import { Input, Output, EventEmitter, ContentChild, HostBinding, InjectionToken, Directive, inject } from '@angular/core';
import { from, Subject } from 'rxjs';
import { takeUntil, take, skip } from 'rxjs/operators';
import { GanttViewType, GanttGroupInternal, GanttItemInternal } from './class';
import { createViewFactory } from './views/factory';
import { GanttDate, getUnixTime } from './utils/date';
import { uniqBy, flatten, recursiveItems, getFlatItems, keyBy } from './utils/helpers';
import { GanttConfigService } from './gantt.config';
import { SelectionModel } from '@angular/cdk/collections';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { GanttBaselineItemInternal } from './class/baseline';
import * as i0 from "@angular/core";
export class GanttUpper {
    set linkOptions(options) {
        this._linkOptions = options;
    }
    get linkOptions() {
        return Object.assign({}, this.configService.config.linkOptions, this._linkOptions);
    }
    set selectable(value) {
        this._selectable = coerceBooleanProperty(value);
        if (this._selectable) {
            this.selectionModel = this.initSelectionModel();
        }
        else {
            this.selectionModel?.clear();
        }
    }
    get selectable() {
        return this._selectable;
    }
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
        if (this.selectable) {
            this.selectionModel = this.initSelectionModel();
        }
    }
    get multiple() {
        return this._multiple;
    }
    // public viewChange = new EventEmitter<GanttView>();
    get element() {
        return this.elementRef.nativeElement;
    }
    constructor(elementRef, cdr, ngZone, // @Inject(GANTT_GLOBAL_CONFIG) public config: GanttGlobalConfig
    config) {
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.ngZone = ngZone;
        this.config = config;
        // eslint-disable-next-line @angular-eslint/no-input-rename
        this.originItems = [];
        // eslint-disable-next-line @angular-eslint/no-input-rename
        this.originGroups = [];
        // eslint-disable-next-line @angular-eslint/no-input-rename
        this.originBaselineItems = [];
        this.viewType = GanttViewType.month;
        this.showTodayLine = true;
        this.showToolbar = false;
        this.toolbarOptions = {
            viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
        };
        this.viewOptions = {};
        this.quickTimeFocus = false;
        this.loadOnScroll = new EventEmitter();
        this.dragStarted = new EventEmitter();
        this.dragMoved = new EventEmitter();
        this.dragEnded = new EventEmitter();
        this.barClick = new EventEmitter();
        this.viewChange = new EventEmitter();
        this.expandChange = new EventEmitter();
        this.configService = inject(GanttConfigService);
        this.computeAllRefs = true;
        this.linkDragEnded = new EventEmitter();
        this.items = [];
        this.groups = [];
        this.baselineItems = [];
        this.baselineItemsMap = {};
        this.firstChange = true;
        this.unsubscribe$ = new Subject();
        this._selectable = false;
        this._multiple = false;
        this.ganttClass = true;
    }
    createView() {
        const viewDate = this.getViewDate();
        this.styles = Object.assign({}, this.configService.config.styleOptions, this.styles);
        this.viewOptions.dateFormat = Object.assign({}, this.configService.config.dateFormat, this.viewOptions.dateFormat);
        this.viewOptions.styleOptions = Object.assign({}, this.configService.config.styleOptions, this.viewOptions.styleOptions);
        this.viewOptions.dateDisplayFormats = this.configService.getViewsLocale()[this.viewType]?.dateFormats;
        this.view = createViewFactory(this.viewType, viewDate.start, viewDate.end, this.viewOptions);
    }
    setupGroups() {
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
    setupItems() {
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
        }
        else {
            this.originItems.forEach((origin) => {
                const item = new GanttItemInternal(origin, 0, this.view);
                this.items.push(item);
            });
        }
    }
    setupBaselineItems() {
        this.originBaselineItems = uniqBy(this.originBaselineItems, 'id');
        this.baselineItems = [];
        this.originBaselineItems.forEach((origin) => {
            const item = new GanttBaselineItemInternal(origin);
            this.baselineItems.push(item);
        });
        this.baselineItemsMap = keyBy(this.baselineItems, 'id');
    }
    setupExpandedState() {
        this.originItems = uniqBy(this.originItems, 'id');
        let items = [];
        const flatOriginItems = getFlatItems(this.originItems);
        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        }
        else {
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
    getViewDate() {
        let start = this.start;
        let end = this.end;
        if (!this.start || !this.end) {
            this.originItems.forEach((item) => {
                if (item.start && !this.start) {
                    const itemStart = item.start instanceof Date ? getUnixTime(item.start) : item.start;
                    start = start ? Math.min(start, itemStart) : itemStart;
                }
                if (item.end && !this.end) {
                    const itemEnd = item.start instanceof Date ? getUnixTime(item.start) : item.start;
                    end = end ? Math.max(end, itemEnd) : itemEnd;
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
    initSelectionModel() {
        return new SelectionModel(this.multiple, []);
    }
    expandGroups(expanded) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.expandChange.next(null);
        this.cdr.detectChanges();
    }
    ngOnInit() {
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
    ngOnChanges(changes) {
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
    computeItemsRefs(...items) {
        items.forEach((item) => {
            item.updateRefs({
                width: item.start && item.end ? this.view.getDateRangeWidth(item.start, item.end) : 0,
                x: item.start ? this.view.getXPointByDate(item.start) : 0,
                y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
            });
        });
    }
    trackBy(index, item) {
        return item.id || index;
    }
    detectChanges() {
        this.cdr.detectChanges();
    }
    // public functions
    expandGroup(group) {
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
    getGanttItem(id) {
        return this.getGanttItems([id])[0] || null;
    }
    getGanttItems(ids) {
        let items = [];
        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        }
        else {
            items = flatten(this.groups.map((group) => recursiveItems(group.items)));
        }
        return items.filter((item) => ids.includes(item.id));
    }
    isSelected(id) {
        if (!this.selectable) {
            return false;
        }
        if (!this.selectionModel.hasValue()) {
            return false;
        }
        return this.selectionModel.isSelected(id);
    }
    changeView(type) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttUpper, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0", type: GanttUpper, inputs: { originItems: ["items", "originItems"], originGroups: ["groups", "originGroups"], originBaselineItems: ["baselineItems", "originBaselineItems"], viewType: "viewType", start: "start", end: "end", showTodayLine: "showTodayLine", draggable: "draggable", styles: "styles", showToolbar: "showToolbar", toolbarOptions: "toolbarOptions", viewOptions: "viewOptions", linkOptions: "linkOptions", disabledLoadOnScroll: "disabledLoadOnScroll", selectable: "selectable", multiple: "multiple", quickTimeFocus: "quickTimeFocus" }, outputs: { loadOnScroll: "loadOnScroll", dragStarted: "dragStarted", dragMoved: "dragMoved", dragEnded: "dragEnded", barClick: "barClick", viewChange: "viewChange", expandChange: "expandChange" }, host: { properties: { "class.gantt": "this.ganttClass" } }, queries: [{ propertyName: "barTemplate", first: true, predicate: ["bar"], descendants: true, static: true }, { propertyName: "rangeTemplate", first: true, predicate: ["range"], descendants: true, static: true }, { propertyName: "itemTemplate", first: true, predicate: ["item"], descendants: true, static: true }, { propertyName: "baselineTemplate", first: true, predicate: ["baseline"], descendants: true, static: true }, { propertyName: "groupTemplate", first: true, predicate: ["group"], descendants: true, static: true }, { propertyName: "groupHeaderTemplate", first: true, predicate: ["groupHeader"], descendants: true, static: true }, { propertyName: "toolbarTemplate", first: true, predicate: ["toolbar"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttUpper, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: undefined }], propDecorators: { originItems: [{
                type: Input,
                args: ['items']
            }], originGroups: [{
                type: Input,
                args: ['groups']
            }], originBaselineItems: [{
                type: Input,
                args: ['baselineItems']
            }], viewType: [{
                type: Input
            }], start: [{
                type: Input
            }], end: [{
                type: Input
            }], showTodayLine: [{
                type: Input
            }], draggable: [{
                type: Input
            }], styles: [{
                type: Input
            }], showToolbar: [{
                type: Input
            }], toolbarOptions: [{
                type: Input
            }], viewOptions: [{
                type: Input
            }], linkOptions: [{
                type: Input
            }], disabledLoadOnScroll: [{
                type: Input
            }], selectable: [{
                type: Input
            }], multiple: [{
                type: Input
            }], quickTimeFocus: [{
                type: Input
            }], loadOnScroll: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragMoved: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }], barClick: [{
                type: Output
            }], viewChange: [{
                type: Output
            }], expandChange: [{
                type: Output
            }], barTemplate: [{
                type: ContentChild,
                args: ['bar', { static: true }]
            }], rangeTemplate: [{
                type: ContentChild,
                args: ['range', { static: true }]
            }], itemTemplate: [{
                type: ContentChild,
                args: ['item', { static: true }]
            }], baselineTemplate: [{
                type: ContentChild,
                args: ['baseline', { static: true }]
            }], groupTemplate: [{
                type: ContentChild,
                args: ['group', { static: true }]
            }], groupHeaderTemplate: [{
                type: ContentChild,
                args: ['groupHeader', { static: true }]
            }], toolbarTemplate: [{
                type: ContentChild,
                args: ['toolbar', { static: true }]
            }], ganttClass: [{
                type: HostBinding,
                args: ['class.gantt']
            }] } });
