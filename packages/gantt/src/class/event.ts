import { GanttItem } from './item';

export class GanttDragEvent<T = unknown> {
    item: GanttItem<T>;
}

export class GanttColumnEvent {
    width: number;
}

export class GanttLinkDragEvent<T = unknown> {
    source: GanttItem<T>;
    target?: GanttItem<T>;
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
