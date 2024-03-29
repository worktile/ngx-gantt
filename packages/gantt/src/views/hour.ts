import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { GanttDate, differenceInMinutes, eachDayOfInterval, eachHourOfInterval } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop } from './view';

const viewOptions: GanttViewOptions = {
    cellWidth: 80,
    start: new GanttDate().startOfMonth(),
    end: new GanttDate().endOfMonth(),
    datePrecisionUnit: 'minute',
    addAmount: 1,
    addUnit: 'week',
    dragPreviewDateFormat: 'HH:mm'
};

export class GanttViewHour extends GanttView {
    override showWeekBackdrop = true;

    override showTimeline = true;

    override viewType = GanttViewType.hour;

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
        return this.getCellWidth() * 24;
    }

    getDayOccupancyWidth(): number {
        return this.cellWidth * 60;
    }

    private getHourOccupancyWidth() {
        return this.getDayOccupancyWidth() / 60;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = this.start.addDays(i);
            const point = new GanttDatePoint(
                start,
                start.format(this.options.dateFormat.day),
                (this.getCellWidth() * 24) / 2 + i * (this.getCellWidth() * 24),
                primaryDatePointTop
            );
            points.push(point);
        }

        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const hours = eachHourOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < hours.length; i++) {
            const start = new GanttDate(hours[i]);
            const point = new GanttDatePoint(
                start,
                start.format(this.options.dateFormat.hour),
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

    override getTodayXPoint(): number {
        const toady = new GanttDate().startOfMinute();
        if (toady.value > this.start.value && toady.value < this.end.value) {
            const x = this.getXPointByDate(toady);
            return x;
        } else {
            return null;
        }
    }

    override getDateIntervalWidth(start: GanttDate, end: GanttDate) {
        let result = 0;
        const minutes = differenceInMinutes(end.value, start.value);
        for (let i = 0; i < minutes; i++) {
            result += this.getHourOccupancyWidth() / 60;
        }
        result = minutes >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }

    override getDateByXPoint(x: number) {
        const hourWidth = this.getHourOccupancyWidth();
        const indexOfSecondaryDate = Math.max(Math.floor(x / hourWidth), 0);
        const matchDate = this.secondaryDatePoints[Math.min(this.secondaryDatePoints.length - 1, indexOfSecondaryDate)];
        const minuteWidth = hourWidth / 60;
        const underOneHourMinutes = Math.floor((x % hourWidth) / minuteWidth);
        return matchDate?.start.addMinutes(underOneHourMinutes);
    }
}
