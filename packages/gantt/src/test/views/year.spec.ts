import { GanttViewYear } from '../../views/year';
import { GanttDate } from '../../utils/date';
import { date, today } from './mock';

describe('GanttViewYear', () => {
    let ganttViewYear: GanttViewYear;

    beforeEach(() => {
        ganttViewYear = new GanttViewYear(date.start, date.end, {
            unitWidth: 732,
            start: today.addYears(-1).startOfYear(),
            end: today.addYears(1).endOfYear()
        });
    });

    it(`should has correct view start`, () => {
        const startOfDay = ganttViewYear.rangeStartOf(date.start.date).getUnixTime();
        expect(startOfDay).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfDay = ganttViewYear.rangeEndOf(date.end.date).getUnixTime();
        expect(endOfDay).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const yearCellWidth = ganttViewYear.getDayWidth(date.start.date);
        expect(yearCellWidth).toEqual(2);
    });

    it(`should has correct primary width`, () => {
        const yearPeriodWidth = ganttViewYear.getPeriodWidth();
        expect(yearPeriodWidth).toEqual(732);
    });

    it(`should has correct period ticks`, () => {
        const yearTicks = ganttViewYear.getPeriodTicks();
        expect(yearTicks.length).toBe(1);
    });

    it(`should has correct unit ticks`, () => {
        const yearTicks = ganttViewYear.getUnitTicks();
        expect(yearTicks.length).toBe(1);
    });
});
