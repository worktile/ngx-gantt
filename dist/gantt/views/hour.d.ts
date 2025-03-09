import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { GanttDate } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions } from './view';
export declare class GanttViewHour extends GanttView {
    showWeekBackdrop: boolean;
    showTimeline: boolean;
    viewType: GanttViewType;
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions);
    viewStartOf(date: GanttDate): GanttDate;
    viewEndOf(date: GanttDate): GanttDate;
    getPrimaryWidth(): number;
    getDayOccupancyWidth(): number;
    private getHourOccupancyWidth;
    getPrimaryDatePoints(): GanttDatePoint[];
    getSecondaryDatePoints(): GanttDatePoint[];
    getTodayXPoint(): number;
    getDateIntervalWidth(start: GanttDate, end: GanttDate): number;
    getDateByXPoint(x: number): GanttDate;
}
