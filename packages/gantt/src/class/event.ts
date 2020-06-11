import { GanttItem } from './item';

export class GanttDragEvent<T = unknown> {
    item: GanttItem<T>;
}

export class GanttLinkDragEvent {
    source: GanttItem;
    target?: GanttItem;
}

export class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}

export class GanttLinkEvent<T = unknown> {
    event: MouseEvent;
    source: GanttItem;
    target: GanttItem;
}

export class GanttBarClickEvent<T = unknown> {
    event: Event;
    item: GanttItem<T>;
}
