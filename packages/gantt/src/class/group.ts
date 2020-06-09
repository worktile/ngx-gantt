import { GanttItemInternal } from './item';

export interface GanttGroup<T = unknown> {
    id: string;
    title: string;
    origin?: T;
}

export class GanttGroupInternal {
    id: string;
    title: string;
    origin: GanttGroup;
    items: GanttItemInternal[];
    mergedItems: GanttItemInternal[][];
    expand = true;
    refs?: {
        height?: number;
    } = {};
    constructor(group: GanttGroup) {
        this.id = group.id;
        this.origin = group;
        this.title = group.title;
        this.items = [];
        this.mergedItems = [[]];
    }
}
