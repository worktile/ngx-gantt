import { GanttViewType } from '../class';
import { GanttDatePoint } from '../class/date-point';
import { zhHantLocale } from '../i18n';
import { GanttDate } from '../utils/date';
import { GanttHolidayOptions, GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop } from './view';

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

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions, holidayOptions?: GanttHolidayOptions) {
        super(start, end, Object.assign({}, viewOptions, options, holidayOptions));
    }

    viewStartOf(date: GanttDate) {
        return date.startOfWeek();
    }

    viewEndOf(date: GanttDate) {
        return date.endOfWeek();
    }

    getPrimaryWidth() {
        return null;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        if (this.isHoliday(date)) {
            return 0;
        }
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const weeks = this.generateWeeks(this.start.value, this.end.addSeconds(1).value);
        const points: GanttDatePoint[] = [];
        let accumulatedWidth = 0;

        for (const weekStart of weeks) {
            const week = new GanttDate(weekStart);
            const { workingDays, weekWidth, firstWorkingDay } = this.calculateWeekInfo(week);
            if (workingDays === 0) {
                continue;
            }
            const weekPosition = accumulatedWidth + weekWidth / 2;
            const point = new GanttDatePoint(
                firstWorkingDay,
                firstWorkingDay.format(this.options.dateFormat?.yearMonth || this.options.dateDisplayFormats.primary),
                weekPosition,
                primaryDatePointTop,
                undefined,
                undefined,
                undefined,
                accumulatedWidth + weekWidth
            );

            points.push(point);
            accumulatedWidth += weekWidth;
        }

        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const endDate = this.end.addSeconds(1).value;
        const weeks = this.generateWeeks(this.start.value, endDate);
        const points: GanttDatePoint[] = [];
        let accumulatedWidth = 0;

        for (const weekStart of weeks) {
            const week = new GanttDate(weekStart);

            for (let j = 0; j < 7; j++) {
                const currentDate = week.addDays(j);
                if (currentDate.value > endDate) {
                    break;
                }
                if (this.isHoliday(currentDate)) {
                    continue;
                }
                const dayPosition = accumulatedWidth + this.getCellWidth() / 2;
                const point = new GanttDatePoint(
                    currentDate,
                    currentDate.format(this.options.dateDisplayFormats.secondary) || currentDate.getDate().toString(),
                    dayPosition,
                    secondaryDatePointTop,
                    {
                        isWeekend: currentDate.isWeekend(),
                        isToday: currentDate.isToday()
                    },
                    undefined,
                    undefined
                );

                points.push(point);
                accumulatedWidth += this.getCellWidth();
            }
        }

        return points;
    }

    override getDateByXPoint(x: number): GanttDate | null {
        if (x < 0 || x > this.getWidth()) return null;
        let accumulatedWidth = 0;
        const targetPoint = this.secondaryDatePoints.find((point) => {
            const dayWidth = this.getDayOccupancyWidth(point.start);
            if (accumulatedWidth + dayWidth > x) return true;
            accumulatedWidth += dayWidth;
            return false;
        });
        return targetPoint?.start ?? this.secondaryDatePoints[this.secondaryDatePoints.length - 1]?.start ?? null;
    }

    private calculateWeekInfo(weekStart: GanttDate) {
        const workingDays = Array.from({ length: 7 }, (_, j) => weekStart.addDays(j)).filter((currentDate) => !this.isHoliday(currentDate));
        return {
            workingDays: workingDays.length,
            weekWidth: workingDays.length * this.getCellWidth(),
            firstWorkingDay: workingDays[0]!
        };
    }

    private generateWeeks(startDate: Date, endDate: Date) {
        const weeks: Date[] = [];
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        let currentWeekStart = new GanttDate(startDate).startOfWeek({ weekStartsOn: 1 }).value;

        while (currentWeekStart <= endDate) {
            weeks.push(currentWeekStart);
            currentWeekStart = new Date(currentWeekStart.getTime() + weekMs);
        }
        return weeks;
    }
}
