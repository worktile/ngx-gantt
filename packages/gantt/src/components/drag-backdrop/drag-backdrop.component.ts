import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
@Component({
    selector: 'gantt-drag-backdrop',
    templateUrl: `./drag-backdrop.component.html`,
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        class: 'gantt-drag-backdrop'
    }
})
export class GanttDragBackdropComponent {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    constructor() {}
}
