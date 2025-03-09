import { Component, Input, HostBinding } from '@angular/core';
import { icons } from './icons';
import * as i0 from "@angular/core";
export class GanttIconComponent {
    set iconName(name) {
        this.setSvg(name);
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.isIcon = true;
    }
    setSvg(name) {
        const iconSvg = icons[name];
        if (iconSvg) {
            this.elementRef.nativeElement.innerHTML = iconSvg;
        }
        else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttIconComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttIconComponent, isStandalone: true, selector: "gantt-icon", inputs: { iconName: "iconName" }, host: { properties: { "class.gantt-icon": "this.isIcon" } }, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttIconComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'gantt-icon',
                    template: '',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { isIcon: [{
                type: HostBinding,
                args: ['class.gantt-icon']
            }], iconName: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvY29tcG9uZW50cy9pY29uL2ljb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFjLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDOztBQU9oQyxNQUFNLE9BQU8sa0JBQWtCO0lBRzNCLElBQWEsUUFBUSxDQUFDLElBQVk7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsWUFBb0IsVUFBbUM7UUFBbkMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFOdEIsV0FBTSxHQUFHLElBQUksQ0FBQztJQU1XLENBQUM7SUFFM0QsTUFBTSxDQUFDLElBQVk7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNWLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDdEQsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2pELENBQUM7SUFDTCxDQUFDOzhHQWhCUSxrQkFBa0I7a0dBQWxCLGtCQUFrQixxS0FIakIsRUFBRTs7MkZBR0gsa0JBQWtCO2tCQUw5QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsRUFBRTtvQkFDWixVQUFVLEVBQUUsSUFBSTtpQkFDbkI7K0VBRW9DLE1BQU07c0JBQXRDLFdBQVc7dUJBQUMsa0JBQWtCO2dCQUVsQixRQUFRO3NCQUFwQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGljb25zIH0gZnJvbSAnLi9pY29ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZ2FudHQtaWNvbicsXG4gICAgdGVtcGxhdGU6ICcnLFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgR2FudHRJY29uQ29tcG9uZW50IHtcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmdhbnR0LWljb24nKSBpc0ljb24gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2V0IGljb25OYW1lKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNldFN2ZyhuYW1lKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuXG4gICAgc2V0U3ZnKG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBpY29uU3ZnID0gaWNvbnNbbmFtZV07XG4gICAgICAgIGlmIChpY29uU3ZnKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSBpY29uU3ZnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=