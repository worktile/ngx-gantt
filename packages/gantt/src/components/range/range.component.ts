import { Component, HostBinding, ElementRef, Inject } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttItemUpper } from '../../gantt-item-upper';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'ngx-gantt-range,gantt-range',
    templateUrl: './range.component.html',
    imports: [NgTemplateOutlet]
})
export class NgxGanttRangeComponent extends GanttItemUpper {
    @HostBinding('class.gantt-range') ganttRangeClass = true;

    constructor(elementRef: ElementRef<HTMLDivElement>, @Inject(GANTT_UPPER_TOKEN) ganttUpper: GanttUpper) {
        super(elementRef, ganttUpper);
    }
}
