import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';
import { GanttLink, GanttLinkType } from './link';

export interface GanttItemRefs {
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
    links?: (GanttLink | string)[];
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
    links: GanttLink[];
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
    fillDays?: number;

    get refs() {
        return this.refs$.getValue();
    }

    refs$ = new BehaviorSubject<{ width: number; x: number; y: number }>(null);

    constructor(item: GanttItem, options?: { fillDays: number }) {
        this.origin = item;
        this.id = this.origin.id;
        this.links = (this.origin.links || []).map((link) => {
            if (typeof link === 'string') {
                return {
                    type: GanttLinkType.fs,
                    link
                };
            } else {
                return link;
            }
        });
        this.color = this.origin.color;
        this.barStyle = this.origin.barStyle;
        this.linkable = this.origin.linkable === undefined ? true : this.origin.linkable;
        this.draggable = this.origin.draggable === undefined ? true : this.origin.draggable;
        this.expandable = this.origin.expandable || (this.origin.children || []).length > 0;
        this.expanded = this.origin.expanded === undefined ? false : this.origin.expanded;
        this.start = item.start ? new GanttDate(item.start) : null;
        this.end = item.end ? new GanttDate(item.end) : null;
        this.fillDays = options?.fillDays || 0;
        this.children = (item.children || []).map((subItem) => {
            return new GanttItemInternal(subItem, { fillDays: this.fillDays });
        });
        this.type = this.origin.type || GanttItemType.bar;
        this.progress = this.origin.progress;
        // fill days when start or end is null
        this.fillItemStartOrEnd(item);
    }

    fillItemStartOrEnd(item: GanttItem) {
        if (this.fillDays > 0) {
            const fillDays = this.fillDays - 1;
            if (item.start && !item.end) {
                this.end = new GanttDate(item.start).addDays(fillDays).endOfDay();
            }
            if (!item.start && item.end) {
                this.start = new GanttDate(item.end).addDays(-fillDays).startOfDay();
            }
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
            return new GanttItemInternal(subItem, { fillDays: this.fillDays });
        });
    }

    setExpand(expanded: boolean) {
        this.expanded = expanded;
        this.origin.expanded = expanded;
    }

    addLink(link: GanttLink) {
        this.links = [...this.links, link];
        this.origin.links = this.links;
    }
}
