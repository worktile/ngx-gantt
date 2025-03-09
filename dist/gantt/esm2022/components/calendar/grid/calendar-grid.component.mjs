import { Component, HostBinding, Inject } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { isNumber } from '../../../utils/helpers';
import { GANTT_UPPER_TOKEN } from '../../../gantt-upper';
import { GanttViewType } from './../../../class/view-type';
import { todayBorderRadius } from '../../../gantt.styles';
import * as i0 from "@angular/core";
import * as i1 from "../../../gantt-upper";
const mainHeight = 5000;
export class GanttCalendarGridComponent {
    get view() {
        return this.ganttUpper.view;
    }
    constructor(ganttUpper, ngZone, elementRef) {
        this.ganttUpper = ganttUpper;
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.unsubscribe$ = new Subject();
        this.mainHeight = mainHeight;
        this.todayBorderRadius = todayBorderRadius;
        this.viewTypes = GanttViewType;
        this.className = `gantt-calendar gantt-calendar-grid`;
    }
    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const todayEle = this.elementRef.nativeElement.getElementsByClassName('gantt-calendar-today-overlay')[0];
        const line = this.elementRef.nativeElement.getElementsByClassName('today-line')[0];
        if (isNumber(x)) {
            if (line) {
                line.style.left = `${x}px`;
                line.style.top = `0px`;
                line.style.bottom = `${-mainHeight}px`;
            }
        }
        else {
            todayEle.style.display = 'none';
        }
    }
    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            merge(this.ganttUpper.viewChange, this.ganttUpper.view.start$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                this.setTodayPoint();
            });
        });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttCalendarGridComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.0", type: GanttCalendarGridComponent, isStandalone: true, selector: "gantt-calendar-grid", host: { properties: { "class": "this.className" } }, ngImport: i0, template: "<div class=\"gantt-calendar-today-overlay\" [style.width.px]=\"view.width\">\n  @if (ganttUpper.showTodayLine) {\n  <span class=\"today-line\"> </span>\n  }\n</div>\n\n<svg class=\"gantt-calendar-grid-main\" [attr.width]=\"view.width\" [attr.height]=\"ganttUpper.styles.headerHeight - 1\">\n  <g>\n    @if (view.showTimeline) {\n    <g>\n      @for (point of view.secondaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.cellWidth\"\n        [attr.x2]=\"($index + 1) * view.cellWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"secondary-line\"\n      ></line>\n      }\n    </g>\n    }\n    <g>\n      @for (point of view.primaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.primaryWidth\"\n        [attr.x2]=\"($index + 1) * view.primaryWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"primary-line\"\n      ></line>\n      }\n    </g>\n  </g>\n</svg>\n" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttCalendarGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-calendar-grid', standalone: true, template: "<div class=\"gantt-calendar-today-overlay\" [style.width.px]=\"view.width\">\n  @if (ganttUpper.showTodayLine) {\n  <span class=\"today-line\"> </span>\n  }\n</div>\n\n<svg class=\"gantt-calendar-grid-main\" [attr.width]=\"view.width\" [attr.height]=\"ganttUpper.styles.headerHeight - 1\">\n  <g>\n    @if (view.showTimeline) {\n    <g>\n      @for (point of view.secondaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.cellWidth\"\n        [attr.x2]=\"($index + 1) * view.cellWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"secondary-line\"\n      ></line>\n      }\n    </g>\n    }\n    <g>\n      @for (point of view.primaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.primaryWidth\"\n        [attr.x2]=\"($index + 1) * view.primaryWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"primary-line\"\n      ></line>\n      }\n    </g>\n  </g>\n</svg>\n" }]
        }], ctorParameters: () => [{ type: i1.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.NgZone }, { type: i0.ElementRef }], propDecorators: { className: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvY29tcG9uZW50cy9jYWxlbmRhci9ncmlkL2NhbGVuZGFyLWdyaWQuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvY2FsZW5kYXIvZ3JpZC9jYWxlbmRhci1ncmlkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsV0FBVyxFQUErQyxNQUFNLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFDaEksT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sc0JBQXNCLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7QUFFMUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBT3hCLE1BQU0sT0FBTywwQkFBMEI7SUFDbkMsSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBV0QsWUFDc0MsVUFBc0IsRUFDaEQsTUFBYyxFQUNkLFVBQW1DO1FBRlQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNoRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFidkMsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRTNDLGVBQVUsR0FBRyxVQUFVLENBQUM7UUFFeEIsc0JBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFFdEMsY0FBUyxHQUFHLGFBQWEsQ0FBQztRQUVKLGNBQVMsR0FBRyxvQ0FBb0MsQ0FBQztJQU1wRSxDQUFDO0lBRUosYUFBYTtRQUNULE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQWdCLENBQUM7UUFDeEgsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFnQixDQUFDO1FBRWxHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDZCxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDO1lBQzNDLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNwQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM5QyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDbEMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7OEdBakRRLDBCQUEwQixrQkFldkIsaUJBQWlCO2tHQWZwQiwwQkFBMEIsb0lDakJ2QyxzK0JBa0NBOzsyRkRqQmEsMEJBQTBCO2tCQUx0QyxTQUFTOytCQUNJLHFCQUFxQixjQUVuQixJQUFJOzswQkFpQlgsTUFBTTsyQkFBQyxpQkFBaUI7dUZBSFAsU0FBUztzQkFBOUIsV0FBVzt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEhvc3RCaW5kaW5nLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE9uRGVzdHJveSwgTmdab25lLCBJbmplY3QsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIG1lcmdlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IGlzTnVtYmVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvaGVscGVycyc7XG5cbmltcG9ydCB7IEdBTlRUX1VQUEVSX1RPS0VOLCBHYW50dFVwcGVyIH0gZnJvbSAnLi4vLi4vLi4vZ2FudHQtdXBwZXInO1xuaW1wb3J0IHsgR2FudHRWaWV3VHlwZSB9IGZyb20gJy4vLi4vLi4vLi4vY2xhc3Mvdmlldy10eXBlJztcbmltcG9ydCB7IHRvZGF5Qm9yZGVyUmFkaXVzIH0gZnJvbSAnLi4vLi4vLi4vZ2FudHQuc3R5bGVzJztcblxuY29uc3QgbWFpbkhlaWdodCA9IDUwMDA7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZ2FudHQtY2FsZW5kYXItZ3JpZCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NhbGVuZGFyLWdyaWQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgR2FudHRDYWxlbmRhckdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgZ2V0IHZpZXcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbnR0VXBwZXIudmlldztcbiAgICB9XG4gICAgcHJpdmF0ZSB1bnN1YnNjcmliZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgbWFpbkhlaWdodCA9IG1haW5IZWlnaHQ7XG5cbiAgICB0b2RheUJvcmRlclJhZGl1cyA9IHRvZGF5Qm9yZGVyUmFkaXVzO1xuXG4gICAgdmlld1R5cGVzID0gR2FudHRWaWV3VHlwZTtcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MnKSBjbGFzc05hbWUgPSBgZ2FudHQtY2FsZW5kYXIgZ2FudHQtY2FsZW5kYXItZ3JpZGA7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChHQU5UVF9VUFBFUl9UT0tFTikgcHVibGljIGdhbnR0VXBwZXI6IEdhbnR0VXBwZXIsXG4gICAgICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD5cbiAgICApIHt9XG5cbiAgICBzZXRUb2RheVBvaW50KCkge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy52aWV3LmdldFRvZGF5WFBvaW50KCk7XG4gICAgICAgIGNvbnN0IHRvZGF5RWxlID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ2FudHQtY2FsZW5kYXItdG9kYXktb3ZlcmxheScpWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBjb25zdCBsaW5lID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9kYXktbGluZScpWzBdIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIGlmIChpc051bWJlcih4KSkge1xuICAgICAgICAgICAgaWYgKGxpbmUpIHtcbiAgICAgICAgICAgICAgICBsaW5lLnN0eWxlLmxlZnQgPSBgJHt4fXB4YDtcbiAgICAgICAgICAgICAgICBsaW5lLnN0eWxlLnRvcCA9IGAwcHhgO1xuICAgICAgICAgICAgICAgIGxpbmUuc3R5bGUuYm90dG9tID0gYCR7LW1haW5IZWlnaHR9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9kYXlFbGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm5nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBtZXJnZSh0aGlzLmdhbnR0VXBwZXIudmlld0NoYW5nZSwgdGhpcy5nYW50dFVwcGVyLnZpZXcuc3RhcnQkKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLnVuc3Vic2NyaWJlJCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9kYXlQb2ludCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSQubmV4dCgpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlJC5jb21wbGV0ZSgpO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJnYW50dC1jYWxlbmRhci10b2RheS1vdmVybGF5XCIgW3N0eWxlLndpZHRoLnB4XT1cInZpZXcud2lkdGhcIj5cbiAgQGlmIChnYW50dFVwcGVyLnNob3dUb2RheUxpbmUpIHtcbiAgPHNwYW4gY2xhc3M9XCJ0b2RheS1saW5lXCI+IDwvc3Bhbj5cbiAgfVxuPC9kaXY+XG5cbjxzdmcgY2xhc3M9XCJnYW50dC1jYWxlbmRhci1ncmlkLW1haW5cIiBbYXR0ci53aWR0aF09XCJ2aWV3LndpZHRoXCIgW2F0dHIuaGVpZ2h0XT1cImdhbnR0VXBwZXIuc3R5bGVzLmhlYWRlckhlaWdodCAtIDFcIj5cbiAgPGc+XG4gICAgQGlmICh2aWV3LnNob3dUaW1lbGluZSkge1xuICAgIDxnPlxuICAgICAgQGZvciAocG9pbnQgb2Ygdmlldy5zZWNvbmRhcnlEYXRlUG9pbnRzOyB0cmFjayBwb2ludC54KSB7XG4gICAgICA8bGluZVxuICAgICAgICBbYXR0ci54MV09XCIoJGluZGV4ICsgMSkgKiB2aWV3LmNlbGxXaWR0aFwiXG4gICAgICAgIFthdHRyLngyXT1cIigkaW5kZXggKyAxKSAqIHZpZXcuY2VsbFdpZHRoXCJcbiAgICAgICAgW2F0dHIueTFdPVwiMFwiXG4gICAgICAgIFthdHRyLnkyXT1cIm1haW5IZWlnaHRcIlxuICAgICAgICBjbGFzcz1cInNlY29uZGFyeS1saW5lXCJcbiAgICAgID48L2xpbmU+XG4gICAgICB9XG4gICAgPC9nPlxuICAgIH1cbiAgICA8Zz5cbiAgICAgIEBmb3IgKHBvaW50IG9mIHZpZXcucHJpbWFyeURhdGVQb2ludHM7IHRyYWNrIHBvaW50LngpIHtcbiAgICAgIDxsaW5lXG4gICAgICAgIFthdHRyLngxXT1cIigkaW5kZXggKyAxKSAqIHZpZXcucHJpbWFyeVdpZHRoXCJcbiAgICAgICAgW2F0dHIueDJdPVwiKCRpbmRleCArIDEpICogdmlldy5wcmltYXJ5V2lkdGhcIlxuICAgICAgICBbYXR0ci55MV09XCIwXCJcbiAgICAgICAgW2F0dHIueTJdPVwibWFpbkhlaWdodFwiXG4gICAgICAgIGNsYXNzPVwicHJpbWFyeS1saW5lXCJcbiAgICAgID48L2xpbmU+XG4gICAgICB9XG4gICAgPC9nPlxuICA8L2c+XG48L3N2Zz5cbiJdfQ==