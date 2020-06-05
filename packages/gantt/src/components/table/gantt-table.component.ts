import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit, Inject, ElementRef } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../../class';
import { maxSideWidth, minSideWidth, sideWidth } from '../../gantt.styles';
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

    public get sideWidth() {
        return sideWidth;
    }

    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        this.columnList = columns;
        this.resetColumnWidth();
    }

    @Input() groupTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor(@Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef, private elementRef: ElementRef) {}

    ngOnInit() {}

    expandGroup(group: GanttGroupInternal) {
        group.expand = !group.expand;
        this.ganttRef.detectChanges();
    }

    resetColumnWidth() {
        const columnsLength = this.columnList.length;
        this.columnList.forEach((column, index) => {
            if (columnsLength === 1) {
                if (index === 0) {
                    column.width = '100%';
                }
            }
            if (columnsLength === 2) {
                if (index === 0) {
                    column.width = '65%';
                } else {
                    column.width = '35%';
                }
            }
            if (columnsLength >= 3) {
                if (index === 0) {
                    column.width = '45%';
                } else {
                    column.width = (0.55 / (columnsLength - 1)) * 100 + '%';
                }
            }
        });
    }
}
