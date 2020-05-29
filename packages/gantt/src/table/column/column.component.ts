import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
    selector: 'ngx-gantt-column',
    templateUrl: './column.component.html'
})
export class GanttTableColumnComponent implements OnInit {
    public columnWidth: string;

    @Input() name: string;

    @Input('width')
    set width(width: number | string) {
        this.columnWidth = coerceCssPixelValue(width);
    }

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
