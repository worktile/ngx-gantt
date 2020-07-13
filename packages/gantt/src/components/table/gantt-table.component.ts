import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../../class';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';
import { NgxGanttComponent } from '../../gantt.component';

@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit {
    public columnList: QueryList<NgxGanttTableColumnComponent>;

    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        this.columnList = columns;
    }

    @Input() groupTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor(public gantt: NgxGanttComponent) {}

    ngOnInit() {}

    expandGroup(group: GanttGroupInternal) {
        this.gantt.expandGroup(group);
    }

    expandChildren(item: GanttItemInternal) {
        this.gantt.expandChildren(item);
    }
}
