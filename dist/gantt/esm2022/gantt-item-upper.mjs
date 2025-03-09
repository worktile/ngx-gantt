import { Input, Inject, Directive } from '@angular/core';
import { GanttItemType } from './class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { rangeHeight } from './gantt.styles';
import { GANTT_UPPER_TOKEN } from './gantt-upper';
import * as i0 from "@angular/core";
import * as i1 from "./gantt-upper";
export class GanttItemUpper {
    constructor(elementRef, ganttUpper) {
        this.elementRef = elementRef;
        this.ganttUpper = ganttUpper;
        this.firstChange = true;
        this.unsubscribe$ = new Subject();
        this.refsUnsubscribe$ = new Subject();
    }
    ngOnInit() {
        this.firstChange = false;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    ngOnChanges(changes) {
        if (!this.firstChange) {
            this.itemChange(changes.item.currentValue);
        }
    }
    itemChange(item) {
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
        this.item = item;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.item.refs?.x + 'px';
        itemElement.style.top = this.item.refs?.y + 'px';
        itemElement.style.width = this.item.refs?.width + 'px';
        if (this.item.type === GanttItemType.bar) {
            itemElement.style.height = this.ganttUpper.styles.barHeight + 'px';
        }
        else if (this.item.type === GanttItemType.range) {
            itemElement.style.height = rangeHeight + 'px';
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttItemUpper, deps: [{ token: i0.ElementRef }, { token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0", type: GanttItemUpper, inputs: { template: "template", item: "item" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttItemUpper, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { template: [{
                type: Input
            }], item: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQtaXRlbS11cHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3BhY2thZ2VzL2dhbnR0L3NyYy9nYW50dC1pdGVtLXVwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQWMsTUFBTSxFQUFlLFNBQVMsRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDL0gsT0FBTyxFQUFxQixhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDM0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLGVBQWUsQ0FBQzs7O0FBRzlELE1BQU0sT0FBZ0IsY0FBYztJQVdoQyxZQUFzQixVQUFtQyxFQUF1QyxVQUFzQjtRQUFoRyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUF1QyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBTi9HLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBRW5CLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUVuQyxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0lBRTJFLENBQUM7SUFFMUgsUUFBUTtRQUNKLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2xFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFFTyxVQUFVLENBQUMsSUFBdUI7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNsRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sWUFBWTtRQUNoQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNsRCxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xELFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDakQsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN2RCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3ZFLENBQUM7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoRCxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ2xELENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7OEdBcERpQixjQUFjLDRDQVdtQyxpQkFBaUI7a0dBWGxFLGNBQWM7OzJGQUFkLGNBQWM7a0JBRG5DLFNBQVM7OzBCQVlzRCxNQUFNOzJCQUFDLGlCQUFpQjt5Q0FWM0UsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgRWxlbWVudFJlZiwgSW5qZWN0LCBUZW1wbGF0ZVJlZiwgRGlyZWN0aXZlLCBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHYW50dEl0ZW1JbnRlcm5hbCwgR2FudHRJdGVtVHlwZSB9IGZyb20gJy4vY2xhc3MnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgcmFuZ2VIZWlnaHQgfSBmcm9tICcuL2dhbnR0LnN0eWxlcyc7XG5pbXBvcnQgeyBHQU5UVF9VUFBFUl9UT0tFTiwgR2FudHRVcHBlciB9IGZyb20gJy4vZ2FudHQtdXBwZXInO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHYW50dEl0ZW1VcHBlciBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KCkgaXRlbTogR2FudHRJdGVtSW50ZXJuYWw7XG5cbiAgICBwdWJsaWMgZmlyc3RDaGFuZ2UgPSB0cnVlO1xuXG4gICAgcHVibGljIHVuc3Vic2NyaWJlJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBwdWJsaWMgcmVmc1Vuc3Vic2NyaWJlJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIEBJbmplY3QoR0FOVFRfVVBQRVJfVE9LRU4pIHByb3RlY3RlZCBnYW50dFVwcGVyOiBHYW50dFVwcGVyKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pdGVtLnJlZnMkLnBpcGUodGFrZVVudGlsKHRoaXMucmVmc1Vuc3Vic2NyaWJlJCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9ucygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtQ2hhbmdlKGNoYW5nZXMuaXRlbS5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpdGVtQ2hhbmdlKGl0ZW06IEdhbnR0SXRlbUludGVybmFsKSB7XG4gICAgICAgIHRoaXMucmVmc1Vuc3Vic2NyaWJlJC5uZXh0KCk7XG4gICAgICAgIHRoaXMucmVmc1Vuc3Vic2NyaWJlJC5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtO1xuICAgICAgICB0aGlzLml0ZW0ucmVmcyQucGlwZSh0YWtlVW50aWwodGhpcy5yZWZzVW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb25zKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UG9zaXRpb25zKCkge1xuICAgICAgICBjb25zdCBpdGVtRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpdGVtRWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5pdGVtLnJlZnM/LnggKyAncHgnO1xuICAgICAgICBpdGVtRWxlbWVudC5zdHlsZS50b3AgPSB0aGlzLml0ZW0ucmVmcz8ueSArICdweCc7XG4gICAgICAgIGl0ZW1FbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5pdGVtLnJlZnM/LndpZHRoICsgJ3B4JztcbiAgICAgICAgaWYgKHRoaXMuaXRlbS50eXBlID09PSBHYW50dEl0ZW1UeXBlLmJhcikge1xuICAgICAgICAgICAgaXRlbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5nYW50dFVwcGVyLnN0eWxlcy5iYXJIZWlnaHQgKyAncHgnO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXRlbS50eXBlID09PSBHYW50dEl0ZW1UeXBlLnJhbmdlKSB7XG4gICAgICAgICAgICBpdGVtRWxlbWVudC5zdHlsZS5oZWlnaHQgPSByYW5nZUhlaWdodCArICdweCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSQubmV4dCgpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlJC5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLnJlZnNVbnN1YnNjcmliZSQubmV4dCgpO1xuICAgICAgICB0aGlzLnJlZnNVbnN1YnNjcmliZSQuY29tcGxldGUoKTtcbiAgICB9XG59XG4iXX0=