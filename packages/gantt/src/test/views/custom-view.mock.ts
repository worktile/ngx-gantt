import {
    GanttDate,
    GanttViewTick,
    GanttView,
    GanttViewDate,
    GanttViewOptions,
    GanttViewType,
    eachDayOfInterval,
    PERIOD_TICK_TOP,
    UNIT_TICK_TOP
} from 'ngx-gantt';

const defaultViewOptions: GanttViewOptions = {
    unitWidth: 50,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month'
};

export class GanttViewCustom extends GanttView {
    override showNowIndicator = true;

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
        if (!this.options.showWeekend) {
            return this.getUnitWidth() * 5;
        } else {
            return this.getUnitWidth() * 7;
        }
    }

    getDayWidth(date: GanttDate): number {
        if (!this.options.showWeekend && date.isWeekend()) {
            return 0;
        }
        return this.unitWidth;
    }

    getPeriodTicks(): GanttViewTick[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        const dayInWeekMap = {
            '1': '周一',
            '2': '周二',
            '3': '周三',
            '4': '周四',
            '5': '周五',
            '6': '周六',
            '0': '周日'
        };
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const tick = new GanttViewTick(
                start,
                `${dayInWeekMap[start.getDay()]}`,
                i * this.getUnitWidth() + this.getUnitWidth() / 2,
                PERIOD_TICK_TOP,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            ticks.push(tick);
        }
        if (!this.options.showWeekend) {
            return ticks
                .filter((tick) => !tick.additions.isWeekend)
                .map((tick, i) => {
                    return { ...tick, x: i * this.getUnitWidth() + this.getUnitWidth() / 2 };
                });
        } else {
            return ticks;
        }
    }

    getUnitTicks(): GanttViewTick[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const tick = new GanttViewTick(
                start,
                `${start.format('MM/d')}`,
                i * this.getUnitWidth() + this.getUnitWidth() / 2,
                UNIT_TICK_TOP,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            ticks.push(tick);
        }

        if (!this.options.showWeekend) {
            return ticks
                .filter((tick) => !tick.additions.isWeekend)
                .map((tick, i) => {
                    return { ...tick, x: i * this.getUnitWidth() + this.getUnitWidth() / 2 };
                });
        } else {
            return ticks;
        }
    }
}
