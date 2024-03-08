import { QueryList } from '@angular/core';
import { NgxGanttTableColumnComponent } from '../table/gantt-column.component';
import { GanttItem } from './item';
import { GanttLinkType } from './link';

export class GanttDragEvent<T = unknown> {
    item: GanttItem<T>;
}

export class GanttTableEvent {
    columns: QueryList<NgxGanttTableColumnComponent>;
}

export class GanttLinkDragEvent<T = unknown> {
    source: GanttItem<T>;
    target?: GanttItem<T>;
    type?: GanttLinkType;
}

export class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}

export class GanttLineClickEvent<T = unknown> {
    event: MouseEvent;
    source: GanttItem<T>;
    target: GanttItem<T>;
}

export class GanttBarClickEvent<T = unknown> {
    event: Event;
    item: GanttItem<T>;
}

export class GanttSelectedEvent<T = unknown> {
    event: Event;
    current?: GanttItem<T>;
    selectedValue: GanttItem<T> | GanttItem<T>[];
}

export class GanttTableDragDroppedEvent<T = unknown> {
    source: GanttItem<T>;
    sourceParent: GanttItem<T>;
    target: GanttItem<T>;
    targetParent: GanttItem<T>;
    dropPosition: GanttTableDropPosition;
}

export class GanttTableDragStartedEvent<T = unknown> {
    source: GanttItem<T>;
    sourceParent: GanttItem<T>;
}

export class GanttTableDragEndedEvent<T = unknown> {
    source: GanttItem<T>;
    sourceParent: GanttItem<T>;
}

export type GanttTableDropPosition = 'before' | 'inside' | 'after';

export class GanttTableDragEnterPredicateContext<T = unknown> {
    source: GanttItem<T>;
    target: GanttItem<T>;
    dropPosition: GanttTableDropPosition;
}

export class GanttVirtualScrolledIndexChangeEvent {
    index: number;
    renderedRange: {
        start: number;
        end: number;
    };
    count: number;
}
