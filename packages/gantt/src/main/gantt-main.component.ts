import { Component, OnInit, HostBinding, Inject, Input, TemplateRef } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal } from '../class';
import { GANTT_REF_TOKEN, GanttRef } from '../gantt-ref';

@Component({
    selector: 'gantt-main',
    templateUrl: './gantt-main.component.html'
})
export class GanttMainComponent implements OnInit {
    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input() barTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

    constructor(@Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef) {}

    ngOnInit() {}

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }
}
