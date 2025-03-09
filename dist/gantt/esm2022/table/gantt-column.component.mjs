import { Component, ContentChild, Input, Inject } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GANTT_UPPER_TOKEN } from '../gantt-upper';
import * as i0 from "@angular/core";
import * as i1 from "../gantt-upper";
export class NgxGanttTableColumnComponent {
    set width(width) {
        this.columnWidth = coerceCssPixelValue(width);
    }
    constructor(ganttUpper, elementRef) {
        this.ganttUpper = ganttUpper;
        this.elementRef = elementRef;
    }
    get classList() {
        return this.elementRef.nativeElement.classList;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableColumnComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttTableColumnComponent, isStandalone: true, selector: "ngx-gantt-column", inputs: { width: "width", name: "name", showExpandIcon: "showExpandIcon" }, host: { classAttribute: "gantt-table-column" }, queries: [{ propertyName: "templateRef", first: true, predicate: ["cell"], descendants: true, static: true }, { propertyName: "headerTemplateRef", first: true, predicate: ["header"], descendants: true, static: true }], ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableColumnComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-gantt-column',
                    template: '',
                    host: {
                        class: 'gantt-table-column'
                    },
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i1.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.ElementRef }], propDecorators: { width: [{
                type: Input
            }], name: [{
                type: Input
            }], showExpandIcon: [{
                type: Input
            }], templateRef: [{
                type: ContentChild,
                args: ['cell', { static: true }]
            }], headerTemplateRef: [{
                type: ContentChild,
                args: ['header', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQtY29sdW1uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BhY2thZ2VzL2dhbnR0L3NyYy90YWJsZS9nYW50dC1jb2x1bW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFlLEtBQUssRUFBRSxNQUFNLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFDaEcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFjLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQVMvRCxNQUFNLE9BQU8sNEJBQTRCO0lBR3JDLElBQ0ksS0FBSyxDQUFDLEtBQXNCO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQVVELFlBQThDLFVBQXNCLEVBQVUsVUFBc0I7UUFBdEQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBRXhHLElBQUksU0FBUztRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQ25ELENBQUM7OEdBcEJRLDRCQUE0QixrQkFnQmpCLGlCQUFpQjtrR0FoQjVCLDRCQUE0QixtYUFOM0IsRUFBRTs7MkZBTUgsNEJBQTRCO2tCQVJ4QyxTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRTt3QkFDRixLQUFLLEVBQUUsb0JBQW9CO3FCQUM5QjtvQkFDRCxVQUFVLEVBQUUsSUFBSTtpQkFDbkI7OzBCQWlCZ0IsTUFBTTsyQkFBQyxpQkFBaUI7a0VBWmpDLEtBQUs7c0JBRFIsS0FBSztnQkFLRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsY0FBYztzQkFBdEIsS0FBSztnQkFFa0MsV0FBVztzQkFBbEQsWUFBWTt1QkFBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUVJLGlCQUFpQjtzQkFBMUQsWUFBWTt1QkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIFRlbXBsYXRlUmVmLCBJbnB1dCwgSW5qZWN0LCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb2VyY2VDc3NQaXhlbFZhbHVlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IEdhbnR0VXBwZXIsIEdBTlRUX1VQUEVSX1RPS0VOIH0gZnJvbSAnLi4vZ2FudHQtdXBwZXInO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZ2FudHQtY29sdW1uJyxcbiAgICB0ZW1wbGF0ZTogJycsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ2dhbnR0LXRhYmxlLWNvbHVtbidcbiAgICB9LFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FudHRUYWJsZUNvbHVtbkNvbXBvbmVudCB7XG4gICAgcHVibGljIGNvbHVtbldpZHRoOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCB3aWR0aCh3aWR0aDogbnVtYmVyIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29sdW1uV2lkdGggPSBjb2VyY2VDc3NQaXhlbFZhbHVlKHdpZHRoKTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzaG93RXhwYW5kSWNvbjogYm9vbGVhbjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ2NlbGwnLCB7IHN0YXRpYzogdHJ1ZSB9KSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoJ2hlYWRlcicsIHsgc3RhdGljOiB0cnVlIH0pIGhlYWRlclRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChHQU5UVF9VUFBFUl9UT0tFTikgcHVibGljIGdhbnR0VXBwZXI6IEdhbnR0VXBwZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICAgIGdldCBjbGFzc0xpc3QoKTogRE9NVG9rZW5MaXN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICB9XG59XG4iXX0=