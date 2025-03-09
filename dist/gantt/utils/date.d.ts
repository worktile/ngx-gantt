import { Locale, FirstWeekContainsDate } from 'date-fns';
export { Locale, addDays, addHours, addMinutes, addMonths, addQuarters, addSeconds, addWeeks, addYears, differenceInCalendarDays, differenceInCalendarQuarters, differenceInDays, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, endOfDay, endOfMonth, endOfQuarter, endOfWeek, endOfYear, format, fromUnixTime, getDaysInMonth, getUnixTime, getWeek, isToday, isWeekend, setDate, startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear, startOfMinute, startOfHour, endOfMinute, endOfHour, differenceInMinutes, eachHourOfInterval } from 'date-fns';
export type GanttDateUtil = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
export declare function setDefaultTimeZone(zone: string): void;
export declare function getDefaultTimeZone(): string;
export declare class GanttDate {
    value: Date;
    constructor(date?: Date | string | number);
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getTime(): number;
    getDate(): number;
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    getMilliseconds(): number;
    getWeek(options?: {
        locale?: Locale;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }): number;
    getDaysInMonth(): number;
    getDaysInQuarter(): number;
    getDaysInYear(): number;
    setDate(dayOfMonth: number): GanttDate;
    clone(): GanttDate;
    add(amount: number, unit?: GanttDateUtil): GanttDate;
    addSeconds(amount: number): GanttDate;
    addMinutes(amount: number): GanttDate;
    addHours(amount: number): GanttDate;
    addDays(amount: number): GanttDate;
    addWeeks(amount: number): GanttDate;
    addMonths(amount: number): GanttDate;
    addQuarters(amount: number): GanttDate;
    addYears(amount: number): GanttDate;
    startOfMinute(): GanttDate;
    startOfHour(): GanttDate;
    startOfDay(): GanttDate;
    startOfWeek(options?: {
        locale?: Locale;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }): GanttDate;
    startOfMonth(): GanttDate;
    startOfQuarter(): GanttDate;
    startOfYear(): GanttDate;
    endOfMinute(): GanttDate;
    endOfHour(): GanttDate;
    endOfDay(): GanttDate;
    endOfWeek(options?: {
        locale?: Locale;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }): GanttDate;
    endOfMonth(): GanttDate;
    endOfQuarter(): GanttDate;
    endOfYear(): GanttDate;
    getUnixTime(): number;
    format(mat: string, options?: {
        locale?: Locale;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        firstWeekContainsDate?: FirstWeekContainsDate;
        useAdditionalWeekYearTokens?: boolean;
        useAdditionalDayOfYearTokens?: boolean;
    }): string;
    isWeekend(): boolean;
    isToday(): boolean;
}
