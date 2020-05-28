import { Component, OnInit, Input, HostBinding, QueryList } from '@angular/core';
import { GanttItemInternal } from '../../class/item';
import { GanttTableColumnComponent } from '../column/column.component';

@Component({
    selector: 'gantt-table-items',
    templateUrl: './items.component.html',
})
export class GanttTableItemsComponent implements OnInit {
    @Input() items: GanttItemInternal[] = [];

    @Input() columns: QueryList<GanttTableColumnComponent>;

    @HostBinding('class.gantt-table-items') ganttTableItemsClass = true;

    constructor() {}

    ngOnInit() {}
}
