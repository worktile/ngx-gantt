import { Component, OnInit, HostBinding, ElementRef, OnChanges, OnDestroy, Inject } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttItemUpper } from '../../gantt-item-upper';

@Component({
    selector: 'gantt-range',
    templateUrl: './range.component.html'
})
export class NgxGanttRangeComponent extends GanttItemUpper implements OnInit, OnChanges, OnDestroy {
    @HostBinding('class.gantt-range') ganttRangeClass = true;

    constructor(elementRef: ElementRef<HTMLDivElement>, @Inject(GANTT_UPPER_TOKEN) ganttUpper: GanttUpper) {
        super(elementRef, ganttUpper);
    }

    ngOnInit() {
        super.onInit();
    }

    ngOnChanges(): void {
        super.onChanges();
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
