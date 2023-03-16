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
    ContentChildren,
    QueryList,
    AfterViewInit,
    ContentChild,
    TemplateRef,
    forwardRef,
    Inject,
    ViewChild,
    Optional,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { startWith, takeUntil, take, finalize, skip } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttLinkDragEvent, GanttLineClickEvent, GanttItemInternal, GanttItem, GanttSelectedEvent, GanttGroupInternal } from './class';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { GanttGlobalConfig, GANTT_GLOBAL_CONFIG } from './gantt.config';
import { NgxGanttRootComponent } from './root.component';
import { GanttDate } from './utils/date';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Dictionary, keyBy, recursiveItems, uniqBy } from './utils/helpers';
import { GanttPrintService } from './gantt-print.service';
import { defaultColumnWidth } from './components/table/header/gantt-table-header.component';
@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
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
export class NgxGanttComponent extends GanttUpper implements OnInit, OnChanges, AfterViewInit {
    @Input() maxLevel = 2;

    @Input() async: boolean;

    @Input() childrenResolve: (GanttItem) => Observable<GanttItem[]>;

    @Input() override linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() override linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @Output() selectedChange = new EventEmitter<GanttSelectedEvent>();

    @ContentChild(NgxGanttTableComponent) override table: NgxGanttTableComponent;

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    @ContentChild('tableEmpty', { static: true }) tableEmptyTemplate: TemplateRef<any>;

    @ViewChild('ganttRoot') ganttRoot: NgxGanttRootComponent;

    @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

    public flatData: (GanttGroupInternal | GanttItemInternal)[] = [];

    public renderData: (GanttGroupInternal | GanttItemInternal)[] = [];

    private rangeStart: number;

    private rangeEnd: number;

    private flatDataMap: Dictionary<GanttGroupInternal | GanttItemInternal>;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        @Optional() private printService: GanttPrintService,
        @Inject(GANTT_GLOBAL_CONFIG) config: GanttGlobalConfig
    ) {
        super(elementRef, cdr, ngZone, config);
        this.computeAllRefs = false;
    }

    override ngOnInit() {
        super.ngOnInit();
        this.buildVirtualFlatData();
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.dragContainer.dragEnded.subscribe((event) => {
                    this.computeTempDataRefs();
                });

                this.dragContainer.linkDragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                    this.linkDragStarted.emit(event);
                });

                this.dragContainer.linkDragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                    this.linkDragEnded.emit(event);
                });
            });
        });

        this.view.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeTempDataRefs();
        });
    }

    override ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.renderData = this.flatData.slice(this.rangeStart, this.rangeEnd);
                this.computeTempDataRefs();
            }
            if (changes.originItems || changes.originGroups) {
                this.buildVirtualFlatData();
                this.renderData = this.flatData.slice(this.rangeStart, this.rangeEnd);
                this.computeTempDataRefs();
            }
        }
    }

    ngAfterViewInit() {
        this.virtualScroll.renderedRangeStream.pipe(takeUntil(this.unsubscribe$)).subscribe((range) => {
            const linksElement = this.elementRef.nativeElement.querySelector('.gantt-links-overlay') as HTMLDivElement;
            linksElement.style.top = `${-(this.styles.lineHeight * range.start)}px`;
            this.rangeStart = range.start;
            this.rangeEnd = range.end;
            this.renderData = this.flatData.slice(range.start, range.end);
            this.computeTempDataRefs();
        });
    }

    private buildVirtualFlatData() {
        const virtualData = [];
        if (this.groups.length) {
            this.groups.forEach((group) => {
                virtualData.push(group);
                if (group.expanded) {
                    const items = recursiveItems(group.items);
                    virtualData.push(...items);
                }
            });
        }

        if (this.items.length) {
            virtualData.push(...recursiveItems(this.items));
        }
        this.flatData = [...virtualData];
        this.flatDataMap = keyBy(this.flatData, 'id');
    }

    private afterExpand() {
        this.buildVirtualFlatData();
        this.renderData = this.flatData.slice(this.rangeStart, this.rangeEnd);
    }

    private computeTempDataRefs() {
        const tempItemData = [];
        this.renderData.forEach((data: GanttGroupInternal | GanttItemInternal) => {
            if (!data.hasOwnProperty('items')) {
                const item = data as GanttItemInternal;
                if (item.links) {
                    item.links.forEach((link) => {
                        if (this.flatDataMap[link.link]) {
                            tempItemData.push(this.flatDataMap[link.link]);
                        }
                    });
                }
                tempItemData.push(data);
            }
        });
        this.computeItemsRefs(...uniqBy(tempItemData, 'id'));
        this.flatData = [...this.flatData];
        this.renderData = [...this.renderData];
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
                            this.expandChange.emit(item);
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
                this.expandChange.emit(item);
            }
        } else {
            item.setExpand(false);
            this.afterExpand();
            this.expandChange.emit(item);
        }
    }

    selectItem(selectEvent: GanttSelectedEvent) {
        if (!this.selectable) {
            return;
        }
        const { event, selectedValue } = selectEvent;
        this.selectionModel.toggle((selectedValue as GanttItem).id);

        const selectedIds = this.selectionModel.selected;
        if (this.multiple) {
            const _selectedValue = this.getGanttItems(selectedIds).map((item) => item.origin);
            this.selectedChange.emit({ event, selectedValue: _selectedValue });
        } else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, selectedValue: _selectedValue });
        }
    }

    scrollToToday() {
        this.ganttRoot.scrollToToday();
    }

    scrollToDate(date: number | GanttDate) {
        this.ganttRoot.scrollToDate(date);
    }

    override expandGroups(expanded: boolean) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });

        this.afterExpand();
        this.expandChange.next(null);
        this.cdr.detectChanges();
    }

    override expandGroup(group: GanttGroupInternal) {
        group.setExpand(!group.expanded);
        this.afterExpand();
        this.expandChange.emit();
        this.cdr.detectChanges();
    }
}
