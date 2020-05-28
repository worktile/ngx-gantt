import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
    selector: 'ngx-gantt-column',
    templateUrl: './column.component.html',
})
export class GanttTableColumnComponent implements OnInit {
    @Input() name: string;

    @Input('width')
    set width(width: number | string) {
        console.log(width);
        this.columnWidth = coerceCssPixelValue(width);
    }

    public columnWidth: string;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
