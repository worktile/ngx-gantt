import { Component, OnInit, ContentChild, TemplateRef, Input, EventEmitter, Inject } from '@angular/core';
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

    @Input() key: string;

    @ContentChild('cell', { static: true }) templateRef: TemplateRef<any>;

    @ContentChild('header', { static: true }) headerTemplateRef: TemplateRef<any>;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    ngOnInit() {
        const cacheWidth = localStorage.getItem(this.generateCacheKey());
        this.columnWidth = coerceCssPixelValue(cacheWidth || this.columnWidth);
    }

    public setWidth(width: number | string) {
        localStorage.setItem(this.generateCacheKey(), coerceCssPixelValue(width));
    }

    private generateCacheKey() {
        return `${this.ganttUpper.cachePrefix}-${this.key || this.generateColumnKeyByName()}`;
    }

    private generateColumnKeyByName() {
        return (this.name || '').split('').reduce((prev, current) => {
            return prev + current.charCodeAt(0);
        }, 0);
    }
}
