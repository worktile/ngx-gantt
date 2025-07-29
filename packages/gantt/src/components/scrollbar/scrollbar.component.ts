import { NgClass } from '@angular/common';
import { Component, Inject, input } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { NgxGanttRootComponent } from '../../root.component';

@Component({
    selector: 'gantt-scrollbar',
    templateUrl: `./scrollbar.component.html`,
    imports: [NgClass]
})
export class GanttScrollbarComponent {
    hasFooter = input<boolean>(false);

    tableWidth = input<number>();

    ganttRoot = input<NgxGanttRootComponent>();

    tableScrollWidth = input<number>(0);

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}
}
