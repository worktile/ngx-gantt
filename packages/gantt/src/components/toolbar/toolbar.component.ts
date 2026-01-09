import { Component, HostBinding, TemplateRef, inject, input } from '@angular/core';
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

    readonly template = input<TemplateRef<any>>();

    @HostBinding('class.gantt-toolbar') ganttItemClass = true;

    views = inject(GanttConfigService).getViewsLocale();

    constructor() {}

    selectView(view: GanttViewType) {
        this.ganttUpper.viewType.set(view);
    }
}
