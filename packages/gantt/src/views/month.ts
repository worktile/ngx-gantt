import { GanttView, GanttViewOptions, GanttViewDate, UNIT_TICK_TOP, PERIOD_TICK_TOP } from './view';
import { GanttDate, differenceInCalendarQuarters, eachMonthOfInterval } from '../utils/date';
import { GanttViewTick } from '../class/view-tick';
import { GanttViewType } from '../class';
import { zhHantLocale } from '../i18n';

const defaultViewOptions: GanttViewOptions = {
    start: new GanttDate().startOfQuarter().addQuarters(-1),
    end: new GanttDate().endOfQuarter().addQuarters(2),
    unitWidth: 280,
    addAmount: 1,
    addUnit: 'quarter',
    tickFormats: {
        period: zhHantLocale.views.month.tickFormats.period,
        unit: zhHantLocale.views.month.tickFormats.unit
    }
};

export class GanttViewMonth extends GanttView {
    override viewType = GanttViewType.month;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, defaultViewOptions, options));
    }

    rangeStartOf(date: GanttDate) {
        return date.startOfQuarter();
    }

    rangeEndOf(date: GanttDate) {
        return date.endOfQuarter();
    }

    getPeriodWidth() {
        return this.getUnitWidth() * 3;
    }

    getDayWidth(date: GanttDate): number {
        return this.unitWidth / date.getDaysInMonth();
    }

    getPeriodTicks(): GanttViewTick[] {
        const quarters = differenceInCalendarQuarters(this.end.addSeconds(1).value, this.start.value);
        const ticks: GanttViewTick[] = [];
        const periodWidth = this.getPeriodWidth();
        for (let i = 0; i < quarters; i++) {
            const start = this.start.addQuarters(i);
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
        const months = eachMonthOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        const unitWidth = this.getUnitWidth();
        for (let i = 0; i < months.length; i++) {
            const start = new GanttDate(months[i]);
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
                }
            });
            ticks.push(tick);
        }
        return ticks;
    }
}
