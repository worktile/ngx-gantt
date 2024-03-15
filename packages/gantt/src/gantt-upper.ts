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
    Inject,
    OnInit,
    OnDestroy,
    OnChanges
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
    GanttLinkDragEvent,
    GanttToolbarOptions
} from './class';
import { GanttView, GanttViewOptions } from './views/view';
import { createViewFactory } from './views/factory';
import { GanttDate } from './utils/date';
import { uniqBy, flatten, recursiveItems, getFlatItems, Dictionary, keyBy } from './utils/helpers';
import { GanttDragContainer } from './gantt-drag-container';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig, GanttStyleOptions, defaultConfig } from './gantt.config';
import { GanttLinkOptions } from './class/link';
import { SelectionModel } from '@angular/cdk/collections';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { GanttBaselineItem, GanttBaselineItemInternal } from './class/baseline';
import { NgxGanttTableComponent } from './table/gantt-table.component';

@Directive()
export abstract class GanttUpper implements OnChanges, OnInit, OnDestroy {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('items') originItems: GanttItem[] = [];

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('groups') originGroups: GanttGroup[] = [];

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('baselineItems') originBaselineItems: GanttBaselineItem[] = [];

    @Input() viewType: GanttViewType = GanttViewType.month;

    @Input() start: number;

    @Input() end: number;

    @Input() showTodayLine = true;

    @Input() draggable: boolean;

    @Input() styles: GanttStyleOptions;

    @Input() showToolbar = false;

    @Input() toolbarOptions: GanttToolbarOptions = {
        viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
    };

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

    @Output() viewChange = new EventEmitter<GanttView>();

    @Output() expandChange = new EventEmitter<GanttItemInternal | GanttGroupInternal>();

    @ContentChild('bar', { static: true }) barTemplate: TemplateRef<any>;

    @ContentChild('range', { static: true }) rangeTemplate: TemplateRef<any>;

    @ContentChild('item', { static: true }) itemTemplate: TemplateRef<any>;

    @ContentChild('baseline', { static: true }) baselineTemplate: TemplateRef<any>;

    @ContentChild('group', { static: true }) groupTemplate: TemplateRef<any>;

    @ContentChild('groupHeader', { static: true }) groupHeaderTemplate: TemplateRef<any>;

    @ContentChild('toolbar', { static: true }) toolbarTemplate: TemplateRef<any>;

    public linkable: boolean;

    public computeAllRefs = true;

    public linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    public view: GanttView;

    public items: GanttItemInternal[] = [];

    public groups: GanttGroupInternal[] = [];

    public baselineItems: GanttBaselineItemInternal[] = [];

    public baselineItemsMap: Dictionary<GanttBaselineItemInternal> = {};

    // public viewChange = new EventEmitter<GanttView>();

    public get element() {
        return this.elementRef.nativeElement;
    }

    public firstChange = true;

    public dragContainer: GanttDragContainer;

    public unsubscribe$ = new Subject<void>();

    public selectionModel: SelectionModel<string>;

    public table?: NgxGanttTableComponent;

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
        this.viewOptions.dateFormat = Object.assign({}, defaultConfig.dateFormat, this.config.dateFormat, this.viewOptions.dateFormat);
        this.viewOptions.styleOptions = Object.assign(
            {},
            defaultConfig.styleOptions,
            this.config.styleOptions,
            this.viewOptions.styleOptions
        );
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
                    const item = new GanttItemInternal(origin, 0, this.view);
                    group.items.push(item);
                }
            });
        } else {
            this.originItems.forEach((origin) => {
                const item = new GanttItemInternal(origin, 0, this.view);
                this.items.push(item);
            });
        }
    }

    private setupBaselineItems() {
        this.originBaselineItems = uniqBy(this.originBaselineItems, 'id');
        this.baselineItems = [];

        this.originBaselineItems.forEach((origin) => {
            const item = new GanttBaselineItemInternal(origin);
            this.baselineItems.push(item);
        });

        this.baselineItemsMap = keyBy(this.baselineItems, 'id');
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
        if (this.computeAllRefs) {
            this.groups.forEach((group) => {
                const groupItems = recursiveItems(group.items);
                this.computeItemsRefs(...groupItems);
            });
            const items = recursiveItems(this.items);
            this.computeItemsRefs(...items);
        }
    }

    private initSelectionModel() {
        return new SelectionModel(this.multiple, []);
    }

    expandGroups(expanded: boolean) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.expandChange.next(null);
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.styles = Object.assign({}, defaultConfig.styleOptions, this.config.styleOptions, this.styles);
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.setupBaselineItems();
        this.computeItemsRefs(...this.baselineItems);
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
                const disabledLoadOnScroll = this.disabledLoadOnScroll;
                this.dragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.disabledLoadOnScroll = true;
                    this.dragStarted.emit(event);
                });

                this.dragContainer.dragMoved.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.dragMoved.emit(event);
                });

                this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.disabledLoadOnScroll = disabledLoadOnScroll;
                    this.dragEnded.emit(event);
                });
            });
        });

        this.view.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeRefs();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue && changes.viewType.currentValue !== changes.viewType.previousValue) {
                this.changeView(changes.viewType.currentValue);
            }
            if (changes.viewOptions) {
                this.changeView(this.viewType);
            }
            if (changes.originItems || changes.originGroups) {
                this.setupExpandedState();
                this.setupGroups();
                this.setupItems();
                this.computeRefs();
            }

            if (changes.originBaselineItems) {
                this.setupBaselineItems();
                this.computeItemsRefs(...this.baselineItems);
            }
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    computeItemsRefs(...items: GanttItemInternal[] | GanttBaselineItemInternal[]) {
        items.forEach((item) => {
            item.updateRefs({
                width: item.start && item.end ? this.view.getDateRangeWidth(item.start, item.end) : 0,
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

    // public functions

    expandGroup(group: GanttGroupInternal) {
        group.setExpand(!group.expanded);
        this.expandChange.emit(group);
        this.cdr.detectChanges();
    }

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

    changeView(type: GanttViewType) {
        this.viewType = type;
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.setupBaselineItems();
        this.computeItemsRefs(...this.baselineItems);
        this.viewChange.emit(this.view);
    }

    rerenderView() {
        this.changeView(this.viewType);
    }
}

export const GANTT_UPPER_TOKEN = new InjectionToken<GanttUpper>('GANTT_UPPER_TOKEN');
