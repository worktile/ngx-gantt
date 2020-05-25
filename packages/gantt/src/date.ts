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
} from 'date-fns';

export * from 'date-fns';

export type GanttDate = TinyDate;

export type TinyDateUtil = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export class TinyDate {
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

    getDaysInMonth() {
        return getDaysInMonth(this.value);
    }

    getDaysInQuarter() {
        return differenceInCalendarDays(this.endOfQuarter().addSeconds(1).value, this.startOfQuarter().value);
    }

    setDate(dayOfMonth: number): TinyDate {
        return new TinyDate(setDate(this.value, dayOfMonth));
    }

    clone(): TinyDate {
        return new TinyDate(new Date(this.value));
    }

    add(amount: number, unit?: TinyDateUtil) {
        switch (unit) {
            case 'second':
                return new TinyDate(this.value).addSeconds(amount);
            case 'minute':
                return new TinyDate(this.value).addMinutes(amount);
            case 'hour':
                return new TinyDate(this.value).addHours(amount);
            case 'day':
                return new TinyDate(this.value).addDays(amount);
            case 'week':
                return new TinyDate(this.value).addWeeks(amount);
            case 'month':
                return new TinyDate(this.value).addMonths(amount);
            case 'quarter':
                return new TinyDate(this.value).addQuarters(amount);
            case 'year':
                return new TinyDate(this.value).addYears(amount);
            default:
                return new TinyDate(this.value).addSeconds(amount);
        }
    }

    addSeconds(amount: number): TinyDate {
        return new TinyDate(addSeconds(this.value, amount));
    }

    addMinutes(amount: number): TinyDate {
        return new TinyDate(addMinutes(this.value, amount));
    }

    addHours(amount: number): TinyDate {
        return new TinyDate(addHours(this.value, amount));
    }

    addDays(amount: number): TinyDate {
        return new TinyDate(addDays(this.value, amount));
    }

    addWeeks(amount: number) {
        return new TinyDate(addWeeks(this.value, amount));
    }

    addMonths(amount: number): TinyDate {
        return new TinyDate(addMonths(this.value, amount));
    }

    addQuarters(amount: number): TinyDate {
        return new TinyDate(addQuarters(this.value, amount));
    }

    addYears(amount: number): TinyDate {
        return new TinyDate(addYears(this.value, amount));
    }

    startOfDay(): TinyDate {
        return new TinyDate(startOfDay(this.value));
    }

    startOfWeek(options?: { locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): TinyDate {
        return new TinyDate(startOfWeek(this.value, options));
    }

    startOfMonth(): TinyDate {
        return new TinyDate(startOfMonth(this.value));
    }

    startOfQuarter(): TinyDate {
        return new TinyDate(startOfQuarter(this.value));
    }

    startOfYear(): TinyDate {
        return new TinyDate(startOfYear(this.value));
    }

    endOfDay(): TinyDate {
        return new TinyDate(endOfDay(this.value));
    }

    endOfWeek(options?: { locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): TinyDate {
        return new TinyDate(endOfWeek(this.value, options));
    }

    endOfMonth(): TinyDate {
        return new TinyDate(endOfMonth(this.value));
    }

    endOfQuarter(): TinyDate {
        return new TinyDate(endOfQuarter(this.value));
    }

    endOfYear(): TinyDate {
        return new TinyDate(endOfYear(this.value));
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
}
