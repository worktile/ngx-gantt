import { GanttView, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop, GanttViewDate } from './view';
import { GanttDate, differenceInCalendarQuarters, eachMonthOfInterval } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';

const viewOptions: GanttViewOptions = {
    start: new GanttDate().startOfQuarter().addQuarters(-1),
    end: new GanttDate().endOfQuarter().addQuarters(2),
    cellWidth: 280,
    addAmount: 1,
    addUnit: 'quarter'
};

export class GanttViewMonth extends GanttView {
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfQuarter();
    }

    endOf(date: GanttDate) {
        return date.endOfQuarter();
    }

    getPrimaryWidth() {
        return this.getCellWidth() * 3;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth / date.getDaysInMonth();
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const quarters = differenceInCalendarQuarters(this.end.addSeconds(1).value, this.start.value);
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < quarters; i++) {
            const start = this.start.addQuarters(i);
            const point = new GanttDatePoint(
                start,
                start.format('yyyy年QQQ'),
                (this.getCellWidth() * 3) / 2 + i * (this.getCellWidth() * 3),
                primaryDatePointTop
            );
            points.push(point);
        }

        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const months = eachMonthOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < months.length; i++) {
            const start = new GanttDate(months[i]);
            const point = new GanttDatePoint(
                start,
                `${start.getMonth() + 1}月`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }
}
