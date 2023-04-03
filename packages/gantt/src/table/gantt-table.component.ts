import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GanttTableDragEnterPredicateContext, GanttTableDragDroppedEvent, GanttTableEvent, GanttItemInternal } from '../class';

@Component({
    selector: 'ngx-gantt-table',
    template: ''
})
export class NgxGanttTableComponent {
    @Input() draggable = false;

    @Input() dropEnterPredicate?: (context: GanttTableDragEnterPredicateContext) => boolean;

    @Output() dragDropped = new EventEmitter<GanttTableDragDroppedEvent>();

    @Output() dragStarted = new EventEmitter<GanttItemInternal>();

    @Output() dragEnded = new EventEmitter<GanttItemInternal>();

    @Output() columnChanges = new EventEmitter<GanttTableEvent>();

    @ContentChild('rowBeforeSlot', { static: true }) rowBeforeTemplate: TemplateRef<any>;

    @ContentChild('rowAfterSlot', { static: true }) rowAfterTemplate: TemplateRef<any>;
}
