import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../class';
import { GanttTableColumnComponent } from './column/column.component';
import { maxSideWidth, minSideWidth } from '../gantt.styles';
import { GANTT_REF_TOKEN, GanttRef } from '../gantt-ref';

@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit {
    public columnList: QueryList<GanttTableColumnComponent>;

    public get maxSideWidth() {
        return maxSideWidth;
    }

    public get minSideWidth() {
        return minSideWidth;
    }

    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<GanttTableColumnComponent>) {
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
