import { Component } from '@angular/core';

@Component({
    selector: 'gantt-drag-backdrop',
    templateUrl: `./drag-backdrop.component.html`,
    host: {
        class: 'gantt-drag-backdrop'
    },
    standalone: true
})
export class GanttDragBackdropComponent {}
