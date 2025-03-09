import { Component, Inject } from '@angular/core';
import { GANTT_UPPER_TOKEN } from '../../gantt-upper';
import * as i0 from "@angular/core";
import * as i1 from "../../gantt-upper";
export class GanttDragBackdropComponent {
    constructor(ganttUpper) {
        this.ganttUpper = ganttUpper;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragBackdropComponent, deps: [{ token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttDragBackdropComponent, isStandalone: true, selector: "gantt-drag-backdrop", host: { classAttribute: "gantt-drag-backdrop" }, ngImport: i0, template: "<div class=\"gantt-drag-mask\" [style.top.px]=\"ganttUpper.styles.headerHeight\">\n  <div class=\"date-range\">\n    <span class=\"start\"></span>\n    <span class=\"end\"></span>\n  </div>\n</div>\n" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragBackdropComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-drag-backdrop', host: {
                        class: 'gantt-drag-backdrop'
                    }, standalone: true, template: "<div class=\"gantt-drag-mask\" [style.top.px]=\"ganttUpper.styles.headerHeight\">\n  <div class=\"date-range\">\n    <span class=\"start\"></span>\n    <span class=\"end\"></span>\n  </div>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1iYWNrZHJvcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvY29tcG9uZW50cy9kcmFnLWJhY2tkcm9wL2RyYWctYmFja2Ryb3AuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvZHJhZy1iYWNrZHJvcC9kcmFnLWJhY2tkcm9wLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLG1CQUFtQixDQUFDOzs7QUFTbEUsTUFBTSxPQUFPLDBCQUEwQjtJQUNuQyxZQUE4QyxVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQUcsQ0FBQzs4R0FEL0QsMEJBQTBCLGtCQUNmLGlCQUFpQjtrR0FENUIsMEJBQTBCLGdJQ1Z2Qyx5TUFNQTs7MkZESWEsMEJBQTBCO2tCQVJ0QyxTQUFTOytCQUNJLHFCQUFxQixRQUV6Qjt3QkFDRixLQUFLLEVBQUUscUJBQXFCO3FCQUMvQixjQUNXLElBQUk7OzBCQUdILE1BQU07MkJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdBTlRUX1VQUEVSX1RPS0VOLCBHYW50dFVwcGVyIH0gZnJvbSAnLi4vLi4vZ2FudHQtdXBwZXInO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdnYW50dC1kcmFnLWJhY2tkcm9wJyxcbiAgICB0ZW1wbGF0ZVVybDogYC4vZHJhZy1iYWNrZHJvcC5jb21wb25lbnQuaHRtbGAsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ2dhbnR0LWRyYWctYmFja2Ryb3AnXG4gICAgfSxcbiAgICBzdGFuZGFsb25lOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIEdhbnR0RHJhZ0JhY2tkcm9wQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEdBTlRUX1VQUEVSX1RPS0VOKSBwdWJsaWMgZ2FudHRVcHBlcjogR2FudHRVcHBlcikge31cbn1cbiIsIjxkaXYgY2xhc3M9XCJnYW50dC1kcmFnLW1hc2tcIiBbc3R5bGUudG9wLnB4XT1cImdhbnR0VXBwZXIuc3R5bGVzLmhlYWRlckhlaWdodFwiPlxuICA8ZGl2IGNsYXNzPVwiZGF0ZS1yYW5nZVwiPlxuICAgIDxzcGFuIGNsYXNzPVwic3RhcnRcIj48L3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJlbmRcIj48L3NwYW4+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=