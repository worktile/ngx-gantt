import { Component, ContentChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { GanttTableEvent } from '../class';

@Component({
    selector: 'ngx-gantt-table',
    template: ''
})
export class NgxGanttTableComponent {
    @Output() columnChanges = new EventEmitter<GanttTableEvent>();

    @ContentChild('rowBeforeSlot', { static: true }) rowBeforeTemplate: TemplateRef<any>;

    @ContentChild('rowAfterSlot', { static: true }) rowAfterTemplate: TemplateRef<any>;
}
