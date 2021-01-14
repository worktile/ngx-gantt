import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GanttTableEvent } from '../class';

@Component({
    selector: 'ngx-gantt-table',
    template: ''
})
export class NgxGanttTableComponent implements OnInit {
    @Output() columnChanges = new EventEmitter<GanttTableEvent>();

    constructor() {}

    ngOnInit() {}
}
