import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';

@Component({
    selector: 'ngx-gantt-column',
    templateUrl: './column.component.html',
})
export class GanttTableColumnComponent implements OnInit {
    @Input() name: string;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
