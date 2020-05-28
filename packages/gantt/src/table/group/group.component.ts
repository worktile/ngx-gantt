import { Component, OnInit, TemplateRef, Input, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { GanttGroup } from '../../class/group';

@Component({
    selector: 'gantt-table-group',
    templateUrl: './group.component.html',
})
export class GanttTableGroupComponent implements OnInit {
    @Input() group: GanttGroup;

    @Input() groupHeader: TemplateRef<any>;

    @HostBinding('class.gantt-table-group') ganttTableGroupClass = true;

    constructor(public elementRef: ElementRef<HTMLDivElement>) {}

    ngOnInit() {}
}
