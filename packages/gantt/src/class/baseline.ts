import { BehaviorSubject } from 'rxjs';
import { GanttDate } from '../utils/date';
import { GanttItemRefs } from './item';

export interface GanttBaselineItem {
    id: string;
    start?: number;
    end?: number;
}

export class GanttBaselineItemInternal {
    id: string;
    start: GanttDate;
    end: GanttDate;
    origin: GanttBaselineItem;

    get refs() {
        return this.refs$.getValue();
    }

    refs$ = new BehaviorSubject<{ width: number; x: number; y: number }>(null);

    constructor(item: GanttBaselineItem) {
        this.origin = item;
        this.id = this.origin.id;
        this.start = item.start ? new GanttDate(item.start) : null;
        this.end = item.end ? new GanttDate(item.end) : null;
    }

    updateRefs(refs: GanttItemRefs) {
        this.refs$.next(refs);
    }
}
