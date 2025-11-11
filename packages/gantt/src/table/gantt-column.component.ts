import { Component, ContentChild, TemplateRef, Input, ElementRef, inject } from '@angular/core';
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
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);
    private elementRef = inject(ElementRef);

    public columnWidth: string;

    @Input()
    set width(width: number | string) {
        this.columnWidth = coerceCssPixelValue(width);
    }

    @Input() name: string;

    @Input() showExpandIcon: boolean;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor() {}

    get classList(): DOMTokenList {
        return this.elementRef.nativeElement.classList;
    }
}
