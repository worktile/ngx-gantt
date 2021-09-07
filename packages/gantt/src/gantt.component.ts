import {
    Component,
    OnInit,
    ElementRef,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output,
    ChangeDetectorRef,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ContentChildren,
    QueryList,
    AfterViewInit,
    ViewChild,
    ContentChild,
    TemplateRef
} from '@angular/core';
import { startWith, takeUntil, take, finalize, debounce, debounceTime } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttLinkDragEvent, GanttLineClickEvent, GanttItemInternal, GanttItem, GanttGroupInternal } from './class';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { sideWidth } from './gantt.styles';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { recursiveItems } from './utils/helpers';
import { GanttDomService } from './gantt-dom.service';

export const defaultColumnWidth = 100;
export const minColumnWidth = 80;

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: NgxGanttComponent
        }
    ]
})
export class NgxGanttComponent extends GanttUpper implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() maxLevel = 2;

    @Input() async: boolean;

    @Input() childrenResolve: (GanttItem) => Observable<GanttItem[]>;

    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @ContentChild(NgxGanttTableComponent) table: NgxGanttTableComponent;

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    @ContentChild('tableEmpty', { static: true }) tableEmptyTemplate: TemplateRef<any>;

    @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

    public sideTableWidth = sideWidth;

    public flatData: GanttGroupInternal[] | GanttItemInternal[] = [];

    public tempData: GanttGroupInternal[] | GanttItemInternal[] = [];

    private rangeStart: number;

    private rangeEnd: number;

    private ngUnsubscribe$ = new Subject();

    // get inverseOfTranslation(): string {
    //     if (!this.virtualScroll || !this.virtualScroll['_renderedContentOffset']) {
    //         return '-0px';
    //     }
    //     const offset = this.virtualScroll['_renderedContentOffset'];
    //     return `-${offset}px`;
    // }

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone) {
        super(elementRef, cdr, ngZone);
    }

    private expandGroups(expanded: boolean) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });

        this.afterExpand();
        this.expandChange.next();
        this.cdr.detectChanges();
    }

    ngOnInit() {
        super.onInit();

        this.buildVirtualFlatData();

        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.dragContainer.linkDragStarted.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragStarted.emit(event);
            });
            this.dragContainer.linkDragEnded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragEnded.emit(event);
            });
        });
    }

    ngAfterViewInit() {
        this.columns.changes.pipe(startWith(true), takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.columns.forEach((column) => {
                if (!column.columnWidth) {
                    column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
                }
            });
            this.cdr.detectChanges();
        });

        this.virtualScroll.renderedRangeStream.subscribe((range) => {
            const linksElement = this.elementRef.nativeElement.querySelector('.gantt-links-overlay') as HTMLDivElement;
            linksElement.style.top = `${-(this.styles.lineHeight * range.start)}px`;

            this.rangeStart = range.start;
            this.rangeEnd = range.end;
            this.tempData = this.flatData.slice(range.start, range.end);
        });

        // this.virtualScroll.elementScrolled().subscribe((event) => {
        //     const scrollTop = this.virtualScroll.measureScrollOffset();
        //     const top = scrollTop - this.styles.lineHeight * this.rangeStart;
        //     const tableHeaderElement = this.elementRef.nativeElement.querySelector('.gantt-table-header') as HTMLDivElement;
        //     const calendarElement = this.elementRef.nativeElement.querySelector('.gantt-calendar-overlay-main') as HTMLDivElement;
        //     tableHeaderElement.style.top = `${top}px`;
        //     calendarElement.style.top = `${top}px`;
        // });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.onChanges(changes);
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.buildVirtualFlatData();
                this.tempData = this.flatData.slice(this.rangeStart, this.rangeEnd);
            }
            if (changes.originItems || changes.originGroups) {
                this.buildVirtualFlatData();
                this.tempData = this.flatData.slice(this.rangeStart, this.rangeEnd);
            }
        }
    }

    expandGroup(group: GanttGroupInternal) {
        group.setExpand(!group.expanded);

        this.afterExpand();

        this.expandChange.emit();
        this.cdr.detectChanges();
    }

    expandAll() {
        this.expandGroups(true);
    }

    collapseAll() {
        this.expandGroups(false);
    }

    expandChildren(item: GanttItemInternal) {
        if (!item.expanded) {
            item.setExpand(true);
            if (this.async && this.childrenResolve && item.children.length === 0) {
                item.loading = true;
                this.childrenResolve(item.origin)
                    .pipe(
                        take(1),
                        finalize(() => {
                            item.loading = false;
                            this.afterExpand();
                            this.expandChange.emit();
                            this.cdr.detectChanges();
                        })
                    )
                    .subscribe((items) => {
                        item.addChildren(items);
                        this.computeItemsRefs(...item.children);
                    });
            } else {
                this.computeItemsRefs(...item.children);
                this.afterExpand();
                this.expandChange.emit();
            }
        } else {
            item.setExpand(false);
            this.afterExpand();
            this.expandChange.emit();
        }
    }

    buildVirtualFlatData() {
        const virtualData = [];
        if (this.groups.length) {
            this.groups.forEach((group) => {
                virtualData.push(group);
                if (group.expanded) {
                    const items = recursiveItems(group.items, 0);
                    virtualData.push(...items);
                }
            });
        }

        if (this.items.length) {
            virtualData.push(...recursiveItems(this.items, 0));
        }
        this.flatData = [...virtualData];
    }

    afterExpand() {
        this.buildVirtualFlatData();
        this.tempData = this.flatData.slice(this.rangeStart, this.rangeEnd);
    }

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
