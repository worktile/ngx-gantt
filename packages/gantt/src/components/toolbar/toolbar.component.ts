import { Component, OnInit, HostBinding, Input, TemplateRef, Inject, SimpleChanges } from '@angular/core';
import { ganttViews, GanttViewType } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';

@Component({
    selector: 'ngx-gantt-toolbar,gantt-toolbar',
    templateUrl: './toolbar.component.html'
})
export class NgxGanttToolbarComponent implements OnInit {
    @Input() template: TemplateRef<any>;

    @HostBinding('class.gantt-toolbar') ganttItemClass = true;

    views = [];

    constructor(@Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper) {}

    ngOnInit() {
        const viewTypes = this.ganttUpper.toolbarOptions?.viewTypes || [];
        ganttViews.forEach((view) => {
            if (viewTypes.includes(view.value)) {
                this.views.push(view);
            }
        });
    }

    selectView(view: GanttViewType) {
        this.ganttUpper.viewTypeChange(view);
    }
}
