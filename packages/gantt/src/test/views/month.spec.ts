import { GanttViewMonth } from '../../views/month';
import { GanttDate } from '../../utils/date';
import { date, today } from './mock';

describe('GanttViewMonth', () => {
    let ganttViewMonth: GanttViewMonth;

    beforeEach(() => {
        ganttViewMonth = new GanttViewMonth(date.start, date.end, {
            unitWidth: 310,
            start: today.startOfQuarter().addQuarters(-1),
            end: today.endOfQuarter().addQuarters(2)
        });
    });

    it(`should has correct view start`, () => {
        const startOfMonth = ganttViewMonth.rangeStartOf(date.start.date).getUnixTime();
        expect(startOfMonth).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfMonth = ganttViewMonth.rangeEndOf(date.end.date).getUnixTime();
        expect(endOfMonth).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const monthCellWidth = ganttViewMonth.getDayWidth(date.start.date);
        expect(monthCellWidth).toEqual(10);
    });

    it(`should has correct primary width`, () => {
        const monthPeriodWidth = ganttViewMonth.getPeriodWidth();
        expect(monthPeriodWidth).toEqual(930);
    });

    it(`should has correct period ticks`, () => {
        const monthTicks = ganttViewMonth.getPeriodTicks();
        expect(monthTicks.length).toBe(4);
    });

    it(`should has correct unit ticks`, () => {
        const monthTicks = ganttViewMonth.getUnitTicks();
        expect(monthTicks.length).toBe(12);
    });
});
