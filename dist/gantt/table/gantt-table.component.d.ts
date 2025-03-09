import { EventEmitter, TemplateRef } from '@angular/core';
import { GanttTableDragEnterPredicateContext, GanttTableDragDroppedEvent, GanttTableEvent, GanttTableDragStartedEvent, GanttTableDragEndedEvent, GanttTableItemClickEvent } from '../class';
import * as i0 from "@angular/core";
export declare class NgxGanttTableComponent {
    draggable: boolean;
    dropEnterPredicate?: (context: GanttTableDragEnterPredicateContext) => boolean;
    dragDropped: EventEmitter<GanttTableDragDroppedEvent<unknown>>;
    dragStarted: EventEmitter<GanttTableDragStartedEvent<unknown>>;
    dragEnded: EventEmitter<GanttTableDragEndedEvent<unknown>>;
    columnChanges: EventEmitter<GanttTableEvent>;
    itemClick: EventEmitter<GanttTableItemClickEvent<unknown>>;
    rowBeforeTemplate: TemplateRef<any>;
    rowAfterTemplate: TemplateRef<any>;
    tableEmptyTemplate: TemplateRef<any>;
    tableFooterTemplate: TemplateRef<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGanttTableComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGanttTableComponent, "ngx-gantt-table", never, { "draggable": { "alias": "draggable"; "required": false; }; "dropEnterPredicate": { "alias": "dropEnterPredicate"; "required": false; }; }, { "dragDropped": "dragDropped"; "dragStarted": "dragStarted"; "dragEnded": "dragEnded"; "columnChanges": "columnChanges"; "itemClick": "itemClick"; }, ["rowBeforeTemplate", "rowAfterTemplate", "tableEmptyTemplate", "tableFooterTemplate"], never, true, never>;
}
