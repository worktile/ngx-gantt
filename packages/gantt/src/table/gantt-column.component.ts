import { Component, OnInit, ContentChild, TemplateRef, Input, EventEmitter, Inject, Output } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../gantt-upper';
@Component({
    selector: 'ngx-gantt-column',
    template: ''
})
export class NgxGanttTableColumnComponent implements OnInit {
    public columnWidth: string;

    @Input()
    set width(width: number | string) {
        this.columnWidth = coerceCssPixelValue(width);
    }

    @Input() name: string;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    ngOnInit() {}
}
