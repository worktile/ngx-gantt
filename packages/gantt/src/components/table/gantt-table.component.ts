import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit, ElementRef } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../../class';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';
import { defaultColumnWidth, NgxGanttComponent } from '../../gantt.component';

import { coerceCssPixelValue } from '@angular/cdk/coercion';
@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit {
    public columnList: QueryList<NgxGanttTableColumnComponent>;

    public hasGroup: boolean;

    public flatData: (GanttGroupInternal | GanttItemInternal)[];

    @Input() set tempData(data: (GanttGroupInternal | GanttItemInternal)[]) {
        const firstData = data[0];
        if (firstData && firstData.hasOwnProperty('items')) {
            this.hasGroup = true;
        }
        this.ganttTableEmptyClass = data?.length ? false : true;
        this.flatData = data;
    }

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
        });
        this.columnList = columns;
    }

    @Input() groupTemplate: TemplateRef<any>;

    @Input() emptyTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    @HostBinding('class.gantt-table-empty') ganttTableEmptyClass = false;

    constructor(public gantt: NgxGanttComponent, private elementRef: ElementRef) {}

    ngOnInit() {}

    expandGroup(group: GanttGroupInternal) {
        this.gantt.expandGroup(group);
    }

    expandChildren(item: GanttItemInternal) {
        this.gantt.expandChildren(item);
    }

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }
}
