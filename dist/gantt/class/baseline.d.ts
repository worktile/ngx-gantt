import { BehaviorSubject } from 'rxjs';
import { GanttDate } from '../utils/date';
import { GanttItemRefs } from './item';
export interface GanttBaselineItem {
    id: string;
    start?: number;
    end?: number;
}
export declare class GanttBaselineItemInternal {
    id: string;
    start: GanttDate;
    end: GanttDate;
    origin: GanttBaselineItem;
    get refs(): {
        width: number;
        x: number;
        y: number;
    };
    refs$: BehaviorSubject<{
        width: number;
        x: number;
        y: number;
    }>;
    constructor(item: GanttBaselineItem);
    updateRefs(refs: GanttItemRefs): void;
}
