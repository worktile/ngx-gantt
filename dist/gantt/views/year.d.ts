import { GanttView, GanttViewOptions, GanttViewDate } from './view';
import { GanttDate } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';
import { GanttViewType } from '../class';
export declare class GanttViewYear extends GanttView {
    viewType: GanttViewType;
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions);
    viewStartOf(date: GanttDate): GanttDate;
    viewEndOf(date: GanttDate): GanttDate;
    getPrimaryWidth(): number;
    getDayOccupancyWidth(date: GanttDate): number;
    getPrimaryDatePoints(): GanttDatePoint[];
    getSecondaryDatePoints(): GanttDatePoint[];
}
