import { GanttViewYear } from '../year';
import { GanttDate } from '../../utils/date';
import { date, today } from './mock';

describe('GanttViewYear', () => {
    let ganttViewYear: GanttViewYear;

    beforeEach(() => {
        ganttViewYear = new GanttViewYear(date.start, date.end, {
            cellWidth: 732,
            start: today.addYears(-1).startOfYear(),
            end: today.addYears(1).endOfYear()
        });
    });

    it(`should has correct view start`, () => {
        const startOfDay = ganttViewYear.viewStartOf(date.start.date).getUnixTime();
        expect(startOfDay).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfDay = ganttViewYear.viewEndOf(date.end.date).getUnixTime();
        expect(endOfDay).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const yearCellWidth = ganttViewYear.getDayOccupancyWidth(date.start.date);
        expect(yearCellWidth).toEqual(2);
    });

    it(`should has correct primary width`, () => {
        const yearPrimaryWidth = ganttViewYear.getPrimaryWidth();
        expect(yearPrimaryWidth).toEqual(732);
    });

    it(`should has correct primary date points`, () => {
        const yearPoints = ganttViewYear.getPrimaryDatePoints();
        expect(yearPoints.length).toBe(1);
    });

    it(`should has correct secondary date points`, () => {
        const yearPoints = ganttViewYear.getSecondaryDatePoints();
        expect(yearPoints.length).toBe(1);
    });
});
