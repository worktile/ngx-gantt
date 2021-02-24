import { GanttViewMonth } from '../month';
import { GanttViewDay } from '../day';
import { GanttDate } from '../../utils/date';
import { GanttViewQuarter } from '../quarter';

const date = {
    start: {
        date: new GanttDate(1577808000),
        isCustom: true
    },
    end: {
        date: new GanttDate(1609344000),
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
        ganttViewDay = new GanttViewDay(date.start, date.end, options);
        ganttViewMonth = new GanttViewMonth(date.start, date.end, { cellWidth: 310 });
        ganttViewQuarter = new GanttViewQuarter(date.start, date.end, { cellWidth: 910 });
    });

    it(`should has correct view start`, () => {
        const startOfDay = ganttViewDay.startOf(date.start.date).getUnixTime();
        const startOfMonth = ganttViewMonth.startOf(date.start.date).getUnixTime();
        const startOfQuarter = ganttViewQuarter.startOf(date.start.date).getUnixTime();

        expect(startOfDay).toEqual(1577635200);
        expect(startOfMonth).toEqual(1577808000);
        expect(startOfQuarter).toEqual(1577808000);
    });

    it(`should has correct view end`, () => {
        const endOfDay = ganttViewDay.endOf(date.end.date).getUnixTime();
        const endOfMonth = ganttViewMonth.endOf(date.end.date).getUnixTime();
        const endOfQuarter = ganttViewQuarter.endOf(date.end.date).getUnixTime();
        expect(endOfDay).toEqual(1609689599);
        expect(endOfMonth).toEqual(1609430399);
        expect(endOfQuarter).toEqual(1609430399);
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
        console.log(ganttViewMonth.start, ganttViewMonth.end);
        expect(dayPoints.length).toBe(371);
        expect(monthPoints.length).toBe(12);
        expect(quarterPoints.length).toBe(4);
    });
});
