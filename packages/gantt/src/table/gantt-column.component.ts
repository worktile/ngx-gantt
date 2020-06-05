import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
    selector: 'ngx-gantt-column',
    template: ''
})
export class NgxGanttTableColumnComponent implements OnInit {
    width: number;

    @Input() name: string;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
