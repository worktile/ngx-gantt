import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'gantt-drag-backdrop',
    templateUrl: `./drag-backdrop.component.html`
})
export class GanttDragBackdropComponent {
    @HostBinding('class.gantt-drag-backdrop') backdropClass = true;
}
