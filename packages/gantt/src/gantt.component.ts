import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport, ViewportRuler } from '@angular/cdk/scrolling';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    afterEveryRender,
    contentChild,
    contentChildren,
    effect,
    forwardRef,
    inject,
    input,
    output,
    signal,
    untracked,
    viewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
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
import { GanttScrollbarComponent } from './components/scrollbar/scrollbar.component';
import { GanttTableBodyComponent } from './components/table/body/gantt-table-body.component';
import { GanttTableHeaderComponent } from './components/table/header/gantt-table-header.component';
import { GanttSyncScrollXDirective, GanttSyncScrollYDirective } from './directives/sync-scroll.directive';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';
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
            useExisting: forwardRef(() => NgxGanttComponent)
        },
        {
            provide: GANTT_ABSTRACT_TOKEN,
            useExisting: forwardRef(() => NgxGanttComponent)
        }
    ],
    imports: [
        NgxGanttRootComponent,
        GanttTableHeaderComponent,
        GanttCalendarHeaderComponent,
        GanttLoaderComponent,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        NgClass,
        CdkVirtualForOf,
        GanttTableBodyComponent,
        GanttCalendarGridComponent,
        GanttMainComponent,
        GanttDragBackdropComponent,
        GanttScrollbarComponent,
        NgTemplateOutlet,
        GanttSyncScrollXDirective,
        GanttSyncScrollYDirective
    ]
})
export class NgxGanttComponent extends GanttUpper implements OnInit, AfterViewInit {
    private viewportRuler = inject(ViewportRuler);

    readonly maxLevel = input(2);

    readonly async = input<boolean>();

    readonly childrenResolve = input<(GanttItem) => Observable<GanttItem[]>>();

    override readonly linkable = input<boolean>();

    readonly loading = input<boolean>();

    readonly virtualScrollEnabled = input(true);

    readonly loadingDelay = input(0);

    readonly linkDragStarted = output<GanttLinkDragEvent>();

    override readonly linkDragEnded = output<GanttLinkDragEvent>();

    readonly lineClick = output<GanttLineClickEvent>();

    readonly selectedChange = output<GanttSelectedEvent>();

    readonly virtualScrolledIndexChange = output<GanttVirtualScrolledIndexChangeEvent>();

    override readonly table = contentChild(NgxGanttTableComponent);

    readonly columns = contentChildren(NgxGanttTableColumnComponent, { descendants: true });

    readonly ganttRoot = viewChild<NgxGanttRootComponent>('ganttRoot');

    readonly footerTemplate = contentChild<TemplateRef<any>>('footer');

    readonly virtualScroll = viewChild(CdkVirtualScrollViewport);

    readonly ganttTableBody = viewChild<ElementRef<HTMLDivElement>>('ganttTableBody');

    public realLoading = false;

    public tableScrollWidth = signal<number>(0);

    private resizeObserver: ResizeObserver;

    public flatItems: (GanttGroupInternal | GanttItemInternal)[] = [];

    public viewportItems: (GanttGroupInternal | GanttItemInternal)[] = [];

    private loadingTimer: ReturnType<typeof setTimeout> | null = null;

    private rangeStart = 0;

    private rangeEnd = 0;

    private flatItemsMap: Dictionary<GanttGroupInternal | GanttItemInternal>;

    private draggingItem: GanttItem;

    constructor() {
        super();
        afterEveryRender(() => {
            if (this.virtualScrollEnabled() && this.viewportRuler && this.virtualScroll().getRenderedRange().end > 0) {
                const ganttRoot = this.ganttRoot();
                if (!ganttRoot.verticalScrollbarWidth) {
                    ganttRoot.computeScrollBarOffset();
                }
            }
        });

        effect(() => {
            const loading = this.loading();
            if (loading) {
                untracked(() => {
                    if (this.loadingDelay() > 0) {
                        this.loadingTimer = setTimeout(() => {
                            this.realLoading = loading;
                            this.cdr.markForCheck();
                        }, this.loadingDelay());
                    } else {
                        this.realLoading = loading;
                    }
                });
            } else {
                clearTimeout(this.loadingTimer);
                this.realLoading = loading;
            }
        });
    }

