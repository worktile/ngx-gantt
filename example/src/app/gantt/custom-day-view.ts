import { parse } from 'date-fns';
import {
    GanttDate,
    GanttDatePoint,
    GanttView,
    GanttViewDate,
    GanttViewOptions,
    GanttViewType,
    primaryDatePointTop,
    secondaryDatePointTop
} from 'ngx-gantt';
import { TinyDate } from 'ngx-tethys/util';

const holidays = [
    {
        date: '20250801',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250814',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250815',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250813',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250822',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250821',
        name: '',
        type: 1,
        source: 1
    }
];

const defaultWorkdays = [1, 2, 3, 4, 5];

const holidaysKeyMap = holidays.reduce((map, item) => {
    const tinyDate = new TinyDate(parse(item.date, 'yyyyMMdd', new Date())).format('yyyyMMdd');
    map[tinyDate] = item;
    return map;
}, {});

export function isHoliday(date: GanttDate) {
    let isHoliday = false;
    const formattedDate = date.format('yyyyMMdd');
    const specialDate = holidaysKeyMap[formattedDate];
    if (specialDate) {
        if ((specialDate as any).type === 1) {
            isHoliday = true;
        }
    } else {
        const dayOfWeek = date.getDay();
        const isDefaultWorkdays = defaultWorkdays.includes(dayOfWeek);
        isHoliday = !isDefaultWorkdays;
    }
    return isHoliday;
}

const viewOptions: GanttViewOptions = {
    cellWidth: 35,
    start: new GanttDate().startOfMonth().startOfWeek({ weekStartsOn: 1 }),
    end: new GanttDate().endOfMonth().endOfWeek({ weekStartsOn: 1 }),
    addAmount: 1,
    addUnit: 'month',
    fillDays: 1,
    hided: (date: GanttDate) => {
        if (isHoliday(date)) {
            return true;
        }
        return false;
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
        return 0;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        const hided = this.options.hided(date);
        if (hided) {
            return 0;
        }
        return this.cellWidth;
    }

    private generateWeeks(startDate: Date, endDate: Date): Date[] {
        const weeks: Date[] = [];
        let currentWeekStart = new GanttDate(startDate).startOfWeek({ weekStartsOn: 1 }).value;

        while (currentWeekStart <= endDate) {
            weeks.push(currentWeekStart);
            currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
        return weeks;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const startDate = this.start.value;
        const endDate = this.end.addSeconds(1).value;
        const weeks = this.generateWeeks(startDate, endDate);

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
        const weeks = this.generateWeeks(startDate, endDate);

        const points: GanttDatePoint[] = [];
        let accumulatedWidth = 0;

        for (const weekStart of weeks) {
            const week = new GanttDate(weekStart);

            for (let j = 0; j < 7; j++) {
                const currentDate = week.addDays(j);
                if (currentDate.value > endDate) break;

                if (this.options.hided(currentDate)) continue;
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

    override getWidth(): number {
        return this.secondaryDatePoints?.length * this.getCellWidth() || 0;
    }

    override getXPointByDate(date: GanttDate): number {
        if (date.value < this.start.value || date.value > this.end.value || this.options.hided(date)) {
            return 0;
        }
        const result = this.secondaryDatePoints
            .filter((point) => point.start.value < date.value)
            .reduce((total, point) => total + this.getDayOccupancyWidth(point.start), 0);
        return Number(result.toFixed(3));
    }

    override getDateByXPoint(x: number): GanttDate | null {
        if (x < 0 || x > this.getWidth()) {
            return null;
        }
        let accumulatedWidth = 0;
        for (const point of this.secondaryDatePoints) {
            const dayWidth = this.getDayOccupancyWidth(point.start);
            if (accumulatedWidth + dayWidth > x) {
                return point.start;
            }
            accumulatedWidth += dayWidth;
        }

        return this.secondaryDatePoints[this.secondaryDatePoints.length - 1]?.start || null;
    }

    override getTodayXPoint(): number {
        const today = new GanttDate().startOfDay();
        if (today.value < this.start.value || today.value > this.end.value || this.options.hided(today)) {
            return 0;
        }
        const x = this.getXPointByDate(today);
        const todayWidth = this.getDayOccupancyWidth(today);

        return x + todayWidth / 2;
    }

    override getDateRangeWidth(start: GanttDate, end: GanttDate): number {
        const startOfPrecision = this.startOfPrecision(start);
        const endOfPrecision = this.endOfPrecision(end).addSeconds(1);
        return this.getDateIntervalWidth(startOfPrecision, endOfPrecision);
    }
}
