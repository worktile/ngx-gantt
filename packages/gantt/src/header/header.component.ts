import { Component, OnInit, Input, HostBinding, TemplateRef, Inject } from '@angular/core';
import { GanttView } from '../views/view';
import { GanttDatePoint } from '../class/date-point';
import { getHeaderHeight } from '../gantt.options';
import { GANTT_REF_TOKEN, GanttRef } from '../gantt-ref';

@Component({
    selector: 'gantt-header',
    templateUrl: './header.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttHeaderComponent implements OnInit {
    @Input() sideTitle: string | TemplateRef<string>;

    get view() {
        return this.ganttRef.view;
    }

    headerHeight = getHeaderHeight();

    @HostBinding('class.gantt-header') ganttHeaderClass = true;

    constructor(@Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef) {}

    ngOnInit() {}

    trackBy(point: GanttDatePoint, index: number) {
        return point.text || index;
    }

    isTemplateRef(template: string | TemplateRef<any>) {
        return template instanceof TemplateRef;
    }
}
