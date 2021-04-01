import { GanttDatePoint } from '../../class';
import { GanttDate } from '../../utils/date';

import { GanttView, GanttViewDate, GanttViewOptions } from '../view';
import { date, today } from './mock';

class GanttViewMock extends GanttView {
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, options);
    }

    startOf(): GanttDate {
        return new GanttDate('2020-01-01 00:00:00');
    }

    endOf(): GanttDate {
        return new GanttDate('2020-12-31 23:59:59');
    }

    getPrimaryWidth(): number {
        return 3640;
    }

    getDayOccupancyWidth(): number {
        return 10;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        return [
            {
                text: '2020年',
                x: 1820,
                y: 18,
                start: new GanttDate('2020-01-01 00:00:00')
            }
        ];
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        return [
            {
                text: 'Q1',
                x: 455,
                y: 36,
                start: new GanttDate('2020-01-01 00:00:00')
            },
            {
                text: 'Q2',
                x: 1365,
                y: 36,
                start: new GanttDate('2020-04-01 00:00:00')
            },
            { text: 'Q3', x: 2275, y: 36, start: new GanttDate('2020-07-01 00:00:00') },
            { text: 'Q4', x: 3185, y: 36, start: new GanttDate('2020-10-01 00:00:00') }
        ];
    }
}

describe('GanttView', () => {
    let ganttView: GanttView;

    beforeEach(() => {
        ganttView = new GanttViewMock(date.start, date.end, {
            cellWidth: 20,
            start: today.startOfYear().startOfWeek({ weekStartsOn: 1 }),
            end: today.endOfYear().endOfWeek({ weekStartsOn: 1 })
        });
    });

    it(`should has correct view options`, () => {
        const options = ganttView.options;
        const cellWidth = options.cellWidth;
        const start = options.start.getUnixTime();
        const end = options.end.getUnixTime();
        const max = options.max.getUnixTime();
        const min = options.min.getUnixTime();

        expect(cellWidth).toEqual(20);
        expect(start).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
        expect(end).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
        expect(max).toEqual(new GanttDate('2022-12-31 23:59:59').getUnixTime());
        expect(min).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should has correct start and end`, () => {
        const start = ganttView.start.getUnixTime();
        const end = ganttView.end.getUnixTime();
        expect(start).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
        expect(end).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should add start date`, () => {
        const newDate = ganttView.addStartDate();
        expect(newDate.start.getUnixTime()).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
        expect(newDate.end.getUnixTime()).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
    });

    it(`should add end date`, () => {
        const newDate = ganttView.addEndDate();
        expect(newDate.start.getUnixTime()).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
        expect(newDate.end.getUnixTime()).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should update date`, () => {
        ganttView.updateDate(new GanttDate('2020-10-01 00:00:00'), new GanttDate('2023-02-01 00:00:00'));
        expect(ganttView.start.getUnixTime()).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
        expect(ganttView.end.getUnixTime()).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should get width`, () => {
        const width = ganttView.getWidth();
        expect(width).toEqual(80);
    });

    it(`should get cell width`, () => {
        const cellWidth = ganttView.getCellWidth();
        expect(cellWidth).toEqual(20);
    });

    it(`should get today x point`, () => {
        const xPoint = ganttView.getTodayXPoint();
        expect(xPoint).toEqual(null);
    });

    it(`should get x point by date`, () => {
        const xPoint = ganttView.getXPointByDate(new GanttDate('2020-02-01 00:00:00'));
        expect(xPoint).toEqual(310);
    });

    it(`should get date by x point`, () => {
        ganttView.getSecondaryDatePoints();
        const pointDate = ganttView.getDateByXPoint(60);
        expect(pointDate.getUnixTime()).toEqual(new GanttDate('2020-10-01 00:00:00').getUnixTime());
    });

    it(`should get date range width`, () => {
        const width = ganttView.getDateRangeWidth(new GanttDate('2020-03-01 00:00:00'), new GanttDate('2020-05-01 00:00:00'));
        expect(width).toEqual(610);
    });
});
