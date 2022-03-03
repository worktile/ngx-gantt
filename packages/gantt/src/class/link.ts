import { GanttDate } from '../utils/date';
import { GanttItem } from './item';

export enum GanttLinkType {
    fs = 1,
    ff = 2,
    ss = 3,
    sf = 4
}

export enum GanttLinkPathType {
    curve = 'curve',
    line = 'line'
}

export enum LinkColors {
    default = '#cacaca',
    blocked = '#FF7575',
    active = '#348FE4'
}

export interface GanttLink {
    type: GanttLinkType;
    link: string;
    color?: string;
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
    color: string;
    type: GanttLinkType;
}

export interface GanttLinkOptions {
    dependencyTypes?: [GanttLinkType.fs];
    showArrow?: false;
    linkPathType?: GanttLinkPathType.curve;
}
