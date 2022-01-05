import {differenceInDays, GanttDate, GanttDateUtil} from '../utils/date';
import {GanttDatePoint} from '../class/date-point';
import {BehaviorSubject} from 'rxjs';

export const primaryDatePointTop = 18;

export const secondaryDatePointTop = 36;

export interface GanttViewDate {
    date: GanttDate;
    isCustom?: boolean;
}

export interface GanttViewOptions {
    start?: GanttDate;
    end?: GanttDate;
    min?: GanttDate;
    max?: GanttDate;
    cellWidth?: number;
    addAmount?: number;
    addUnit?: GanttDateUtil;
    headerPatterns?: GanttHeaderPatterns;
}

export interface GanttHeaderPatterns {
    hour?: GanttHeaderPattern;
    day?: GanttHeaderPattern;
    week?: GanttHeaderPattern;
    month?: GanttHeaderPattern;
    quarter?: GanttHeaderPattern;
    year?: GanttHeaderPattern;
}

export interface GanttHeaderPattern {
    primaryLineTemplate: GanttHeaderTemplate;
    secondaryLineTemplate: GanttHeaderTemplate;
}

export class GanttHeaderTemplate {
    template: string;
    datePatterns: string[];

    constructor(template: string, datePatterns: string[]) {
        this.template = template;
        this.datePatterns = datePatterns;
    }

    public apply(date: GanttDate): string {
        return this.replaceTemplate(this.template, this.datePatterns.map(datePattern => date.format(datePattern)))
    }

    private replaceTemplate(templateString: string, formattedDates: string[]): string {
        return templateString.replace(/{(\d+)}/g, (match, number) => {
            return typeof formattedDates[number] !== 'undefined' ? formattedDates[number] : match;
        });
    }
}

const viewOptions: GanttViewOptions = {
    min: new GanttDate().addYears(-1).startOfYear(),
    max: new GanttDate().addYears(1).endOfYear()
};

export abstract class GanttView {
    start$: BehaviorSubject<GanttDate>;

    end$: BehaviorSubject<GanttDate>;

    get start() {
        return this.start$.getValue();
    }

    get end() {
        return this.end$.getValue();
    }

    primaryDatePoints: GanttDatePoint[];

    secondaryDatePoints: GanttDatePoint[];

    width: number;

    cellWidth: number;

    primaryWidth: number;

    showTimeline = true;

    showWeekBackdrop: boolean;

    options: GanttViewOptions;

    constructor(start: GanttViewDate, end: GanttViewDate, options: GanttViewOptions) {
        this.options = Object.assign({}, viewOptions, options);
        const startDate = start.isCustom
            ? this.startOf(start.date)
            : this.startOf(start.date.value < this.options.start.value ? start.date : this.options.start);
        const endDate = end.isCustom
            ? this.endOf(end.date)
            : this.endOf(end.date.value > this.options.end.value ? end.date : this.options.end);
        this.start$ = new BehaviorSubject<GanttDate>(startDate);
        this.end$ = new BehaviorSubject<GanttDate>(endDate);
        this.initialize();
    }

    abstract startOf(date: GanttDate): GanttDate;

    abstract endOf(date: GanttDate): GanttDate;

    // 获取一级时间网格合并后的宽度
    abstract getPrimaryWidth(): number;

    // 获取当前视图下每一天占用的宽度
    abstract getDayOccupancyWidth(date: GanttDate): number;

    // 获取一级时间点（坐标，显示名称）
    abstract getPrimaryDatePoints(): GanttDatePoint[];

    // 获取二级时间点（坐标，显示名称）
    abstract getSecondaryDatePoints(): GanttDatePoint[];

    abstract getItemWidth(start: GanttDate, end: GanttDate);

    abstract getTodayXPoint(): number;

    // 获取指定时间的X坐标
    abstract getXPointByDate(date: GanttDate);

    protected getDateIntervalWidth(start: GanttDate, end: GanttDate) {
        let result = 0;
        const days = differenceInDays(end.value, start.value);
        for (let i = 0; i < Math.abs(days); i++) {
            result += this.getDayOccupancyWidth(start.addDays(i));
        }
        result = days >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }

    protected initialize() {
        this.primaryDatePoints = this.getPrimaryDatePoints();
        this.secondaryDatePoints = this.getSecondaryDatePoints();
        this.width = this.getWidth();
        this.cellWidth = this.getCellWidth();
        this.primaryWidth = this.getPrimaryWidth();
    }

    addStartDate() {
        const start = this.startOf(this.start.add(this.options.addAmount * -1, this.options.addUnit));
        if (start.value >= this.options.min.value) {
            const origin = this.start;
            this.start$.next(start);
            this.initialize();
            return {start: this.start, end: origin};
        }
        return null;
    }

    addEndDate() {
        const end = this.endOf(this.end.add(this.options.addAmount, this.options.addUnit));
        if (end.value <= this.options.max.value) {
            const origin = this.end;
            this.end$.next(end);
            this.initialize();
            return {start: origin, end: this.end};
        }
        return null;
    }

    updateDate(start: GanttDate, end: GanttDate) {
        start = this.startOf(start);
        end = this.endOf(end);
        if (start.value < this.start.value) {
            this.start$.next(start);
        }
        if (end.value > this.end.value) {
            this.end$.next(end);
        }
        this.initialize();
    }

    // 获取View的宽度
    getWidth() {
        return this.getCellWidth() * this.secondaryDatePoints.length;
    }

    // 获取单个网格的宽度
    getCellWidth() {
        return this.options.cellWidth;
    }

    // 获取当前时间的X坐标
    getTodayXPointDayBased(): number {
        const toady = new GanttDate().startOfDay();
        if (toady.value > this.start.value && toady.value < this.end.value) {
            return this.getXPointByDate(toady) + this.getDayOccupancyWidth(toady) / 2;
        } else {
            return null;
        }
    }

    // 根据X坐标获取对应时间
    getDateByXPoint(x: number) {
        const indexOfSecondaryDate = Math.floor(x / this.getCellWidth());
        const matchDate = this.secondaryDatePoints[indexOfSecondaryDate];
        const dayWidth = this.getDayOccupancyWidth(matchDate?.start);
        if (dayWidth === this.getCellWidth()) {
            return matchDate?.start;
        } else {
            const day = Math.floor((x % this.getCellWidth()) / dayWidth) + 1;
            if (this.getCellWidth() / dayWidth === 7) {
                return matchDate?.start.addDays(day);
            }
            return matchDate?.start.setDate(day);
        }
    }

    // 获取指定时间范围的宽度
    getDateRangeWidth(start: GanttDate, end: GanttDate) {
        // addSeconds(1) 是因为计算相差天会以一个整天来计算 end时间一般是59分59秒不是一个整天，所以需要加1
        return this.getDateIntervalWidth(start, end.addSeconds(1));
    }

    getHeaderText(date: GanttDate, headerTemplate: GanttHeaderTemplate, defualtPattern: string) {
        return headerTemplate ? headerTemplate.apply(date) : date.format(defualtPattern);
    }
}
