import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GanttTableDragEnterPredicateContext, GanttTableDragDroppedEvent, GanttTableEvent } from '../class';

@Component({
    selector: 'ngx-gantt-table',
    template: ''
})
export class NgxGanttTableComponent {
    @Input() draggable = false;

    @Input() dropEnterPredicate?: (context: GanttTableDragEnterPredicateContext) => boolean;

    @Output() dragDropped = new EventEmitter<GanttTableDragDroppedEvent>();

    @Output() columnChanges = new EventEmitter<GanttTableEvent>();

    @ContentChild('rowBeforeSlot', { static: true }) rowBeforeTemplate: TemplateRef<any>;

    @ContentChild('rowAfterSlot', { static: true }) rowAfterTemplate: TemplateRef<any>;
}