export const GANTT_UPPER_TOKEN = new InjectionToken('GANTT_UPPER_TOKEN');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQtdXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvZ2FudHQtdXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILEtBQUssRUFFTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFlBQVksRUFFWixXQUFXLEVBSVgsY0FBYyxFQUNkLFNBQVMsRUFJVCxNQUFNLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkQsT0FBTyxFQUdILGFBQWEsRUFHYixrQkFBa0IsRUFDbEIsaUJBQWlCLEVBSXBCLE1BQU0sU0FBUyxDQUFDO0FBRWpCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RELE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQWMsS0FBSyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkcsT0FBTyxFQUFFLGtCQUFrQixFQUF1RCxNQUFNLGdCQUFnQixDQUFDO0FBRXpHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUUsT0FBTyxFQUFxQix5QkFBeUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztBQUloRixNQUFNLE9BQWdCLFVBQVU7SUE4QjVCLElBQWEsV0FBVyxDQUFDLE9BQXlCO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFD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WUFBWTt1QkFBQyxhQUFhLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUVGLGVBQWU7c0JBQXpELFlBQVk7dUJBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkE0Q2IsVUFBVTtzQkFBckMsV0FBVzt1QkFBQyxhQUFhOztBQW1SOUIsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQWEsbUJBQW1CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgSW5wdXQsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgRWxlbWVudFJlZixcbiAgICBIb3N0QmluZGluZyxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBOZ1pvbmUsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBJbmplY3Rpb25Ub2tlbixcbiAgICBEaXJlY3RpdmUsXG4gICAgT25Jbml0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkNoYW5nZXMsXG4gICAgaW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCB0YWtlLCBza2lwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgICBHYW50dEl0ZW0sXG4gICAgR2FudHRHcm91cCxcbiAgICBHYW50dFZpZXdUeXBlLFxuICAgIEdhbnR0TG9hZE9uU2Nyb2xsRXZlbnQsXG4gICAgR2FudHREcmFnRXZlbnQsXG4gICAgR2FudHRHcm91cEludGVybmFsLFxuICAgIEdhbnR0SXRlbUludGVybmFsLFxuICAgIEdhbnR0QmFyQ2xpY2tFdmVudCxcbiAgICBHYW50dExpbmtEcmFnRXZlbnQsXG4gICAgR2FudHRUb29sYmFyT3B0aW9uc1xufSBmcm9tICcuL2NsYXNzJztcbmltcG9ydCB7IEdhbnR0VmlldywgR2FudHRWaWV3T3B0aW9ucyB9IGZyb20gJy4vdmlld3Mvdmlldyc7XG5pbXBvcnQgeyBjcmVhdGVWaWV3RmFjdG9yeSB9IGZyb20gJy4vdmlld3MvZmFjdG9yeSc7XG5pbXBvcnQgeyBHYW50dERhdGUsIGdldFVuaXhUaW1lIH0gZnJvbSAnLi91dGlscy9kYXRlJztcbmltcG9ydCB7IHVuaXFCeSwgZmxhdHRlbiwgcmVjdXJzaXZlSXRlbXMsIGdldEZsYXRJdGVtcywgRGljdGlvbmFyeSwga2V5QnkgfSBmcm9tICcuL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHsgR2FudHREcmFnQ29udGFpbmVyIH0gZnJvbSAnLi9nYW50dC1kcmFnLWNvbnRhaW5lcic7XG5pbXBvcnQgeyBHYW50dENvbmZpZ1NlcnZpY2UsIEdhbnR0R2xvYmFsQ29uZmlnLCBHYW50dFN0eWxlT3B0aW9ucywgZGVmYXVsdENvbmZpZyB9IGZyb20gJy4vZ2FudHQuY29uZmlnJztcbmltcG9ydCB7IEdhbnR0TGlua09wdGlvbnMgfSBmcm9tICcuL2NsYXNzL2xpbmsnO1xuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgR2FudHRCYXNlbGluZUl0ZW0sIEdhbnR0QmFzZWxpbmVJdGVtSW50ZXJuYWwgfSBmcm9tICcuL2NsYXNzL2Jhc2VsaW5lJztcbmltcG9ydCB7IE5neEdhbnR0VGFibGVDb21wb25lbnQgfSBmcm9tICcuL3RhYmxlL2dhbnR0LXRhYmxlLmNvbXBvbmVudCc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdhbnR0VXBwZXIgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L25vLWlucHV0LXJlbmFtZVxuICAgIEBJbnB1dCgnaXRlbXMnKSBvcmlnaW5JdGVtczogR2FudHRJdGVtW10gPSBbXTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8taW5wdXQtcmVuYW1lXG4gICAgQElucHV0KCdncm91cHMnKSBvcmlnaW5Hcm91cHM6IEdhbnR0R3JvdXBbXSA9IFtdO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1pbnB1dC1yZW5hbWVcbiAgICBASW5wdXQoJ2Jhc2VsaW5lSXRlbXMnKSBvcmlnaW5CYXNlbGluZUl0ZW1zOiBHYW50dEJhc2VsaW5lSXRlbVtdID0gW107XG5cbiAgICBASW5wdXQoKSB2aWV3VHlwZTogR2FudHRWaWV3VHlwZSA9IEdhbnR0Vmlld1R5cGUubW9udGg7XG5cbiAgICBASW5wdXQoKSBzdGFydDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgZW5kOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBzaG93VG9kYXlMaW5lID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGRyYWdnYWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHN0eWxlczogR2FudHRTdHlsZU9wdGlvbnM7XG5cbiAgICBASW5wdXQoKSBzaG93VG9vbGJhciA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgdG9vbGJhck9wdGlvbnM6IEdhbnR0VG9vbGJhck9wdGlvbnMgPSB7XG4gICAgICAgIHZpZXdUeXBlczogW0dhbnR0Vmlld1R5cGUuZGF5LCBHYW50dFZpZXdUeXBlLm1vbnRoLCBHYW50dFZpZXdUeXBlLnllYXJdXG4gICAgfTtcblxuICAgIEBJbnB1dCgpIHZpZXdPcHRpb25zOiBHYW50dFZpZXdPcHRpb25zID0ge307XG5cbiAgICBASW5wdXQoKSBzZXQgbGlua09wdGlvbnMob3B0aW9uczogR2FudHRMaW5rT3B0aW9ucykge1xuICAgICAgICB0aGlzLl9saW5rT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgZ2V0IGxpbmtPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb25maWdTZXJ2aWNlLmNvbmZpZy5saW5rT3B0aW9ucywgdGhpcy5fbGlua09wdGlvbnMpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGRpc2FibGVkTG9hZE9uU2Nyb2xsOiBib29sZWFuO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGFibGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25Nb2RlbCA9IHRoaXMuaW5pdFNlbGVjdGlvbk1vZGVsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbk1vZGVsPy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHNlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RhYmxlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgc2V0IG11bHRpcGxlKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICAgICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbk1vZGVsID0gdGhpcy5pbml0U2VsZWN0aW9uTW9kZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHF1aWNrVGltZUZvY3VzID0gZmFsc2U7XG5cbiAgICBAT3V0cHV0KCkgbG9hZE9uU2Nyb2xsID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dExvYWRPblNjcm9sbEV2ZW50PigpO1xuXG4gICAgQE91dHB1dCgpIGRyYWdTdGFydGVkID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dERyYWdFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKSBkcmFnTW92ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0RHJhZ0V2ZW50PigpO1xuXG4gICAgQE91dHB1dCgpIGRyYWdFbmRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8R2FudHREcmFnRXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KCkgYmFyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0QmFyQ2xpY2tFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKSB2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dFZpZXc+KCk7XG5cbiAgICBAT3V0cHV0KCkgZXhwYW5kQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dEl0ZW1JbnRlcm5hbCB8IEdhbnR0R3JvdXBJbnRlcm5hbD4oKTtcblxuICAgIEBDb250ZW50Q2hpbGQoJ2JhcicsIHsgc3RhdGljOiB0cnVlIH0pIGJhclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQENvbnRlbnRDaGlsZCgncmFuZ2UnLCB7IHN0YXRpYzogdHJ1ZSB9KSByYW5nZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQENvbnRlbnRDaGlsZCgnaXRlbScsIHsgc3RhdGljOiB0cnVlIH0pIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ2Jhc2VsaW5lJywgeyBzdGF0aWM6IHRydWUgfSkgYmFzZWxpbmVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ2dyb3VwJywgeyBzdGF0aWM6IHRydWUgfSkgZ3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ2dyb3VwSGVhZGVyJywgeyBzdGF0aWM6IHRydWUgfSkgZ3JvdXBIZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ3Rvb2xiYXInLCB7IHN0YXRpYzogdHJ1ZSB9KSB0b29sYmFyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwdWJsaWMgY29uZmlnU2VydmljZSA9IGluamVjdChHYW50dENvbmZpZ1NlcnZpY2UpO1xuXG4gICAgcHVibGljIGxpbmthYmxlOiBib29sZWFuO1xuXG4gICAgcHVibGljIGNvbXB1dGVBbGxSZWZzID0gdHJ1ZTtcblxuICAgIHB1YmxpYyBsaW5rRHJhZ0VuZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dExpbmtEcmFnRXZlbnQ+KCk7XG5cbiAgICBwdWJsaWMgdmlldzogR2FudHRWaWV3O1xuXG4gICAgcHVibGljIGl0ZW1zOiBHYW50dEl0ZW1JbnRlcm5hbFtdID0gW107XG5cbiAgICBwdWJsaWMgZ3JvdXBzOiBHYW50dEdyb3VwSW50ZXJuYWxbXSA9IFtdO1xuXG4gICAgcHVibGljIGJhc2VsaW5lSXRlbXM6IEdhbnR0QmFzZWxpbmVJdGVtSW50ZXJuYWxbXSA9IFtdO1xuXG4gICAgcHVibGljIGJhc2VsaW5lSXRlbXNNYXA6IERpY3Rpb25hcnk8R2FudHRCYXNlbGluZUl0ZW1JbnRlcm5hbD4gPSB7fTtcblxuICAgIC8vIHB1YmxpYyB2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dFZpZXc+KCk7XG5cbiAgICBwdWJsaWMgZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmlyc3RDaGFuZ2UgPSB0cnVlO1xuXG4gICAgcHVibGljIGRyYWdDb250YWluZXI6IEdhbnR0RHJhZ0NvbnRhaW5lcjtcblxuICAgIHB1YmxpYyB1bnN1YnNjcmliZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgcHVibGljIHNlbGVjdGlvbk1vZGVsOiBTZWxlY3Rpb25Nb2RlbDxzdHJpbmc+O1xuXG4gICAgcHVibGljIHRhYmxlPzogTmd4R2FudHRUYWJsZUNvbXBvbmVudDtcblxuICAgIHByaXZhdGUgZ3JvdXBzTWFwOiB7IFtrZXk6IHN0cmluZ106IEdhbnR0R3JvdXBJbnRlcm5hbCB9O1xuXG4gICAgcHJpdmF0ZSBfc2VsZWN0YWJsZSA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBfbXVsdGlwbGUgPSBmYWxzZTtcblxuICAgIHByaXZhdGUgX2xpbmtPcHRpb25zOiBHYW50dExpbmtPcHRpb25zO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5nYW50dCcpIGdhbnR0Q2xhc3MgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCBuZ1pvbmU6IE5nWm9uZSwgLy8gQEluamVjdChHQU5UVF9HTE9CQUxfQ09ORklHKSBwdWJsaWMgY29uZmlnOiBHYW50dEdsb2JhbENvbmZpZ1xuICAgICAgICBwcm90ZWN0ZWQgY29uZmlnOiBHYW50dEdsb2JhbENvbmZpZ1xuICAgICkge31cblxuICAgIHByaXZhdGUgY3JlYXRlVmlldygpIHtcbiAgICAgICAgY29uc3Qgdmlld0RhdGUgPSB0aGlzLmdldFZpZXdEYXRlKCk7XG5cbiAgICAgICAgdGhpcy5zdHlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZ1NlcnZpY2UuY29uZmlnLnN0eWxlT3B0aW9ucywgdGhpcy5zdHlsZXMpO1xuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmRhdGVGb3JtYXQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZ1NlcnZpY2UuY29uZmlnLmRhdGVGb3JtYXQsIHRoaXMudmlld09wdGlvbnMuZGF0ZUZvcm1hdCk7XG4gICAgICAgIHRoaXMudmlld09wdGlvbnMuc3R5bGVPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb25maWdTZXJ2aWNlLmNvbmZpZy5zdHlsZU9wdGlvbnMsIHRoaXMudmlld09wdGlvbnMuc3R5bGVPcHRpb25zKTtcbiAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5kYXRlRGlzcGxheUZvcm1hdHMgPSB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Vmlld3NMb2NhbGUoKVt0aGlzLnZpZXdUeXBlXT8uZGF0ZUZvcm1hdHM7XG4gICAgICAgIHRoaXMudmlldyA9IGNyZWF0ZVZpZXdGYWN0b3J5KHRoaXMudmlld1R5cGUsIHZpZXdEYXRlLnN0YXJ0LCB2aWV3RGF0ZS5lbmQsIHRoaXMudmlld09wdGlvbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBHcm91cHMoKSB7XG4gICAgICAgIGNvbnN0IGNvbGxhcHNlZElkcyA9IHRoaXMuZ3JvdXBzLmZpbHRlcigoZ3JvdXApID0+IGdyb3VwLmV4cGFuZGVkID09PSBmYWxzZSkubWFwKChncm91cCkgPT4gZ3JvdXAuaWQpO1xuICAgICAgICB0aGlzLmdyb3Vwc01hcCA9IHt9O1xuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xuICAgICAgICB0aGlzLm9yaWdpbkdyb3Vwcy5mb3JFYWNoKChvcmlnaW4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gbmV3IEdhbnR0R3JvdXBJbnRlcm5hbChvcmlnaW4pO1xuICAgICAgICAgICAgZ3JvdXAuZXhwYW5kZWQgPSAhY29sbGFwc2VkSWRzLmluY2x1ZGVzKGdyb3VwLmlkKTtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBzTWFwW2dyb3VwLmlkXSA9IGdyb3VwO1xuICAgICAgICAgICAgdGhpcy5ncm91cHMucHVzaChncm91cCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBJdGVtcygpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5JdGVtcyA9IHVuaXFCeSh0aGlzLm9yaWdpbkl0ZW1zLCAnaWQnKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5ncm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5JdGVtcy5mb3JFYWNoKChvcmlnaW4pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBzTWFwW29yaWdpbi5ncm91cF9pZF07XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgR2FudHRJdGVtSW50ZXJuYWwob3JpZ2luLCAwLCB0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICBncm91cC5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5JdGVtcy5mb3JFYWNoKChvcmlnaW4pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gbmV3IEdhbnR0SXRlbUludGVybmFsKG9yaWdpbiwgMCwgdGhpcy52aWV3KTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBCYXNlbGluZUl0ZW1zKCkge1xuICAgICAgICB0aGlzLm9yaWdpbkJhc2VsaW5lSXRlbXMgPSB1bmlxQnkodGhpcy5vcmlnaW5CYXNlbGluZUl0ZW1zLCAnaWQnKTtcbiAgICAgICAgdGhpcy5iYXNlbGluZUl0ZW1zID0gW107XG5cbiAgICAgICAgdGhpcy5vcmlnaW5CYXNlbGluZUl0ZW1zLmZvckVhY2goKG9yaWdpbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IG5ldyBHYW50dEJhc2VsaW5lSXRlbUludGVybmFsKG9yaWdpbik7XG4gICAgICAgICAgICB0aGlzLmJhc2VsaW5lSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5iYXNlbGluZUl0ZW1zTWFwID0ga2V5QnkodGhpcy5iYXNlbGluZUl0ZW1zLCAnaWQnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwRXhwYW5kZWRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5JdGVtcyA9IHVuaXFCeSh0aGlzLm9yaWdpbkl0ZW1zLCAnaWQnKTtcbiAgICAgICAgbGV0IGl0ZW1zOiBHYW50dEl0ZW1JbnRlcm5hbFtdID0gW107XG4gICAgICAgIGNvbnN0IGZsYXRPcmlnaW5JdGVtcyA9IGdldEZsYXRJdGVtcyh0aGlzLm9yaWdpbkl0ZW1zKTtcblxuICAgICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpdGVtcyA9IHJlY3Vyc2l2ZUl0ZW1zKHRoaXMuaXRlbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbXMgPSBmbGF0dGVuKHRoaXMuZ3JvdXBzLm1hcCgoZ3JvdXApID0+IHJlY3Vyc2l2ZUl0ZW1zKGdyb3VwLml0ZW1zKSkpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLm9yaWdpbi5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0l0ZW0gPSBmbGF0T3JpZ2luSXRlbXMuZmluZCgob3JpZ2luSXRlbSkgPT4gb3JpZ2luSXRlbS5pZCA9PT0gaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0l0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0l0ZW0uZXhwYW5kZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5leHBhbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Vmlld0RhdGUoKSB7XG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmVuZDtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0IHx8ICF0aGlzLmVuZCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5JdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uc3RhcnQgJiYgIXRoaXMuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVN0YXJ0ID0gaXRlbS5zdGFydCBpbnN0YW5jZW9mIERhdGUgPyBnZXRVbml4VGltZShpdGVtLnN0YXJ0KSA6IGl0ZW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnQgPyBNYXRoLm1pbihzdGFydCwgaXRlbVN0YXJ0KSA6IGl0ZW1TdGFydDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uZW5kICYmICF0aGlzLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtRW5kID0gaXRlbS5zdGFydCBpbnN0YW5jZW9mIERhdGUgPyBnZXRVbml4VGltZShpdGVtLnN0YXJ0KSA6IGl0ZW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IGVuZCA/IE1hdGgubWF4KGVuZCwgaXRlbUVuZCkgOiBpdGVtRW5kO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBHYW50dERhdGUoc3RhcnQpLFxuICAgICAgICAgICAgICAgIGlzQ3VzdG9tOiB0aGlzLnN0YXJ0ID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5kOiB7XG4gICAgICAgICAgICAgICAgZGF0ZTogbmV3IEdhbnR0RGF0ZShlbmQpLFxuICAgICAgICAgICAgICAgIGlzQ3VzdG9tOiB0aGlzLmVuZCA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXB1dGVSZWZzKCkge1xuICAgICAgICBpZiAodGhpcy5jb21wdXRlQWxsUmVmcykge1xuICAgICAgICAgICAgdGhpcy5ncm91cHMuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cEl0ZW1zID0gcmVjdXJzaXZlSXRlbXMoZ3JvdXAuaXRlbXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZUl0ZW1zUmVmcyguLi5ncm91cEl0ZW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSByZWN1cnNpdmVJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZUl0ZW1zUmVmcyguLi5pdGVtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRTZWxlY3Rpb25Nb2RlbCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb25Nb2RlbCh0aGlzLm11bHRpcGxlLCBbXSk7XG4gICAgfVxuXG4gICAgZXhwYW5kR3JvdXBzKGV4cGFuZGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBzLmZvckVhY2goKGdyb3VwKSA9PiB7XG4gICAgICAgICAgICBncm91cC5zZXRFeHBhbmQoZXhwYW5kZWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5leHBhbmRDaGFuZ2UubmV4dChudWxsKTtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwcygpO1xuICAgICAgICB0aGlzLnNldHVwSXRlbXMoKTtcbiAgICAgICAgdGhpcy5jb21wdXRlUmVmcygpO1xuICAgICAgICB0aGlzLnNldHVwQmFzZWxpbmVJdGVtcygpO1xuICAgICAgICB0aGlzLmNvbXB1dGVJdGVtc1JlZnMoLi4udGhpcy5iYXNlbGluZUl0ZW1zKTtcbiAgICAgICAgdGhpcy5pbml0U2VsZWN0aW9uTW9kZWwoKTtcbiAgICAgICAgdGhpcy5maXJzdENoYW5nZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIE5vdGU6IHRoZSB6b25lIG1heSBiZSBub29wZWQgdGhyb3VnaCBgQm9vdHN0cmFwT3B0aW9uc2Agd2hlbiBib290c3RyYXBwaW5nIHRoZSByb290IG1vZHVsZS4gVGhpcyBtZWFuc1xuICAgICAgICAvLyB0aGUgYG9uU3RhYmxlYCB3aWxsIG5ldmVyIGVtaXQgYW55IHZhbHVlLlxuICAgICAgICBjb25zdCBvblN0YWJsZSQgPSB0aGlzLm5nWm9uZS5pc1N0YWJsZSA/IGZyb20oUHJvbWlzZS5yZXNvbHZlKCkpIDogdGhpcy5uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKTtcbiAgICAgICAgLy8gTm9ybWFsbHkgdGhpcyBpc24ndCBpbiB0aGUgem9uZSwgYnV0IGl0IGNhbiBjYXVzZSBwZXJmb3JtYW5jZSByZWdyZXNzaW9ucyBmb3IgYXBwc1xuICAgICAgICAvLyB1c2luZyBgem9uZS1wYXRjaC1yeGpzYCBiZWNhdXNlIGl0J2xsIHRyaWdnZXIgYSBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW4gaXQgdW5zdWJzY3JpYmVzLlxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBvblN0YWJsZSQucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc2FibGVkTG9hZE9uU2Nyb2xsID0gdGhpcy5kaXNhYmxlZExvYWRPblNjcm9sbDtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZHJhZ1N0YXJ0ZWQucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZWRMb2FkT25TY3JvbGwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdTdGFydGVkLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLmRyYWdNb3ZlZC5waXBlKHRha2VVbnRpbCh0aGlzLnVuc3Vic2NyaWJlJCkpLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnTW92ZWQuZW1pdChldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZHJhZ0VuZGVkLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVkTG9hZE9uU2Nyb2xsID0gZGlzYWJsZWRMb2FkT25TY3JvbGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0VuZGVkLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmlldy5zdGFydCQucGlwZShza2lwKDEpLCB0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlUmVmcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgaWYgKGNoYW5nZXMudmlld1R5cGUgJiYgY2hhbmdlcy52aWV3VHlwZS5jdXJyZW50VmFsdWUgJiYgY2hhbmdlcy52aWV3VHlwZS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXMudmlld1R5cGUucHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlldyhjaGFuZ2VzLnZpZXdUeXBlLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlcy52aWV3T3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlldyh0aGlzLnZpZXdUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFuZ2VzLm9yaWdpbkl0ZW1zIHx8IGNoYW5nZXMub3JpZ2luR3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cEV4cGFuZGVkU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwR3JvdXBzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUmVmcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hhbmdlcy5vcmlnaW5CYXNlbGluZUl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cEJhc2VsaW5lSXRlbXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVJdGVtc1JlZnMoLi4udGhpcy5iYXNlbGluZUl0ZW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlJC5uZXh0KCk7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgY29tcHV0ZUl0ZW1zUmVmcyguLi5pdGVtczogR2FudHRJdGVtSW50ZXJuYWxbXSB8IEdhbnR0QmFzZWxpbmVJdGVtSW50ZXJuYWxbXSkge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLnVwZGF0ZVJlZnMoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiBpdGVtLnN0YXJ0ICYmIGl0ZW0uZW5kID8gdGhpcy52aWV3LmdldERhdGVSYW5nZVdpZHRoKGl0ZW0uc3RhcnQsIGl0ZW0uZW5kKSA6IDAsXG4gICAgICAgICAgICAgICAgeDogaXRlbS5zdGFydCA/IHRoaXMudmlldy5nZXRYUG9pbnRCeURhdGUoaXRlbS5zdGFydCkgOiAwLFxuICAgICAgICAgICAgICAgIHk6ICh0aGlzLnN0eWxlcy5saW5lSGVpZ2h0IC0gdGhpcy5zdHlsZXMuYmFySGVpZ2h0KSAvIDIgLSAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhY2tCeShpbmRleDogbnVtYmVyLCBpdGVtOiBHYW50dEdyb3VwSW50ZXJuYWwgfCBHYW50dEl0ZW1JbnRlcm5hbCkge1xuICAgICAgICByZXR1cm4gaXRlbS5pZCB8fCBpbmRleDtcbiAgICB9XG5cbiAgICBkZXRlY3RDaGFuZ2VzKCkge1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uc1xuXG4gICAgZXhwYW5kR3JvdXAoZ3JvdXA6IEdhbnR0R3JvdXBJbnRlcm5hbCkge1xuICAgICAgICBncm91cC5zZXRFeHBhbmQoIWdyb3VwLmV4cGFuZGVkKTtcbiAgICAgICAgdGhpcy5leHBhbmRDaGFuZ2UuZW1pdChncm91cCk7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBleHBhbmRBbGwoKSB7XG4gICAgICAgIHRoaXMuZXhwYW5kR3JvdXBzKHRydWUpO1xuICAgIH1cblxuICAgIGNvbGxhcHNlQWxsKCkge1xuICAgICAgICB0aGlzLmV4cGFuZEdyb3VwcyhmYWxzZSk7XG4gICAgfVxuXG4gICAgZ2V0R2FudHRJdGVtKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0R2FudHRJdGVtcyhbaWRdKVswXSB8fCBudWxsO1xuICAgIH1cblxuICAgIGdldEdhbnR0SXRlbXMoaWRzOiBzdHJpbmdbXSkge1xuICAgICAgICBsZXQgaXRlbXM6IEdhbnR0SXRlbUludGVybmFsW10gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaXRlbXMgPSByZWN1cnNpdmVJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1zID0gZmxhdHRlbih0aGlzLmdyb3Vwcy5tYXAoKGdyb3VwKSA9PiByZWN1cnNpdmVJdGVtcyhncm91cC5pdGVtcykpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXMuZmlsdGVyKChpdGVtKSA9PiBpZHMuaW5jbHVkZXMoaXRlbS5pZCkpO1xuICAgIH1cblxuICAgIGlzU2VsZWN0ZWQoaWQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3Rpb25Nb2RlbC5oYXNWYWx1ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChpZCk7XG4gICAgfVxuXG4gICAgY2hhbmdlVmlldyh0eXBlOiBHYW50dFZpZXdUeXBlKSB7XG4gICAgICAgIHRoaXMudmlld1R5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwcygpO1xuICAgICAgICB0aGlzLnNldHVwSXRlbXMoKTtcbiAgICAgICAgdGhpcy5jb21wdXRlUmVmcygpO1xuICAgICAgICB0aGlzLnNldHVwQmFzZWxpbmVJdGVtcygpO1xuICAgICAgICB0aGlzLmNvbXB1dGVJdGVtc1JlZnMoLi4udGhpcy5iYXNlbGluZUl0ZW1zKTtcbiAgICAgICAgdGhpcy52aWV3Q2hhbmdlLmVtaXQodGhpcy52aWV3KTtcbiAgICB9XG5cbiAgICByZXJlbmRlclZpZXcoKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVmlldyh0aGlzLnZpZXdUeXBlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBHQU5UVF9VUFBFUl9UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxHYW50dFVwcGVyPignR0FOVFRfVVBQRVJfVE9LRU4nKTtcbiJdfQ==