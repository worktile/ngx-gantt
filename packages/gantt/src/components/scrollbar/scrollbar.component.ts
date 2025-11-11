import { NgClass } from '@angular/common';
import { Component, input, inject } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { NgxGanttRootComponent } from '../../root.component';
import { GanttSyncScrollXDirective } from '../../directives/sync-scroll.directive';

@Component({
    selector: 'gantt-scrollbar',
    templateUrl: `./scrollbar.component.html`,
    imports: [NgClass, GanttSyncScrollXDirective]
})
export class GanttScrollbarComponent {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    hasFooter = input<boolean>(false);

    tableWidth = input<number>();

    ganttRoot = input<NgxGanttRootComponent>();

    tableScrollWidth = input<number>(0);

    constructor() {}
}
