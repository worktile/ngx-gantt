import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { zhHantLocale } from '../i18n';
import { eachDayOfInterval, eachWeekOfInterval, GanttDate } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop } from './view';

const viewOptions: GanttViewOptions = {
    cellWidth: 35,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month',
    dateDisplayFormats: zhHantLocale.views.day.dateFormats
};

export class GanttViewDay extends GanttView {
    override showTimeline = false;

    override viewType = GanttViewType.day;

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
        return this.getCellWidth() * 7;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        if (this.hideHoliday(date)) {
            return 0;
        }
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const weekEnd = weekStart.addWeeks(1);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const pointWidth = this.getDateIntervalWidth(weekStart, weekEnd);
            const lastPoint = points[points.length - 1];
            const point = new GanttDatePoint(
                weekStart,
                weekStart.addWeeks(increaseWeek).format(this.options.dateFormat?.yearMonth || this.options.dateDisplayFormats.primary),
                pointWidth / 2 + (lastPoint?.rightX || 0),
                primaryDatePointTop
            );

            point.leftX = lastPoint?.rightX || 0;
            point.rightX = point.leftX + pointWidth;
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value }).filter(
            (day) => !this.hideHoliday(new GanttDate(day))
        );
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const point = new GanttDatePoint(
                start,
                start.format(this.options.dateDisplayFormats.secondary) || start.getDate().toString(),
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
