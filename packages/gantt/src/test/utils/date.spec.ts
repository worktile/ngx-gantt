import { GanttDate, setDefaultTimeZone } from '../../utils/date';

describe('tiny-date', () => {
    const date = new GanttDate('2020-2-2 20:20:20');

    it('support getTime', () => expect(date.getTime()).toBe(date.value.getTime()));

    it('support getDate', () => expect(date.getDate()).toBe(date.value.getDate()));

    it('support getMilliseconds', () => expect(date.getMilliseconds()).toBe(date.value.getMilliseconds()));

    it('support getDaysInMonth', () => {
        expect(date.getDaysInMonth()).toBe(29);
    });

    it('support getDaysInQuarter', () => {
        expect(date.getDaysInQuarter()).toBe(91);
    });

    it('support setDate', () => {
        expect(date.setDate(10).getUnixTime()).toBe(new GanttDate('2020-02-10 20:20:20').getUnixTime());
    });

    it('support startOf', () => {
        expect(date.startOfDay().getUnixTime()).toBe(new GanttDate('2020-02-02 00:00:00').getUnixTime());
        expect(date.startOfMonth().getUnixTime()).toBe(new GanttDate('2020-02-01 00:00:00').getUnixTime());
    });

    it('support endOf', () => {
        expect(date.endOfDay().getUnixTime()).toBe(new GanttDate('2020-02-02 23:59:59').getUnixTime());
        expect(date.endOfMonth().getUnixTime()).toBe(new GanttDate('2020-02-29 23:59:59').getUnixTime());
    });

    it('support is', () => {
        expect(date.isToday()).toBe(false);
        expect(date.isWeekend()).toBe(true);
    });

    it('support add', () => {
        let newGanttDate: GanttDate;

        newGanttDate = date.addYears(1);
        expect(newGanttDate.getYear()).toBe(date.getYear() + 1);

        newGanttDate = date.addQuarters(1);
        expect(newGanttDate.getUnixTime()).toBe(new GanttDate('2020-05-02 20:20:20').getUnixTime());

        newGanttDate = date.addMonths(1);
        expect(newGanttDate.getMonth()).toBe(date.getMonth() + 1);

        newGanttDate = date.addWeeks(1);
        expect(newGanttDate.getWeek()).toBe(date.getWeek() + 1);

        newGanttDate = date.addDays(1);
        expect(newGanttDate.getDay()).toBe(date.getDay() + 1);

        newGanttDate = date.addHours(1);
        expect(newGanttDate.getHours()).toBe(date.getHours() + 1);

        newGanttDate = date.addMinutes(1);
        expect(newGanttDate.getMinutes()).toBe(date.getMinutes() + 1);

        newGanttDate = date.addSeconds(1);
        expect(newGanttDate.getSeconds()).toBe(date.getSeconds() + 1);
    });

    it('support add by type', () => {
        let newGanttDate: GanttDate;

        newGanttDate = date.add(1, 'year');
        expect(newGanttDate.getYear()).toBe(date.getYear() + 1);

        newGanttDate = date.add(1, 'quarter');
        expect(newGanttDate.getUnixTime()).toBe(new GanttDate('2020-05-02 20:20:20').getUnixTime());

        newGanttDate = date.add(1, 'month');
        expect(newGanttDate.getMonth()).toBe(date.getMonth() + 1);

        newGanttDate = date.add(1, 'week');
        expect(newGanttDate.getWeek()).toBe(date.getWeek() + 1);

        newGanttDate = date.add(1, 'day');
        expect(newGanttDate.getDay()).toBe(date.getDay() + 1);

        newGanttDate = date.add(1, 'hour');
        expect(newGanttDate.getHours()).toBe(date.getHours() + 1);

        newGanttDate = date.add(1, 'minute');
        expect(newGanttDate.getMinutes()).toBe(date.getMinutes() + 1);

        newGanttDate = date.add(1, 'second');
        expect(newGanttDate.getSeconds()).toBe(date.getSeconds() + 1);

        newGanttDate = date.add(1);
        expect(newGanttDate.getSeconds()).toBe(date.getSeconds() + 1);
    });

    it('support clone', () => {
        expect(date.getTime()).toBe(date.clone().getTime());
    });

    it('support format', () => {
        expect(date.format(`yyyy年'Q'Q`)).toBe('2020年Q1');
    });

    describe('GanttDate TimeZone Operations', () => {
        afterEach(() => {
            setDefaultTimeZone(null);
        });

        it('should format date correctly in UTC timezone', () => {
            setDefaultTimeZone('UTC');
            const date = new GanttDate('2020-02-02T20:20:20Z'); // UTC time
            expect(date.format('yyyy-MM-dd HH:mm:ss')).toBe('2020-02-02 20:20:20');
        });

        it('should format date correctly in America/New_York timezone', () => {
            setDefaultTimeZone('America/New_York');
            const date = new GanttDate('2020-02-02T20:20:20Z'); // UTC time
            // New York is UTC-5 in February (no daylight saving)
            expect(date.format('yyyy-MM-dd HH:mm:ss')).toBe('2020-02-02 15:20:20');
        });

        it('should format date correctly in Asia/Shanghai timezone', () => {
            setDefaultTimeZone('Asia/Shanghai');
            const date = new GanttDate('2020-02-02T20:20:20Z'); // UTC time
            // Shanghai is UTC+8
            expect(date.format('yyyy-MM-dd HH:mm:ss')).toBe('2020-02-03 04:20:20');
        });

        it('should handle daylight saving time in America/New_York timezone', () => {
            setDefaultTimeZone('America/New_York');
            const date = new GanttDate('2020-06-02T20:20:20Z'); // UTC time
            // New York is UTC-4 in June (daylight saving time)
            expect(date.format('yyyy-MM-dd HH:mm:ss')).toBe('2020-06-02 16:20:20');
        });

        it('should handle Unix timestamp with timezone correctly', () => {
            setDefaultTimeZone('Asia/Tokyo');
            const date = new GanttDate(1580674820); // Unix timestamp for 2020-02-02T20:20:20Z
            // Tokyo is UTC+9
            expect(date.format('yyyy-MM-dd HH:mm:ss')).toBe('2020-02-03 05:20:20');
        });
    });
});
