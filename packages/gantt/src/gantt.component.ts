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
    TemplateRef,
    Optional,
    forwardRef
} from '@angular/core';
import { startWith, takeUntil, take, finalize, skip } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttLinkDragEvent, GanttLineClickEvent, GanttItemInternal, GanttItem, GanttGroupInternal } from './class';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Dictionary, keyBy, recursiveItems, uniqBy } from './utils/helpers';
import { GanttDomService, ScrollDirection } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { GanttPrintService } from './gantt-print.service';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { defaultColumnWidth } from './components/table/header/gantt-table-header.component';
import { GanttVirtualScrollService } from './gantt-virtual-scroll.service';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        GanttDomService,
        GanttDragContainer,
        GanttVirtualScrollService,
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: NgxGanttComponent
        },
        {
            provide: GANTT_ABSTRACT_TOKEN,
            useExisting: forwardRef(() => NgxGanttComponent)
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

    public flatData: (GanttGroupInternal | GanttItemInternal)[] = [];

    public tempData: (GanttGroupInternal | GanttItemInternal)[] = [];

    private flatDataMap: Dictionary<GanttGroupInternal | GanttItemInternal>;

    private ngUnsubscribe$ = new Subject();

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        private dom: GanttDomService,
        private virtualScrollService: GanttVirtualScrollService,
        public dragContainer: GanttDragContainer,
        @Optional() private printService: GanttPrintService
    ) {
        super(elementRef, cdr, ngZone);
        this.dragContainer = dragContainer;
        this.computeAllRefs = false;
    }

    ngOnInit() {
        super.onInit();

        this.virtualScrollService.initialize();
        this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
        this.virtualScrollService.change.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(([flatData, tempData]) => {
            this.flatData = flatData;
            this.flatDataMap = keyBy(this.flatData, 'id');
            this.tempData = tempData;
            if (this.tempData.length) {
                this.computeTempDataRefs();
            }
        });

        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.dom.initialize(this.elementRef);
            if (this.printService) {
                this.printService.register(this.elementRef);
            }

            this.setupViewScroll();
            // 优化初始化时Scroll滚动体验问题，通过透明度解决，默认透明度为0，滚动结束后恢复
            this.elementRef.nativeElement.style.opacity = '1';
            this.viewChange.pipe(startWith(null)).subscribe(() => {
                this.scrollToToday();
            });

            this.dragContainer.dragEnded.subscribe((event) => {
                this.computeTempDataRefs();
            });

            this.dragContainer.linkDragStarted.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragStarted.emit(event);
            });

            this.dragContainer.linkDragEnded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragEnded.emit(event);
            });
        });

        this.view.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeTempDataRefs();
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
            this.virtualScrollService.setRange(range);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.onChanges(changes);
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.computeTempDataRefs();
            }
            if (changes.originItems || changes.originGroups) {
                this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
            }
        }
    }

    expandGroup(group: GanttGroupInternal) {
        group.setExpand(!group.expanded);
        this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
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
                            this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
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
                this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
                this.expandChange.emit();
            }
        } else {
            item.setExpand(false);
            this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
            this.expandChange.emit();
        }
    }

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }

    private scrollToToday() {
        const x = this.view.getTodayXPoint();
        this.dom.scrollMainContainer(x);
    }

    private setupViewScroll() {
        if (this.disabledLoadOnScroll) {
            return;
        }
        this.dom
            .getViewerScroll()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                if (event.direction === ScrollDirection.LEFT) {
                    const dates = this.view.addStartDate();
                    if (dates) {
                        event.target.scrollLeft += this.view.getDateRangeWidth(dates.start, dates.end);
                        this.ngZone.run(() => {
                            this.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() });
                        });
                    }
                }
                if (event.direction === ScrollDirection.RIGHT) {
                    const dates = this.view.addEndDate();
                    if (dates) {
                        this.ngZone.run(() => {
                            this.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() });
                        });
                    }
                }
                this.cdr.detectChanges();
            });
    }

    private expandGroups(expanded: boolean) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });

        this.virtualScrollService.buildVirtualFlatData(this.groups, this.items);
        this.expandChange.next();
        this.cdr.detectChanges();
    }

    private computeTempDataRefs() {
        const tempItemData = [];
        this.tempData.forEach((data: GanttGroupInternal | GanttItemInternal) => {
            if (!data.hasOwnProperty('items')) {
                const item = data as GanttItemInternal;
                if (item.links) {
                    item.links.forEach((link) => {
                        if (this.flatDataMap[link]) {
                            tempItemData.push(this.flatDataMap[link]);
                        }
                    });
                }
                tempItemData.push(data);
            }
        });
        this.computeItemsRefs(...uniqBy(tempItemData, 'id'));

        this.flatData = [...this.flatData];
        this.tempData = [...this.tempData];
    }

    ngOnDestroy() {
        this.virtualScrollService.destroy();
        super.onDestroy();
    }
}
