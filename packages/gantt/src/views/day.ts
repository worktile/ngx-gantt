import { GanttView, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop } from './view';
import { GanttDate, eachWeekOfInterval, eachDayOfInterval } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';

const viewOptions: GanttViewOptions = {
    cellWidth: 35,
    start: new GanttDate().startOfYear().startOfWeek({ weekStartsOn: 1 }),
    end: new GanttDate().endOfYear().endOfWeek({ weekStartsOn: 1 }),
    addAmount: 1,
    addUnit: 'month'
};

export class GanttViewDay extends GanttView {
    showWeekBackdrop = true;

    showTimeline = false;

    constructor(start: GanttDate, end: GanttDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfWeek({ weekStartsOn: 1 });
    }

    endOf(date: GanttDate) {
        return date.endOfWeek({ weekStartsOn: 1 });
    }

    getPrimaryWidth() {
        return this.getCellWidth() * 7;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value }, { weekStartsOn: 1 });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const point = new GanttDatePoint(
                weekStart,
                weekStart.addWeeks(increaseWeek).format('yyyy年MM月'),
                (this.getCellWidth() * 7) / 2 + i * (this.getCellWidth() * 7),
                primaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const point = new GanttDatePoint(
                start,
                start.getDate().toString(),
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
