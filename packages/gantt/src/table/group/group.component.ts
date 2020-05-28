import { Component, OnInit, TemplateRef, Input, ViewChild, ElementRef, HostBinding, Inject, QueryList } from '@angular/core';
import { GanttGroupInternal } from '../../class/group';
import { GANTT_REF_TOKEN, GanttRef } from '../../gantt-ref';
import { GanttTableColumnComponent } from '../column/column.component';

@Component({
    selector: 'gantt-table-group',
    templateUrl: './group.component.html'
})
export class GanttTableGroupComponent implements OnInit {
    @Input() group: GanttGroupInternal;

    @Input() columns: QueryList<GanttTableColumnComponent>;

    @Input() groupHeader: TemplateRef<any>;

    @Input() groupHeaderTitle: TemplateRef<any>;

    @HostBinding('class.gantt-table-group') ganttTableGroupClass = true;

    constructor(public elementRef: ElementRef<HTMLDivElement>, @Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef) {}

    ngOnInit() {}

    expandGroup() {
        this.group.expand = !this.group.expand;
        this.ganttRef.detectChanges();
    }
}
