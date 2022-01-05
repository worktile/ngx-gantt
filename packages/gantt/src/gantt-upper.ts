import {
    ChangeDetectorRef,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    InjectionToken,
    Input,
    NgZone,
    Output,
    SimpleChanges,
    TemplateRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {skip, take, takeUntil} from 'rxjs/operators';
import {
    GanttBarClickEvent,
    GanttDragEvent,
    GanttGroup,
    GanttGroupInternal,
    GanttItem,
    GanttItemInternal,
    GanttLinkDragEvent,
    GanttLoadOnScrollEvent,
    GanttViewType
} from './class';
import {GanttView, GanttViewOptions} from './views/view';
import {createViewFactory} from './views/factory';
import {GanttDate} from './utils/date';
import {defaultStyles, GanttStyles} from './gantt.styles';
import {flatten, recursiveItems, uniqBy} from './utils/helpers';
import {GanttDragContainer} from './gantt-drag-container';

@Directive()
export abstract class GanttUpper {
    @Input('items') originItems: GanttItem[] = [];

    @Input('groups') originGroups: GanttGroup[] = [];

    @Input() viewType: GanttViewType = GanttViewType.month;

    @Input() start: number;

    @Input() end: number;

    @Input() showTodayLine = true;

    @Input() draggable: boolean;

    @Input() styles: GanttStyles;

    @Input() viewOptions: GanttViewOptions;

    @Input() disabledLoadOnScroll: boolean;

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    @Output() dragStarted = new EventEmitter<GanttDragEvent>();

    @Output() dragEnded = new EventEmitter<GanttDragEvent>();

    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @ContentChild('bar', { static: true }) barTemplate: TemplateRef<any>;

    @ContentChild('range', { static: true }) rangeTemplate: TemplateRef<any>;

    @ContentChild('item', { static: true }) itemTemplate: TemplateRef<any>;

    @ContentChild('group', { static: true }) groupTemplate: TemplateRef<any>;

    @ContentChild('groupHeader', { static: true }) groupHeaderTemplate: TemplateRef<any>;

    public linkable: boolean;

    public linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    public view: GanttView;

    public items: GanttItemInternal[] = [];

    public groups: GanttGroupInternal[] = [];

    public viewChange = new EventEmitter<GanttView>();

    public expandChange = new EventEmitter<void>();

    public get element() {
        return this.elementRef.nativeElement;
    }

    public firstChange = true;

    public dragContainer: GanttDragContainer;

    public unsubscribe$ = new Subject();

    private groupsMap: { [key: string]: GanttGroupInternal };

    private expandedItemIds: string[] = [];

    @HostBinding('class.gantt') ganttClass = true;

    constructor(protected elementRef: ElementRef<HTMLElement>, protected cdr: ChangeDetectorRef, protected ngZone: NgZone) {}

    private createView() {
        const viewDate = this.getViewDate();
        this.view = createViewFactory(this.viewType, viewDate.start, viewDate.end, this.viewOptions);
    }

    private setupGroups() {
        const collapsedIds = this.groups.filter((group) => group.expanded === false).map((group) => group.id);
        this.groupsMap = {};
        this.groups = [];
        this.originGroups.forEach((origin) => {
            const group = new GanttGroupInternal(origin);
            group.expanded = !collapsedIds.includes(group.id);
            this.groupsMap[group.id] = group;
            this.groups.push(group);
        });
    }

    private setupItems() {
        this.originItems = uniqBy(this.originItems, 'id');

        // 根据上一次数据展开状态同步新的数据展开状态
        this.originItems.forEach((originItem) => {
            const oldItem = this.items.find((item) => {
                return item.id === originItem.id;
            });
            if (!this.firstChange) {
                if (oldItem && !oldItem.children?.length && originItem.children?.length) {
                    originItem.expanded = originItem.expanded || this.expandedItemIds.includes(originItem.id);
                } else {
                    originItem.expanded = this.expandedItemIds.includes(originItem.id);
                }
            }
        });
        this.items = [];
        if (this.groups.length > 0) {
            this.originItems.forEach((origin) => {
                const group = this.groupsMap[origin.group_id];
                if (group) {
                    const item = new GanttItemInternal(origin, { viewType: this.viewType });
                    group.items.push(item);
                }
            });
        } else {
            this.originItems.forEach((origin) => {
                const item = new GanttItemInternal(origin, { viewType: this.viewType });
                this.items.push(item);
            });
        }
    }

    private setupExpandedState() {
        let items: GanttItemInternal[] = [];
        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        } else {
            items = flatten(this.groups.map((group) => recursiveItems(group.items)));
        }
        this.expandedItemIds = [];
        items.forEach((item) => {
            if (item.origin.expanded) {
                this.expandedItemIds.push(item.id);
            }
        });
    }

    private getViewDate() {
        let start = this.start;
        let end = this.end;
        if (!this.start || !this.end) {
            this.originItems.forEach((item) => {
                if (item.start && !this.start) {
                    start = start ? Math.min(start, item.start) : item.start;
                }
                if (item.end && !this.end) {
                    end = end ? Math.max(end, item.end) : item.end;
                }
            });
        }
        return {
            start: {
                date: new GanttDate(start),
                isCustom: this.start ? true : false
            },
            end: {
                date: new GanttDate(end),
                isCustom: this.end ? true : false
            }
        };
    }

    computeRefs() {
        this.groups.forEach((group) => {
            const groupItems = recursiveItems(group.items);
            this.computeItemsRefs(...groupItems);
        });
        const items = recursiveItems(this.items);
        this.computeItemsRefs(...items);
    }

    private expandGroups(expanded: boolean) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.expandChange.next();
        this.cdr.detectChanges();
    }

    onInit() {
        this.styles = Object.assign({}, defaultStyles, this.styles);
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.firstChange = false;

        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.element.style.opacity = '1';

            this.dragContainer.dragStarted.subscribe((event) => {
                this.dragStarted.emit(event);
            });
            this.dragContainer.dragEnded.subscribe((event) => {
                this.dragEnded.emit(event);
                this.computeRefs();
                this.detectChanges();
            });
        });

        this.view.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeRefs();
        });
    }

    onChanges(changes: SimpleChanges) {
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.createView();
                this.setupGroups();
                this.setupItems();
                this.computeRefs();
                this.viewChange.emit(this.view);
            }
            if (changes.originItems || changes.originGroups) {
                this.setupExpandedState();
                this.setupGroups();
                this.setupItems();
                this.computeRefs();
            }
        }
    }

    onDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    computeItemsRefs(...items: GanttItemInternal[]) {
        items.forEach((item) => {
            item.updateRefs({
                width: item.start && item.end ? this.view.getItemWidth(item.start, item.end) : 0,
                x: item.start ? this.view.getXPointByDate(item.start) : 0,  //B Giusto horus, sbagliato Drag.  //A sbagliato hours, giusto drag.
                y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
            });
        });
    }

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }

    detectChanges() {
        this.cdr.detectChanges();
    }

    expandGroup(group: GanttGroupInternal) {
        group.setExpand(!group.expanded);
        this.expandChange.emit();
        this.cdr.detectChanges();
    }

    // public functions

    expandAll() {
        this.expandGroups(true);
    }

    collapseAll() {
        this.expandGroups(false);
    }
}

export const GANTT_UPPER_TOKEN = new InjectionToken<GanttUpper>('GANTT_UPPER_TOKEN');
