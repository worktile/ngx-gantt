import { Component, HostBinding, Input, ViewChild, Inject } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GANTT_ABSTRACT_TOKEN } from '../../../gantt-abstract';
import { setStyleWithVendorPrefix } from '../../../utils/set-style-with-vendor-prefix';
import { Subject, takeUntil } from 'rxjs';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
export const defaultColumnWidth = 100;
export const minColumnWidth = 80;
export class GanttTableHeaderComponent {
    get height() {
        return this.gantt.styles.headerHeight + 'px';
    }
    get lineHeight() {
        return this.gantt.styles.headerHeight + 'px';
    }
    constructor(elementRef, gantt, cdr) {
        this.elementRef = elementRef;
        this.gantt = gantt;
        this.cdr = cdr;
        this.tableWidth = 0;
        this.unsubscribe$ = new Subject();
        this.className = `gantt-table-header `;
    }
    ngOnInit() {
        this.columnsChange();
        this.columns.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.columnsChange();
            this.gantt.cdr.detectChanges();
        });
    }
    columnsChange() {
        let tableWidth = 0;
        this.columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
            tableWidth += Number(column.columnWidth.replace('px', ''));
        });
        this.tableWidth = tableWidth;
    }
    dragFixed(config) {
        if (config.movedWidth < config.minWidth) {
            setStyleWithVendorPrefix({
                element: config.target,
                style: 'transform',
                value: `translate3d(${config.minWidth - config.originWidth}px, 0, 0)`
            });
        }
    }
    onResizeStarted(event) {
        const target = event.source.element.nativeElement;
        this.dragStartLeft = target.getBoundingClientRect().left;
    }
    onResizeMoved(event, column) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        let originWidth;
        let movedWidth;
        let minWidth;
        if (column) {
            originWidth = parseInt(column.columnWidth, 10);
            movedWidth = originWidth + (left - this.dragStartLeft);
            minWidth = minColumnWidth;
        }
        else {
            originWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
            movedWidth = originWidth + (left - this.dragStartLeft);
            minWidth = minColumnWidth * this.columns.length;
        }
        this.dragFixed({
            target,
            originWidth,
            movedWidth,
            minWidth
        });
        this.showAuxiliaryLine(event);
    }
    onResizeEnded(event, column) {
        const beforeWidth = parseInt(column.columnWidth, 10);
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const width = parseInt(column.columnWidth, 10) + (left - this.dragStartLeft);
        const columnWidth = Math.max(width || 0, minColumnWidth);
        column.columnWidth = coerceCssPixelValue(columnWidth);
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columns });
        }
        this.tableWidth = this.tableWidth - beforeWidth + columnWidth;
        this.hideAuxiliaryLine();
        event.source.reset();
    }
    onOverallResizeEnded(event) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const tableWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        const dragWidth = left - this.dragStartLeft;
        let tempWidth = 0;
        this.columns.forEach((column) => {
            const lastColumnWidth = parseInt(column.columnWidth, 10);
            const distributeWidth = parseInt(String(dragWidth * (lastColumnWidth / tableWidth)), 10);
            const columnWidth = Math.max(lastColumnWidth + distributeWidth || 0, minColumnWidth);
            column.columnWidth = coerceCssPixelValue(columnWidth);
            tempWidth += columnWidth;
        });
        this.tableWidth = tempWidth;
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columns });
        }
        this.hideAuxiliaryLine();
        event.source.reset();
    }
    showAuxiliaryLine(event) {
        const tableRect = this.elementRef.nativeElement.getBoundingClientRect();
        const targetRect = event.source.element.nativeElement.getBoundingClientRect();
        const distance = { x: targetRect.left - tableRect.left, y: targetRect.top - tableRect.top };
        this.resizeLineElementRef.nativeElement.style.left = `${distance.x}px`;
        this.resizeLineElementRef.nativeElement.style.display = 'block';
    }
    hideAuxiliaryLine() {
        this.resizeLineElementRef.nativeElement.style.display = 'none';
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttTableHeaderComponent, deps: [{ token: i0.ElementRef }, { token: GANTT_ABSTRACT_TOKEN }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttTableHeaderComponent, isStandalone: true, selector: "gantt-table-header", inputs: { columns: "columns" }, host: { properties: { "class": "this.className", "style.height": "this.height", "style.line-height": "this.lineHeight" } }, viewQueries: [{ propertyName: "resizeLineElementRef", first: true, predicate: ["resizeLine"], descendants: true, static: true }], ngImport: i0, template: "<div class=\"gantt-table-header-container\">\n  <div class=\"gantt-table-column\" *ngFor=\"let column of columns; let i = index\" [style.width]=\"column.columnWidth\">\n    <ng-container *ngIf=\"column.headerTemplateRef; else default\" [ngTemplateOutlet]=\"column.headerTemplateRef\"> </ng-container>\n    <ng-template #default>\n      {{ column.name }}\n    </ng-template>\n    <div\n      class=\"column-resize-handle\"\n      cdkDrag\n      cdkDragLockAxis=\"x\"\n      cdkDragBoundary=\".gantt\"\n      (cdkDragMoved)=\"onResizeMoved($event, column)\"\n      (cdkDragStarted)=\"onResizeStarted($event)\"\n      (cdkDragEnded)=\"onResizeEnded($event, column)\"\n    ></div>\n  </div>\n</div>\n\n<div\n  class=\"table-resize-handle\"\n  cdkDrag\n  cdkDragLockAxis=\"x\"\n  cdkDragBoundary=\".gantt\"\n  (cdkDragMoved)=\"onResizeMoved($event)\"\n  (cdkDragStarted)=\"onResizeStarted($event)\"\n  (cdkDragEnded)=\"onOverallResizeEnded($event)\"\n></div>\n\n<div #resizeLine class=\"table-resize-auxiliary-line\"></div>\n", dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttTableHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-table-header', standalone: true, imports: [NgFor, NgIf, NgTemplateOutlet, CdkDrag], template: "<div class=\"gantt-table-header-container\">\n  <div class=\"gantt-table-column\" *ngFor=\"let column of columns; let i = index\" [style.width]=\"column.columnWidth\">\n    <ng-container *ngIf=\"column.headerTemplateRef; else default\" [ngTemplateOutlet]=\"column.headerTemplateRef\"> </ng-container>\n    <ng-template #default>\n      {{ column.name }}\n    </ng-template>\n    <div\n      class=\"column-resize-handle\"\n      cdkDrag\n      cdkDragLockAxis=\"x\"\n      cdkDragBoundary=\".gantt\"\n      (cdkDragMoved)=\"onResizeMoved($event, column)\"\n      (cdkDragStarted)=\"onResizeStarted($event)\"\n      (cdkDragEnded)=\"onResizeEnded($event, column)\"\n    ></div>\n  </div>\n</div>\n\n<div\n  class=\"table-resize-handle\"\n  cdkDrag\n  cdkDragLockAxis=\"x\"\n  cdkDragBoundary=\".gantt\"\n  (cdkDragMoved)=\"onResizeMoved($event)\"\n  (cdkDragStarted)=\"onResizeStarted($event)\"\n  (cdkDragEnded)=\"onOverallResizeEnded($event)\"\n></div>\n\n<div #resizeLine class=\"table-resize-auxiliary-line\"></div>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [GANTT_ABSTRACT_TOKEN]
                }] }, { type: i0.ChangeDetectorRef }], propDecorators: { columns: [{
                type: Input
            }], resizeLineElementRef: [{
                type: ViewChild,
                args: ['resizeLine', { static: true }]
            }], className: [{
                type: HostBinding,
                args: ['class']
            }], height: [{
                type: HostBinding,
                args: ['style.height']
            }], lineHeight: [{
                type: HostBinding,
                args: ['style.line-height']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQtdGFibGUtaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2dhbnR0L3NyYy9jb21wb25lbnRzL3RhYmxlL2hlYWRlci9nYW50dC10YWJsZS1oZWFkZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvdGFibGUvaGVhZGVyL2dhbnR0LXRhYmxlLWhlYWRlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULFdBQVcsRUFFWCxLQUFLLEVBRUwsU0FBUyxFQUVULE1BQU0sRUFHVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQXlDLE9BQU8sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBMEIsb0JBQW9CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUN2RixPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUNoRSxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDdEMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztBQWFqQyxNQUFNLE9BQU8seUJBQXlCO0lBYWxDLElBQ0ksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUNqRCxDQUFDO0lBRUQsSUFDSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENB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NFdDakN0Qyw4L0JBNkJBLDRDREVjLEtBQUssbUhBQUUsSUFBSSw2RkFBRSxnQkFBZ0Isb0pBQUUsT0FBTzs7MkZBRXZDLHlCQUF5QjtrQkFOckMsU0FBUzsrQkFDSSxvQkFBb0IsY0FFbEIsSUFBSSxXQUNQLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLENBQUM7OzBCQTJCNUMsTUFBTTsyQkFBQyxvQkFBb0I7eUVBbEJ2QixPQUFPO3NCQUFmLEtBQUs7Z0JBRXFDLG9CQUFvQjtzQkFBOUQsU0FBUzt1QkFBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUVuQixTQUFTO3NCQUE5QixXQUFXO3VCQUFDLE9BQU87Z0JBR2hCLE1BQU07c0JBRFQsV0FBVzt1QkFBQyxjQUFjO2dCQU12QixVQUFVO3NCQURiLFdBQVc7dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgUXVlcnlMaXN0LFxuICAgIElucHV0LFxuICAgIE9uSW5pdCxcbiAgICBWaWV3Q2hpbGQsXG4gICAgRWxlbWVudFJlZixcbiAgICBJbmplY3QsXG4gICAgT25EZXN0cm95LFxuICAgIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4R2FudHRUYWJsZUNvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL3RhYmxlL2dhbnR0LWNvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ01vdmUsIENka0RyYWdTdGFydCwgQ2RrRHJhZyB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHsgY29lcmNlQ3NzUGl4ZWxWYWx1ZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBHYW50dEFic3RyYWN0Q29tcG9uZW50LCBHQU5UVF9BQlNUUkFDVF9UT0tFTiB9IGZyb20gJy4uLy4uLy4uL2dhbnR0LWFic3RyYWN0JztcbmltcG9ydCB7IHNldFN0eWxlV2l0aFZlbmRvclByZWZpeCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3NldC1zdHlsZS13aXRoLXZlbmRvci1wcmVmaXgnO1xuaW1wb3J0IHsgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ0ZvciwgTmdJZiwgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5leHBvcnQgY29uc3QgZGVmYXVsdENvbHVtbldpZHRoID0gMTAwO1xuZXhwb3J0IGNvbnN0IG1pbkNvbHVtbldpZHRoID0gODA7XG5pbnRlcmZhY2UgRHJhZ0ZpeGVkQ29uZmlnIHtcbiAgICB0YXJnZXQ6IEhUTUxFbGVtZW50O1xuICAgIG9yaWdpbldpZHRoOiBudW1iZXI7XG4gICAgbW92ZWRXaWR0aDogbnVtYmVyO1xuICAgIG1pbldpZHRoOiBudW1iZXI7XG59XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2dhbnR0LXRhYmxlLWhlYWRlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2dhbnR0LXRhYmxlLWhlYWRlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbTmdGb3IsIE5nSWYsIE5nVGVtcGxhdGVPdXRsZXQsIENka0RyYWddXG59KVxuZXhwb3J0IGNsYXNzIEdhbnR0VGFibGVIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgcHVibGljIGRyYWdTdGFydExlZnQ6IG51bWJlcjtcblxuICAgIHB1YmxpYyB0YWJsZVdpZHRoID0gMDtcblxuICAgIHByaXZhdGUgdW5zdWJzY3JpYmUkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAgIEBJbnB1dCgpIGNvbHVtbnM6IFF1ZXJ5TGlzdDxOZ3hHYW50dFRhYmxlQ29sdW1uQ29tcG9uZW50PjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Jlc2l6ZUxpbmUnLCB7IHN0YXRpYzogdHJ1ZSB9KSByZXNpemVMaW5lRWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgY2xhc3NOYW1lID0gYGdhbnR0LXRhYmxlLWhlYWRlciBgO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxuICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbnR0LnN0eWxlcy5oZWFkZXJIZWlnaHQgKyAncHgnO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnc3R5bGUubGluZS1oZWlnaHQnKVxuICAgIGdldCBsaW5lSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW50dC5zdHlsZXMuaGVhZGVySGVpZ2h0ICsgJ3B4JztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBASW5qZWN0KEdBTlRUX0FCU1RSQUNUX1RPS0VOKSBwcml2YXRlIGdhbnR0OiBHYW50dEFic3RyYWN0Q29tcG9uZW50LFxuICAgICAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgICApIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zQ2hhbmdlKCk7XG4gICAgICAgIHRoaXMuY29sdW1ucy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uc0NoYW5nZSgpO1xuICAgICAgICAgICAgdGhpcy5nYW50dC5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbHVtbnNDaGFuZ2UoKSB7XG4gICAgICAgIGxldCB0YWJsZVdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5jb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgaWYgKCFjb2x1bW4uY29sdW1uV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjb2x1bW4uY29sdW1uV2lkdGggPSBjb2VyY2VDc3NQaXhlbFZhbHVlKGRlZmF1bHRDb2x1bW5XaWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWJsZVdpZHRoICs9IE51bWJlcihjb2x1bW4uY29sdW1uV2lkdGgucmVwbGFjZSgncHgnLCAnJykpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZVdpZHRoID0gdGFibGVXaWR0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYWdGaXhlZChjb25maWc6IERyYWdGaXhlZENvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnLm1vdmVkV2lkdGggPCBjb25maWcubWluV2lkdGgpIHtcbiAgICAgICAgICAgIHNldFN0eWxlV2l0aFZlbmRvclByZWZpeCh7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogY29uZmlnLnRhcmdldCxcbiAgICAgICAgICAgICAgICBzdHlsZTogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGB0cmFuc2xhdGUzZCgke2NvbmZpZy5taW5XaWR0aCAtIGNvbmZpZy5vcmlnaW5XaWR0aH1weCwgMCwgMClgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUmVzaXplU3RhcnRlZChldmVudDogQ2RrRHJhZ1N0YXJ0KSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnNvdXJjZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0TGVmdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIH1cblxuICAgIG9uUmVzaXplTW92ZWQoZXZlbnQ6IENka0RyYWdNb3ZlLCBjb2x1bW4/OiBOZ3hHYW50dFRhYmxlQ29sdW1uQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnNvdXJjZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcblxuICAgICAgICBsZXQgb3JpZ2luV2lkdGg6IG51bWJlcjtcbiAgICAgICAgbGV0IG1vdmVkV2lkdGg6IG51bWJlcjtcbiAgICAgICAgbGV0IG1pbldpZHRoOiBudW1iZXI7XG4gICAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgICAgIG9yaWdpbldpZHRoID0gcGFyc2VJbnQoY29sdW1uLmNvbHVtbldpZHRoLCAxMCk7XG4gICAgICAgICAgICBtb3ZlZFdpZHRoID0gb3JpZ2luV2lkdGggKyAobGVmdCAtIHRoaXMuZHJhZ1N0YXJ0TGVmdCk7XG4gICAgICAgICAgICBtaW5XaWR0aCA9IG1pbkNvbHVtbldpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3JpZ2luV2lkdGggPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgICAgIG1vdmVkV2lkdGggPSBvcmlnaW5XaWR0aCArIChsZWZ0IC0gdGhpcy5kcmFnU3RhcnRMZWZ0KTtcbiAgICAgICAgICAgIG1pbldpZHRoID0gbWluQ29sdW1uV2lkdGggKiB0aGlzLmNvbHVtbnMubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnRml4ZWQoe1xuICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgb3JpZ2luV2lkdGgsXG4gICAgICAgICAgICBtb3ZlZFdpZHRoLFxuICAgICAgICAgICAgbWluV2lkdGhcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaG93QXV4aWxpYXJ5TGluZShldmVudCk7XG4gICAgfVxuXG4gICAgb25SZXNpemVFbmRlZChldmVudDogQ2RrRHJhZ0VuZCwgY29sdW1uOiBOZ3hHYW50dFRhYmxlQ29sdW1uQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZVdpZHRoID0gcGFyc2VJbnQoY29sdW1uLmNvbHVtbldpZHRoLCAxMCk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnNvdXJjZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBwYXJzZUludChjb2x1bW4uY29sdW1uV2lkdGgsIDEwKSArIChsZWZ0IC0gdGhpcy5kcmFnU3RhcnRMZWZ0KTtcbiAgICAgICAgY29uc3QgY29sdW1uV2lkdGggPSBNYXRoLm1heCh3aWR0aCB8fCAwLCBtaW5Db2x1bW5XaWR0aCk7XG4gICAgICAgIGNvbHVtbi5jb2x1bW5XaWR0aCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUoY29sdW1uV2lkdGgpO1xuICAgICAgICBpZiAodGhpcy5nYW50dC50YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5nYW50dC50YWJsZS5jb2x1bW5DaGFuZ2VzLmVtaXQoeyBjb2x1bW5zOiB0aGlzLmNvbHVtbnMgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlV2lkdGggPSB0aGlzLnRhYmxlV2lkdGggLSBiZWZvcmVXaWR0aCArIGNvbHVtbldpZHRoO1xuICAgICAgICB0aGlzLmhpZGVBdXhpbGlhcnlMaW5lKCk7XG4gICAgICAgIGV2ZW50LnNvdXJjZS5yZXNldCgpO1xuICAgIH1cblxuICAgIG9uT3ZlcmFsbFJlc2l6ZUVuZGVkKGV2ZW50OiBDZGtEcmFnRW5kKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnNvdXJjZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgY29uc3QgdGFibGVXaWR0aCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICBjb25zdCBkcmFnV2lkdGggPSBsZWZ0IC0gdGhpcy5kcmFnU3RhcnRMZWZ0O1xuICAgICAgICBsZXQgdGVtcFdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5jb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGFzdENvbHVtbldpZHRoID0gcGFyc2VJbnQoY29sdW1uLmNvbHVtbldpZHRoLCAxMCk7XG4gICAgICAgICAgICBjb25zdCBkaXN0cmlidXRlV2lkdGggPSBwYXJzZUludChTdHJpbmcoZHJhZ1dpZHRoICogKGxhc3RDb2x1bW5XaWR0aCAvIHRhYmxlV2lkdGgpKSwgMTApO1xuICAgICAgICAgICAgY29uc3QgY29sdW1uV2lkdGggPSBNYXRoLm1heChsYXN0Q29sdW1uV2lkdGggKyBkaXN0cmlidXRlV2lkdGggfHwgMCwgbWluQ29sdW1uV2lkdGgpO1xuICAgICAgICAgICAgY29sdW1uLmNvbHVtbldpZHRoID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZShjb2x1bW5XaWR0aCk7XG4gICAgICAgICAgICB0ZW1wV2lkdGggKz0gY29sdW1uV2lkdGg7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlV2lkdGggPSB0ZW1wV2lkdGg7XG4gICAgICAgIGlmICh0aGlzLmdhbnR0LnRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmdhbnR0LnRhYmxlLmNvbHVtbkNoYW5nZXMuZW1pdCh7IGNvbHVtbnM6IHRoaXMuY29sdW1ucyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGlkZUF1eGlsaWFyeUxpbmUoKTtcbiAgICAgICAgZXZlbnQuc291cmNlLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG93QXV4aWxpYXJ5TGluZShldmVudDogQ2RrRHJhZ01vdmUpIHtcbiAgICAgICAgY29uc3QgdGFibGVSZWN0ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHRhcmdldFJlY3QgPSBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHsgeDogdGFyZ2V0UmVjdC5sZWZ0IC0gdGFibGVSZWN0LmxlZnQsIHk6IHRhcmdldFJlY3QudG9wIC0gdGFibGVSZWN0LnRvcCB9O1xuICAgICAgICB0aGlzLnJlc2l6ZUxpbmVFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2Rpc3RhbmNlLnh9cHhgO1xuICAgICAgICB0aGlzLnJlc2l6ZUxpbmVFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWRlQXV4aWxpYXJ5TGluZSgpIHtcbiAgICAgICAgdGhpcy5yZXNpemVMaW5lRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUkLm5leHQoKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSQuY29tcGxldGUoKTtcbiAgICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwiZ2FudHQtdGFibGUtaGVhZGVyLWNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwiZ2FudHQtdGFibGUtY29sdW1uXCIgKm5nRm9yPVwibGV0IGNvbHVtbiBvZiBjb2x1bW5zOyBsZXQgaSA9IGluZGV4XCIgW3N0eWxlLndpZHRoXT1cImNvbHVtbi5jb2x1bW5XaWR0aFwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uaGVhZGVyVGVtcGxhdGVSZWY7IGVsc2UgZGVmYXVsdFwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbHVtbi5oZWFkZXJUZW1wbGF0ZVJlZlwiPiA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHQ+XG4gICAgICB7eyBjb2x1bW4ubmFtZSB9fVxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJjb2x1bW4tcmVzaXplLWhhbmRsZVwiXG4gICAgICBjZGtEcmFnXG4gICAgICBjZGtEcmFnTG9ja0F4aXM9XCJ4XCJcbiAgICAgIGNka0RyYWdCb3VuZGFyeT1cIi5nYW50dFwiXG4gICAgICAoY2RrRHJhZ01vdmVkKT1cIm9uUmVzaXplTW92ZWQoJGV2ZW50LCBjb2x1bW4pXCJcbiAgICAgIChjZGtEcmFnU3RhcnRlZCk9XCJvblJlc2l6ZVN0YXJ0ZWQoJGV2ZW50KVwiXG4gICAgICAoY2RrRHJhZ0VuZGVkKT1cIm9uUmVzaXplRW5kZWQoJGV2ZW50LCBjb2x1bW4pXCJcbiAgICA+PC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXZcbiAgY2xhc3M9XCJ0YWJsZS1yZXNpemUtaGFuZGxlXCJcbiAgY2RrRHJhZ1xuICBjZGtEcmFnTG9ja0F4aXM9XCJ4XCJcbiAgY2RrRHJhZ0JvdW5kYXJ5PVwiLmdhbnR0XCJcbiAgKGNka0RyYWdNb3ZlZCk9XCJvblJlc2l6ZU1vdmVkKCRldmVudClcIlxuICAoY2RrRHJhZ1N0YXJ0ZWQpPVwib25SZXNpemVTdGFydGVkKCRldmVudClcIlxuICAoY2RrRHJhZ0VuZGVkKT1cIm9uT3ZlcmFsbFJlc2l6ZUVuZGVkKCRldmVudClcIlxuPjwvZGl2PlxuXG48ZGl2ICNyZXNpemVMaW5lIGNsYXNzPVwidGFibGUtcmVzaXplLWF1eGlsaWFyeS1saW5lXCI+PC9kaXY+XG4iXX0=