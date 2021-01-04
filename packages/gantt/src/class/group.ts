import { GanttItemInternal } from './item';

export interface GanttGroup<T = unknown> {
    id: string;
    title: string;
    expanded?: boolean;
    origin?: T;
    class?: string;
}

export class GanttGroupInternal {
    id: string;
    title: string;
    origin: GanttGroup;
    items: GanttItemInternal[];
    mergedItems: GanttItemInternal[][];
    expanded?: boolean;
    refs?: {
        height?: number;
    } = {};
    class?: string;
    constructor(group: GanttGroup) {
        this.id = group.id;
        this.origin = group;
        this.title = group.title;
        this.expanded = group.expanded === undefined ? true : group.expanded;
        this.items = [];
        this.mergedItems = [[]];
        this.class = group.class || '';
    }

    setExpand(expanded: boolean) {
        this.expanded = expanded;
        this.origin.expanded = expanded;
    }
}
