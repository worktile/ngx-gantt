import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit, Inject } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../../class';
import { maxSideWidth, minSideWidth } from '../../gantt.styles';
import { GANTT_REF_TOKEN, GanttRef } from '../../gantt-ref';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';

@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit {
    public columnList: QueryList<NgxGanttTableColumnComponent>;

    public get maxSideWidth() {
        return maxSideWidth;
    }

    public get minSideWidth() {
        return minSideWidth;
    }

    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        this.columnList = columns;
    }

    @Input() groupTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor(@Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef) {}

    ngOnInit() {}

    expandGroup(group: GanttGroupInternal) {
        group.expand = !group.expand;
        this.ganttRef.detectChanges();
    }
}
