import { GanttItemInfo } from './item';

export class GanttDragEvent {
    item: GanttItemInfo;
}

export class GanttDependencyDragEvent {
    source: GanttItemInfo;
    dependent?: GanttItemInfo;
}

export class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}

export class GanttDependencyEvent {
  event: MouseEvent;
  source: GanttItemInfo;
  dependent: GanttItemInfo;
}
