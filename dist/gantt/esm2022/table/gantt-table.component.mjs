import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxGanttTableComponent {
    constructor() {
        this.draggable = false;
        this.dragDropped = new EventEmitter();
        this.dragStarted = new EventEmitter();
        this.dragEnded = new EventEmitter();
        this.columnChanges = new EventEmitter();
        this.itemClick = new EventEmitter();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttTableComponent, isStandalone: true, selector: "ngx-gantt-table", inputs: { draggable: "draggable", dropEnterPredicate: "dropEnterPredicate" }, outputs: { dragDropped: "dragDropped", dragStarted: "dragStarted", dragEnded: "dragEnded", columnChanges: "columnChanges", itemClick: "itemClick" }, queries: [{ propertyName: "rowBeforeTemplate", first: true, predicate: ["rowBeforeSlot"], descendants: true, static: true }, { propertyName: "rowAfterTemplate", first: true, predicate: ["rowAfterSlot"], descendants: true, static: true }, { propertyName: "tableEmptyTemplate", first: true, predicate: ["tableEmpty"], descendants: true, static: true }, { propertyName: "tableFooterTemplate", first: true, predicate: ["tableFooter"], descendants: true, static: true }], ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-gantt-table',
                    template: '',
                    standalone: true
                }]
        }], propDecorators: { draggable: [{
                type: Input
            }], dropEnterPredicate: [{
                type: Input
            }], dragDropped: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }], columnChanges: [{
                type: Output
            }], itemClick: [{
                type: Output
            }], rowBeforeTemplate: [{
                type: ContentChild,
                args: ['rowBeforeSlot', { static: true }]
            }], rowAfterTemplate: [{
                type: ContentChild,
                args: ['rowAfterSlot', { static: true }]
            }], tableEmptyTemplate: [{
                type: ContentChild,
                args: ['tableEmpty', { static: true }]
            }], tableFooterTemplate: [{
                type: ContentChild,
                args: ['tableFooter', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQtdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL3RhYmxlL2dhbnR0LXRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQVMsS0FBSyxFQUFFLE1BQU0sRUFBZSxNQUFNLGVBQWUsQ0FBQzs7QUFlekcsTUFBTSxPQUFPLHNCQUFzQjtJQUxuQztRQU1hLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFJakIsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBOEIsQ0FBQztRQUU3RCxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUE4QixDQUFDO1FBRTdELGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBNEIsQ0FBQztRQUV6RCxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRXBELGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBNEIsQ0FBQztLQVN0RTs4R0F0Qlksc0JBQXNCO2tHQUF0QixzQkFBc0IsaXdCQUhyQixFQUFFOzsyRkFHSCxzQkFBc0I7a0JBTGxDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsUUFBUSxFQUFFLEVBQUU7b0JBQ1osVUFBVSxFQUFFLElBQUk7aUJBQ25COzhCQUVZLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsa0JBQWtCO3NCQUExQixLQUFLO2dCQUVJLFdBQVc7c0JBQXBCLE1BQU07Z0JBRUcsV0FBVztzQkFBcEIsTUFBTTtnQkFFRyxTQUFTO3NCQUFsQixNQUFNO2dCQUVHLGFBQWE7c0JBQXRCLE1BQU07Z0JBRUcsU0FBUztzQkFBbEIsTUFBTTtnQkFFMEMsaUJBQWlCO3NCQUFqRSxZQUFZO3VCQUFDLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBRUMsZ0JBQWdCO3NCQUEvRCxZQUFZO3VCQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBRUEsa0JBQWtCO3NCQUEvRCxZQUFZO3VCQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBRUcsbUJBQW1CO3NCQUFqRSxZQUFZO3VCQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgRXZlbnRFbWl0dGVyLCBpbnB1dCwgSW5wdXQsIE91dHB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgR2FudHRUYWJsZURyYWdFbnRlclByZWRpY2F0ZUNvbnRleHQsXG4gICAgR2FudHRUYWJsZURyYWdEcm9wcGVkRXZlbnQsXG4gICAgR2FudHRUYWJsZUV2ZW50LFxuICAgIEdhbnR0VGFibGVEcmFnU3RhcnRlZEV2ZW50LFxuICAgIEdhbnR0VGFibGVEcmFnRW5kZWRFdmVudCxcbiAgICBHYW50dFRhYmxlSXRlbUNsaWNrRXZlbnRcbn0gZnJvbSAnLi4vY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1nYW50dC10YWJsZScsXG4gICAgdGVtcGxhdGU6ICcnLFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FudHRUYWJsZUNvbXBvbmVudCB7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBkcm9wRW50ZXJQcmVkaWNhdGU/OiAoY29udGV4dDogR2FudHRUYWJsZURyYWdFbnRlclByZWRpY2F0ZUNvbnRleHQpID0+IGJvb2xlYW47XG5cbiAgICBAT3V0cHV0KCkgZHJhZ0Ryb3BwZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0VGFibGVEcmFnRHJvcHBlZEV2ZW50PigpO1xuXG4gICAgQE91dHB1dCgpIGRyYWdTdGFydGVkID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dFRhYmxlRHJhZ1N0YXJ0ZWRFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKSBkcmFnRW5kZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdhbnR0VGFibGVEcmFnRW5kZWRFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKSBjb2x1bW5DaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dFRhYmxlRXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KCkgaXRlbUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dFRhYmxlSXRlbUNsaWNrRXZlbnQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkKCdyb3dCZWZvcmVTbG90JywgeyBzdGF0aWM6IHRydWUgfSkgcm93QmVmb3JlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAQ29udGVudENoaWxkKCdyb3dBZnRlclNsb3QnLCB7IHN0YXRpYzogdHJ1ZSB9KSByb3dBZnRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQENvbnRlbnRDaGlsZCgndGFibGVFbXB0eScsIHsgc3RhdGljOiB0cnVlIH0pIHRhYmxlRW1wdHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ3RhYmxlRm9vdGVyJywgeyBzdGF0aWM6IHRydWUgfSkgdGFibGVGb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pjtcbn1cbiJdfQ==