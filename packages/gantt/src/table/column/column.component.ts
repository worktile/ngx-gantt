import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
    selector: 'ngx-gantt-column',
    templateUrl: './column.component.html'
})
export class GanttTableColumnComponent implements OnInit {
    private columnWidth = 'auto';

    @Input() name: string;

    @Input('width')
    set width(width: number | string) {
        this.columnWidth = coerceCssPixelValue(width);
    }

    get width() {
        return this.columnWidth;
    }

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
