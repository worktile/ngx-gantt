import { GanttView, GanttViewOptions, GanttViewDate, PERIOD_TICK_TOP, UNIT_TICK_TOP } from './view';
import { GanttDate } from '../utils/date';
import { GanttViewTick } from '../class/view-tick';
import { eachYearOfInterval, differenceInCalendarYears } from 'date-fns';
import { GanttViewType } from '../class';
import { zhHantLocale } from '../i18n';

const defaultViewOptions: GanttViewOptions = {
    unitWidth: 480,
    start: new GanttDate().addYears(-2).startOfYear(),
    end: new GanttDate().addYears(2).endOfYear(),
    loadDuration: {
        amount: 1,
        unit: 'year'
    },
    tickFormats: {
        period: zhHantLocale.views.year.tickFormats.unit || '',
        unit: zhHantLocale.views.year.tickFormats.unit || ''
    }
};

export class GanttViewYear extends GanttView {
    override viewType = GanttViewType.year;

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
        return this.getUnitWidth();
    }

    getDayWidth(date: GanttDate): number {
        return this.unitWidth / date.getDaysInYear();
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
                    text: ``,
                    y: PERIOD_TICK_TOP,
                    x: rectX + periodWidth / 2
                }
            });
            ticks.push(tick);
        }
        return ticks;
    }

    getUnitTicks(): GanttViewTick[] {
        const years = differenceInCalendarYears(this.end.value, this.start.value);
        const ticks: GanttViewTick[] = [];
        const tickTop = '60%';
        const unitWidth = this.getUnitWidth();
        for (let i = 0; i <= years; i++) {
            const start = this.start.addYears(i);
            const rectX = i * unitWidth;
            const tick = new GanttViewTick({
                date: start,
                rect: {
                    x: rectX,
                    width: unitWidth
                },
                label: {
                    text: `${start.format(this.options.tickFormats?.unit || this.options.tickFormats?.period)}`,
                    y: tickTop,
                    x: rectX + unitWidth / 2
                }
            });
            ticks.push(tick);
        }
        return ticks;
    }
}
