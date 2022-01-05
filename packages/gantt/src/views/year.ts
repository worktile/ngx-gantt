import {GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop} from './view';
import {GanttDate} from '../utils/date';
import {GanttDatePoint} from '../class/date-point';
import {differenceInCalendarYears, eachYearOfInterval} from 'date-fns';

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

    getItemWidth(start: GanttDate, end: GanttDate) {
        return super.getDateRangeWidth(start.startOfDay(), end.endOfDay());
    }

    getTodayXPoint(): number {
        return this.getTodayXPointDayBased();
    }

    getXPointByDate(date: GanttDate) {
        return this.getDateIntervalWidth(this.start, date);
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth / date.getDaysInYear();
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const years = eachYearOfInterval({start: this.start.value, end: this.end.value});
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
                this.getHeaderText(start, this.options?.headerPatterns?.year?.secondaryLineTemplate, 'yyyy年'),
                i * this.getCellWidth() + this.getCellWidth() / 2,
                pointTop
            );
            points.push(point);
        }
        return points;
    }
}
