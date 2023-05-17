import { GanttDate } from '../utils/date';
import { GanttItem } from './item';

export enum GanttLinkType {
    fs = 1,
    ff = 2,
    ss = 3,
    sf = 4
}

export enum GanttLinkLineType {
    curve = 'curve',
    straight = 'straight'
}

export enum LinkColors {
    default = '#cacaca',
    blocked = '#FF7575',
    active = '#6698ff'
}

export interface GanttLink {
    type: GanttLinkType;
    link: string;
    color?: { default: string; active?: string } | string;
}

export interface GanttLinkItem {
    id: string;
    before: { x: number; y: number };
    after: { x: number; y: number };
    start: GanttDate;
    end: GanttDate;
    origin: GanttItem;
    links: GanttLink[];
}

export interface LinkInternal {
    path: string;
    source: GanttItem;
    target: GanttItem;
    type: GanttLinkType;
    color: string;
    defaultColor?: string;
    activeColor?: string;
}

export interface GanttLinkOptions {
    dependencyTypes?: GanttLinkType[];
    showArrow?: boolean;
    lineType?: GanttLinkLineType;
}
