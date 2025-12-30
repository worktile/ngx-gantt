import { GanttDate } from '../../utils/date';
import { GanttViewDay } from '../../views/day';
import { date, today } from './mock';

describe('GanttViewDay', () => {
    let ganttViewDay: GanttViewDay;

    beforeEach(() => {
        ganttViewDay = new GanttViewDay(date.start, date.end, {
            unitWidth: 20,
            start: today.startOfYear().startOfWeek(),
            end: today.endOfYear().endOfWeek()
        });
    });

    it(`should has correct view start`, () => {
        const startOfDay = ganttViewDay.rangeStartOf(date.start.date).getUnixTime();
        expect(startOfDay).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfDay = ganttViewDay.rangeEndOf(date.end.date).getUnixTime();
        expect(endOfDay).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const dayCellWidth = ganttViewDay.getDayWidth(date.start.date);
        expect(dayCellWidth).toEqual(20);
    });

    it(`should has correct primary width`, () => {
        const dayPeriodWidth = ganttViewDay.getPeriodWidth();
        expect(dayPeriodWidth).toEqual(140);
    });

    it(`should has correct period ticks`, () => {
        const dayTicks = ganttViewDay.getPeriodTicks();
        expect(dayTicks.length).toBe(54);
    });

    it(`should has correct unit ticks`, () => {
        const dayTicks = ganttViewDay.getUnitTicks();
        expect(dayTicks.length).toBe(371);
    });
});
