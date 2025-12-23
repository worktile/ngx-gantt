import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { zhHantLocale } from '../i18n';
import { differenceInCalendarDays, eachDayOfInterval, eachWeekOfInterval, GanttDate } from '../utils/date';
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

    // 获取两个日期在当前可见时间轴上的索引差值
    override getVisibleDateIndexOffset(start: GanttDate, end: GanttDate): number {
        const startTime = this.startOfPrecision(start).value;
        const endTime = this.startOfPrecision(end).value;

        const startIndex = this.secondaryDatePoints.findIndex((p) => p.start.value >= startTime);
        const endIndex = this.secondaryDatePoints.findIndex((p) => p.start.value >= endTime);

        if (startIndex !== -1 && endIndex !== -1) {
            return endIndex - startIndex;
        }
        return differenceInCalendarDays(endTime, startTime);
    }

    // 根据基准日期和索引偏移量，获取新的日期
    override getDateByIndexOffset(baseDate: GanttDate, indexOffset: number): GanttDate {
        const baseTime = this.startOfPrecision(baseDate).value;
        const baseIndex = this.secondaryDatePoints.findIndex((p) => p.start.value >= baseTime);
        if (baseIndex !== -1) {
            const targetIndex = baseIndex + indexOffset;
            const safeIndex = Math.max(0, Math.min(targetIndex, this.secondaryDatePoints.length - 1));
            return this.secondaryDatePoints[safeIndex].start;
        }
        return baseDate.addDays(indexOffset);
    }
}
