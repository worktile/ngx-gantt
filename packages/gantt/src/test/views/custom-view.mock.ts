import {
    GanttDate,
    GanttDatePoint,
    GanttView,
    GanttViewDate,
    GanttViewOptions,
    GanttViewType,
    eachDayOfInterval,
    primaryDatePointTop,
    secondaryDatePointTop
} from 'ngx-gantt';

const viewOptions: GanttViewOptions = {
    cellWidth: 50,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month'
};

export class GanttViewCustom extends GanttView {
    override showWeekBackdrop = true;

    override showTimeline = true;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    viewStartOf(date: GanttDate) {
        return date.startOfWeek();
    }

    viewEndOf(date: GanttDate) {
        return date.endOfWeek();
    }

    getPrimaryWidth() {
        if (!this.options.showWeekend) {
            return this.getCellWidth() * 5;
        } else {
            return this.getCellWidth() * 7;
        }
    }

    getDayOccupancyWidth(date: GanttDate): number {
        if (!this.options.showWeekend && date.isWeekend()) {
            return 0;
        }
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
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
            const point = new GanttDatePoint(
                start,
                `${dayInWeekMap[start.getDay()]}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                primaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            points.push(point);
        }
        if (!this.options.showWeekend) {
            return points
                .filter((point) => !point.additions.isWeekend)
                .map((point, i) => {
                    return { ...point, x: i * this.getCellWidth() + this.getCellWidth() / 2 };
                });
        } else {
            return points;
        }
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const point = new GanttDatePoint(
                start,
                `${start.format('MM/d')}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            points.push(point);
        }

        if (!this.options.showWeekend) {
            return points
                .filter((point) => !point.additions.isWeekend)
                .map((point, i) => {
                    return { ...point, x: i * this.getCellWidth() + this.getCellWidth() / 2 };
                });
        } else {
            return points;
        }
    }
}
