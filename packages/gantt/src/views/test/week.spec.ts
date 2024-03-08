import { GanttDate } from '../../utils/date';
import { GanttViewWeek } from '../week';
import { date, today } from './mock';

describe('GanttViewWeek', () => {
    let ganttViewWeek: GanttViewWeek;

    beforeEach(() => {
        ganttViewWeek = new GanttViewWeek(date.start, date.end, {
            cellWidth: 140,
            start: today.startOfYear().startOfWeek(),
            end: today.endOfYear().endOfWeek()
        });
    });

    it(`should has correct view start`, () => {
        const startOfWeek = ganttViewWeek.viewStartOf(date.start.date).getUnixTime();
        expect(startOfWeek).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfWeek = ganttViewWeek.viewEndOf(date.end.date).getUnixTime();
        expect(endOfWeek).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const weekCellWidth = ganttViewWeek.getDayOccupancyWidth();
        expect(weekCellWidth).toEqual(20);
    });

    it(`should has correct primary width`, () => {
        const weekPrimaryWidth = ganttViewWeek.getPrimaryWidth();
        expect(weekPrimaryWidth).toEqual(140);
    });

    it(`should has correct primary date points`, () => {
        const weekPoints = ganttViewWeek.getPrimaryDatePoints();
        expect(weekPoints.length).toBe(54);
    });

    it(`should has correct secondary date points`, () => {
        const weekPoints = ganttViewWeek.getSecondaryDatePoints();
        expect(weekPoints.length).toBe(54);
    });
});
