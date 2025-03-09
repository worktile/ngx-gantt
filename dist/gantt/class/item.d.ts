import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';
import { GanttLink } from './link';
import { GanttViewType } from './view-type';
import { GanttView } from '../views/view';
export interface GanttItemRefs {
    width: number;
    x: number;
    y: number;
}
export declare enum GanttItemType {
    bar = "bar",
    range = "range",
    custom = "custom"
}
export interface GanttItem<T = unknown> {
    id: string;
    title: string;
    start?: number | Date;
    end?: number | Date;
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
export declare class GanttItemInternal {
    private view?;
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
    constructor(item: GanttItem, level: number, view?: GanttView);
    private fillDateWhenStartOrEndIsNil;
    updateRefs(refs: GanttItemRefs): void;
    updateDate(start: GanttDate, end: GanttDate): void;
    updateLevel(level: number): void;
    addChildren(items: GanttItem[]): void;
    setExpand(expanded: boolean): void;
    addLink(link: GanttLink): void;
}
