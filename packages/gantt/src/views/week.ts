import {GanttDatePoint} from '../class/date-point';
import {eachWeekOfInterval, GanttDate} from '../utils/date';
import {GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop} from './view';

const viewOptions: GanttViewOptions = {
    cellWidth: 280,
    start: new GanttDate().startOfYear().startOfWeek({weekStartsOn: 1}),
    end: new GanttDate().endOfYear().endOfWeek({weekStartsOn: 1}),
    addAmount: 1,
    addUnit: 'month'
};

export class GanttViewWeek extends GanttView {
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfWeek({weekStartsOn: 1});
    }

    endOf(date: GanttDate) {
        return date.endOfWeek({weekStartsOn: 1});
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

    getDayOccupancyWidth(): number {
        return this.cellWidth / 7;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const weeks = eachWeekOfInterval({
            start: this.start.value,
            end: this.end.addSeconds(1).value
        }, {weekStartsOn: 1});
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const point = new GanttDatePoint(
                weekStart,
                this.getHeaderText(weekStart.addWeeks(increaseWeek), this.options?.headerPatterns?.week?.primaryLineTemplate, 'yyyy年'),
                this.getCellWidth() / 2 + i * this.getCellWidth(),
                primaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const weeks = eachWeekOfInterval({start: this.start.value, end: this.end.value});
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const start = new GanttDate(weeks[i]);
            const point = new GanttDatePoint(
                start,
                this.getHeaderText(start, this.options?.headerPatterns?.week?.secondaryLineTemplate, '第w周'),
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }
}
