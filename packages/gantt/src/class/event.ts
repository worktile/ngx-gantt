import { GanttItem } from './item';

export class GanttDragEvent<T = unknown> {
    item: GanttItem<T>;
}

export class GanttLinkDragEvent<T = unknown> {
    source: GanttItem<T>;
    dependent?: GanttItem<T>;
}

export class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}

export class GanttLinkEvent<T = unknown> {
    event: MouseEvent;
    source: GanttItem<T>;
    dependent: GanttItem<T>;
}

export class GanttBarClickEvent<T = unknown> {
    event: Event;
    item: GanttItem<T>;
}
