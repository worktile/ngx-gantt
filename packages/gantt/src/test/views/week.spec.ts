import { GanttDate } from '../../utils/date';
import { GanttViewWeek } from '../../views/week';
import { date, today } from './mock';

describe('GanttViewWeek', () => {
    let ganttViewWeek: GanttViewWeek;

    beforeEach(() => {
        ganttViewWeek = new GanttViewWeek(date.start, date.end, {
            unitWidth: 140,
            start: today.startOfYear().startOfWeek(),
            end: today.endOfYear().endOfWeek()
        });
    });

    it(`should has correct view start`, () => {
        const startOfWeek = ganttViewWeek.rangeStartOf(date.start.date).getUnixTime();
        expect(startOfWeek).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfWeek = ganttViewWeek.rangeEndOf(date.end.date).getUnixTime();
        expect(endOfWeek).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const weekCellWidth = ganttViewWeek.getDayWidth();
        expect(weekCellWidth).toEqual(20);
    });

    it(`should has correct primary width`, () => {
        const weekPeriodWidth = ganttViewWeek.getPeriodWidth();
        expect(weekPeriodWidth).toEqual(140);
    });

    it(`should has correct period ticks`, () => {
        const weekTicks = ganttViewWeek.getPeriodTicks();
        expect(weekTicks.length).toBe(54);
    });

    it(`should has correct unit ticks`, () => {
        const weekTicks = ganttViewWeek.getUnitTicks();
        expect(weekTicks.length).toBe(54);
    });
});
