import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport, ViewportRuler } from '@angular/cdk/scrolling';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    forwardRef
} from '@angular/core';
import { Observable, from } from 'rxjs';
import { finalize, skip, take, takeUntil } from 'rxjs/operators';
import {
    GanttGroupInternal,
    GanttItem,
    GanttItemInternal,
    GanttLineClickEvent,
    GanttLinkDragEvent,
    GanttSelectedEvent,
    GanttTableDragEndedEvent,
    GanttTableDragStartedEvent,
    GanttVirtualScrolledIndexChangeEvent
} from './class';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttLoaderComponent } from './components/loader/loader.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { GanttTableBodyComponent } from './components/table/body/gantt-table-body.component';
import { GanttTableHeaderComponent } from './components/table/header/gantt-table-header.component';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from './gantt.config';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GanttDate } from './utils/date';
import { Dictionary, keyBy, recursiveItems, uniqBy } from './utils/helpers';
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
    ],
    standalone: true,
    imports: [
        NgxGanttRootComponent,
        GanttTableHeaderComponent,
        GanttCalendarHeaderComponent,
        NgIf,
        GanttLoaderComponent,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        NgClass,
        CdkVirtualForOf,
        GanttTableBodyComponent,
        GanttCalendarGridComponent,
        GanttMainComponent,
        GanttDragBackdropComponent,
        NgTemplateOutlet
    ]
})
export class NgxGanttComponent extends GanttUpper implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
    @Input() maxLevel = 2;

    @Input() async: boolean;

    @Input() childrenResolve: (GanttItem) => Observable<GanttItem[]>;

    @Input() override linkable: boolean;

    @Input() set loading(loading: boolean) {
        if (loading) {
            if (this.loadingDelay > 0) {
                this.loadingTimer = setTimeout(() => {
                    this._loading = loading;
                    this.cdr.markForCheck();
                }, this.loadingDelay);
            } else {
                this._loading = loading;
            }
        } else {
            clearTimeout(this.loadingTimer);
            this._loading = loading;
        }
    }

    @Input() virtualScrollEnabled = true;

    @Input() loadingDelay = 0;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() override linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @Output() selectedChange = new EventEmitter<GanttSelectedEvent>();

    @Output() virtualScrolledIndexChange = new EventEmitter<GanttVirtualScrolledIndexChangeEvent>();

    @ContentChild(NgxGanttTableComponent) override table: NgxGanttTableComponent;

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    // 此模版已挪到 table 组件下，为了兼容此处暂时保留
    @ContentChild('tableEmpty', { static: true }) tableEmptyTemplate: TemplateRef<any>;

    @ViewChild('ganttRoot') ganttRoot: NgxGanttRootComponent;

    @ContentChild('footer', { static: true }) footerTemplate: TemplateRef<any>;

    @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

    get loading() {
        return this._loading;
    }

    public flatItems: (GanttGroupInternal | GanttItemInternal)[] = [];

    public viewportItems: (GanttGroupInternal | GanttItemInternal)[] = [];

    private _loading = false;

    private loadingTimer;

    private rangeStart = 0;

    private rangeEnd = 0;

    private flatItemsMap: Dictionary<GanttGroupInternal | GanttItemInternal>;

    private draggingItem: GanttItem;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        private viewportRuler: ViewportRuler,
        @Inject(GANTT_GLOBAL_CONFIG) config: GanttGlobalConfig
    ) {
        super(elementRef, cdr, ngZone, config);
        this.computeAllRefs = false;
    }

    override ngOnInit() {
        super.ngOnInit();
        this.buildFlatItems();
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
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

        if (!this.virtualScrollEnabled) {
            this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
            this.computeTempDataRefs();
        }
    }

    override ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
                this.computeTempDataRefs();
            }
            if (changes.originItems || changes.originGroups) {
                this.buildFlatItems();
                this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
                this.computeTempDataRefs();
            }
        }
    }

    ngAfterViewInit() {
        if (this.virtualScrollEnabled) {
            this.virtualScroll.renderedRangeStream.pipe(takeUntil(this.unsubscribe$)).subscribe((range) => {
                const linksElement = this.elementRef.nativeElement.querySelector('.gantt-links-overlay') as HTMLDivElement;
                linksElement.style.top = `${-(this.styles.lineHeight * range.start)}px`;
                this.rangeStart = range.start;
                this.rangeEnd = range.end;
                this.viewportItems = this.flatItems.slice(range.start, range.end);
                this.appendDraggingItemToViewportItems();
                this.computeTempDataRefs();
            });
        }
    }

    ngAfterViewChecked() {
        if (this.virtualScrollEnabled && this.viewportRuler && this.virtualScroll.getRenderedRange().end > 0) {
            const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
            this.ngZone.runOutsideAngular(() => {
                onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                    if (!this.ganttRoot.verticalScrollbarWidth) {
                        this.ganttRoot.computeScrollBarOffset();
                        this.cdr.markForCheck();
                    }
                });
            });
        }
    }

    private buildFlatItems() {
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
        this.flatItems = [...virtualData];
        this.flatItemsMap = keyBy(this.flatItems, 'id');
        if (!this.virtualScrollEnabled) {
            this.rangeStart = 0;
            this.rangeEnd = this.flatItems.length;
        }
    }

    private afterExpand() {
        this.buildFlatItems();
        this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
    }

    private computeTempDataRefs() {
        const tempItemData = [];
        this.viewportItems.forEach((data: GanttGroupInternal | GanttItemInternal) => {
            if (!data.hasOwnProperty('items')) {
                const item = data as GanttItemInternal;
                if (item.links) {
                    item.links.forEach((link) => {
                        if (this.flatItemsMap[link.link]) {
                            tempItemData.push(this.flatItemsMap[link.link]);
                        }
                    });
                }
                tempItemData.push(data);
            }
        });
        this.computeItemsRefs(...uniqBy(tempItemData, 'id'));
        this.flatItems = [...this.flatItems];
        this.viewportItems = [...this.viewportItems];
    }

    private appendDraggingItemToViewportItems() {
        if (this.draggingItem) {
            let flatItem = this.viewportItems.find((item) => {
                return item.id === this.draggingItem.id;
            });
            if (!flatItem) {
                flatItem = this.flatItems.find((item) => {
                    return item.id === this.draggingItem.id;
                });
                if (flatItem) {
                    this.viewportItems.push(flatItem);
                }
            }
        }
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
            this.selectedChange.emit({ event, current: selectedValue as GanttItem, selectedValue: _selectedValue });
        } else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, current: selectedValue as GanttItem, selectedValue: _selectedValue });
        }
    }

    scrollToToday() {
        this.ganttRoot.scrollToToday();
    }

    scrollToDate(date: number | GanttDate) {
        this.ganttRoot.scrollToDate(date);
    }

    scrolledIndexChange(index: number) {
        this.virtualScrolledIndexChange.emit({
            index,
            renderedRange: {
                start: this.rangeStart,
                end: this.rangeEnd
            },
            count: this.flatItems.length
        });
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

    itemDragStarted(event: GanttTableDragStartedEvent) {
        this.table.dragStarted.emit(event);
        this.draggingItem = event.source;
    }

    itemDragEnded(event: GanttTableDragEndedEvent) {
        this.table.dragEnded.emit(event);
        this.draggingItem = null;
    }
}
