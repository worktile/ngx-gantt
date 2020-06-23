import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit, Inject, ElementRef, Output, EventEmitter } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal, GanttItem } from '../../class';
import { GANTT_REF_TOKEN, GanttRef } from '../../gantt-ref';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';

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

    constructor(@Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef) {}

    ngOnInit() {}

    expandGroup(group: GanttGroupInternal) {
        this.ganttRef.expandGroup(group);
    }

    expandChildren(item: GanttItemInternal) {
        this.ganttRef.expandChildren(item);
    }
}
