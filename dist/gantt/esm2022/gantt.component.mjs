import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { from } from 'rxjs';
import { finalize, skip, take, takeUntil } from 'rxjs/operators';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttLoaderComponent } from './components/loader/loader.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { GanttTableBodyComponent } from './components/table/body/gantt-table-body.component';
import { GanttTableHeaderComponent } from './components/table/header/gantt-table-header.component';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';
import { GANTT_GLOBAL_CONFIG } from './gantt.config';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { keyBy, recursiveItems, uniqBy } from './utils/helpers';
import { GanttScrollbarComponent } from './components/scrollbar/scrollbar.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
export class NgxGanttComponent extends GanttUpper {
    set loading(loading) {
        if (loading) {
            if (this.loadingDelay > 0) {
                this.loadingTimer = setTimeout(() => {
                    this._loading = loading;
                    this.cdr.markForCheck();
                }, this.loadingDelay);
            }
            else {
                this._loading = loading;
            }
        }
        else {
            clearTimeout(this.loadingTimer);
            this._loading = loading;
        }
    }
    get loading() {
        return this._loading;
    }
    constructor(elementRef, cdr, ngZone, viewportRuler, config) {
        super(elementRef, cdr, ngZone, config);
        this.viewportRuler = viewportRuler;
        this.maxLevel = 2;
        this.virtualScrollEnabled = true;
        this.loadingDelay = 0;
        this.linkDragStarted = new EventEmitter();
        this.linkDragEnded = new EventEmitter();
        this.lineClick = new EventEmitter();
        this.selectedChange = new EventEmitter();
        this.virtualScrolledIndexChange = new EventEmitter();
        this.flatItems = [];
        this.viewportItems = [];
        this._loading = false;
        this.rangeStart = 0;
        this.rangeEnd = 0;
        this.computeAllRefs = false;
    }
    ngOnInit() {
        super.ngOnInit();
        this.buildFlatItems();
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.dragContainer.linkDragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.linkDragStarted.emit(event);
                });
                this.dragContainer.linkDragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
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
    ngOnChanges(changes) {
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
                const linksElement = this.elementRef.nativeElement.querySelector('.gantt-links-overlay');
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
    buildFlatItems() {
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
    afterExpand() {
        this.buildFlatItems();
        this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
    }
    computeTempDataRefs() {
        const tempItemData = [];
        this.viewportItems.forEach((data) => {
            if (!data.hasOwnProperty('items')) {
                const item = data;
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
    appendDraggingItemToViewportItems() {
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
    expandChildren(item) {
        if (!item.expanded) {
            item.setExpand(true);
            if (this.async && this.childrenResolve && item.children.length === 0) {
                item.loading = true;
                this.childrenResolve(item.origin)
                    .pipe(take(1), finalize(() => {
                    item.loading = false;
                    this.afterExpand();
                    this.expandChange.emit(item);
                    this.cdr.detectChanges();
                }))
                    .subscribe((items) => {
                    item.addChildren(items);
                    this.computeItemsRefs(...item.children);
                });
            }
            else {
                this.computeItemsRefs(...item.children);
                this.afterExpand();
                this.expandChange.emit(item);
            }
        }
        else {
            item.setExpand(false);
            this.afterExpand();
            this.expandChange.emit(item);
        }
    }
    selectItem(selectEvent) {
        this.table.itemClick.emit({
            event: selectEvent.event,
            current: selectEvent.current
        });
        if (!this.selectable) {
            return;
        }
        const { event, selectedValue } = selectEvent;
        this.selectionModel.toggle(selectedValue.id);
        const selectedIds = this.selectionModel.selected;
        if (this.multiple) {
            const _selectedValue = this.getGanttItems(selectedIds).map((item) => item.origin);
            this.selectedChange.emit({ event, current: selectedValue, selectedValue: _selectedValue });
        }
        else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, current: selectedValue, selectedValue: _selectedValue });
        }
    }
    scrollToToday() {
        this.ganttRoot.scrollToToday();
    }
    scrollToDate(date) {
        this.ganttRoot.scrollToDate(date);
    }
    scrolledIndexChange(index) {
        this.virtualScrolledIndexChange.emit({
            index,
            renderedRange: {
                start: this.rangeStart,
                end: this.rangeEnd
            },
            count: this.flatItems.length
        });
    }
    expandGroups(expanded) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.afterExpand();
        this.expandChange.next(null);
        this.cdr.detectChanges();
    }
    expandGroup(group) {
        group.setExpand(!group.expanded);
        this.afterExpand();
        this.expandChange.emit();
        this.cdr.detectChanges();
    }
    itemDragStarted(event) {
        this.table.dragStarted.emit(event);
        this.draggingItem = event.source;
    }
    itemDragEnded(event) {
        this.table.dragEnded.emit(event);
        this.draggingItem = null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i1.ViewportRuler }, { token: GANTT_GLOBAL_CONFIG }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttComponent, isStandalone: true, selector: "ngx-gantt", inputs: { maxLevel: "maxLevel", async: "async", childrenResolve: "childrenResolve", linkable: "linkable", loading: "loading", virtualScrollEnabled: "virtualScrollEnabled", loadingDelay: "loadingDelay" }, outputs: { linkDragStarted: "linkDragStarted", linkDragEnded: "linkDragEnded", lineClick: "lineClick", selectedChange: "selectedChange", virtualScrolledIndexChange: "virtualScrolledIndexChange" }, providers: [
            {
                provide: GANTT_UPPER_TOKEN,
                useExisting: NgxGanttComponent
            },
            {
                provide: GANTT_ABSTRACT_TOKEN,
                useExisting: forwardRef(() => NgxGanttComponent)
            }
        ], queries: [{ propertyName: "table", first: true, predicate: NgxGanttTableComponent, descendants: true }, { propertyName: "tableEmptyTemplate", first: true, predicate: ["tableEmpty"], descendants: true, static: true }, { propertyName: "footerTemplate", first: true, predicate: ["footer"], descendants: true, static: true }, { propertyName: "columns", predicate: NgxGanttTableColumnComponent, descendants: true }], viewQueries: [{ propertyName: "ganttRoot", first: true, predicate: ["ganttRoot"], descendants: true }, { propertyName: "virtualScroll", first: true, predicate: CdkVirtualScrollViewport, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<ngx-gantt-root #ganttRoot>\n  <div class=\"gantt-header\">\n    <gantt-table-header #tableHeader [columns]=\"columns\"></gantt-table-header>\n    <div class=\"gantt-container-header\">\n      <gantt-calendar-header [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"></gantt-calendar-header>\n    </div>\n  </div>\n  <gantt-loader *ngIf=\"loading\"></gantt-loader>\n\n  <cdk-virtual-scroll-viewport\n    class=\"gantt-virtual-scroll-viewport\"\n    [ngClass]=\"{\n      'gantt-normal-viewport': !virtualScrollEnabled,\n      'gantt-scroll-container': virtualScrollEnabled,\n      'with-footer': table?.tableFooterTemplate || footerTemplate\n    }\"\n    [style.top.px]=\"styles.headerHeight\"\n    [itemSize]=\"styles.lineHeight\"\n    [minBufferPx]=\"styles.lineHeight * 10\"\n    [maxBufferPx]=\"styles.lineHeight * 20\"\n    (scrolledIndexChange)=\"scrolledIndexChange($event)\"\n  >\n    <ng-container *cdkVirtualFor=\"let item of flatItems; trackBy: trackBy\"></ng-container>\n    <div class=\"gantt-side\" [style.width.px]=\"tableHeader.tableWidth + 1\" [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\">\n      <div class=\"gantt-side-container\">\n        <div class=\"gantt-table\">\n          <gantt-table-body\n            [flatItems]=\"flatItems\"\n            [viewportItems]=\"viewportItems\"\n            [columns]=\"columns\"\n            [groupTemplate]=\"groupTemplate\"\n            [emptyTemplate]=\"table.tableEmptyTemplate || tableEmptyTemplate\"\n            [rowBeforeTemplate]=\"table?.rowBeforeTemplate\"\n            [rowAfterTemplate]=\"table?.rowAfterTemplate\"\n            [draggable]=\"table.draggable\"\n            [dropEnterPredicate]=\"table.dropEnterPredicate\"\n            (dragDropped)=\"table.dragDropped.emit($event)\"\n            (dragStarted)=\"itemDragStarted($event)\"\n            (dragEnded)=\"itemDragEnded($event)\"\n            (itemClick)=\"selectItem($event)\"\n          >\n          </gantt-table-body>\n        </div>\n      </div>\n    </div>\n    <div class=\"gantt-container\">\n      <gantt-calendar-grid\n        [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"\n        [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n      ></gantt-calendar-grid>\n      <div class=\"gantt-main\">\n        <gantt-main\n          [ganttRoot]=\"ganttRoot\"\n          [flatItems]=\"flatItems\"\n          [viewportItems]=\"viewportItems\"\n          [groupHeaderTemplate]=\"groupHeaderTemplate\"\n          [itemTemplate]=\"itemTemplate\"\n          [barTemplate]=\"barTemplate\"\n          [rangeTemplate]=\"rangeTemplate\"\n          [baselineTemplate]=\"baselineTemplate\"\n          [quickTimeFocus]=\"quickTimeFocus\"\n          (barClick)=\"barClick.emit($event)\"\n          (lineClick)=\"lineClick.emit($event)\"\n        >\n        </gantt-main>\n      </div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n\n  <gantt-drag-backdrop [style.left.px]=\"tableHeader.tableWidth + 1\"></gantt-drag-backdrop>\n\n  <gantt-scrollbar\n    [ganttRoot]=\"ganttRoot\"\n    [hasFooter]=\"!!table?.tableFooterTemplate\"\n    [tableWidth]=\"tableHeader.tableWidth\"\n  ></gantt-scrollbar>\n\n  <div\n    class=\"gantt-footer\"\n    *ngIf=\"table?.tableFooterTemplate || footerTemplate\"\n    [style.right.px]=\"ganttRoot.verticalScrollbarWidth\"\n    [style.bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n  >\n    <div class=\"gantt-table-footer\" [style.width.px]=\"tableHeader.tableWidth + 1\" *ngIf=\"table?.tableFooterTemplate\">\n      <ng-template [ngTemplateOutlet]=\"table?.tableFooterTemplate\" [ngTemplateOutletContext]=\"{ columns: columns }\"> </ng-template>\n    </div>\n    <div class=\"gantt-container-footer\" *ngIf=\"footerTemplate\">\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\"> </ng-template>\n    </div>\n  </div>\n</ngx-gantt-root>\n", dependencies: [{ kind: "component", type: NgxGanttRootComponent, selector: "ngx-gantt-root", inputs: ["sideWidth"] }, { kind: "component", type: GanttTableHeaderComponent, selector: "gantt-table-header", inputs: ["columns"] }, { kind: "component", type: GanttCalendarHeaderComponent, selector: "gantt-calendar-header" }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: GanttLoaderComponent, selector: "gantt-loader" }, { kind: "component", type: CdkVirtualScrollViewport, selector: "cdk-virtual-scroll-viewport", inputs: ["orientation", "appendOnly"], outputs: ["scrolledIndexChange"] }, { kind: "directive", type: CdkFixedSizeVirtualScroll, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: ["itemSize", "minBufferPx", "maxBufferPx"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: CdkVirtualForOf, selector: "[cdkVirtualFor][cdkVirtualForOf]", inputs: ["cdkVirtualForOf", "cdkVirtualForTrackBy", "cdkVirtualForTemplate", "cdkVirtualForTemplateCacheSize"] }, { kind: "component", type: GanttTableBodyComponent, selector: "gantt-table-body", inputs: ["viewportItems", "flatItems", "columns", "groupTemplate", "emptyTemplate", "rowBeforeTemplate", "rowAfterTemplate", "draggable", "dropEnterPredicate"], outputs: ["dragDropped", "dragStarted", "dragEnded", "itemClick"] }, { kind: "component", type: GanttCalendarGridComponent, selector: "gantt-calendar-grid" }, { kind: "component", type: GanttMainComponent, selector: "gantt-main", inputs: ["viewportItems", "flatItems", "groupHeaderTemplate", "itemTemplate", "barTemplate", "rangeTemplate", "baselineTemplate", "ganttRoot", "quickTimeFocus"], outputs: ["barClick", "lineClick"] }, { kind: "component", type: GanttDragBackdropComponent, selector: "gantt-drag-backdrop" }, { kind: "component", type: GanttScrollbarComponent, selector: "gantt-scrollbar", inputs: ["hasFooter", "tableWidth", "ganttRoot"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: GANTT_UPPER_TOKEN,
                            useExisting: NgxGanttComponent
                        },
                        {
                            provide: GANTT_ABSTRACT_TOKEN,
                            useExisting: forwardRef(() => NgxGanttComponent)
                        }
                    ], standalone: true, imports: [
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
                        GanttScrollbarComponent,
                        NgTemplateOutlet,
                        NgFor
                    ], template: "<ngx-gantt-root #ganttRoot>\n  <div class=\"gantt-header\">\n    <gantt-table-header #tableHeader [columns]=\"columns\"></gantt-table-header>\n    <div class=\"gantt-container-header\">\n      <gantt-calendar-header [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"></gantt-calendar-header>\n    </div>\n  </div>\n  <gantt-loader *ngIf=\"loading\"></gantt-loader>\n\n  <cdk-virtual-scroll-viewport\n    class=\"gantt-virtual-scroll-viewport\"\n    [ngClass]=\"{\n      'gantt-normal-viewport': !virtualScrollEnabled,\n      'gantt-scroll-container': virtualScrollEnabled,\n      'with-footer': table?.tableFooterTemplate || footerTemplate\n    }\"\n    [style.top.px]=\"styles.headerHeight\"\n    [itemSize]=\"styles.lineHeight\"\n    [minBufferPx]=\"styles.lineHeight * 10\"\n    [maxBufferPx]=\"styles.lineHeight * 20\"\n    (scrolledIndexChange)=\"scrolledIndexChange($event)\"\n  >\n    <ng-container *cdkVirtualFor=\"let item of flatItems; trackBy: trackBy\"></ng-container>\n    <div class=\"gantt-side\" [style.width.px]=\"tableHeader.tableWidth + 1\" [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\">\n      <div class=\"gantt-side-container\">\n        <div class=\"gantt-table\">\n          <gantt-table-body\n            [flatItems]=\"flatItems\"\n            [viewportItems]=\"viewportItems\"\n            [columns]=\"columns\"\n            [groupTemplate]=\"groupTemplate\"\n            [emptyTemplate]=\"table.tableEmptyTemplate || tableEmptyTemplate\"\n            [rowBeforeTemplate]=\"table?.rowBeforeTemplate\"\n            [rowAfterTemplate]=\"table?.rowAfterTemplate\"\n            [draggable]=\"table.draggable\"\n            [dropEnterPredicate]=\"table.dropEnterPredicate\"\n            (dragDropped)=\"table.dragDropped.emit($event)\"\n            (dragStarted)=\"itemDragStarted($event)\"\n            (dragEnded)=\"itemDragEnded($event)\"\n            (itemClick)=\"selectItem($event)\"\n          >\n          </gantt-table-body>\n        </div>\n      </div>\n    </div>\n    <div class=\"gantt-container\">\n      <gantt-calendar-grid\n        [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"\n        [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n      ></gantt-calendar-grid>\n      <div class=\"gantt-main\">\n        <gantt-main\n          [ganttRoot]=\"ganttRoot\"\n          [flatItems]=\"flatItems\"\n          [viewportItems]=\"viewportItems\"\n          [groupHeaderTemplate]=\"groupHeaderTemplate\"\n          [itemTemplate]=\"itemTemplate\"\n          [barTemplate]=\"barTemplate\"\n          [rangeTemplate]=\"rangeTemplate\"\n          [baselineTemplate]=\"baselineTemplate\"\n          [quickTimeFocus]=\"quickTimeFocus\"\n          (barClick)=\"barClick.emit($event)\"\n          (lineClick)=\"lineClick.emit($event)\"\n        >\n        </gantt-main>\n      </div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n\n  <gantt-drag-backdrop [style.left.px]=\"tableHeader.tableWidth + 1\"></gantt-drag-backdrop>\n\n  <gantt-scrollbar\n    [ganttRoot]=\"ganttRoot\"\n    [hasFooter]=\"!!table?.tableFooterTemplate\"\n    [tableWidth]=\"tableHeader.tableWidth\"\n  ></gantt-scrollbar>\n\n  <div\n    class=\"gantt-footer\"\n    *ngIf=\"table?.tableFooterTemplate || footerTemplate\"\n    [style.right.px]=\"ganttRoot.verticalScrollbarWidth\"\n    [style.bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n  >\n    <div class=\"gantt-table-footer\" [style.width.px]=\"tableHeader.tableWidth + 1\" *ngIf=\"table?.tableFooterTemplate\">\n      <ng-template [ngTemplateOutlet]=\"table?.tableFooterTemplate\" [ngTemplateOutletContext]=\"{ columns: columns }\"> </ng-template>\n    </div>\n    <div class=\"gantt-container-footer\" *ngIf=\"footerTemplate\">\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\"> </ng-template>\n    </div>\n  </div>\n</ngx-gantt-root>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i1.ViewportRuler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [GANTT_GLOBAL_CONFIG]
                }] }], propDecorators: { maxLevel: [{
                type: Input
            }], async: [{
                type: Input
            }], childrenResolve: [{
                type: Input
            }], linkable: [{
                type: Input
            }], loading: [{
                type: Input
            }], virtualScrollEnabled: [{
                type: Input
            }], loadingDelay: [{
                type: Input
            }], linkDragStarted: [{
                type: Output
            }], linkDragEnded: [{
                type: Output
            }], lineClick: [{
                type: Output
            }], selectedChange: [{
                type: Output
            }], virtualScrolledIndexChange: [{
                type: Output
            }], table: [{
                type: ContentChild,
                args: [NgxGanttTableComponent]
            }], columns: [{
                type: ContentChildren,
                args: [NgxGanttTableColumnComponent, { descendants: true }]
            }], tableEmptyTemplate: [{
                type: ContentChild,
                args: ['tableEmpty', { static: true }]
            }], ganttRoot: [{
                type: ViewChild,
                args: ['ganttRoot']
            }], footerTemplate: [{
                type: ContentChild,
                args: ['footer', { static: true }]
            }], virtualScroll: [{
                type: ViewChild,
                args: [CdkVirtualScrollViewport]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2dhbnR0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uL3BhY2thZ2VzL2dhbnR0L3NyYy9nYW50dC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixFQUFpQixNQUFNLHdCQUF3QixDQUFDO0FBQzdILE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pFLE9BQU8sRUFHSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBRWYsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxFQUlOLFNBQVMsRUFDVCxVQUFVLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN4QyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFZakUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDaEcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDdEcsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDaEcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDN0YsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFD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QixLQUFLO2dCQUVZLFFBQVE7c0JBQXpCLEtBQUs7Z0JBRU8sT0FBTztzQkFBbkIsS0FBSztnQkFnQkcsb0JBQW9CO3NCQUE1QixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUksZUFBZTtzQkFBeEIsTUFBTTtnQkFFWSxhQUFhO3NCQUEvQixNQUFNO2dCQUVHLFNBQVM7c0JBQWxCLE1BQU07Z0JBRUcsY0FBYztzQkFBdkIsTUFBTTtnQkFFRywwQkFBMEI7c0JBQW5DLE1BQU07Z0JBRXdDLEtBQUs7c0JBQW5ELFlBQVk7dUJBQUMsc0JBQXNCO2dCQUVrQyxPQUFPO3NCQUE1RSxlQUFlO3VCQUFDLDRCQUE0QixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFHdEIsa0JBQWtCO3NCQUEvRCxZQUFZO3VCQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBRXBCLFNBQVM7c0JBQWhDLFNBQVM7dUJBQUMsV0FBVztnQkFFb0IsY0FBYztzQkFBdkQsWUFBWTt1QkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUVILGFBQWE7c0JBQWpELFNBQVM7dUJBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCwgQ2RrVmlydHVhbEZvck9mLCBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIFZpZXdwb3J0UnVsZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IE5nQ2xhc3MsIE5nRm9yLCBOZ0lmLCBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ1pvbmUsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIGZvcndhcmRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaW5hbGl6ZSwgc2tpcCwgdGFrZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgICBHYW50dEdyb3VwSW50ZXJuYWwsXG4gICAgR2FudHRJdGVtLFxuICAgIEdhbnR0SXRlbUludGVybmFsLFxuICAgIEdhbnR0TGluZUNsaWNrRXZlbnQsXG4gICAgR2FudHRMaW5rRHJhZ0V2ZW50LFxuICAgIEdhbnR0U2VsZWN0ZWRFdmVudCxcbiAgICBHYW50dFRhYmxlRHJhZ0VuZGVkRXZlbnQsXG4gICAgR2FudHRUYWJsZURyYWdTdGFydGVkRXZlbnQsXG4gICAgR2FudHRWaXJ0dWFsU2Nyb2xsZWRJbmRleENoYW5nZUV2ZW50XG59IGZyb20gJy4vY2xhc3MnO1xuaW1wb3J0IHsgR2FudHRDYWxlbmRhckdyaWRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXIvZ3JpZC9jYWxlbmRhci1ncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBHYW50dENhbGVuZGFySGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NhbGVuZGFyL2hlYWRlci9jYWxlbmRhci1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0RHJhZ0JhY2tkcm9wQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RyYWctYmFja2Ryb3AvZHJhZy1iYWNrZHJvcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgR2FudHRMb2FkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbG9hZGVyL2xvYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgR2FudHRNYWluQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL21haW4vZ2FudHQtbWFpbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgR2FudHRUYWJsZUJvZHlDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUvYm9keS9nYW50dC10YWJsZS1ib2R5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBHYW50dFRhYmxlSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlL2hlYWRlci9nYW50dC10YWJsZS1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEdBTlRUX0FCU1RSQUNUX1RPS0VOIH0gZnJvbSAnLi9nYW50dC1hYnN0cmFjdCc7XG5pbXBvcnQgeyBHQU5UVF9VUFBFUl9UT0tFTiwgR2FudHRVcHBlciB9IGZyb20gJy4vZ2FudHQtdXBwZXInO1xuaW1wb3J0IHsgR0FOVFRfR0xPQkFMX0NPTkZJRywgR2FudHRHbG9iYWxDb25maWcgfSBmcm9tICcuL2dhbnR0LmNvbmZpZyc7XG5pbXBvcnQgeyBOZ3hHYW50dFJvb3RDb21wb25lbnQgfSBmcm9tICcuL3Jvb3QuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbnR0VGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuL3RhYmxlL2dhbnR0LWNvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FudHRUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vdGFibGUvZ2FudHQtdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0RGF0ZSB9IGZyb20gJy4vdXRpbHMvZGF0ZSc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5LCBrZXlCeSwgcmVjdXJzaXZlSXRlbXMsIHVuaXFCeSB9IGZyb20gJy4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgeyBHYW50dFNjcm9sbGJhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zY3JvbGxiYXIvc2Nyb2xsYmFyLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWdhbnR0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZ2FudHQuY29tcG9uZW50Lmh0bWwnLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBHQU5UVF9VUFBFUl9UT0tFTixcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBOZ3hHYW50dENvbXBvbmVudFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBHQU5UVF9BQlNUUkFDVF9UT0tFTixcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neEdhbnR0Q29tcG9uZW50KVxuICAgICAgICB9XG4gICAgXSxcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgTmd4R2FudHRSb290Q29tcG9uZW50LFxuICAgICAgICBHYW50dFRhYmxlSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBHYW50dENhbGVuZGFySGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBOZ0lmLFxuICAgICAgICBHYW50dExvYWRlckNvbXBvbmVudCxcbiAgICAgICAgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgICBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLFxuICAgICAgICBOZ0NsYXNzLFxuICAgICAgICBDZGtWaXJ0dWFsRm9yT2YsXG4gICAgICAgIEdhbnR0VGFibGVCb2R5Q29tcG9uZW50LFxuICAgICAgICBHYW50dENhbGVuZGFyR3JpZENvbXBvbmVudCxcbiAgICAgICAgR2FudHRNYWluQ29tcG9uZW50LFxuICAgICAgICBHYW50dERyYWdCYWNrZHJvcENvbXBvbmVudCxcbiAgICAgICAgR2FudHRTY3JvbGxiYXJDb21wb25lbnQsXG4gICAgICAgIE5nVGVtcGxhdGVPdXRsZXQsXG4gICAgICAgIE5nRm9yXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYW50dENvbXBvbmVudCBleHRlbmRzIEdhbnR0VXBwZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCB7XG4gICAgQElucHV0KCkgbWF4TGV2ZWwgPSAyO1xuXG4gICAgQElucHV0KCkgYXN5bmM6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBjaGlsZHJlblJlc29sdmU6IChHYW50dEl0ZW0pID0+IE9ic2VydmFibGU8R2FudHRJdGVtW10+O1xuXG4gICAgQElucHV0KCkgb3ZlcnJpZGUgbGlua2FibGU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzZXQgbG9hZGluZyhsb2FkaW5nOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nRGVsYXkgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9hZGluZyA9IGxvYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMubG9hZGluZ0RlbGF5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZGluZyA9IGxvYWRpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkaW5nVGltZXIpO1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZyA9IGxvYWRpbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSB2aXJ0dWFsU2Nyb2xsRW5hYmxlZCA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBsb2FkaW5nRGVsYXkgPSAwO1xuXG4gICAgQE91dHB1dCgpIGxpbmtEcmFnU3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8R2FudHRMaW5rRHJhZ0V2ZW50PigpO1xuXG4gICAgQE91dHB1dCgpIG92ZXJyaWRlIGxpbmtEcmFnRW5kZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0TGlua0RyYWdFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKSBsaW5lQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0TGluZUNsaWNrRXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KCkgc2VsZWN0ZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0U2VsZWN0ZWRFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKSB2aXJ0dWFsU2Nyb2xsZWRJbmRleENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8R2FudHRWaXJ0dWFsU2Nyb2xsZWRJbmRleENoYW5nZUV2ZW50PigpO1xuXG4gICAgQENvbnRlbnRDaGlsZChOZ3hHYW50dFRhYmxlQ29tcG9uZW50KSBvdmVycmlkZSB0YWJsZTogTmd4R2FudHRUYWJsZUNvbXBvbmVudDtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oTmd4R2FudHRUYWJsZUNvbHVtbkNvbXBvbmVudCwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBjb2x1bW5zOiBRdWVyeUxpc3Q8Tmd4R2FudHRUYWJsZUNvbHVtbkNvbXBvbmVudD47XG5cbiAgICAvLyDmraTmqKHniYjlt7LmjKrliLAgdGFibGUg57uE5Lu25LiL77yM5Li65LqG5YW85a655q2k5aSE5pqC5pe25L+d55WZXG4gICAgQENvbnRlbnRDaGlsZCgndGFibGVFbXB0eScsIHsgc3RhdGljOiB0cnVlIH0pIHRhYmxlRW1wdHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2dhbnR0Um9vdCcpIGdhbnR0Um9vdDogTmd4R2FudHRSb290Q29tcG9uZW50O1xuXG4gICAgQENvbnRlbnRDaGlsZCgnZm9vdGVyJywgeyBzdGF0aWM6IHRydWUgfSkgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkKENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCkgdmlydHVhbFNjcm9sbDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuXG4gICAgZ2V0IGxvYWRpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBmbGF0SXRlbXM6IChHYW50dEdyb3VwSW50ZXJuYWwgfCBHYW50dEl0ZW1JbnRlcm5hbClbXSA9IFtdO1xuXG4gICAgcHVibGljIHZpZXdwb3J0SXRlbXM6IChHYW50dEdyb3VwSW50ZXJuYWwgfCBHYW50dEl0ZW1JbnRlcm5hbClbXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSBfbG9hZGluZyA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBsb2FkaW5nVGltZXI7XG5cbiAgICBwcml2YXRlIHJhbmdlU3RhcnQgPSAwO1xuXG4gICAgcHJpdmF0ZSByYW5nZUVuZCA9IDA7XG5cbiAgICBwcml2YXRlIGZsYXRJdGVtc01hcDogRGljdGlvbmFyeTxHYW50dEdyb3VwSW50ZXJuYWwgfCBHYW50dEl0ZW1JbnRlcm5hbD47XG5cbiAgICBwcml2YXRlIGRyYWdnaW5nSXRlbTogR2FudHRJdGVtO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgcHJpdmF0ZSB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICBASW5qZWN0KEdBTlRUX0dMT0JBTF9DT05GSUcpIGNvbmZpZzogR2FudHRHbG9iYWxDb25maWdcbiAgICApIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudFJlZiwgY2RyLCBuZ1pvbmUsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMuY29tcHV0ZUFsbFJlZnMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBuZ09uSW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICAgICAgdGhpcy5idWlsZEZsYXRJdGVtcygpO1xuICAgICAgICAvLyBOb3RlOiB0aGUgem9uZSBtYXkgYmUgbm9vcGVkIHRocm91Z2ggYEJvb3RzdHJhcE9wdGlvbnNgIHdoZW4gYm9vdHN0cmFwcGluZyB0aGUgcm9vdCBtb2R1bGUuIFRoaXMgbWVhbnNcbiAgICAgICAgLy8gdGhlIGBvblN0YWJsZWAgd2lsbCBuZXZlciBlbWl0IGFueSB2YWx1ZS5cbiAgICAgICAgY29uc3Qgb25TdGFibGUkID0gdGhpcy5uZ1pvbmUuaXNTdGFibGUgPyBmcm9tKFByb21pc2UucmVzb2x2ZSgpKSA6IHRoaXMubmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSk7XG4gICAgICAgIC8vIE5vcm1hbGx5IHRoaXMgaXNuJ3QgaW4gdGhlIHpvbmUsIGJ1dCBpdCBjYW4gY2F1c2UgcGVyZm9ybWFuY2UgcmVncmVzc2lvbnMgZm9yIGFwcHNcbiAgICAgICAgLy8gdXNpbmcgYHpvbmUtcGF0Y2gtcnhqc2AgYmVjYXVzZSBpdCdsbCB0cmlnZ2VyIGEgY2hhbmdlIGRldGVjdGlvbiB3aGVuIGl0IHVuc3Vic2NyaWJlcy5cbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgb25TdGFibGUkLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIubGlua0RyYWdTdGFydGVkLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKChldmVudDogR2FudHRMaW5rRHJhZ0V2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlua0RyYWdTdGFydGVkLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLmxpbmtEcmFnRW5kZWQucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKGV2ZW50OiBHYW50dExpbmtEcmFnRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rRHJhZ0VuZGVkLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmlldy5zdGFydCQucGlwZShza2lwKDEpLCB0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlVGVtcERhdGFSZWZzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy52aWV3cG9ydEl0ZW1zID0gdGhpcy5mbGF0SXRlbXMuc2xpY2UodGhpcy5yYW5nZVN0YXJ0LCB0aGlzLnJhbmdlRW5kKTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRlbXBEYXRhUmVmcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgICAgICAgaWYgKCF0aGlzLmZpcnN0Q2hhbmdlKSB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcy52aWV3VHlwZSAmJiBjaGFuZ2VzLnZpZXdUeXBlLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlld3BvcnRJdGVtcyA9IHRoaXMuZmxhdEl0ZW1zLnNsaWNlKHRoaXMucmFuZ2VTdGFydCwgdGhpcy5yYW5nZUVuZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlVGVtcERhdGFSZWZzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlcy5vcmlnaW5JdGVtcyB8fCBjaGFuZ2VzLm9yaWdpbkdyb3Vwcykge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVpbGRGbGF0SXRlbXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdwb3J0SXRlbXMgPSB0aGlzLmZsYXRJdGVtcy5zbGljZSh0aGlzLnJhbmdlU3RhcnQsIHRoaXMucmFuZ2VFbmQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRlbXBEYXRhUmVmcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsLnJlbmRlcmVkUmFuZ2VTdHJlYW0ucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKHJhbmdlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlua3NFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmdhbnR0LWxpbmtzLW92ZXJsYXknKSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgICAgICAgICBsaW5rc0VsZW1lbnQuc3R5bGUudG9wID0gYCR7LSh0aGlzLnN0eWxlcy5saW5lSGVpZ2h0ICogcmFuZ2Uuc3RhcnQpfXB4YDtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlU3RhcnQgPSByYW5nZS5zdGFydDtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlRW5kID0gcmFuZ2UuZW5kO1xuICAgICAgICAgICAgICAgIHRoaXMudmlld3BvcnRJdGVtcyA9IHRoaXMuZmxhdEl0ZW1zLnNsaWNlKHJhbmdlLnN0YXJ0LCByYW5nZS5lbmQpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ2dpbmdJdGVtVG9WaWV3cG9ydEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlVGVtcERhdGFSZWZzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbEVuYWJsZWQgJiYgdGhpcy52aWV3cG9ydFJ1bGVyICYmIHRoaXMudmlydHVhbFNjcm9sbC5nZXRSZW5kZXJlZFJhbmdlKCkuZW5kID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgb25TdGFibGUkID0gdGhpcy5uZ1pvbmUuaXNTdGFibGUgPyBmcm9tKFByb21pc2UucmVzb2x2ZSgpKSA6IHRoaXMubmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSk7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25TdGFibGUkLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdhbnR0Um9vdC52ZXJ0aWNhbFNjcm9sbGJhcldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbnR0Um9vdC5jb21wdXRlU2Nyb2xsQmFyT2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGJ1aWxkRmxhdEl0ZW1zKCkge1xuICAgICAgICBjb25zdCB2aXJ0dWFsRGF0YSA9IFtdO1xuICAgICAgICBpZiAodGhpcy5ncm91cHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3Vwcy5mb3JFYWNoKChncm91cCkgPT4ge1xuICAgICAgICAgICAgICAgIHZpcnR1YWxEYXRhLnB1c2goZ3JvdXApO1xuICAgICAgICAgICAgICAgIGlmIChncm91cC5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHJlY3Vyc2l2ZUl0ZW1zKGdyb3VwLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgdmlydHVhbERhdGEucHVzaCguLi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZpcnR1YWxEYXRhLnB1c2goLi4ucmVjdXJzaXZlSXRlbXModGhpcy5pdGVtcykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmxhdEl0ZW1zID0gWy4uLnZpcnR1YWxEYXRhXTtcbiAgICAgICAgdGhpcy5mbGF0SXRlbXNNYXAgPSBrZXlCeSh0aGlzLmZsYXRJdGVtcywgJ2lkJyk7XG4gICAgICAgIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5yYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICAgIHRoaXMucmFuZ2VFbmQgPSB0aGlzLmZsYXRJdGVtcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFmdGVyRXhwYW5kKCkge1xuICAgICAgICB0aGlzLmJ1aWxkRmxhdEl0ZW1zKCk7XG4gICAgICAgIHRoaXMudmlld3BvcnRJdGVtcyA9IHRoaXMuZmxhdEl0ZW1zLnNsaWNlKHRoaXMucmFuZ2VTdGFydCwgdGhpcy5yYW5nZUVuZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb21wdXRlVGVtcERhdGFSZWZzKCkge1xuICAgICAgICBjb25zdCB0ZW1wSXRlbURhdGEgPSBbXTtcbiAgICAgICAgdGhpcy52aWV3cG9ydEl0ZW1zLmZvckVhY2goKGRhdGE6IEdhbnR0R3JvdXBJbnRlcm5hbCB8IEdhbnR0SXRlbUludGVybmFsKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoJ2l0ZW1zJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gZGF0YSBhcyBHYW50dEl0ZW1JbnRlcm5hbDtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5saW5rcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmxpbmtzLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZsYXRJdGVtc01hcFtsaW5rLmxpbmtdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEl0ZW1EYXRhLnB1c2godGhpcy5mbGF0SXRlbXNNYXBbbGluay5saW5rXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ZW1wSXRlbURhdGEucHVzaChkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29tcHV0ZUl0ZW1zUmVmcyguLi51bmlxQnkodGVtcEl0ZW1EYXRhLCAnaWQnKSk7XG4gICAgICAgIHRoaXMuZmxhdEl0ZW1zID0gWy4uLnRoaXMuZmxhdEl0ZW1zXTtcbiAgICAgICAgdGhpcy52aWV3cG9ydEl0ZW1zID0gWy4uLnRoaXMudmlld3BvcnRJdGVtc107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBlbmREcmFnZ2luZ0l0ZW1Ub1ZpZXdwb3J0SXRlbXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nSXRlbSkge1xuICAgICAgICAgICAgbGV0IGZsYXRJdGVtID0gdGhpcy52aWV3cG9ydEl0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pZCA9PT0gdGhpcy5kcmFnZ2luZ0l0ZW0uaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghZmxhdEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBmbGF0SXRlbSA9IHRoaXMuZmxhdEl0ZW1zLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IHRoaXMuZHJhZ2dpbmdJdGVtLmlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChmbGF0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdwb3J0SXRlbXMucHVzaChmbGF0SXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwYW5kQ2hpbGRyZW4oaXRlbTogR2FudHRJdGVtSW50ZXJuYWwpIHtcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKSB7XG4gICAgICAgICAgICBpdGVtLnNldEV4cGFuZCh0cnVlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFzeW5jICYmIHRoaXMuY2hpbGRyZW5SZXNvbHZlICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuUmVzb2x2ZShpdGVtLm9yaWdpbilcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxpemUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZENoYW5nZS5lbWl0KGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoaXRlbXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkQ2hpbGRyZW4oaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlSXRlbXNSZWZzKC4uLml0ZW0uY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlSXRlbXNSZWZzKC4uLml0ZW0uY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZENoYW5nZS5lbWl0KGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5zZXRFeHBhbmQoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5hZnRlckV4cGFuZCgpO1xuICAgICAgICAgICAgdGhpcy5leHBhbmRDaGFuZ2UuZW1pdChpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdEl0ZW0oc2VsZWN0RXZlbnQ6IEdhbnR0U2VsZWN0ZWRFdmVudCkge1xuICAgICAgICB0aGlzLnRhYmxlLml0ZW1DbGljay5lbWl0KHtcbiAgICAgICAgICAgIGV2ZW50OiBzZWxlY3RFdmVudC5ldmVudCxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHNlbGVjdEV2ZW50LmN1cnJlbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGV2ZW50LCBzZWxlY3RlZFZhbHVlIH0gPSBzZWxlY3RFdmVudDtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25Nb2RlbC50b2dnbGUoKHNlbGVjdGVkVmFsdWUgYXMgR2FudHRJdGVtKS5pZCk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJZHMgPSB0aGlzLnNlbGVjdGlvbk1vZGVsLnNlbGVjdGVkO1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgY29uc3QgX3NlbGVjdGVkVmFsdWUgPSB0aGlzLmdldEdhbnR0SXRlbXMoc2VsZWN0ZWRJZHMpLm1hcCgoaXRlbSkgPT4gaXRlbS5vcmlnaW4pO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KHsgZXZlbnQsIGN1cnJlbnQ6IHNlbGVjdGVkVmFsdWUgYXMgR2FudHRJdGVtLCBzZWxlY3RlZFZhbHVlOiBfc2VsZWN0ZWRWYWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IF9zZWxlY3RlZFZhbHVlID0gdGhpcy5nZXRHYW50dEl0ZW0oc2VsZWN0ZWRJZHNbMF0pPy5vcmlnaW47XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoeyBldmVudCwgY3VycmVudDogc2VsZWN0ZWRWYWx1ZSBhcyBHYW50dEl0ZW0sIHNlbGVjdGVkVmFsdWU6IF9zZWxlY3RlZFZhbHVlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9Ub2RheSgpIHtcbiAgICAgICAgdGhpcy5nYW50dFJvb3Quc2Nyb2xsVG9Ub2RheSgpO1xuICAgIH1cblxuICAgIHNjcm9sbFRvRGF0ZShkYXRlOiBudW1iZXIgfCBEYXRlIHwgR2FudHREYXRlKSB7XG4gICAgICAgIHRoaXMuZ2FudHRSb290LnNjcm9sbFRvRGF0ZShkYXRlKTtcbiAgICB9XG5cbiAgICBzY3JvbGxlZEluZGV4Q2hhbmdlKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsZWRJbmRleENoYW5nZS5lbWl0KHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcmVuZGVyZWRSYW5nZToge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiB0aGlzLnJhbmdlU3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOiB0aGlzLnJhbmdlRW5kXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY291bnQ6IHRoaXMuZmxhdEl0ZW1zLmxlbmd0aFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBleHBhbmRHcm91cHMoZXhwYW5kZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5ncm91cHMuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGdyb3VwLnNldEV4cGFuZChleHBhbmRlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQoKTtcbiAgICAgICAgdGhpcy5leHBhbmRDaGFuZ2UubmV4dChudWxsKTtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGV4cGFuZEdyb3VwKGdyb3VwOiBHYW50dEdyb3VwSW50ZXJuYWwpIHtcbiAgICAgICAgZ3JvdXAuc2V0RXhwYW5kKCFncm91cC5leHBhbmRlZCk7XG4gICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQoKTtcbiAgICAgICAgdGhpcy5leHBhbmRDaGFuZ2UuZW1pdCgpO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgaXRlbURyYWdTdGFydGVkKGV2ZW50OiBHYW50dFRhYmxlRHJhZ1N0YXJ0ZWRFdmVudCkge1xuICAgICAgICB0aGlzLnRhYmxlLmRyYWdTdGFydGVkLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLmRyYWdnaW5nSXRlbSA9IGV2ZW50LnNvdXJjZTtcbiAgICB9XG5cbiAgICBpdGVtRHJhZ0VuZGVkKGV2ZW50OiBHYW50dFRhYmxlRHJhZ0VuZGVkRXZlbnQpIHtcbiAgICAgICAgdGhpcy50YWJsZS5kcmFnRW5kZWQuZW1pdChldmVudCk7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmdJdGVtID0gbnVsbDtcbiAgICB9XG59XG4iLCI8bmd4LWdhbnR0LXJvb3QgI2dhbnR0Um9vdD5cbiAgPGRpdiBjbGFzcz1cImdhbnR0LWhlYWRlclwiPlxuICAgIDxnYW50dC10YWJsZS1oZWFkZXIgI3RhYmxlSGVhZGVyIFtjb2x1bW5zXT1cImNvbHVtbnNcIj48L2dhbnR0LXRhYmxlLWhlYWRlcj5cbiAgICA8ZGl2IGNsYXNzPVwiZ2FudHQtY29udGFpbmVyLWhlYWRlclwiPlxuICAgICAgPGdhbnR0LWNhbGVuZGFyLWhlYWRlciBbc3R5bGUucGFkZGluZy1yaWdodC5weF09XCJnYW50dFJvb3QudmVydGljYWxTY3JvbGxiYXJXaWR0aFwiPjwvZ2FudHQtY2FsZW5kYXItaGVhZGVyPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGdhbnR0LWxvYWRlciAqbmdJZj1cImxvYWRpbmdcIj48L2dhbnR0LWxvYWRlcj5cblxuICA8Y2RrLXZpcnR1YWwtc2Nyb2xsLXZpZXdwb3J0XG4gICAgY2xhc3M9XCJnYW50dC12aXJ0dWFsLXNjcm9sbC12aWV3cG9ydFwiXG4gICAgW25nQ2xhc3NdPVwie1xuICAgICAgJ2dhbnR0LW5vcm1hbC12aWV3cG9ydCc6ICF2aXJ0dWFsU2Nyb2xsRW5hYmxlZCxcbiAgICAgICdnYW50dC1zY3JvbGwtY29udGFpbmVyJzogdmlydHVhbFNjcm9sbEVuYWJsZWQsXG4gICAgICAnd2l0aC1mb290ZXInOiB0YWJsZT8udGFibGVGb290ZXJUZW1wbGF0ZSB8fCBmb290ZXJUZW1wbGF0ZVxuICAgIH1cIlxuICAgIFtzdHlsZS50b3AucHhdPVwic3R5bGVzLmhlYWRlckhlaWdodFwiXG4gICAgW2l0ZW1TaXplXT1cInN0eWxlcy5saW5lSGVpZ2h0XCJcbiAgICBbbWluQnVmZmVyUHhdPVwic3R5bGVzLmxpbmVIZWlnaHQgKiAxMFwiXG4gICAgW21heEJ1ZmZlclB4XT1cInN0eWxlcy5saW5lSGVpZ2h0ICogMjBcIlxuICAgIChzY3JvbGxlZEluZGV4Q2hhbmdlKT1cInNjcm9sbGVkSW5kZXhDaGFuZ2UoJGV2ZW50KVwiXG4gID5cbiAgICA8bmctY29udGFpbmVyICpjZGtWaXJ0dWFsRm9yPVwibGV0IGl0ZW0gb2YgZmxhdEl0ZW1zOyB0cmFja0J5OiB0cmFja0J5XCI+PC9uZy1jb250YWluZXI+XG4gICAgPGRpdiBjbGFzcz1cImdhbnR0LXNpZGVcIiBbc3R5bGUud2lkdGgucHhdPVwidGFibGVIZWFkZXIudGFibGVXaWR0aCArIDFcIiBbc3R5bGUucGFkZGluZy1ib3R0b20ucHhdPVwiZ2FudHRSb290Lmhvcml6b250YWxTY3JvbGxiYXJIZWlnaHRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJnYW50dC1zaWRlLWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FudHQtdGFibGVcIj5cbiAgICAgICAgICA8Z2FudHQtdGFibGUtYm9keVxuICAgICAgICAgICAgW2ZsYXRJdGVtc109XCJmbGF0SXRlbXNcIlxuICAgICAgICAgICAgW3ZpZXdwb3J0SXRlbXNdPVwidmlld3BvcnRJdGVtc1wiXG4gICAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcbiAgICAgICAgICAgIFtncm91cFRlbXBsYXRlXT1cImdyb3VwVGVtcGxhdGVcIlxuICAgICAgICAgICAgW2VtcHR5VGVtcGxhdGVdPVwidGFibGUudGFibGVFbXB0eVRlbXBsYXRlIHx8IHRhYmxlRW1wdHlUZW1wbGF0ZVwiXG4gICAgICAgICAgICBbcm93QmVmb3JlVGVtcGxhdGVdPVwidGFibGU/LnJvd0JlZm9yZVRlbXBsYXRlXCJcbiAgICAgICAgICAgIFtyb3dBZnRlclRlbXBsYXRlXT1cInRhYmxlPy5yb3dBZnRlclRlbXBsYXRlXCJcbiAgICAgICAgICAgIFtkcmFnZ2FibGVdPVwidGFibGUuZHJhZ2dhYmxlXCJcbiAgICAgICAgICAgIFtkcm9wRW50ZXJQcmVkaWNhdGVdPVwidGFibGUuZHJvcEVudGVyUHJlZGljYXRlXCJcbiAgICAgICAgICAgIChkcmFnRHJvcHBlZCk9XCJ0YWJsZS5kcmFnRHJvcHBlZC5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgKGRyYWdTdGFydGVkKT1cIml0ZW1EcmFnU3RhcnRlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgIChkcmFnRW5kZWQpPVwiaXRlbURyYWdFbmRlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgIChpdGVtQ2xpY2spPVwic2VsZWN0SXRlbSgkZXZlbnQpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPC9nYW50dC10YWJsZS1ib2R5PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJnYW50dC1jb250YWluZXJcIj5cbiAgICAgIDxnYW50dC1jYWxlbmRhci1ncmlkXG4gICAgICAgIFtzdHlsZS5wYWRkaW5nLXJpZ2h0LnB4XT1cImdhbnR0Um9vdC52ZXJ0aWNhbFNjcm9sbGJhcldpZHRoXCJcbiAgICAgICAgW3N0eWxlLnBhZGRpbmctYm90dG9tLnB4XT1cImdhbnR0Um9vdC5ob3Jpem9udGFsU2Nyb2xsYmFySGVpZ2h0XCJcbiAgICAgID48L2dhbnR0LWNhbGVuZGFyLWdyaWQ+XG4gICAgICA8ZGl2IGNsYXNzPVwiZ2FudHQtbWFpblwiPlxuICAgICAgICA8Z2FudHQtbWFpblxuICAgICAgICAgIFtnYW50dFJvb3RdPVwiZ2FudHRSb290XCJcbiAgICAgICAgICBbZmxhdEl0ZW1zXT1cImZsYXRJdGVtc1wiXG4gICAgICAgICAgW3ZpZXdwb3J0SXRlbXNdPVwidmlld3BvcnRJdGVtc1wiXG4gICAgICAgICAgW2dyb3VwSGVhZGVyVGVtcGxhdGVdPVwiZ3JvdXBIZWFkZXJUZW1wbGF0ZVwiXG4gICAgICAgICAgW2l0ZW1UZW1wbGF0ZV09XCJpdGVtVGVtcGxhdGVcIlxuICAgICAgICAgIFtiYXJUZW1wbGF0ZV09XCJiYXJUZW1wbGF0ZVwiXG4gICAgICAgICAgW3JhbmdlVGVtcGxhdGVdPVwicmFuZ2VUZW1wbGF0ZVwiXG4gICAgICAgICAgW2Jhc2VsaW5lVGVtcGxhdGVdPVwiYmFzZWxpbmVUZW1wbGF0ZVwiXG4gICAgICAgICAgW3F1aWNrVGltZUZvY3VzXT1cInF1aWNrVGltZUZvY3VzXCJcbiAgICAgICAgICAoYmFyQ2xpY2spPVwiYmFyQ2xpY2suZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAobGluZUNsaWNrKT1cImxpbmVDbGljay5lbWl0KCRldmVudClcIlxuICAgICAgICA+XG4gICAgICAgIDwvZ2FudHQtbWFpbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Nkay12aXJ0dWFsLXNjcm9sbC12aWV3cG9ydD5cblxuICA8Z2FudHQtZHJhZy1iYWNrZHJvcCBbc3R5bGUubGVmdC5weF09XCJ0YWJsZUhlYWRlci50YWJsZVdpZHRoICsgMVwiPjwvZ2FudHQtZHJhZy1iYWNrZHJvcD5cblxuICA8Z2FudHQtc2Nyb2xsYmFyXG4gICAgW2dhbnR0Um9vdF09XCJnYW50dFJvb3RcIlxuICAgIFtoYXNGb290ZXJdPVwiISF0YWJsZT8udGFibGVGb290ZXJUZW1wbGF0ZVwiXG4gICAgW3RhYmxlV2lkdGhdPVwidGFibGVIZWFkZXIudGFibGVXaWR0aFwiXG4gID48L2dhbnR0LXNjcm9sbGJhcj5cblxuICA8ZGl2XG4gICAgY2xhc3M9XCJnYW50dC1mb290ZXJcIlxuICAgICpuZ0lmPVwidGFibGU/LnRhYmxlRm9vdGVyVGVtcGxhdGUgfHwgZm9vdGVyVGVtcGxhdGVcIlxuICAgIFtzdHlsZS5yaWdodC5weF09XCJnYW50dFJvb3QudmVydGljYWxTY3JvbGxiYXJXaWR0aFwiXG4gICAgW3N0eWxlLmJvdHRvbS5weF09XCJnYW50dFJvb3QuaG9yaXpvbnRhbFNjcm9sbGJhckhlaWdodFwiXG4gID5cbiAgICA8ZGl2IGNsYXNzPVwiZ2FudHQtdGFibGUtZm9vdGVyXCIgW3N0eWxlLndpZHRoLnB4XT1cInRhYmxlSGVhZGVyLnRhYmxlV2lkdGggKyAxXCIgKm5nSWY9XCJ0YWJsZT8udGFibGVGb290ZXJUZW1wbGF0ZVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRhYmxlPy50YWJsZUZvb3RlclRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgY29sdW1uczogY29sdW1ucyB9XCI+IDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImdhbnR0LWNvbnRhaW5lci1mb290ZXJcIiAqbmdJZj1cImZvb3RlclRlbXBsYXRlXCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9vdGVyVGVtcGxhdGVcIj4gPC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25neC1nYW50dC1yb290PlxuIl19