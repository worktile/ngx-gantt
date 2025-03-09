import { BehaviorSubject } from 'rxjs';
import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { GanttDateFormat } from '../gantt.config';
import { GanttDate, GanttDateUtil } from '../utils/date';
export declare const primaryDatePointTop = "40%";
export declare const secondaryDatePointTop = "80%";
export interface GanttViewDate {
    date: GanttDate;
    isCustom?: boolean;
}
export interface GanttViewOptions {
    start?: GanttDate;
    end?: GanttDate;
    min?: GanttDate;
    max?: GanttDate;
    cellWidth?: number;
    addAmount?: number;
    addUnit?: GanttDateUtil;
    /** @deprecated dateFormat is deprecated, please use dateDisplayFormats or setting i18n locale */
    dateFormat?: GanttDateFormat;
    dateDisplayFormats?: {
        primary?: string;
        secondary?: string;
    };
    datePrecisionUnit?: 'day' | 'hour' | 'minute';
    dragPreviewDateFormat?: string;
    [key: string]: any;
}
export declare abstract class GanttView {
    viewType: GanttViewType;
    start$: BehaviorSubject<GanttDate>;
    end$: BehaviorSubject<GanttDate>;
    get start(): GanttDate;
    get end(): GanttDate;
    primaryDatePoints: GanttDatePoint[];
    secondaryDatePoints: GanttDatePoint[];
    width: number;
    cellWidth: number;
    primaryWidth: number;
    showTimeline: boolean;
    showWeekBackdrop: boolean;
    options: GanttViewOptions;
    dateFormats: {
        primary?: string;
        secondary?: string;
    };
    constructor(start: GanttViewDate, end: GanttViewDate, options: GanttViewOptions);
    abstract viewStartOf(date: GanttDate): GanttDate;
    abstract viewEndOf(date: GanttDate): GanttDate;
    /**
     * deprecated, please use viewStartOf()
     * @deprecated
     */
    startOf(date: GanttDate): GanttDate;
    /**
     * deprecated, please use viewEndOf()
     * @deprecated
     */
    endOf(date: GanttDate): GanttDate;
    abstract getPrimaryWidth(): number;
    abstract getDayOccupancyWidth(date: GanttDate): number;
    abstract getPrimaryDatePoints(): GanttDatePoint[];
    abstract getSecondaryDatePoints(): GanttDatePoint[];
    startOfPrecision(date: GanttDate): GanttDate;
    endOfPrecision(date: GanttDate): GanttDate;
    differenceByPrecisionUnit(dateLeft: GanttDate, dateRight: GanttDate): number;
    getDateIntervalWidth(start: GanttDate, end: GanttDate): number;
    protected initialize(): void;
    addStartDate(): {
        start: GanttDate;
        end: GanttDate;
    };
    addEndDate(): {
        start: GanttDate;
        end: GanttDate;
    };
    updateDate(start: GanttDate, end: GanttDate): void;
    getWidth(): number;
    getCellWidth(): number;
    getTodayXPoint(): number;
    getXPointByDate(date: GanttDate): number;
    getDateByXPoint(x: number): GanttDate;
    getDateRangeWidth(start: GanttDate, end: GanttDate): number;
    getMinRangeWidthByPrecisionUnit(date: GanttDate): number;
}
