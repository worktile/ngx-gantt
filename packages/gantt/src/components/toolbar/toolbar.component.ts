import { Component, HostBinding, Input, TemplateRef, Inject, inject } from '@angular/core';
import { GanttViewType } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import { GanttConfigService } from '../../gantt.config';

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

    views = inject(GanttConfigService).getViewsLocale();

    constructor(@Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper) {}

    selectView(view: GanttViewType) {
        this.ganttUpper.changeView(view);
    }
}
