import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import {
    GanttTableDragDroppedEvent,
    GanttTableDragEndedEvent,
    GanttTableDragEnterPredicateContext,
    GanttTableDragStartedEvent,
    GanttTableEvent,
    GanttTableItemClickEvent
} from '../class';

@Component({
    selector: 'ngx-gantt-table',
    template: '',
    standalone: true
})
export class NgxGanttTableComponent {
    @Input() draggable = false;

    @Input() dropEnterPredicate?: (context: GanttTableDragEnterPredicateContext) => boolean;

    @Output() dragDropped = new EventEmitter<GanttTableDragDroppedEvent>();

    @Output() dragStarted = new EventEmitter<GanttTableDragStartedEvent>();

    @Output() dragEnded = new EventEmitter<GanttTableDragEndedEvent>();

    @Output() columnChanges = new EventEmitter<GanttTableEvent>();

    @Output() itemClick = new EventEmitter<GanttTableItemClickEvent>();

    @ContentChild('rowBeforeSlot', { static: true }) rowBeforeTemplate: TemplateRef<any>;

    @ContentChild('rowAfterSlot', { static: true }) rowAfterTemplate: TemplateRef<any>;

    @ContentChild('tableEmpty', { static: true }) tableEmptyTemplate: TemplateRef<any>;

    @ContentChild('tableFooter', { static: true }) tableFooterTemplate: TemplateRef<any>;

    @ContentChild('columnSetting', { static: true }) columnSettingTemplate: TemplateRef<any>;
}
