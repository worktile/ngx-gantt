import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';

interface GanttItemRefs {
    width: number;
    x: number;
    y: number;
}

export interface GanttItem<T = unknown> {
    id: string;
    title: string;
    start?: number;
    end?: number;
    group_id?: string;
    links?: string[];
    color?: string;
    draggable?: boolean;
    linkable?: boolean;
    children?: GanttItem[];
    origin?: T;
}

export class GanttItemInternal {
    id: string;
    title: string;
    start: GanttDate;
    end: GanttDate;
    links: string[];
    origin: GanttItem;
    children: GanttItemInternal[];
    expand: boolean;
    get refs() {
        return this.refs$.getValue();
    }

    refs$ = new BehaviorSubject<{ width: number; x?: number; y?: number }>(null);

    constructor(item: GanttItem) {
        this.origin = item;
        this.id = this.origin.id;
        this.links = this.origin.links || [];
        this.start = new GanttDate(item.start);
        this.end = new GanttDate(item.end);
        this.children = (item.children || []).map((subItem) => {
            return new GanttItemInternal(subItem);
        });
    }

    updateRefs(refs: GanttItemRefs) {
        this.refs$.next(refs);
    }

    public updateDate(start: GanttDate, end: GanttDate) {
        this.start = start.startOfDay();
        this.end = end.endOfDay();
        this.origin.start = this.start.getUnixTime();
        this.origin.end = this.end.getUnixTime();
    }
}
