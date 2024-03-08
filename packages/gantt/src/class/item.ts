import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';
import { GanttLink, GanttLinkType } from './link';
import { GanttViewType } from './view-type';
import { GanttView } from '../views/view';

const DEFAULT_FILL_INCREMENT_WIDTH = 120;

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
    itemDraggable?: boolean;
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
    start: GanttDate | null;
    end: GanttDate | null;
    links: GanttLink[];
    color?: string;
    barStyle?: Partial<CSSStyleDeclaration>;
    draggable?: boolean;
    itemDraggable?: boolean;
    linkable?: boolean;
    origin: GanttItem;
    expandable?: boolean;
    expanded?: boolean;
    loading: boolean;
    children: GanttItemInternal[];
    type?: GanttItemType;
    progress?: number;
    viewType?: GanttViewType;
    level: number;

    get refs() {
        return this.refs$.getValue();
    }

    refs$ = new BehaviorSubject<{ width: number; x: number; y: number }>(null as any);

    constructor(item: GanttItem, level: number, private view?: GanttView) {
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
        this.itemDraggable = this.origin.itemDraggable;
        this.expandable = this.origin.expandable || (this.origin.children || []).length > 0;
        this.expanded = this.origin.expanded === undefined ? false : this.origin.expanded;
        this.start = item.start ? new GanttDate(item.start) : null;
        this.end = item.end ? new GanttDate(item.end) : null;
        this.level = level;
        this.children = (item.children || []).map((subItem) => {
            return new GanttItemInternal(subItem, level + 1, view);
        });
        this.type = this.origin.type || GanttItemType.bar;
        this.progress = this.origin.progress;
        this.fillDateWhenStartOrEndIsNil(item);
    }

    private fillDateWhenStartOrEndIsNil(item: GanttItem) {
        if (this.view) {
            if (item.start && !item.end) {
                this.end = this.view.getDateByXPoint(this.view.getXPointByDate(new GanttDate(item.start)) + DEFAULT_FILL_INCREMENT_WIDTH);
            }
            if (!item.start && item.end) {
                this.start = this.view.getDateByXPoint(this.view.getXPointByDate(new GanttDate(item.end)) - DEFAULT_FILL_INCREMENT_WIDTH);
            }
        }
    }

    updateRefs(refs: GanttItemRefs) {
        this.refs$.next(refs);
    }

    updateDate(start: GanttDate, end: GanttDate) {
        this.start = start;
        this.end = end;
        this.origin.start = this.start.getUnixTime();
        this.origin.end = this.end.getUnixTime();
    }

    updateLevel(level: number) {
        this.level = level;
    }

    addChildren(items: GanttItem[]) {
        this.origin.children = items;
        this.children = (items || []).map((subItem) => {
            return new GanttItemInternal(subItem, this.level + 1, this.view);
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
