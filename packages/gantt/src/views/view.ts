import { differenceInCalendarDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { GanttViewType } from '../class';
import { GanttViewTick } from '../class/view-tick';
import { GanttDate, GanttDateUtil, differenceInDays } from '../utils/date';

export const PERIOD_TICK_TOP = '40%';

export const UNIT_TICK_TOP = '80%';

export interface GanttViewDate {
    date: GanttDate;
    isCustom?: boolean;
}

export interface GanttViewOptions {
    start?: GanttDate;
    end?: GanttDate;
    minBoundary?: GanttDate;
    maxBoundary?: GanttDate;
    unitWidth?: number;
    addAmount?: number;
    addUnit?: GanttDateUtil;
    tickFormats?: { period: string; unit: string };
    precisionUnit?: 'day' | 'hour' | 'minute';
    dragTooltipFormat?: string;
    holiday?: {
        isHoliday: (GanttDate) => boolean;
        hideHoliday: boolean;
    };
    // custom key and value
    [key: string]: any;
}

const defaultViewOptions: GanttViewOptions = {
    minBoundary: new GanttDate().addYears(-1).startOfYear(),
    maxBoundary: new GanttDate().addYears(1).endOfYear(),
    precisionUnit: 'day',
    dragTooltipFormat: 'MM-dd'
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

    periodTicks: GanttViewTick[];

    unitTicks: GanttViewTick[];

    width: number;

    unitWidth: number;

    periodWidth: number;

    showNowIndicator = true;

    options: GanttViewOptions;

    constructor(start: GanttViewDate, end: GanttViewDate, options: GanttViewOptions) {
        this.options = Object.assign({}, defaultViewOptions, options);

        const startDate = start.isCustom
            ? this.rangeStartOf(start.date)
            : this.rangeStartOf(start.date.value < this.options.start.value ? start.date : this.options.start);
        const endDate = end.isCustom
            ? this.rangeEndOf(end.date)
            : this.rangeEndOf(end.date.value > this.options.end.value ? end.date : this.options.end);
        this.start$ = new BehaviorSubject<GanttDate>(startDate);
        this.end$ = new BehaviorSubject<GanttDate>(endDate);

        this.recomputeLayout();
    }

    abstract rangeStartOf(date: GanttDate): GanttDate;

    abstract rangeEndOf(date: GanttDate): GanttDate;

    // 获取周期刻度合并后的宽度
    abstract getPeriodWidth(): number;

    // 获取当前视图下每一天占用的宽度
    abstract getDayWidth(date: GanttDate): number;

    // 获取一级时间刻度（坐标，显示名称）
    abstract getPeriodTicks(): GanttViewTick[];

    // 获取二级时间刻度（坐标，显示名称）
    abstract getUnitTicks(): GanttViewTick[];

    protected hideHoliday(date: GanttDate): boolean {
        return this.options.holiday?.hideHoliday && this.options.holiday?.isHoliday?.(date);
    }

    alignToPrecisionStart(date: GanttDate) {
        switch (this.options.precisionUnit) {
            case 'minute':
                return date.startOfMinute();
            case 'hour':
                return date.startOfHour();
            default:
                return date.startOfDay();
        }
    }

    alignToPrecisionEnd(date: GanttDate) {
        switch (this.options.precisionUnit) {
            case 'minute':
                return date.endOfMinute();
            case 'hour':
                return date.endOfHour();
            default:
                return date.endOfDay();
        }
    }

    calculateIntervalWidth(start: GanttDate, end: GanttDate) {
        let result = 0;
        const days = differenceInDays(end.value, start.value);
        for (let i = 0; i < Math.abs(days); i++) {
            result += this.getDayWidth(start.addDays(i));
        }
        result = days >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }

    protected recomputeLayout() {
        this.unitWidth = this.getUnitWidth();
        this.periodTicks = this.getPeriodTicks();
        this.unitTicks = this.getUnitTicks();
        this.width = this.getWidth();
        this.periodWidth = this.getPeriodWidth();
    }

    addStartDate() {
        const start = this.rangeStartOf(this.start.add(this.options.addAmount * -1, this.options.addUnit));
        if (start.value >= this.options.minBoundary.value) {
            const origin = this.start;
            this.start$.next(start);
            this.recomputeLayout();
            return { start: this.start, end: origin };
        }
        return null;
    }

    addEndDate() {
        const end = this.rangeEndOf(this.end.add(this.options.addAmount, this.options.addUnit));
        if (end.value <= this.options.maxBoundary.value) {
            const origin = this.end;

            this.end$.next(end);
            this.recomputeLayout();
            return { start: origin, end: this.end };
        }
        return null;
    }

    updateDate(start: GanttDate, end: GanttDate) {
        start = this.rangeStartOf(start);
        end = this.rangeEndOf(end);
        if (start.value < this.start.value) {
            this.start$.next(start);
        }
        if (end.value > this.end.value) {
            this.end$.next(end);
        }
        this.recomputeLayout();
    }

    // 获取View的宽度
    getWidth() {
        return this.getUnitWidth() * this.unitTicks.length;
    }

    // 获取单个网格的宽度
    getUnitWidth() {
        return this.options.unitWidth;
    }

    // 获取当前时间的X坐标
    getNowX(): number {
        const today = new GanttDate().startOfDay();
        if (today.value > this.start.value && today.value < this.end.value) {
            const x = this.getXAtDate(today) + this.getDayWidth(today) / 2;
            return x;
        } else {
            return null;
        }
    }

    // 获取指定时间的X坐标
    getXAtDate(date: GanttDate) {
        return this.calculateIntervalWidth(this.start, date);
    }

    // 根据X坐标获取对应时间
    getDateAtX(x: number) {
        const indexOfSecondaryDate = Math.max(Math.floor(x / this.getUnitWidth()), 0);
        const matchDate = this.unitTicks[Math.min(this.unitTicks.length - 1, indexOfSecondaryDate)];
        const dayWidth = this.getDayWidth(matchDate?.date);
        if (dayWidth === this.getUnitWidth()) {
            return matchDate?.date;
        } else {
            const day = Math.floor((x % this.getUnitWidth()) / dayWidth);
            return matchDate?.date.addDays(day);
        }
    }

    // 获取指定时间范围的宽度
    calculateRangeWidth(start: GanttDate, end: GanttDate) {
        // addSeconds(1) 是因为计算相差天会以一个整天来计算 end时间一般是59分59秒不是一个整天，所以需要加1
        return this.calculateIntervalWidth(this.alignToPrecisionStart(start), this.alignToPrecisionEnd(end).addSeconds(1));
    }

    // 根据日期精度获取最小时间范围的宽度
    getPrecisionUnitWidth(date: GanttDate) {
        switch (this.options.precisionUnit) {
            case 'minute':
                return this.getDayWidth(date) / 24 / 60;
            case 'hour':
                return this.getDayWidth(date) / 24;
            default:
                return this.getDayWidth(date);
        }
    }

    // 获取两个日期在当前可见时间轴上的索引差值
    getVisibleDateIndexOffset(start: GanttDate, end: GanttDate): number {
        switch (this.options.precisionUnit) {
            case 'minute':
                return differenceInMinutes(end.value, start.value);
            case 'hour':
                return differenceInHours(end.value, start.value);
            default:
                return differenceInCalendarDays(end.value, start.value);
        }
    }

    // 根据基准日期和索引偏移量，获取新的日期
    getDateByIndexOffset(baseDate: GanttDate, indexOffset: number): GanttDate {
        return baseDate.add(indexOffset, this.options.precisionUnit);
    }
}
