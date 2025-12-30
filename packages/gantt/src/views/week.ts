import { GanttViewType } from '../class';
import { GanttViewTick } from '../class/view-tick';
import { eachWeekOfInterval, GanttDate } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions, PERIOD_TICK_TOP, UNIT_TICK_TOP } from './view';
import { zhHantLocale } from '../i18n';

const defaultViewOptions: GanttViewOptions = {
    unitWidth: 280,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month',
    tickFormats: {
        period: zhHantLocale.views.week.tickFormats.period,
        unit: zhHantLocale.views.week.tickFormats.unit
    }
};

export class GanttViewWeek extends GanttView {
    override viewType = GanttViewType.week;

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
        return this.getUnitWidth();
    }

    getDayWidth(): number {
        return this.unitWidth / 7;
    }

    getPeriodTicks(): GanttViewTick[] {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const ticks: GanttViewTick[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const tick = new GanttViewTick(
                weekStart,
                weekStart.addWeeks(increaseWeek).format(this.options.tickFormats?.period),
                this.getUnitWidth() / 2 + i * this.getUnitWidth(),
                PERIOD_TICK_TOP
            );
            ticks.push(tick);
        }
        return ticks;
    }

    getUnitTicks(): GanttViewTick[] {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const ticks: GanttViewTick[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const start = new GanttDate(weeks[i]);
            const tick = new GanttViewTick(
                start,
                `${start.format(this.options.tickFormats?.unit)}`,
                i * this.getUnitWidth() + this.getUnitWidth() / 2,
                UNIT_TICK_TOP
            );
            ticks.push(tick);
        }
        return ticks;
    }
}
