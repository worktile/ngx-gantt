import { GanttDate } from '../date';

describe('tiny-date', () => {
    const date = new GanttDate('2020-2-2 20:20:20');

    it('support getTime', () => expect(date.getTime()).toBe(date.value.getTime()));

    it('support getMilliseconds', () => expect(date.getMilliseconds()).toBe(date.value.getMilliseconds()));

    it('support add', () => {
        let newGanttDate: GanttDate;

        newGanttDate = date.addYears(1);
        expect(newGanttDate.getYear()).toBe(date.getYear() + 1);

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

    it('support clone', () => {
        expect(date.getTime()).toBe(date.clone().getTime());
    });
});
