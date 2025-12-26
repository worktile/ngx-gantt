import {
    TemplateRef,
    Output,
    EventEmitter,
    ElementRef,
    HostBinding,
    ChangeDetectorRef,
    NgZone,
    InjectionToken,
    Directive,
    OnInit,
    OnDestroy,
    inject,
    input,
    output,
    contentChild,
    computed,
    effect,
    linkedSignal,
    model,
    Signal,
    OutputEmitterRef,
    signal
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
import { GanttDate, getUnixTime } from './utils/date';
import { uniqBy, flatten, recursiveItems, getFlatItems, Dictionary, keyBy } from './utils/helpers';
import { GanttDragContainer } from './gantt-drag-container';
import { GANTT_GLOBAL_CONFIG, GanttConfigService, GanttGlobalConfig, GanttStyleOptions } from './gantt.config';
import { GanttLinkOptions } from './class/link';
import { SelectionModel } from '@angular/cdk/collections';
import { coerceBooleanProperty, coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttBaselineItem, GanttBaselineItemInternal } from './class/baseline';
import { NgxGanttTableComponent } from './table/gantt-table.component';

@Directive()
export abstract class GanttUpper implements OnInit, OnDestroy {
    protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    protected cdr = inject(ChangeDetectorRef);

    protected ngZone = inject(NgZone);

    protected config = inject<GanttGlobalConfig>(GANTT_GLOBAL_CONFIG);

    // eslint-disable-next-line @angular-eslint/no-input-rename
    readonly originItems = input<GanttItem[]>([], { alias: 'items' });

    // @Input('groups') originGroups: GanttGroup[] = [];

    // eslint-disable-next-line @angular-eslint/no-input-rename
    readonly originGroups = input<GanttGroup[]>([], { alias: 'groups' });

    // eslint-disable-next-line @angular-eslint/no-input-rename
    readonly originBaselineItems = input<GanttBaselineItem[]>([], { alias: 'baselineItems' });

    readonly viewType = model<GanttViewType>(GanttViewType.month);

    readonly start = input<number>();

    readonly end = input<number>();

    readonly showTodayLine = input(true);

    readonly draggable = input<boolean>();

    // eslint-disable-next-line @angular-eslint/no-input-rename
    readonly originStyles = input<GanttStyleOptions>({}, { alias: 'styles' });

    readonly styles = computed(() => {
        return Object.assign({}, this.configService.config.styleOptions, this.originStyles());
    });

    readonly showToolbar = input(false);

    readonly toolbarOptions = input<GanttToolbarOptions>({
        viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
    });

    readonly viewOptions = input<GanttViewOptions>({});

    // eslint-disable-next-line @angular-eslint/no-input-rename
    readonly originLinkOptions = input<GanttLinkOptions>({}, { alias: 'linkOptions' });

    readonly linkOptions = computed(() => {
        return Object.assign({}, this.configService.config.linkOptions, this.originLinkOptions());
    });

    readonly disabledLoadOnScroll = input<boolean>(true);

    readonly selectable = input(false, { transform: coerceBooleanProperty });

    readonly multiple = input(false, { transform: coerceBooleanProperty });

    readonly quickTimeFocus = input(false);

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    readonly dragStarted = output<GanttDragEvent>();

    readonly dragMoved = output<GanttDragEvent>();

    readonly dragEnded = output<GanttDragEvent>();

    readonly barClick = output<GanttBarClickEvent>();

    readonly viewChange = output<GanttView>();

    readonly expandChange = output<GanttItemInternal | GanttGroupInternal | (GanttItemInternal | GanttGroupInternal)[]>();

    readonly barTemplate = contentChild<TemplateRef<any>>('bar');

    readonly rangeTemplate = contentChild<TemplateRef<any>>('range');

    readonly itemTemplate = contentChild<TemplateRef<any>>('item');

    readonly baselineTemplate = contentChild<TemplateRef<any>>('baseline');

    readonly groupTemplate = contentChild<TemplateRef<any>>('group');

    readonly groupHeaderTemplate = contentChild<TemplateRef<any>>('groupHeader');

    readonly toolbarTemplate = contentChild<TemplateRef<any>>('toolbar');

    readonly disableLoadOnScroll = linkedSignal(() => this.disabledLoadOnScroll());

    readonly previousViewType = linkedSignal({
        source: () => this.viewType(),
        computation: (source, previous) => previous?.source
    });

    readonly previousViewOptions = linkedSignal({
        source: () => this.viewOptions(),
        computation: (source, previous) => previous?.source
    });

    public configService = inject(GanttConfigService);

    public linkable: Signal<boolean> = signal(false);

    public linkDragEnded: OutputEmitterRef<GanttLinkDragEvent>;

    public view: GanttView;

    public items: GanttItemInternal[] = [];

    public groups: GanttGroupInternal[] = [];

    public baselineItems: GanttBaselineItemInternal[] = [];

    public baselineItemsMap: Dictionary<GanttBaselineItemInternal> = {};

    public get element() {
        return this.elementRef.nativeElement;
    }

    public dragContainer: GanttDragContainer;

    public unsubscribe$ = new Subject<void>();

    public selectionModel: SelectionModel<string>;

    public table?: Signal<NgxGanttTableComponent>;

    private groupsMap: { [key: string]: GanttGroupInternal };

    protected isEffectFinished = signal(false);

    @HostBinding('class.gantt') ganttClass = true;

    constructor() {
        effect(() => {
            this.initSelectionModel();
        });

        effect(() => {
            const viewType = this.viewType();
            const previousViewType = this.previousViewType();
            const viewOptions = this.viewOptions();
            const previousViewOptions = this.previousViewOptions();
            if (
                (viewType && previousViewType && viewType !== previousViewType) ||
                (viewOptions && previousViewOptions && viewOptions !== previousViewOptions)
            ) {
                this.changeView();
            }
        });

        effect(() => {
            if (this.originItems() || this.originGroups()) {
                this.setupExpandedState();
                this.setupGroups();
                this.setupItems();
                this.computeRefs();
                this.isEffectFinished.set(true);
            }
        });

        effect(() => {
            if (this.originBaselineItems()) {
                this.setupBaselineItems();
                this.computeItemsRefs(...this.baselineItems);
            }
        });
    }

    private createView() {
        const viewDate = this.getViewDate();
        const viewOptions = { ...this.viewOptions() };
        viewOptions.dateFormat = Object.assign({}, this.configService.config.dateFormat, viewOptions.dateFormat);
        viewOptions.styleOptions = Object.assign({}, this.configService.config.styleOptions, viewOptions.styleOptions);
        viewOptions.dateDisplayFormats = this.configService.getViewsLocale()[this.viewType()]?.dateFormats;
        this.view = createViewFactory(this.viewType(), viewDate.start, viewDate.end, viewOptions);
    }

    private setupGroups() {
        const collapsedIds = this.originGroups()
            .filter((group) => group.expanded === false)
            .map((group) => group.id);
        this.groupsMap = {};
        this.groups = [];
        this.originGroups().forEach((origin) => {
            const group = new GanttGroupInternal(origin);
            group.expanded = !collapsedIds.includes(group.id);
            this.groupsMap[group.id] = group;
            this.groups.push(group);
        });
    }

    protected setupItems() {
        // this.originItems = uniqBy(this.originItems(), 'id');
        this.items = [];
        if (this.groups.length > 0) {
            this.originItems().forEach((origin) => {
                const group = this.groupsMap[origin.group_id];
                if (group) {
                    const item = new GanttItemInternal(origin, 0, this.view);
                    group.items.push(item);
                }
            });
        } else {
            this.originItems().forEach((origin) => {
                const item = new GanttItemInternal(origin, 0, this.view);
                this.items.push(item);
            });
        }
    }

    private setupBaselineItems() {
        // this.originBaselineItems = uniqBy(this.originBaselineItems(), 'id');
        this.baselineItems = [];

        this.originBaselineItems().forEach((origin) => {
            const item = new GanttBaselineItemInternal(origin);
            this.baselineItems.push(item);
        });

        this.baselineItemsMap = keyBy(this.baselineItems, 'id');
    }

    private setupExpandedState() {
        // this.originItems = uniqBy(this.originItems(), 'id');
        let items: GanttItemInternal[] = [];
        const flatOriginItems = getFlatItems(this.originItems());

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
        let start = this.start();
        let end = this.end();
        const startValue = this.start();
        const endValue = this.end();
        if (!startValue || !endValue) {
            this.originItems().forEach((item) => {
                if (item.start && !this.start()) {
                    const itemStart = item.start instanceof Date ? getUnixTime(item.start) : item.start;
                    start = start ? Math.min(start, itemStart) : itemStart;
                }
                if (item.end && !this.end()) {
                    const itemEnd = item.start instanceof Date ? getUnixTime(item.start) : item.start;
                    end = end ? Math.max(end, itemEnd) : itemEnd;
                }
            });
        }
        return {
            start: {
                date: new GanttDate(start),
                isCustom: startValue ? true : false
            },
            end: {
                date: new GanttDate(end),
                isCustom: endValue ? true : false
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

    private initSelectionModel() {
        const multiple = this.multiple();
        const selectable = this.selectable();
        if (selectable) {
            this.selectionModel = new SelectionModel(multiple, []);
        } else {
            this.selectionModel?.clear();
        }
    }

    private initCssVariables() {
        const styles = this.styles();
        this.element.style.setProperty('--gantt-header-height', coerceCssPixelValue(styles.headerHeight));
        this.element.style.setProperty('--gantt-line-height', coerceCssPixelValue(styles.lineHeight));
        this.element.style.setProperty('--gantt-bar-height', coerceCssPixelValue(styles.barHeight));
    }

    expandGroups(expanded: boolean) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.expandChange.emit(this.groups);
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.createView();
        this.initCssVariables();

        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.element.style.opacity = '1';
                this.dragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.disableLoadOnScroll.set(true);
                    this.dragStarted.emit(event);
                });

                this.dragContainer.dragMoved.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.dragMoved.emit(event);
                });

                this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.disableLoadOnScroll.set(this.disabledLoadOnScroll());
                    this.dragEnded.emit(event);
                });
            });
        });

        this.view?.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeRefs();
        });
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
                y: (this.styles().lineHeight - this.styles().barHeight) / 2 - 1
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
        if (!this.selectionModel?.hasValue()) {
            return false;
        }
        return this.selectionModel?.isSelected(id);
    }

    changeView() {
        this.createView();
        if (this.previousViewType()) {
            this.setupGroups();
            this.setupItems();
            this.computeRefs();
            this.setupBaselineItems();
            this.computeItemsRefs(...this.baselineItems);
        }
        this.viewChange.emit(this.view);
    }

    rerenderView() {
        this.changeView();
    }
}

export const GANTT_UPPER_TOKEN = new InjectionToken<GanttUpper>('GANTT_UPPER_TOKEN');
