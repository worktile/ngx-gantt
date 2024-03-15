import { differenceInCalendarDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { GanttDateFormat, defaultConfig } from '../gantt.config';
import { GanttDate, GanttDateUtil, differenceInDays } from '../utils/date';

export const primaryDatePointTop = '40%';

export const secondaryDatePointTop = '80%';

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
    dateFormat?: GanttDateFormat;
    datePrecisionUnit?: 'day' | 'hour' | 'minute';
    dragPreviewDateFormat?: string;
    // custom key and value
    [key: string]: any;
}

const viewOptions: GanttViewOptions = {
    min: new GanttDate().addYears(-1).startOfYear(),
    max: new GanttDate().addYears(1).endOfYear(),
    dateFormat: defaultConfig.dateFormat,
    datePrecisionUnit: 'day',
    dragPreviewDateFormat: 'MM-dd'
};

export abstract class GanttView {
    viewType: GanttViewType;

    start$: BehaviorSubject<GanttDate>;

    end$: BehaviorSubject<GanttDate>;

    get start() {
        return this.start$.getValue();
    }

    get end() {
        return this.end$.getValue();
    }

    primaryDatePoints: GanttDatePoint[];

    secondaryDatePoints: GanttDatePoint[];

    width: number;

    cellWidth: number;

    primaryWidth: number;

    showTimeline = true;

    showWeekBackdrop: boolean;

    options: GanttViewOptions;

    constructor(start: GanttViewDate, end: GanttViewDate, options: GanttViewOptions) {
        this.options = Object.assign({}, viewOptions, options);
        const startDate = start.isCustom
            ? this.viewStartOf(start.date)
            : this.viewStartOf(start.date.value < this.options.start.value ? start.date : this.options.start);
        const endDate = end.isCustom
            ? this.viewEndOf(end.date)
            : this.viewEndOf(end.date.value > this.options.end.value ? end.date : this.options.end);
        this.start$ = new BehaviorSubject<GanttDate>(startDate);
        this.end$ = new BehaviorSubject<GanttDate>(endDate);
        this.initialize();
    }

    abstract viewStartOf(date: GanttDate): GanttDate;

    abstract viewEndOf(date: GanttDate): GanttDate;

    /**
     * deprecated, please use viewStartOf()
     * @deprecated
     */
    startOf(date: GanttDate): GanttDate {
        return this.viewStartOf(date);
    }

    /**
     * deprecated, please use viewEndOf()
     * @deprecated
     */
    endOf(date: GanttDate): GanttDate {
        return this.viewEndOf(date);
    }

    // 获取一级时间网格合并后的宽度
    abstract getPrimaryWidth(): number;

    // 获取当前视图下每一天占用的宽度
    abstract getDayOccupancyWidth(date: GanttDate): number;

    // 获取一级时间点（坐标，显示名称）
    abstract getPrimaryDatePoints(): GanttDatePoint[];

    // 获取二级时间点（坐标，显示名称）
    abstract getSecondaryDatePoints(): GanttDatePoint[];

    startOfPrecision(date: GanttDate) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return date.startOfMinute();
            case 'hour':
                return date.startOfHour();
            default:
                return date.startOfDay();
        }
    }

    endOfPrecision(date: GanttDate) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return date.endOfMinute();
            case 'hour':
                return date.endOfHour();
            default:
                return date.endOfDay();
        }
    }

    differenceByPrecisionUnit(dateLeft: GanttDate, dateRight: GanttDate) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return differenceInMinutes(dateLeft.value, dateRight.value);
            case 'hour':
                return differenceInHours(dateLeft.value, dateRight.value);
            default:
                return differenceInCalendarDays(dateLeft.value, dateRight.value);
        }
    }

    getDateIntervalWidth(start: GanttDate, end: GanttDate) {
        let result = 0;
        const days = differenceInDays(end.value, start.value);
        for (let i = 0; i < Math.abs(days); i++) {
            result += this.getDayOccupancyWidth(start.addDays(i));
        }
        result = days >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }

    protected initialize() {
        this.primaryDatePoints = this.getPrimaryDatePoints();
        this.secondaryDatePoints = this.getSecondaryDatePoints();
        this.width = this.getWidth();
        this.cellWidth = this.getCellWidth();
        this.primaryWidth = this.getPrimaryWidth();
    }

    addStartDate() {
        const start = this.viewStartOf(this.start.add(this.options.addAmount * -1, this.options.addUnit));
        if (start.value >= this.options.min.value) {
            const origin = this.start;
            this.start$.next(start);
            this.initialize();
            return { start: this.start, end: origin };
        }
        return null;
    }

    addEndDate() {
        const end = this.viewEndOf(this.end.add(this.options.addAmount, this.options.addUnit));
        if (end.value <= this.options.max.value) {
            const origin = this.end;
            this.end$.next(end);
            this.initialize();
            return { start: origin, end: this.end };
        }
        return null;
    }

    updateDate(start: GanttDate, end: GanttDate) {
        start = this.viewStartOf(start);
        end = this.viewEndOf(end);
        if (start.value < this.start.value) {
            this.start$.next(start);
        }
        if (end.value > this.end.value) {
            this.end$.next(end);
        }
        this.initialize();
    }

    // 获取View的宽度
    getWidth() {
        return this.getCellWidth() * this.secondaryDatePoints.length;
    }

    // 获取单个网格的宽度
    getCellWidth() {
        return this.options.cellWidth;
    }

    // 获取当前时间的X坐标
    getTodayXPoint(): number {
        const toady = new GanttDate().startOfDay();
        if (toady.value > this.start.value && toady.value < this.end.value) {
            const x = this.getXPointByDate(toady) + this.getDayOccupancyWidth(toady) / 2;
            return x;
        } else {
            return null;
        }
    }

    // 获取指定时间的X坐标
    getXPointByDate(date: GanttDate) {
        return this.getDateIntervalWidth(this.start, date);
    }

    // 根据X坐标获取对应时间
    getDateByXPoint(x: number) {
        const indexOfSecondaryDate = Math.max(Math.floor(x / this.getCellWidth()), 0);
        const matchDate = this.secondaryDatePoints[Math.min(this.secondaryDatePoints.length - 1, indexOfSecondaryDate)];
        const dayWidth = this.getDayOccupancyWidth(matchDate?.start);
        if (dayWidth === this.getCellWidth()) {
            return matchDate?.start;
        } else {
            const day = Math.floor((x % this.getCellWidth()) / dayWidth);
            return matchDate?.start.addDays(day);
        }
    }

    // 获取指定时间范围的宽度
    getDateRangeWidth(start: GanttDate, end: GanttDate) {
        // addSeconds(1) 是因为计算相差天会以一个整天来计算 end时间一般是59分59秒不是一个整天，所以需要加1
        return this.getDateIntervalWidth(this.startOfPrecision(start), this.endOfPrecision(end).addSeconds(1));
    }

    // 根据日期精度获取最小时间范围的宽度
    getMinRangeWidthByPrecisionUnit(date: GanttDate) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return this.getDayOccupancyWidth(date) / 24 / 60;
            case 'hour':
                return this.getDayOccupancyWidth(date) / 24;
            default:
                return this.getDayOccupancyWidth(date);
        }
    }
}
