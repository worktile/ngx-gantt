import { GanttView, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop, GanttViewDate } from './view';
import { GanttDate } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';
import { eachYearOfInterval, differenceInCalendarYears } from 'date-fns';

const viewOptions: GanttViewOptions = {
    cellWidth: 480,
    start: new GanttDate().addYears(-2).startOfYear(),
    end: new GanttDate().addYears(2).endOfYear(),
    addAmount: 1,
    addUnit: 'year'
};

export class GanttViewYear extends GanttView {
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfYear();
    }

    endOf(date: GanttDate) {
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
        const pointTop = 27;
        for (let i = 0; i <= years; i++) {
            const start = this.start.addYears(i);
            const point = new GanttDatePoint(
                start,
                `${start.format('yyyy')}年`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                pointTop
            );
            points.push(point);
        }
        return points;
    }
}
