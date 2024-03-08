import { eachDayOfInterval, eachHourOfInterval } from '../../utils/date';
import { GanttViewHour } from '../hour';
import { date } from './mock';

describe('GanttViewHour', () => {
    let ganttViewHour: GanttViewHour;

    const hourWidth = 30;

    beforeEach(() => {
        ganttViewHour = new GanttViewHour(date.start, date.end, {
            cellWidth: hourWidth
        });
    });

    it(`should correct getPrimaryDatePoints`, () => {
        const points = ganttViewHour.getPrimaryDatePoints();
        const days = eachDayOfInterval({
            start: ganttViewHour.viewStartOf(date.start.date).value,
            end: ganttViewHour.viewEndOf(date.end.date).value
        });
        expect(points.length).toEqual(days.length);
    });

    it(`should correct getSecondaryDatePoints`, () => {
        const points = ganttViewHour.getSecondaryDatePoints();
        const hours = eachHourOfInterval({
            start: ganttViewHour.viewStartOf(date.start.date).value,
            end: ganttViewHour.viewEndOf(date.end.date).value
        });
        expect(points.length).toEqual(hours.length);
    });

    it(`should correct getDateIntervalWidth`, () => {
        let width = ganttViewHour.getDateIntervalWidth(ganttViewHour.start, ganttViewHour.start.addDays(5));
        expect(width).toEqual(5 * (hourWidth * 24));

        width = ganttViewHour.getDateIntervalWidth(ganttViewHour.start, ganttViewHour.start.addDays(5).addMinutes(20));
        expect(width).toEqual(5 * (hourWidth * 24) + hourWidth * (20 / 60));
    });

    it(`should correct getDateByXPoint`, () => {
        let date = ganttViewHour.getDateByXPoint(hourWidth * 40);
        expect(date.getUnixTime()).toEqual(ganttViewHour.start.addHours(40).getUnixTime());
    });
});
