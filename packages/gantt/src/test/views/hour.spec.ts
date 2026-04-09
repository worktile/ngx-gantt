import { eachDayOfInterval, eachHourOfInterval } from '../../utils/date';
import { GanttViewHour } from '../../views/hour';
import { date } from './mock';

describe('GanttViewHour', () => {
    let ganttViewHour: GanttViewHour;

    const hourWidth = 30;

    beforeEach(() => {
        ganttViewHour = new GanttViewHour(date.start, date.end, {
            unitWidth: hourWidth
        });
    });

    it(`should correct getPeriodTicks`, () => {
        const ticks = ganttViewHour.getPeriodTicks();
        const days = eachDayOfInterval({
            start: ganttViewHour.rangeStartOf(date.start.date).value,
            end: ganttViewHour.rangeEndOf(date.end.date).value
        });
        expect(ticks.length).toEqual(days.length);
    });

    it(`should correct getUnitTicks`, () => {
        const ticks = ganttViewHour.getUnitTicks();
        const hours = eachHourOfInterval({
            start: ganttViewHour.rangeStartOf(date.start.date).value,
            end: ganttViewHour.rangeEndOf(date.end.date).value
        });
        expect(ticks.length).toEqual(hours.length);
    });

    it(`should correct getDateIntervalWidth`, () => {
        let width = ganttViewHour.calculateIntervalWidth(ganttViewHour.start, ganttViewHour.start.addDays(5));
        expect(width).toEqual(5 * (hourWidth * 24));

        width = ganttViewHour.calculateIntervalWidth(ganttViewHour.start, ganttViewHour.start.addDays(5).addMinutes(20));
        expect(width).toEqual(5 * (hourWidth * 24) + hourWidth * (20 / 60));
    });

    it(`should correct getDateByXPoint`, () => {
        let date = ganttViewHour.getDateAtX(hourWidth * 40);
        expect(date.getUnixTime()).toEqual(ganttViewHour.start.addHours(40).getUnixTime());
    });
});
