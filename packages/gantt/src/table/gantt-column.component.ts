import {
    Component,
    TemplateRef,
    Input,
    ElementRef,
    input,
    contentChild,
    inject,
    computed,
    WritableSignal,
    Signal,
    effect,
    signal
} from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../gantt-upper';
@Component({
    selector: 'ngx-gantt-column',
    template: '',
    host: {
        class: 'gantt-table-column'
    }
})
export class NgxGanttTableColumnComponent {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    private elementRef = inject(ElementRef);

    readonly width = input<number | string>();

    readonly columnWidth: WritableSignal<string> = signal('');

    readonly name = input<string>();

    readonly showExpandIcon = input<boolean>();

    readonly templateRef = contentChild<TemplateRef<any>>('cell');

    readonly headerTemplateRef = contentChild<TemplateRef<any>>('header');

    constructor() {
        effect(() => {
            this.columnWidth.set(coerceCssPixelValue(this.width()));
        });
    }

    get classList(): DOMTokenList {
        return this.elementRef.nativeElement.classList;
    }
}
