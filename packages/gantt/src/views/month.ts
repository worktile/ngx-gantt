import { GanttView, GanttViewOptions, GanttViewDate, secondaryDatePointTop, primaryDatePointTop } from './view';
import { GanttDate, differenceInCalendarQuarters, eachMonthOfInterval } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';
import { GanttViewType } from '../class';

const viewOptions: GanttViewOptions = {
    start: new GanttDate().startOfQuarter().addQuarters(-1),
    end: new GanttDate().endOfQuarter().addQuarters(2),
    cellWidth: 280,
    addAmount: 1,
    addUnit: 'quarter'
};

export class GanttViewMonth extends GanttView {
    override viewType = GanttViewType.month;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    viewStartOf(date: GanttDate) {
        return date.startOfQuarter();
    }

    viewEndOf(date: GanttDate) {
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
                start.format(this.options.dateFormat.yearQuarter),
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
                start.format(this.options.dateFormat.month),
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }
}
