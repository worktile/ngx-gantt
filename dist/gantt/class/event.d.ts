import { QueryList } from '@angular/core';
import { NgxGanttTableColumnComponent } from '../table/gantt-column.component';
import { GanttItem } from './item';
import { GanttLinkType } from './link';
export declare class GanttDragEvent<T = unknown> {
    item: GanttItem<T>;
}
export declare class GanttTableEvent {
    columns: QueryList<NgxGanttTableColumnComponent>;
}
export declare class GanttLinkDragEvent<T = unknown> {
    source: GanttItem<T>;
    target?: GanttItem<T>;
    type?: GanttLinkType;
}
export declare class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}
export declare class GanttLineClickEvent<T = unknown> {
    event: MouseEvent;
    source: GanttItem<T>;
    target: GanttItem<T>;
}
export declare class GanttBarClickEvent<T = unknown> {
    event: Event;
    item: GanttItem<T>;
}
export declare class GanttTableItemClickEvent<T = unknown> {
    event: Event;
    current?: GanttItem<T>;
}
export declare class GanttSelectedEvent<T = unknown> extends GanttTableItemClickEvent<T> {
    selectedValue: GanttItem<T> | GanttItem<T>[];
}
export declare class GanttTableDragDroppedEvent<T = unknown> {
    source: GanttItem<T>;
    sourceParent: GanttItem<T>;
    target: GanttItem<T>;
    targetParent: GanttItem<T>;
    dropPosition: GanttTableDropPosition;
}
export declare class GanttTableDragStartedEvent<T = unknown> {
    source: GanttItem<T>;
    sourceParent: GanttItem<T>;
}
export declare class GanttTableDragEndedEvent<T = unknown> {
    source: GanttItem<T>;
    sourceParent: GanttItem<T>;
}
export type GanttTableDropPosition = 'before' | 'inside' | 'after';
export declare class GanttTableDragEnterPredicateContext<T = unknown> {
    source: GanttItem<T>;
    target: GanttItem<T>;
    dropPosition: GanttTableDropPosition;
}
export declare class GanttVirtualScrolledIndexChangeEvent {
    index: number;
    renderedRange: {
        start: number;
        end: number;
    };
    count: number;
}
