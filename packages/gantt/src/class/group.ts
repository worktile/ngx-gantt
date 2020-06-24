import { GanttItemInternal } from './item';

export interface GanttGroup<T = unknown> {
    id: string;
    title: string;
    expand?: boolean;
    origin?: T;
}

export class GanttGroupInternal {
    id: string;
    title: string;
    origin: GanttGroup;
    items: GanttItemInternal[];
    mergedItems: GanttItemInternal[][];
    expand: boolean;
    refs?: {
        height?: number;
    } = {};
    constructor(group: GanttGroup) {
        this.id = group.id;
        this.origin = group;
        this.title = group.title;
        this.expand = group.expand === undefined ? true : group.expand;
        this.items = [];
        this.mergedItems = [[]];
    }

    setExpand(expand: boolean) {
        this.expand = expand;
        this.origin.expand = expand;
    }
}
