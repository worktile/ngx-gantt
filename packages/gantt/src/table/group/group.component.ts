import { Component, OnInit, TemplateRef, Input, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { GanttGroup } from '../../class/group';

@Component({
    selector: 'gantt-table-group',
    templateUrl: './group.component.html',
})
export class GanttTableGroupComponent implements OnInit {
    @Input() group: GanttGroup;

    @Input() groupHeader: TemplateRef<any>;

    @Input() groupHeaderTitle: TemplateRef<any>;

    @HostBinding('class.gantt-table-group') ganttTableGroupClass = true;

    public isCollapse = false;

    constructor(public elementRef: ElementRef<HTMLDivElement>) {}

    ngOnInit() {}

    collapseGroup() {
        this.isCollapse = !this.isCollapse;
    }
}
