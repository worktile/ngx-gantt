import { Component, HostBinding, Input, TemplateRef, inject } from '@angular/core';
import { GanttViewType } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { NgTemplateOutlet } from '@angular/common';
import { GanttConfigService } from '../../gantt.config';

@Component({
    selector: 'ngx-gantt-toolbar,gantt-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [NgTemplateOutlet]
})
export class NgxGanttToolbarComponent {
    protected ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    @Input() template: TemplateRef<any>;

    @HostBinding('class.gantt-toolbar') ganttItemClass = true;

    @HostBinding('style.top')
    get top() {
        return this.ganttUpper.styles.headerHeight + 16 + 'px';
    }

    views = inject(GanttConfigService).getViewsLocale();

    constructor() {}

    selectView(view: GanttViewType) {
        this.ganttUpper.changeView(view);
    }
}
