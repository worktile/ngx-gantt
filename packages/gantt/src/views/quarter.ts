import { GanttView, GanttViewOptions, GanttViewDate, UNIT_TICK_TOP, PERIOD_TICK_TOP } from './view';
import { GanttDate } from '../utils/date';
import { GanttViewTick } from '../class/view-tick';
import { eachYearOfInterval, differenceInCalendarQuarters } from 'date-fns';
import { GanttViewType } from '../class';
import { zhHantLocale } from '../i18n';

const defaultViewOptions: GanttViewOptions = {
    start: new GanttDate().addYears(-1).startOfYear(),
    end: new GanttDate().addYears(1).endOfYear(),
    minBoundary: new GanttDate().addYears(-2).startOfYear(),
    maxBoundary: new GanttDate().addYears(2).endOfYear(),
    unitWidth: 500,
    addAmount: 1,
    addUnit: 'year',
    tickFormats: {
        period: zhHantLocale.views.quarter.tickFormats.period,
        unit: zhHantLocale.views.quarter.tickFormats.unit
    }
};

export class GanttViewQuarter extends GanttView {
    override viewType = GanttViewType.quarter;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, defaultViewOptions, options));
    }

    rangeStartOf(date: GanttDate) {
        return date.startOfYear();
    }

    rangeEndOf(date: GanttDate) {
        return date.endOfYear();
    }

    getPeriodWidth() {
        return this.getUnitWidth() * 4;
    }

    getDayWidth(date: GanttDate): number {
        return this.unitWidth / date.getDaysInQuarter();
    }

    getPeriodTicks(): GanttViewTick[] {
        const years = eachYearOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        const periodWidth = this.getPeriodWidth();
        for (let i = 0; i < years.length; i++) {
            const start = new GanttDate(years[i]);
            const rectX = i * periodWidth;
            const tick = new GanttViewTick({
                date: start,
                rect: {
                    x: rectX,
                    width: periodWidth
                },
                label: {
                    text: `${start.format(this.options.tickFormats?.period)}`,
                    y: PERIOD_TICK_TOP,
                    x: rectX + periodWidth / 2
                }
            });
            ticks.push(tick);
        }
        return ticks;
    }

    getUnitTicks(): GanttViewTick[] {
        const quarters = differenceInCalendarQuarters(this.end.value, this.start.value);
        const ticks: GanttViewTick[] = [];
        const unitWidth = this.getUnitWidth();
        for (let i = 0; i <= quarters; i++) {
            const start = this.start.addQuarters(i);
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
