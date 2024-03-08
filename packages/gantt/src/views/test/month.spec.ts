import { GanttViewMonth } from '../month';
import { GanttDate } from '../../utils/date';
import { date, today } from './mock';

describe('GanttViewMonth', () => {
    let ganttViewMonth: GanttViewMonth;

    beforeEach(() => {
        ganttViewMonth = new GanttViewMonth(date.start, date.end, {
            cellWidth: 310,
            start: today.startOfQuarter().addQuarters(-1),
            end: today.endOfQuarter().addQuarters(2)
        });
    });

    it(`should has correct view start`, () => {
        const startOfMonth = ganttViewMonth.viewStartOf(date.start.date).getUnixTime();
        expect(startOfMonth).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfMonth = ganttViewMonth.viewEndOf(date.end.date).getUnixTime();
        expect(endOfMonth).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const monthCellWidth = ganttViewMonth.getDayOccupancyWidth(date.start.date);
        expect(monthCellWidth).toEqual(10);
    });

    it(`should has correct primary width`, () => {
        const monthPrimaryWidth = ganttViewMonth.getPrimaryWidth();
        expect(monthPrimaryWidth).toEqual(930);
    });

    it(`should has correct primary date points`, () => {
        const monthPoints = ganttViewMonth.getPrimaryDatePoints();
        expect(monthPoints.length).toBe(4);
    });

    it(`should has correct secondary date points`, () => {
        const monthPoints = ganttViewMonth.getSecondaryDatePoints();
        expect(monthPoints.length).toBe(12);
    });
});
