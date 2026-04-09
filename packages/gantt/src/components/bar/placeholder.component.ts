import { Component } from '@angular/core';
import { GanttItemUpper } from '../../gantt-item-upper';

@Component({
    selector: 'ngx-gantt-bar-placeholder,gantt-bar-placeholder',
    template: '',
    host: {
        class: 'gantt-bar-placeholder'
    }
})
export class NgxGanttPlaceholderComponent extends GanttItemUpper {
    constructor() {
        super();
    }
}
