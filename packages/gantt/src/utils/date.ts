import {
    addYears,
    addMonths,
    addDays,
    addWeeks,
    addQuarters,
    getUnixTime,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    endOfDay,
    endOfWeek,
    endOfMonth,
    endOfQuarter,
    endOfYear,
    format,
    fromUnixTime,
    getDaysInMonth,
    addSeconds,
    setDate,
    addMinutes,
    addHours,
    differenceInCalendarDays,
    isWeekend,
    getWeek,
    isToday,
    differenceInDays,
    differenceInCalendarQuarters,
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachDayOfInterval
} from 'date-fns';

export {
    addYears,
    addMonths,
    addDays,
    addWeeks,
    addQuarters,
    getUnixTime,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    endOfDay,
    endOfWeek,
    endOfMonth,
    endOfQuarter,
    endOfYear,
    format,
    fromUnixTime,
    getDaysInMonth,
    addSeconds,
    setDate,
    addMinutes,
    addHours,
    differenceInCalendarDays,
    isWeekend,
    getWeek,
    isToday,
    differenceInDays,
    differenceInCalendarQuarters,
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachDayOfInterval
} from 'date-fns';

export type GanttDateUtil = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export class GanttDate {
    value: Date;

    constructor(date?: Date | string | number) {
        if (date) {
            if (date instanceof Date) {
                this.value = date;
            } else if (typeof date === 'string' || typeof date === 'number') {
                if (date.toString().length < 13) {
                    this.value = fromUnixTime(+date);
                } else {
                    this.value = new Date(date);
                }
            } else {
                throw new Error(
                    `The input date type is not supported expect Date | string
                     | number | { date: number; with_time: 0 | 1}, actual ${JSON.stringify(date)}`
                );
            }
        } else {
            this.value = new Date();
        }
    }

    getYear(): number {
        return this.value.getFullYear();
    }

    getMonth(): number {
        return this.value.getMonth();
    }

    getDay(): number {
        return this.value.getDay();
    }

    getTime(): number {
        return this.value.getTime();
    }

    getDate(): number {
        return this.value.getDate();
    }

    getHours(): number {
        return this.value.getHours();
    }

    getMinutes(): number {
        return this.value.getMinutes();
    }

    getSeconds(): number {
        return this.value.getSeconds();
    }

    getMilliseconds(): number {
        return this.value.getMilliseconds();
    }

    getWeek(options: { locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 } = { weekStartsOn: 1 }): number {
        return getWeek(this.value, options);
    }

    getDaysInMonth() {
        return getDaysInMonth(this.value);
    }

    getDaysInQuarter() {
        return differenceInCalendarDays(this.endOfQuarter().addSeconds(1).value, this.startOfQuarter().value);
    }

    setDate(dayOfMonth: number): GanttDate {
        return new GanttDate(setDate(this.value, dayOfMonth));
    }

    clone(): GanttDate {
        return new GanttDate(new Date(this.value));
    }

    add(amount: number, unit?: GanttDateUtil) {
        switch (unit) {
            case 'second':
                return new GanttDate(this.value).addSeconds(amount);
            case 'minute':
                return new GanttDate(this.value).addMinutes(amount);
            case 'hour':
                return new GanttDate(this.value).addHours(amount);
            case 'day':
                return new GanttDate(this.value).addDays(amount);
            case 'week':
                return new GanttDate(this.value).addWeeks(amount);
            case 'month':
                return new GanttDate(this.value).addMonths(amount);
            case 'quarter':
                return new GanttDate(this.value).addQuarters(amount);
            case 'year':
                return new GanttDate(this.value).addYears(amount);
            default:
                return new GanttDate(this.value).addSeconds(amount);
        }
    }

    addSeconds(amount: number): GanttDate {
        return new GanttDate(addSeconds(this.value, amount));
    }

    addMinutes(amount: number): GanttDate {
        return new GanttDate(addMinutes(this.value, amount));
    }

    addHours(amount: number): GanttDate {
        return new GanttDate(addHours(this.value, amount));
    }

    addDays(amount: number): GanttDate {
        return new GanttDate(addDays(this.value, amount));
    }

    addWeeks(amount: number) {
        return new GanttDate(addWeeks(this.value, amount));
    }

    addMonths(amount: number): GanttDate {
        return new GanttDate(addMonths(this.value, amount));
    }

    addQuarters(amount: number): GanttDate {
        return new GanttDate(addQuarters(this.value, amount));
    }

    addYears(amount: number): GanttDate {
        return new GanttDate(addYears(this.value, amount));
    }

    startOfDay(): GanttDate {
        return new GanttDate(startOfDay(this.value));
    }

    startOfWeek(options?: { locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): GanttDate {
        return new GanttDate(startOfWeek(this.value, options));
    }

    startOfMonth(): GanttDate {
        return new GanttDate(startOfMonth(this.value));
    }

    startOfQuarter(): GanttDate {
        return new GanttDate(startOfQuarter(this.value));
    }

    startOfYear(): GanttDate {
        return new GanttDate(startOfYear(this.value));
    }

    endOfDay(): GanttDate {
        return new GanttDate(endOfDay(this.value));
    }

    endOfWeek(options?: { locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): GanttDate {
        return new GanttDate(endOfWeek(this.value, options));
    }

    endOfMonth(): GanttDate {
        return new GanttDate(endOfMonth(this.value));
    }

    endOfQuarter(): GanttDate {
        return new GanttDate(endOfQuarter(this.value));
    }

    endOfYear(): GanttDate {
        return new GanttDate(endOfYear(this.value));
    }

    getUnixTime(): number {
        return getUnixTime(this.value);
    }

    format(
        mat: string,
        options?: {
            locale?: Locale;
            weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
            firstWeekContainsDate?: number;
            useAdditionalWeekYearTokens?: boolean;
            useAdditionalDayOfYearTokens?: boolean;
        }
    ) {
        return format(this.value, mat, options);
    }

    isWeekend() {
        return isWeekend(this.value);
    }

    isToday() {
        return isToday(this.value);
    }
}
