import { Component, ContentChild, TemplateRef, Input, Inject, ElementRef } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../gantt-upper';
@Component({
    selector: 'ngx-gantt-column',
    template: '',
    host: {
        class: 'gantt-table-column'
    },
    standalone: true
})
export class NgxGanttTableColumnComponent {
    public columnWidth: string;

    @Input()
    set width(width: number | string) {
        this.columnWidth = coerceCssPixelValue(width);
    }

    @Input() name: string;

    @Input() showExpandIcon: boolean;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper, private elementRef: ElementRef) {}

    get classList(): DOMTokenList {
        return this.elementRef.nativeElement.classList;
    }
}
