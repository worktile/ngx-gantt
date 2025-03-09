import { GanttItemInternal } from './item';
export interface GanttGroup<T = unknown> {
    id: string;
    title: string;
    expanded?: boolean;
    origin?: T;
    class?: string;
}
export declare class GanttGroupInternal {
    id: string;
    title: string;
    origin: GanttGroup;
    items: GanttItemInternal[];
    mergedItems: GanttItemInternal[][];
    expanded?: boolean;
    refs?: {
        height?: number;
    };
    class?: string;
    constructor(group: GanttGroup);
    setExpand(expanded: boolean): void;
}
