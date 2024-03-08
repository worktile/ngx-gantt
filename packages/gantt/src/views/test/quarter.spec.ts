import { GanttDate } from '../../utils/date';
import { GanttViewQuarter } from '../quarter';
import { date, today } from './mock';

describe('GanttViewQuarter', () => {
    let ganttViewQuarter: GanttViewQuarter;

    beforeEach(() => {
        ganttViewQuarter = new GanttViewQuarter(date.start, date.end, {
            cellWidth: 910,
            start: today.addYears(-1).startOfYear(),
            end: today.addYears(1).endOfYear()
        });
    });

    it(`should has correct view start`, () => {
        const startOfQuarter = ganttViewQuarter.viewStartOf(date.start.date).getUnixTime();
        expect(startOfQuarter).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfQuarter = ganttViewQuarter.viewEndOf(date.end.date).getUnixTime();
        expect(endOfQuarter).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const quarterCellWidth = ganttViewQuarter.getDayOccupancyWidth(date.start.date);
        expect(quarterCellWidth).toEqual(10);
    });

    it(`should has correct primary width`, () => {
        const quarterPrimaryWidth = ganttViewQuarter.getPrimaryWidth();
        expect(quarterPrimaryWidth).toEqual(3640);
    });

    it(`should has correct primary date points`, () => {
        const quarterPoints = ganttViewQuarter.getPrimaryDatePoints();
        expect(quarterPoints.length).toBe(1);
    });

    it(`should has correct secondary date points`, () => {
        const quarterPoints = ganttViewQuarter.getSecondaryDatePoints();
        expect(quarterPoints.length).toBe(4);
    });
});
