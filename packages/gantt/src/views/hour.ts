import { zhHantLocale } from '../i18n';
import { GanttViewType } from '../class';
import { GanttViewTick } from '../class/view-tick';
import { GanttDate, differenceInMinutes, eachDayOfInterval, eachHourOfInterval } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions, PERIOD_TICK_TOP, UNIT_TICK_TOP } from './view';

const defaultViewOptions: GanttViewOptions = {
    unitWidth: 80,
    start: new GanttDate().startOfMonth(),
    end: new GanttDate().endOfMonth(),
    precisionUnit: 'minute',
    loadDuration: {
        amount: 1,
        unit: 'week'
    },
    tickFormats: {
        period: zhHantLocale.views.hour.tickFormats.period,
        unit: zhHantLocale.views.hour.tickFormats.unit
    },
    dragTooltipFormat: 'HH:mm'
};

export class GanttViewHour extends GanttView {
    override showNowIndicator = true;

    override viewType = GanttViewType.hour;

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
        return this.getUnitWidth() * 24;
    }

    getDayWidth(): number {
        return this.unitWidth * 60;
    }

    private getHourOccupancyWidth() {
        return this.getDayWidth() / 60;
    }

    getPeriodTicks(): GanttViewTick[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        const periodWidth = this.getPeriodWidth();
        for (let i = 0; i < days.length; i++) {
            const start = this.start.addDays(i);
            const rectX = i * periodWidth;
            const tick = new GanttViewTick({
                date: start,
                rect: {
                    x: rectX,
                    width: periodWidth
                },
                label: {
                    text: start.format(this.options.tickFormats?.period),
                    y: PERIOD_TICK_TOP,
                    x: rectX + periodWidth / 2
                }
            });
            ticks.push(tick);
        }

        return ticks;
    }

    getUnitTicks(): GanttViewTick[] {
        const hours = eachHourOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        const unitWidth = this.getUnitWidth();
        for (let i = 0; i < hours.length; i++) {
            const start = new GanttDate(hours[i]);
            const rectX = i * unitWidth;
            const tick = new GanttViewTick({
                date: start,
                rect: {
                    x: rectX,
                    width: unitWidth
                },
                label: {
                    text: start.format(this.options.tickFormats?.unit),
                    y: UNIT_TICK_TOP,
                    x: rectX + unitWidth / 2
                },
                metadata: {
                    isWeekend: start.isWeekend(),
                    isToday: start.isToday()
                }
            });
            ticks.push(tick);
        }
        return ticks;
    }

    override getNowX(): number {
        const today = new GanttDate().startOfMinute();
        if (today.value > this.start.value && today.value < this.end.value) {
            const x = this.getXAtDate(today);
            return x;
        } else {
            return null;
        }
    }

    override calculateIntervalWidth(start: GanttDate, end: GanttDate) {
        let result = 0;
        const minutes = differenceInMinutes(end.value, start.value);
        for (let i = 0; i < minutes; i++) {
            result += this.getHourOccupancyWidth() / 60;
        }
        result = minutes >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }

    override getDateAtX(x: number) {
        const hourWidth = this.getHourOccupancyWidth();
        const indexOfSecondaryDate = Math.max(Math.floor(x / hourWidth), 0);
        const matchDate = this.unitTicks[Math.min(this.unitTicks.length - 1, indexOfSecondaryDate)];
        const minuteWidth = hourWidth / 60;
        const underOneHourMinutes = Math.floor((x % hourWidth) / minuteWidth);
        return matchDate?.date.addMinutes(underOneHourMinutes);
    }
}
