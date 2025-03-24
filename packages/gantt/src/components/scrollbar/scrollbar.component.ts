import { Component, Inject, Input } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { NgClass } from '@angular/common';
import { NgxGanttRootComponent } from '../../root.component';

@Component({
    selector: 'gantt-scrollbar',
    templateUrl: `./scrollbar.component.html`,
    imports: [NgClass]
})
export class GanttScrollbarComponent {
    @Input() hasFooter: boolean = false;

    @Input() tableWidth: number;

    @Input() ganttRoot: NgxGanttRootComponent;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}
}
