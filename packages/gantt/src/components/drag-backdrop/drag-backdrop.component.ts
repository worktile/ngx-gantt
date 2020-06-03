import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'gantt-drag-backdrop',
    templateUrl: `./drag-backdrop.component.html`
})
export class GanttDragBackdropComponent implements OnInit {
    @HostBinding('class.gantt-drag-backdrop') backdropClass = true;

    constructor() {}

    ngOnInit() {}
}