    override ngOnInit() {
        super.ngOnInit();
        this.ngZone.runOutsideAngular(() => {
            this.dragContainer.linkDragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragStarted.emit(event);
            });

            this.dragContainer.linkDragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragEnded.emit(event);
            });
        });

        // 如果虚拟滚动未启用，初始化时需要手动填充 viewportItems
        if (!this.virtualScrollEnabled()) {
            this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
            this.computeRefs();
        }
    }

    override computeRefs() {
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

    override setupItems() {
        super.setupItems();
        this.buildFlatItems();
        this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
    }

    ngAfterViewInit() {
        if (this.virtualScrollEnabled()) {
            this.virtualScroll()
                .renderedRangeStream.pipe(takeUntil(this.unsubscribe$))
                .subscribe((range) => {
                    const linksElement = this.elementRef.nativeElement.querySelector('.gantt-links-overlay') as HTMLDivElement;
                    linksElement.style.top = `${-(this.styles().lineHeight * range.start)}px`;
                    this.rangeStart = range.start;
                    this.rangeEnd = range.end;
                    this.viewportItems = this.flatItems.slice(range.start, range.end);
                    this.appendDraggingItemToViewportItems();
                    this.computeRefs();
                });
        }
        this.initScrollContainerObserver();
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
        if (!this.virtualScrollEnabled()) {
            this.rangeStart = 0;
            this.rangeEnd = this.flatItems.length;
        }
    }

    private afterExpand() {
        this.buildFlatItems();
        this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
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
            const childrenResolve = this.childrenResolve();
            if (this.async() && childrenResolve && item.children.length === 0) {
                item.loading = true;
                childrenResolve(item.origin)
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
        this.table().itemClick.emit({
            event: selectEvent.event,
            current: selectEvent.current
        });

        if (!this.selectable()) {
            return;
        }
        const { event, selectedValue } = selectEvent;
        this.selectionModel.toggle((selectedValue as GanttItem).id);

        const selectedIds = this.selectionModel.selected;
        if (this.multiple()) {
            const _selectedValue = this.getGanttItems(selectedIds).map((item) => item.origin);
            this.selectedChange.emit({ event, current: selectedValue as GanttItem, selectedValue: _selectedValue });
        } else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, current: selectedValue as GanttItem, selectedValue: _selectedValue });
        }
    }

    scrollToToday() {
        this.ganttRoot().scrollToToday();
    }

    scrollToDate(date: number | Date | GanttDate) {
        this.ganttRoot().scrollToDate(date);
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
        this.expandChange.emit(this.groups);
        this.cdr.detectChanges();
    }

    override expandGroup(group: GanttGroupInternal) {
        group.setExpand(!group.expanded);
        this.afterExpand();
        this.expandChange.emit(group);
        this.cdr.detectChanges();
    }

    itemDragStarted(event: GanttTableDragStartedEvent) {
        this.table().dragStarted.emit(event);
        this.draggingItem = event.source;
    }

    itemDragEnded(event: GanttTableDragEndedEvent) {
        this.table().dragEnded.emit(event);
        this.draggingItem = null;
    }

    private initScrollContainerObserver() {
        const ganttTableBody = this.ganttTableBody();
        if (ganttTableBody && ganttTableBody['elementRef']?.nativeElement) {
            this.tableScrollWidth.set(ganttTableBody['elementRef'].nativeElement.clientWidth);
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver((entries) => {
                    const newWidth = entries[0].target.clientWidth;
                    if (this.tableScrollWidth() !== newWidth) {
                        this.tableScrollWidth.set(newWidth);
                        this.cdr.markForCheck();
                    }
                });
                this.resizeObserver.observe(ganttTableBody['elementRef'].nativeElement);
            }
        }
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}
