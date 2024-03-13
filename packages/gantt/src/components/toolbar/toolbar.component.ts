import { Component, HostBinding, Input, TemplateRef, Inject } from '@angular/core';
import { ganttViews, GanttViewType } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { keyBy } from '../../utils/helpers';
import { NgIf, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'ngx-gantt-toolbar,gantt-toolbar',
    templateUrl: './toolbar.component.html',
    standalone: true,
    imports: [NgIf, NgFor, NgTemplateOutlet]
})
export class NgxGanttToolbarComponent {
    @Input() template: TemplateRef<any>;

    @HostBinding('class.gantt-toolbar') ganttItemClass = true;

    @HostBinding('style.top')
    get top() {
        return this.ganttUpper.styles.headerHeight + 16 + 'px';
    }

    ganttViewsMap = keyBy(ganttViews, 'value');

    constructor(@Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper) {}

    selectView(view: GanttViewType) {
        this.ganttUpper.changeView(view);
    }
}
