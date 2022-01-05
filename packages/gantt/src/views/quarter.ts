import {GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop} from './view';
import {GanttDate} from '../utils/date';
import {GanttDatePoint} from '../class/date-point';
import {differenceInCalendarQuarters, eachYearOfInterval} from 'date-fns';

const viewOptions: GanttViewOptions = {
    start: new GanttDate().addYears(-1).startOfYear(),
    end: new GanttDate().addYears(1).endOfYear(),
    min: new GanttDate().addYears(-2).startOfYear(),
    max: new GanttDate().addYears(2).endOfYear(),
    cellWidth: 500,
    addAmount: 1,
    addUnit: 'year'
};

export class GanttViewQuarter extends GanttView {
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
        return this.getCellWidth() * 4;
    }

    getItemWidth(start: GanttDate, end: GanttDate) {
        return this.getDateRangeWidth(start.startOfDay(), end.endOfDay());
    }

    getTodayXPoint(): number {
        return this.getTodayXPointDayBased();
    }

    getXPointByDate(date: GanttDate) {
        return this.getDateIntervalWidth(this.start, date);
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth / date.getDaysInQuarter();
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const years = eachYearOfInterval({start: this.start.value, end: this.end.value});
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < years.length; i++) {
            const start = new GanttDate(years[i]);
            const point = new GanttDatePoint(
                start,
                this.getHeaderText(start, this.options?.headerPatterns?.quarter?.primaryLineTemplate, 'yyyy年'),
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
                this.getHeaderText(start, this.options?.headerPatterns?.year?.secondaryLineTemplate, 'QQQ'),
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }
}
