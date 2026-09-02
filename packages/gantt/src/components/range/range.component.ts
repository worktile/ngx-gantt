import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { GanttItemUpper } from '../../gantt-item-upper';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'ngx-gantt-range,gantt-range',
    templateUrl: './range.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet]
})
export class NgxGanttRangeComponent extends GanttItemUpper {
    @HostBinding('class.gantt-range') ganttRangeClass = true;

    constructor() {
        super();
    }
}
