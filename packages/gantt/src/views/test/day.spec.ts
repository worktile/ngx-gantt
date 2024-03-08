import { GanttDate } from '../../utils/date';
import { GanttViewDay } from '../day';
import { date, today } from './mock';

describe('GanttViewDay', () => {
    let ganttViewDay: GanttViewDay;

    beforeEach(() => {
        ganttViewDay = new GanttViewDay(date.start, date.end, {
            cellWidth: 20,
            start: today.startOfYear().startOfWeek(),
            end: today.endOfYear().endOfWeek()
        });
    });

    it(`should has correct view start`, () => {
        const startOfDay = ganttViewDay.viewStartOf(date.start.date).getUnixTime();
        expect(startOfDay).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfDay = ganttViewDay.viewEndOf(date.end.date).getUnixTime();
        expect(endOfDay).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const dayCellWidth = ganttViewDay.getDayOccupancyWidth();
        expect(dayCellWidth).toEqual(20);
    });

    it(`should has correct primary width`, () => {
        const dayPrimaryWidth = ganttViewDay.getPrimaryWidth();
        expect(dayPrimaryWidth).toEqual(140);
    });

    it(`should has correct primary date points`, () => {
        const dayPoints = ganttViewDay.getPrimaryDatePoints();
        expect(dayPoints.length).toBe(54);
    });

    it(`should has correct secondary date points`, () => {
        const dayPoints = ganttViewDay.getSecondaryDatePoints();
        expect(dayPoints.length).toBe(371);
    });
});
