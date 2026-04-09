import { GanttDate } from '../../utils/date';
import { GanttViewQuarter } from '../../views/quarter';
import { date, today } from './mock';

describe('GanttViewQuarter', () => {
    let ganttViewQuarter: GanttViewQuarter;

    beforeEach(() => {
        ganttViewQuarter = new GanttViewQuarter(date.start, date.end, {
            unitWidth: 910,
            start: today.addYears(-1).startOfYear(),
            end: today.addYears(1).endOfYear()
        });
    });

    it(`should has correct view start`, () => {
        const startOfQuarter = ganttViewQuarter.rangeStartOf(date.start.date).getUnixTime();
        expect(startOfQuarter).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfQuarter = ganttViewQuarter.rangeEndOf(date.end.date).getUnixTime();
        expect(endOfQuarter).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const quarterCellWidth = ganttViewQuarter.getDayWidth(date.start.date);
        expect(quarterCellWidth).toEqual(10);
    });

    it(`should has correct primary width`, () => {
        const quarterPeriodWidth = ganttViewQuarter.getPeriodWidth();
        expect(quarterPeriodWidth).toEqual(3640);
    });

    it(`should has correct period ticks`, () => {
        const quarterTicks = ganttViewQuarter.getPeriodTicks();
        expect(quarterTicks.length).toBe(1);
    });

    it(`should has correct unit ticks`, () => {
        const quarterTicks = ganttViewQuarter.getUnitTicks();
        expect(quarterTicks.length).toBe(4);
    });
});
