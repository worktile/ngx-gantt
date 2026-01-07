import { Component } from '@angular/core';
import { GanttItemUpper } from '../../gantt-item-upper';

@Component({
    selector: 'gantt-placeholder',
    template: '',
    host: {
        class: 'gantt-placeholder'
    }
})
export class GanttPlaceholderComponent extends GanttItemUpper {
    constructor() {
        super();
    }
}
