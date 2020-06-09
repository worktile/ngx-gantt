import { GanttItem } from './item';

export class GanttDragEvent {
    item: GanttItem;
}

export class GanttLinkDragEvent {
    source: GanttItem;
    target?: GanttItem;
}

export class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}

export class GanttLinkEvent {
    event: MouseEvent;
    source: GanttItem;
    target: GanttItem;
}

export class GanttBarClickEvent {
    event: Event;
    item: GanttItem;
}
