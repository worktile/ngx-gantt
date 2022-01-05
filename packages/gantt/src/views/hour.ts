import {GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop} from './view';
import {eachDayOfInterval, GanttDate} from '../utils/date';
import {GanttDatePoint} from '../class/date-point';
import {differenceInMinutes, eachHourOfInterval} from "date-fns";

const viewOptions: GanttViewOptions = {
    cellWidth: 35,
    start: new GanttDate().addDays(-1).startOfDay(),
    end: new GanttDate().addDays(1).endOfDay(),
    addAmount: 0,
    addUnit: 'day'
};

export class GanttViewHour extends GanttView {
    showWeekBackdrop = true;

    showTimeline = false;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfDay();
    }

    endOf(date: GanttDate) {
        return date.endOfDay();
    }

    getPrimaryWidth() {
        return this.getCellWidth() * 24;
    }

    getItemWidth(start: GanttDate, end: GanttDate) {
        const result = this.getHourWidth() / 60 * Math.abs(differenceInMinutes(end.value, start.value));
        return Number(result.toFixed(3));
    }

    getTodayXPoint(): number {
        const now = new GanttDate();
        if (now.value > this.start.value && now.value < this.end.value) {
            return this.getItemWidth(this.start, now) + this.getHourWidth() / 2;
        } else {
            return null;
        }
    }

    getXPointByDate(date: GanttDate) {
        return this.getItemWidth(this.start, date);
    }

    getHourWidth(): number {
        return this.cellWidth;
    }

    getDayOccupancyWidth(): number {
        return this.getHourWidth() * 24;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({
            start: this.start.value,
            end: this.end.value
        });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const point = new GanttDatePoint(
                start,
                this.getHeaderText(start, this.options?.headerPatterns?.hour?.primaryLineTemplate, 'dd-LL-yyyy'),
                (this.getCellWidth() * 24) / 2 + i * (this.getCellWidth() * 24),
                primaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const hours = eachHourOfInterval({start: this.start.value, end: this.end.value});
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < hours.length; i++) {
            const start = new GanttDate(hours[i]);
            const point = new GanttDatePoint(
                start,
                this.getHeaderText(start, this.options?.headerPatterns?.hour?.secondaryLineTemplate, 'HH'),
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop,
                {
                    isWeekend: start.isWeekend(),
                    isToday: start.isToday()
                }
            );
            points.push(point);
        }
        return points;
    }
}
