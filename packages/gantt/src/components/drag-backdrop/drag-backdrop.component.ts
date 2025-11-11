import { Component, inject } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
@Component({
    selector: 'gantt-drag-backdrop',
    templateUrl: `./drag-backdrop.component.html`,
    host: {
        class: 'gantt-drag-backdrop'
    },
    standalone: true
})
export class GanttDragBackdropComponent {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    constructor() {}
}
