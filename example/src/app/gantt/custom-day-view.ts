import {
    GanttDate,
    GanttDatePoint,
    GanttView,
    GanttViewDate,
    GanttViewOptions,
    GanttViewType,
    eachDayOfInterval,
    primaryDatePointTop,
    secondaryDatePointTop
} from 'ngx-gantt';

const viewOptions: GanttViewOptions = {
    cellWidth: 35,
    start: new GanttDate().startOfMonth().startOfWeek({ weekStartsOn: 1 }),
    end: new GanttDate().endOfMonth().endOfWeek({ weekStartsOn: 1 }),
    addAmount: 1,
    addUnit: 'month',
    fillDays: 1,
    hided: (date: GanttDate) => {
        return date.isWeekend();
    }
};

export class GanttViewCustom extends GanttView {
    showWeekBackdrop = true;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    viewStartOf(date: GanttDate) {
        return date.startOfDay();
    }

    viewEndOf(date: GanttDate) {
        return date.endOfDay();
    }

    getPrimaryWidth() {
        return null;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        const hided = this.options.hided(date);
        if (hided) {
            return 0;
        }
        return this.cellWidth;
    }

    private getFirstWorkingDay(startDate: Date): Date {
        let actualStartDate = startDate;
        while (this.options.hided(new GanttDate(actualStartDate))) {
            actualStartDate = new Date(actualStartDate.getTime() + 24 * 60 * 60 * 1000);
        }
        return actualStartDate;
    }

    private generateWeeks(startDate: Date, endDate: Date): Date[] {
        const weeks: Date[] = [];
        let currentWeekStart = new Date(startDate);

        while (currentWeekStart <= endDate) {
            weeks.push(currentWeekStart);
            currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        return weeks;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const startDate = this.start.value;
        const endDate = this.end.addSeconds(1).value;
        const actualStartDate = this.getFirstWorkingDay(startDate);
        const weeks = this.generateWeeks(actualStartDate, endDate);

        const points: GanttDatePoint[] = [];
        let accumulatedWidth = 0;

        for (const weekStart of weeks) {
            const week = new GanttDate(weekStart);
            const { workingDays, weekWidth, firstWorkingDay } = this.calculateWeekInfo(week);

            if (workingDays === 0) continue;

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
        const startDate = this.start.value;
        const endDate = this.end.addSeconds(1).value;
        const actualStartDate = this.getFirstWorkingDay(startDate);
        const days = eachDayOfInterval({ start: actualStartDate, end: endDate });

        const points: GanttDatePoint[] = [];
        let accumulatedWidth = 0;

        for (const day of days) {
            const date = new GanttDate(day);
            if (this.options.hided(date)) continue;

            const dayPosition = accumulatedWidth + this.getCellWidth() / 2;
            const point = new GanttDatePoint(
                date,
                date.format(this.options.dateDisplayFormats.secondary) || date.getDate().toString(),
                dayPosition,
                secondaryDatePointTop,
                {
                    isWeekend: date.isWeekend(),
                    isToday: date.isToday()
                },
                undefined,
                undefined
            );

            points.push(point);
            accumulatedWidth += this.getCellWidth();
        }

        return points;
    }

    private calculateWeekInfo(weekStart: GanttDate): {
        workingDays: number;
        weekWidth: number;
        firstWorkingDay: GanttDate;
    } {
        let workingDays = 0;
        let weekWidth = 0;
        let firstWorkingDay: GanttDate | null = null;

        for (let j = 0; j < 7; j++) {
            const currentDate = weekStart.addDays(j);
            if (!this.options.hided(currentDate)) {
                if (firstWorkingDay === null) {
                    firstWorkingDay = currentDate;
                }
                workingDays++;
                weekWidth += this.getCellWidth();
            }
        }

        return { workingDays, weekWidth, firstWorkingDay: firstWorkingDay! };
    }
}
