import { Component, HostBinding, Inject, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../../gantt-upper";
export class NgxGanttBaselineComponent {
    constructor(elementRef, ganttUpper) {
        this.elementRef = elementRef;
        this.ganttUpper = ganttUpper;
        this.unsubscribe$ = new Subject();
        this.ganttBaselineClass = true;
    }
    ngOnInit() {
        this.baselineItem.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.baselineItem.refs.x + 'px';
        itemElement.style.bottom = '2px';
        itemElement.style.width = this.baselineItem.refs.width + 'px';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttBaselineComponent, deps: [{ token: i0.ElementRef }, { token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttBaselineComponent, isStandalone: true, selector: "ngx-gantt-baseline,gantt-baseline", inputs: { baselineItem: "baselineItem", template: "template" }, host: { properties: { "class.gantt-baseline": "this.ganttBaselineClass" } }, ngImport: i0, template: "<div #content *ngIf=\"baselineItem\" class=\"baseline-content\">\n  <ng-template\n    [ngTemplateOutlet]=\"template\"\n    [ngTemplateOutletContext]=\"{ item: baselineItem.origin, refs: baselineItem.refs }\"\n  ></ng-template>\n</div>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttBaselineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-baseline,gantt-baseline', standalone: true, imports: [NgIf, NgTemplateOutlet], template: "<div #content *ngIf=\"baselineItem\" class=\"baseline-content\">\n  <ng-template\n    [ngTemplateOutlet]=\"template\"\n    [ngTemplateOutletContext]=\"{ item: baselineItem.origin, refs: baselineItem.refs }\"\n  ></ng-template>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { baselineItem: [{
                type: Input
            }], template: [{
                type: Input
            }], ganttBaselineClass: [{
                type: HostBinding,
                args: ['class.gantt-baseline']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZWxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvYmFzZWxpbmUvYmFzZWxpbmUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvYmFzZWxpbmUvYmFzZWxpbmUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBa0MsTUFBTSxlQUFlLENBQUM7QUFDbEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFjLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFRekQsTUFBTSxPQUFPLHlCQUF5QjtJQVNsQyxZQUFvQixVQUFtQyxFQUFvQyxVQUFzQjtRQUE3RixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUFvQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBSjFHLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUVMLHVCQUFrQixHQUFHLElBQUksQ0FBQztJQUVxRCxDQUFDO0lBRXJILFFBQVE7UUFDSixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDdEUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLFlBQVk7UUFDaEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDbEQsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN6RCxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDakMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNsRSxDQUFDOzhHQXRCUSx5QkFBeUIsNENBUytCLGlCQUFpQjtrR0FUekUseUJBQXlCLDBPQ2J0Qyw4T0FNQSw0Q0RLYyxJQUFJLDZGQUFFLGdCQUFnQjs7MkZBRXZCLHlCQUF5QjtrQkFOckMsU0FBUzsrQkFDSSxtQ0FBbUMsY0FFakMsSUFBSSxXQUNQLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDOzswQkFXeUIsTUFBTTsyQkFBQyxpQkFBaUI7eUNBUnpFLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFJK0Isa0JBQWtCO3NCQUF0RCxXQUFXO3VCQUFDLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgR2FudHRCYXNlbGluZUl0ZW1JbnRlcm5hbCB9IGZyb20gJy4uLy4uL2NsYXNzL2Jhc2VsaW5lJztcbmltcG9ydCB7IEdhbnR0VXBwZXIsIEdBTlRUX1VQUEVSX1RPS0VOIH0gZnJvbSAnLi4vLi4vZ2FudHQtdXBwZXInO1xuaW1wb3J0IHsgTmdJZiwgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWdhbnR0LWJhc2VsaW5lLGdhbnR0LWJhc2VsaW5lJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vYmFzZWxpbmUuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0YW5kYWxvbmU6IHRydWUsXG4gICAgaW1wb3J0czogW05nSWYsIE5nVGVtcGxhdGVPdXRsZXRdXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbnR0QmFzZWxpbmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIGJhc2VsaW5lSXRlbTogR2FudHRCYXNlbGluZUl0ZW1JbnRlcm5hbDtcblxuICAgIEBJbnB1dCgpIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIHVuc3Vic2NyaWJlJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmdhbnR0LWJhc2VsaW5lJykgZ2FudHRCYXNlbGluZUNsYXNzID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIEBJbmplY3QoR0FOVFRfVVBQRVJfVE9LRU4pIHB1YmxpYyBnYW50dFVwcGVyOiBHYW50dFVwcGVyKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuYmFzZWxpbmVJdGVtLnJlZnMkLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb25zKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UG9zaXRpb25zKCkge1xuICAgICAgICBjb25zdCBpdGVtRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpdGVtRWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5iYXNlbGluZUl0ZW0ucmVmcy54ICsgJ3B4JztcbiAgICAgICAgaXRlbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gJzJweCc7XG4gICAgICAgIGl0ZW1FbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5iYXNlbGluZUl0ZW0ucmVmcy53aWR0aCArICdweCc7XG4gICAgfVxufVxuIiwiPGRpdiAjY29udGVudCAqbmdJZj1cImJhc2VsaW5lSXRlbVwiIGNsYXNzPVwiYmFzZWxpbmUtY29udGVudFwiPlxuICA8bmctdGVtcGxhdGVcbiAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVwiXG4gICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgaXRlbTogYmFzZWxpbmVJdGVtLm9yaWdpbiwgcmVmczogYmFzZWxpbmVJdGVtLnJlZnMgfVwiXG4gID48L25nLXRlbXBsYXRlPlxuPC9kaXY+XG4iXX0=