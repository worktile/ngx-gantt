import { GanttViewMonth } from '../month';
import { GanttViewDay } from '../day';
import { GanttDate } from '../../utils/date';
import { GanttViewQuarter } from '../quarter';

const today = new GanttDate('2020-02-01 00:00:00');

const date = {
    start: {
        date: new GanttDate('2020-01-01 00:00:00'),
        isCustom: true
    },
    end: {
        date: new GanttDate('2020-12-31 00:00:00'),
        isCustom: true
    }
};

const options = {
    cellWidth: 20
};

describe('GanttView', () => {
    let ganttViewDay: GanttViewDay;
    let ganttViewMonth: GanttViewMonth;
    let ganttViewQuarter: GanttViewQuarter;

    beforeEach(() => {
        ganttViewDay = new GanttViewDay(date.start, date.end, {
            cellWidth: 20,
            start: today.startOfYear().startOfWeek({ weekStartsOn: 1 }),
            end: today.endOfYear().endOfWeek({ weekStartsOn: 1 })
        });
        ganttViewMonth = new GanttViewMonth(date.start, date.end, {
            cellWidth: 310,
            start: today.startOfQuarter().addQuarters(-1),
            end: today.endOfQuarter().addQuarters(2)
        });
        ganttViewQuarter = new GanttViewQuarter(date.start, date.end, {
            cellWidth: 910,
            start: today.addYears(-1).startOfYear(),
            end: today.addYears(1).endOfYear()
        });
    });

    it(`should has correct view start`, () => {
        const startOfDay = ganttViewDay.startOf(date.start.date).getUnixTime();
        const startOfMonth = ganttViewMonth.startOf(date.start.date).getUnixTime();
        const startOfQuarter = ganttViewQuarter.startOf(date.start.date).getUnixTime();
        expect(startOfDay).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
        expect(startOfMonth).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
        expect(startOfQuarter).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct view end`, () => {
        const endOfDay = ganttViewDay.endOf(date.end.date).getUnixTime();
        const endOfMonth = ganttViewMonth.endOf(date.end.date).getUnixTime();
        const endOfQuarter = ganttViewQuarter.endOf(date.end.date).getUnixTime();
        expect(endOfDay).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
        expect(endOfMonth).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
        expect(endOfQuarter).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should has correct cell width`, () => {
        const dayCellWidth = ganttViewDay.getDayOccupancyWidth();
        const monthCellWidth = ganttViewMonth.getDayOccupancyWidth(date.start.date);
        const quarterCellWidth = ganttViewQuarter.getDayOccupancyWidth(date.start.date);
        expect(dayCellWidth).toEqual(20);
        expect(monthCellWidth).toEqual(10);
        expect(quarterCellWidth).toEqual(10);
    });

    it(`should has correct primary width`, () => {
        const dayPrimaryWidth = ganttViewDay.getPrimaryWidth();
        const monthPrimaryWidth = ganttViewMonth.getPrimaryWidth();
        const quarterPrimaryWidth = ganttViewQuarter.getPrimaryWidth();
        expect(dayPrimaryWidth).toEqual(140);
        expect(monthPrimaryWidth).toEqual(930);
        expect(quarterPrimaryWidth).toEqual(3640);
    });

    it(`should has correct primary date points`, () => {
        const dayPoints = ganttViewDay.getPrimaryDatePoints();
        const monthPoints = ganttViewMonth.getPrimaryDatePoints();
        const quarterPoints = ganttViewQuarter.getPrimaryDatePoints();
        expect(dayPoints.length).toBe(54);
        expect(monthPoints.length).toBe(4);
        expect(quarterPoints.length).toBe(1);
    });

    it(`should has correct secondary date points`, () => {
        const dayPoints = ganttViewDay.getSecondaryDatePoints();
        const monthPoints = ganttViewMonth.getSecondaryDatePoints();
        const quarterPoints = ganttViewQuarter.getSecondaryDatePoints();
        expect(dayPoints.length).toBe(371);
        expect(monthPoints.length).toBe(12);
        expect(quarterPoints.length).toBe(4);
    });
});
