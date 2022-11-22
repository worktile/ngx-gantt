import { Component, HostBinding, Input, TemplateRef, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { ganttViews, GanttViewType } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { keyBy } from '../../utils/helpers';

@Component({
    selector: 'ngx-gantt-toolbar,gantt-toolbar',
    templateUrl: './toolbar.component.html'
})
export class NgxGanttToolbarComponent {
    @Input() template: TemplateRef<any>;

    @HostBinding('class.gantt-toolbar') ganttItemClass = true;

    ganttViewsMap = keyBy(ganttViews, 'value');

    constructor(@Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper) {}

    selectView(view: GanttViewType) {
        this.ganttUpper.viewTypeChange(view);
    }
}
