import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';

interface GanttItemRefs {
    width: number;
    x: number;
    y: number;
}

export enum GanttItemType {
    bar = 'bar',
    range = 'range',
    custom = 'custom'
}

export interface GanttItem<T = unknown> {
    id: string;
    title: string;
    start?: number;
    end?: number;
    group_id?: string;
    links?: string[];
    draggable?: boolean;
    linkable?: boolean;
    expandable?: boolean;
    expanded?: boolean;
    children?: GanttItem[];
    color?: string;
    barStyle?: Partial<CSSStyleDeclaration>;
    origin?: T;
    type?: GanttItemType;
    progress?: number;
}

export class GanttItemInternal {
    id: string;
    title: string;
    start: GanttDate;
    end: GanttDate;
    links: string[];
    color?: string;
    barStyle?: Partial<CSSStyleDeclaration>;
    draggable?: boolean;
    linkable?: boolean;
    origin: GanttItem;
    expandable?: boolean;
    expanded?: boolean;
    loading: boolean;
    children: GanttItemInternal[];
    type?: GanttItemType;
    progress?: number;

    get refs() {
        return this.refs$.getValue();
    }

    refs$ = new BehaviorSubject<{ width: number; x?: number; y?: number }>(null);

    constructor(item: GanttItem) {
        this.origin = item;
        this.id = this.origin.id;
        this.links = this.origin.links || [];
        this.color = this.origin.color;
        this.barStyle = this.origin.barStyle;
        this.linkable = this.origin.linkable === undefined ? true : this.origin.linkable;
        this.draggable = this.origin.draggable === undefined ? true : this.origin.draggable;
        this.expandable = this.origin.expandable || (this.origin.children || []).length > 0;
        this.expanded = this.origin.expanded === undefined ? false : this.origin.expanded;
        this.start = item.start ? new GanttDate(item.start) : null;
        this.end = item.end ? new GanttDate(item.end) : null;
        this.children = (item.children || []).map((subItem) => {
            return new GanttItemInternal(subItem);
        });
        this.type = this.origin.type || GanttItemType.bar;
        this.progress = this.origin.progress;
        // fill one month when start or end is null
        if (item.start && !item.end) {
            this.end = new GanttDate(item.start).addMonths(1).endOfDay();
        }
        if (!item.start && item.end) {
            this.start = new GanttDate(item.end).addMonths(-1).startOfDay();
        }
    }

    updateRefs(refs: GanttItemRefs) {
        this.refs$.next(refs);
    }

    updateDate(start: GanttDate, end: GanttDate) {
        this.start = start.startOfDay();
        this.end = end.endOfDay();
        this.origin.start = this.start.getUnixTime();
        this.origin.end = this.end.getUnixTime();
    }

    addChildren(items: GanttItem[]) {
        this.origin.children = items;
        this.children = (items || []).map((subItem) => {
            return new GanttItemInternal(subItem);
        });
    }

    setExpand(expanded: boolean) {
        this.expanded = expanded;
        this.origin.expanded = expanded;
    }

    addLink(linkId: string) {
        this.links = [...this.links, linkId];
        this.origin.links = this.links;
    }
}
