import { GanttView, GanttViewOptions, GanttViewDate, primaryDatePointTop, secondaryDatePointTop } from './view';
import { GanttDate } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';
import { eachYearOfInterval, differenceInCalendarYears } from 'date-fns';
import { GanttViewType } from '../class';

const viewOptions: GanttViewOptions = {
    cellWidth: 480,
    start: new GanttDate().addYears(-2).startOfYear(),
    end: new GanttDate().addYears(2).endOfYear(),
    addAmount: 1,
    addUnit: 'year'
};

export class GanttViewYear extends GanttView {
    override viewType = GanttViewType.year;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    viewStartOf(date: GanttDate) {
        return date.startOfYear();
    }

    viewEndOf(date: GanttDate) {
        return date.endOfYear();
    }

    getPrimaryWidth() {
        return this.getCellWidth();
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth / date.getDaysInYear();
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const years = eachYearOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < years.length; i++) {
            const start = new GanttDate(years[i]);
            const point = new GanttDatePoint(start, ``, this.getCellWidth() / 2 + i * this.getCellWidth(), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const years = differenceInCalendarYears(this.end.value, this.start.value);
        const points: GanttDatePoint[] = [];
        const pointTop = '60%';
        for (let i = 0; i <= years; i++) {
            const start = this.start.addYears(i);
            const point = new GanttDatePoint(
                start,
                `${start.format(this.options.dateFormat.year)}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                pointTop
            );
            points.push(point);
        }
        return points;
    }
}
