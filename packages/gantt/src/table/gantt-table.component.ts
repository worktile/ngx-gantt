import { Component, ContentChild, TemplateRef, contentChild, input, output } from '@angular/core';
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
    template: ''
})
export class NgxGanttTableComponent {
    readonly draggable = input(false);

    readonly maxWidth = input<number>(undefined);

    readonly width = input<number>(undefined);

    readonly dropEnterPredicate = input<(context: GanttTableDragEnterPredicateContext) => boolean>(undefined);

    readonly dragDropped = output<GanttTableDragDroppedEvent>();

    readonly dragStarted = output<GanttTableDragStartedEvent>();

    readonly dragEnded = output<GanttTableDragEndedEvent>();

    readonly columnChanges = output<GanttTableEvent>();

    readonly resizeChange = output<number>();

    readonly itemClick = output<GanttTableItemClickEvent>();

    readonly rowBeforeTemplate = contentChild<TemplateRef<any>>('rowBeforeSlot');

    readonly rowAfterTemplate = contentChild<TemplateRef<any>>('rowAfterSlot');

    readonly tableEmptyTemplate = contentChild<TemplateRef<any>>('tableEmpty');

    readonly tableFooterTemplate = contentChild<TemplateRef<any>>('tableFooter');

    readonly settingsSlot = contentChild<TemplateRef<any>>('settingsSlot');
}
