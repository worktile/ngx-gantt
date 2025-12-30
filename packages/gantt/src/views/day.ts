import { GanttViewType } from '../class';
import { GanttViewTick } from '../class/view-tick';
import { zhHantLocale } from '../i18n';
import { differenceInCalendarDays, eachDayOfInterval, eachWeekOfInterval, GanttDate } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions, PERIOD_TICK_TOP, UNIT_TICK_TOP } from './view';

const defaultViewOptions: GanttViewOptions = {
    unitWidth: 35,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month',
    tickFormats: {
        period: zhHantLocale.views.day.tickFormats.period,
        unit: zhHantLocale.views.day.tickFormats.unit
    }
};

export class GanttViewDay extends GanttView {
    override showNowIndicator = false;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, defaultViewOptions, options));
    }

    rangeStartOf(date: GanttDate) {
        return date.startOfWeek();
    }

    rangeEndOf(date: GanttDate) {
        return date.endOfWeek();
    }

    getPeriodWidth() {
        return this.getUnitWidth() * 7;
    }

    getDayWidth(date: GanttDate): number {
        if (this.hideHoliday(date)) {
            return 0;
        }
        return this.unitWidth;
    }

    getPeriodTicks(): GanttViewTick[] {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const ticks: GanttViewTick[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const weekEnd = weekStart.addWeeks(1);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const tickWidth = this.calculateIntervalWidth(weekStart, weekEnd);
            const lastTick = ticks[ticks.length - 1];
            const tick = new GanttViewTick(
                weekStart,
                weekStart.addWeeks(increaseWeek).format(this.options.tickFormats?.period),
                tickWidth / 2 + (lastTick?.rightX || 0),
                PERIOD_TICK_TOP
            );

            tick.leftX = lastTick?.rightX || 0;
            tick.rightX = tick.leftX + tickWidth;
            ticks.push(tick);
        }
        return ticks;
    }

    getUnitTicks(): GanttViewTick[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value }).filter(
            (day) => !this.hideHoliday(new GanttDate(day))
        );
        const ticks: GanttViewTick[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const tick = new GanttViewTick(
                start,
                start.format(this.options.tickFormats?.unit) || start.getDate().toString(),
                i * this.getUnitWidth() + this.getUnitWidth() / 2,
                UNIT_TICK_TOP,
                {
                    isWeekend: start.isWeekend(),
                    isToday: start.isToday()
                }
            );
            ticks.push(tick);
        }
        return ticks;
    }

    // 获取两个日期在当前可见时间轴上的索引差值
    override getVisibleDateIndexOffset(start: GanttDate, end: GanttDate): number {
        const startTime = this.alignToPrecisionStart(start).value;
        const endTime = this.alignToPrecisionStart(end).value;

        const startIndex = this.unitTicks.findIndex((tick) => tick.start.value >= startTime);
        const endIndex = this.unitTicks.findIndex((tick) => tick.start.value >= endTime);

        if (startIndex !== -1 && endIndex !== -1) {
            return endIndex - startIndex;
        }
        return differenceInCalendarDays(endTime, startTime);
    }

    // 根据基准日期和索引偏移量，获取新的日期
    override getDateByIndexOffset(baseDate: GanttDate, indexOffset: number): GanttDate {
        const baseTime = this.alignToPrecisionStart(baseDate).value;
        const baseIndex = this.unitTicks.findIndex((tick) => tick.start.value >= baseTime);
        if (baseIndex !== -1) {
            const targetIndex = baseIndex + indexOffset;
            const safeIndex = Math.max(0, Math.min(targetIndex, this.unitTicks.length - 1));
            return this.unitTicks[safeIndex].start;
        }
        return baseDate.addDays(indexOffset);
    }
}
