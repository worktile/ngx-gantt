import { GanttView, GanttViewOptions } from './view';
import { GanttDate, TinyDate } from '../date';
import { GanttDatePoint } from '../class/date-point';
import { eachYearOfInterval, differenceInCalendarQuarters } from 'date-fns';
import { primaryDatePointTop, secondaryDatePointTop, GanttOptions } from '../gantt.options';

const viewOptions: GanttViewOptions = {
    start: new TinyDate().addYears(-1).startOfYear(),
    end: new TinyDate().addYears(1).endOfYear(),
    min: new TinyDate().addYears(-2).startOfYear(),
    max: new TinyDate().addYears(2).endOfYear(),
    cellWidth: 500,
    addAmount: 1,
    addUnit: 'year',
};

export class GanttViewQuarter extends GanttView {
    constructor(start: GanttDate, end: GanttDate, options?: GanttOptions) {
        super(start, end, Object.assign(viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfYear();
    }

    endOf(date: GanttDate) {
        return date.endOfYear();
    }

    getPrimaryWidth() {
        return this.getCellWidth() * 4;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth / date.getDaysInQuarter();
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const years = eachYearOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i <= years.length; i++) {
            const start = new TinyDate(years[i]);
            const point = new GanttDatePoint(
                start,
                `${start.format('yyyy')}年`,
                (this.getCellWidth() * 4) / 2 + i * (this.getCellWidth() * 4),
                primaryDatePointTop
            );
            points.push(point);
        }

        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const quarters = differenceInCalendarQuarters(this.end.value, this.start.value);
        const points: GanttDatePoint[] = [];
        for (let i = 0; i <= quarters; i++) {
            const start = this.start.addQuarters(i);
            const point = new GanttDatePoint(
                start,
                start.format('QQQ'),
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }
}
