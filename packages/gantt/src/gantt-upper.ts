import {
    Input,
    TemplateRef,
    Output,
    EventEmitter,
    ContentChild,
    ElementRef,
    HostBinding,
    ChangeDetectorRef,
    NgZone,
    SimpleChanges,
    InjectionToken,
    Directive,
    Inject
} from '@angular/core';
import { from, Subject } from 'rxjs';
import { takeUntil, take, skip } from 'rxjs/operators';
import {
    GanttItem,
    GanttGroup,
    GanttViewType,
    GanttLoadOnScrollEvent,
    GanttDragEvent,
    GanttGroupInternal,
    GanttItemInternal,
    GanttBarClickEvent,
    GanttLinkDragEvent
} from './class';
import { GanttView, GanttViewOptions } from './views/view';
import { createViewFactory } from './views/factory';
import { GanttDate } from './utils/date';
import { GanttStyles, defaultStyles } from './gantt.styles';
import { uniqBy, flatten, recursiveItems, getFlatItems } from './utils/helpers';
import { GanttDragContainer } from './gantt-drag-container';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig, defaultConfig } from './gantt.config';
import { GanttLinkOptions } from './class/link';
import { SelectionModel } from '@angular/cdk/collections';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

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

    @Input() viewOptions: GanttViewOptions = {};

    @Input() set linkOptions(options: GanttLinkOptions) {
        this._linkOptions = options;
    }

    get linkOptions() {
        return Object.assign({}, defaultConfig.linkOptions, this.config.linkOptions, this._linkOptions);
    }

    @Input() disabledLoadOnScroll: boolean;

    @Input()
    set selectable(value: BooleanInput) {
        this._selectable = coerceBooleanProperty(value);
        if (this._selectable) {
            this.selectionModel = this.initSelectionModel();
        } else {
            this.selectionModel?.clear();
        }
    }

    get selectable(): boolean {
        return this._selectable;
    }

    @Input()
    set multiple(value: BooleanInput) {
        this._multiple = coerceBooleanProperty(value);
        if (this.selectable) {
            this.selectionModel = this.initSelectionModel();
        }
    }

    get multiple(): boolean {
        return this._multiple;
    }

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    @Output() dragStarted = new EventEmitter<GanttDragEvent>();

    @Output() dragMoved = new EventEmitter<GanttDragEvent>();

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

    public selectionModel: SelectionModel<string>;

    private groupsMap: { [key: string]: GanttGroupInternal };

    private _selectable = false;

    private _multiple = false;

    private _linkOptions: GanttLinkOptions;

    @HostBinding('class.gantt') ganttClass = true;

    constructor(
        protected elementRef: ElementRef<HTMLElement>,
        protected cdr: ChangeDetectorRef,
        protected ngZone: NgZone,
        @Inject(GANTT_GLOBAL_CONFIG) public config: GanttGlobalConfig
    ) {}

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
        this.originItems = uniqBy(this.originItems, 'id');
        let items: GanttItemInternal[] = [];
        const flatOriginItems = getFlatItems(this.originItems);

        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        } else {
            items = flatten(this.groups.map((group) => recursiveItems(group.items)));
        }
        items.forEach((item) => {
            if (item.origin.expanded) {
                const newItem = flatOriginItems.find((originItem) => originItem.id === item.id);
                if (newItem) {
                    if (newItem.expanded === undefined) {
                        newItem.expanded = true;
                    }
                }
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

    private initSelectionModel() {
        return new SelectionModel(this.multiple, []);
    }

    onInit() {
        this.styles = Object.assign({}, defaultStyles, this.styles);
        this.viewOptions.dateFormat = Object.assign({}, defaultConfig.dateFormat, this.config.dateFormat, this.viewOptions.dateFormat);
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.initSelectionModel();
        this.firstChange = false;

        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.element.style.opacity = '1';

                this.dragContainer.dragStarted.subscribe((event) => {
                    this.dragStarted.emit(event);
                });

                this.dragContainer.dragMoved.subscribe((event) => {
                    this.dragMoved.emit(event);
                });
                this.dragContainer.dragEnded.subscribe((event) => {
                    this.dragEnded.emit(event);
                    this.computeRefs();
                    this.detectChanges();
                });
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
                width: item.start && item.end ? this.view.getDateRangeWidth(item.start.startOfDay(), item.end.endOfDay()) : 0,
                x: item.start ? this.view.getXPointByDate(item.start) : 0,
                y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
            });
        });
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
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

    getGanttItem(id: string) {
        return this.getGanttItems([id])[0] || null;
    }

    getGanttItems(ids: string[]) {
        let items: GanttItemInternal[] = [];
        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        } else {
            items = flatten(this.groups.map((group) => recursiveItems(group.items)));
        }
        return items.filter((item) => ids.includes(item.id));
    }

    isSelected(id: string) {
        if (!this.selectable) {
            return false;
        }
        if (!this.selectionModel.hasValue()) {
            return false;
        }
        return this.selectionModel.isSelected(id);
    }
}

export const GANTT_UPPER_TOKEN = new InjectionToken<GanttUpper>('GANTT_UPPER_TOKEN');
