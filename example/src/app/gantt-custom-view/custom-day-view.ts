import {
    GanttView,
    GanttViewOptions,
    PERIOD_TICK_TOP,
    UNIT_TICK_TOP,
    GanttViewDate,
    GanttDate,
    eachDayOfInterval,
    GanttViewTick,
    GanttViewType
} from 'ngx-gantt';

const defaultViewOptions: GanttViewOptions = {
    unitWidth: 50,
    start: new GanttDate().startOfMonth().startOfWeek({ weekStartsOn: 1 }),
    end: new GanttDate().endOfMonth().endOfWeek({ weekStartsOn: 1 }),
    addAmount: 1,
    addUnit: 'month',
    fillDays: 1
};

export class GanttViewCustom extends GanttView {
    override showNowIndicator = true;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, defaultViewOptions, options));
    }

    rangeStartOf(date: GanttDate) {
        return date.startOfWeek({ weekStartsOn: 1 });
    }

    rangeEndOf(date: GanttDate) {
        return date.endOfWeek({ weekStartsOn: 1 });
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
        const periodWidth = this.getPeriodWidth();
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const rectX = i * periodWidth;
            const tick = new GanttViewTick({
                date: start,
                rect: {
                    x: rectX,
                    width: periodWidth,
                    background: isWeekend ? '#f5f5f5' : undefined
                },
                label: {
                    text: `${dayInWeekMap[start.getDay()]}`,
                    y: PERIOD_TICK_TOP,
                    x: rectX + periodWidth / 2,
                    style: isWeekend || start.isToday() ? { color: '#ff9f73' } : undefined
                },
                metadata: {
                    isWeekend,
                    isToday: start.isToday()
                }
            });
            ticks.push(tick);
        }
        if (!this.options.showWeekend) {
            return ticks
                .filter((tick) => !tick.metadata?.isWeekend)
                .map((tick, i) => {
                    const unitWidth = this.getUnitWidth();
                    const rectX = i * unitWidth;
                    return new GanttViewTick({
                        date: tick.date,
                        rect: {
                            ...tick.rect,
                            x: rectX,
                            width: unitWidth
                        },
                        label: {
                            ...tick.label,
                            x: rectX + unitWidth / 2
                        },
                        metadata: tick.metadata
                    });
                });
        } else {
            return ticks;
        }
    }

    getUnitTicks(): GanttViewTick[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const ticks: GanttViewTick[] = [];
        const unitWidth = this.getUnitWidth();
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const rectX = i * unitWidth;
            const tick = new GanttViewTick({
                date: start,
                rect: {
                    x: rectX,
                    width: unitWidth,
                    background: isWeekend ? '#f5f5f5' : undefined
                },
                label: {
                    text: `${start.format('MM/d')}`,
                    y: UNIT_TICK_TOP,
                    x: rectX + unitWidth / 2,
                    style: isWeekend || start.isToday() ? { color: '#ff9f73' } : undefined
                },
                metadata: {
                    isWeekend,
                    isToday: start.isToday()
                }
            });
            ticks.push(tick);
        }

        if (!this.options.showWeekend) {
            return ticks
                .filter((tick) => !tick.metadata?.isWeekend)
                .map((tick, i) => {
                    const rectX = i * unitWidth;
                    return new GanttViewTick({
                        date: tick.date,
                        rect: {
                            ...tick.rect,
                            x: rectX,
                            width: unitWidth
                        },
                        label: {
                            ...tick.label,
                            x: rectX + unitWidth / 2
                        },
                        metadata: tick.metadata
                    });
                });
        } else {
            return ticks;
        }
    }
}
