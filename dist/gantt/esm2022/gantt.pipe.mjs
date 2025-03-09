import { Pipe } from '@angular/core';
import { GanttItemType } from './class';
import { GanttDate } from './utils/date';
import * as i0 from "@angular/core";
export class IsGanttRangeItemPipe {
    transform(value) {
        return value === GanttItemType.range;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttRangeItemPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: IsGanttRangeItemPipe, isStandalone: true, name: "isGanttRangeItem" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttRangeItemPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isGanttRangeItem',
                    standalone: true
                }]
        }] });
export class IsGanttBarItemPipe {
    transform(value) {
        return value === GanttItemType.bar;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttBarItemPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: IsGanttBarItemPipe, isStandalone: true, name: "isGanttBarItem" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttBarItemPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isGanttBarItem',
                    standalone: true
                }]
        }] });
export class IsGanttCustomItemPipe {
    transform(value) {
        return value === GanttItemType.custom;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttCustomItemPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: IsGanttCustomItemPipe, isStandalone: true, name: "isGanttCustomItem" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttCustomItemPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isGanttCustomItem',
                    standalone: true
                }]
        }] });
export class GanttDateFormatPipe {
    transform(value, format) {
        return new GanttDate(value).format(format);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDateFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: GanttDateFormatPipe, isStandalone: true, name: "dateFormat" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDateFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'dateFormat',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3BhY2thZ2VzL2dhbnR0L3NyYy9nYW50dC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDeEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFNekMsTUFBTSxPQUFPLG9CQUFvQjtJQUM3QixTQUFTLENBQUMsS0FBb0I7UUFDMUIsT0FBTyxLQUFLLEtBQUssYUFBYSxDQUFDLEtBQUssQ0FBQztJQUN6QyxDQUFDOzhHQUhRLG9CQUFvQjs0R0FBcEIsb0JBQW9COzsyRkFBcEIsb0JBQW9CO2tCQUpoQyxJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFVBQVUsRUFBRSxJQUFJO2lCQUNuQjs7QUFXRCxNQUFNLE9BQU8sa0JBQWtCO0lBQzNCLFNBQVMsQ0FBQyxLQUFvQjtRQUMxQixPQUFPLEtBQUssS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLENBQUM7OEdBSFEsa0JBQWtCOzRHQUFsQixrQkFBa0I7OzJGQUFsQixrQkFBa0I7a0JBSjlCLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsVUFBVSxFQUFFLElBQUk7aUJBQ25COztBQVdELE1BQU0sT0FBTyxxQkFBcUI7SUFDOUIsU0FBUyxDQUFDLEtBQW9CO1FBQzFCLE9BQU8sS0FBSyxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDMUMsQ0FBQzs4R0FIUSxxQkFBcUI7NEdBQXJCLHFCQUFxQjs7MkZBQXJCLHFCQUFxQjtrQkFKakMsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsbUJBQW1CO29CQUN6QixVQUFVLEVBQUUsSUFBSTtpQkFDbkI7O0FBV0QsTUFBTSxPQUFPLG1CQUFtQjtJQUM1QixTQUFTLENBQUMsS0FBc0IsRUFBRSxNQUFjO1FBQzVDLE9BQU8sSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUM7OEdBSFEsbUJBQW1COzRHQUFuQixtQkFBbUI7OzJGQUFuQixtQkFBbUI7a0JBSi9CLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLFVBQVUsRUFBRSxJQUFJO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdhbnR0SXRlbVR5cGUgfSBmcm9tICcuL2NsYXNzJztcbmltcG9ydCB7IEdhbnR0RGF0ZSB9IGZyb20gJy4vdXRpbHMvZGF0ZSc7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnaXNHYW50dFJhbmdlSXRlbScsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBJc0dhbnR0UmFuZ2VJdGVtUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAgIHRyYW5zZm9ybSh2YWx1ZTogR2FudHRJdGVtVHlwZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IEdhbnR0SXRlbVR5cGUucmFuZ2U7XG4gICAgfVxufVxuXG5AUGlwZSh7XG4gICAgbmFtZTogJ2lzR2FudHRCYXJJdGVtJyxcbiAgICBzdGFuZGFsb25lOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIElzR2FudHRCYXJJdGVtUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAgIHRyYW5zZm9ybSh2YWx1ZTogR2FudHRJdGVtVHlwZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IEdhbnR0SXRlbVR5cGUuYmFyO1xuICAgIH1cbn1cblxuQFBpcGUoe1xuICAgIG5hbWU6ICdpc0dhbnR0Q3VzdG9tSXRlbScsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBJc0dhbnR0Q3VzdG9tSXRlbVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICB0cmFuc2Zvcm0odmFsdWU6IEdhbnR0SXRlbVR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBHYW50dEl0ZW1UeXBlLmN1c3RvbTtcbiAgICB9XG59XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnZGF0ZUZvcm1hdCcsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBHYW50dERhdGVGb3JtYXRQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgdHJhbnNmb3JtKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsIGZvcm1hdDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBuZXcgR2FudHREYXRlKHZhbHVlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9XG59XG4iXX0=