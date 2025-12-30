import { differenceInHours, differenceInMinutes } from 'date-fns';
import { GanttViewTick } from '../../class';
import { GanttDate } from '../../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions } from '../../views/view';
import { date, today } from './mock';

class GanttViewMock extends GanttView {
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, options);
    }

    rangeStartOf(): GanttDate {
        return new GanttDate('2020-01-01 00:00:00');
    }

    rangeEndOf(): GanttDate {
        return new GanttDate('2020-12-31 23:59:59');
    }

    getPeriodWidth(): number {
        return 3640;
    }

    getDayWidth(): number {
        return 10;
    }

    getPeriodTicks(): GanttViewTick[] {
        return [
            {
                text: '2020年',
                x: 1820,
                y: 18,
                start: new GanttDate('2020-01-01 00:00:00')
            }
        ];
    }

    getUnitTicks(): GanttViewTick[] {
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
            unitWidth: 20,
            start: today.startOfYear().startOfWeek(),
            end: today.endOfYear().endOfWeek()
        });
    });

    it(`should has correct view options`, () => {
        const options = ganttView.options;
        const unitWidth = options.unitWidth;
        const start = options.start.getUnixTime();
        const end = options.end.getUnixTime();
        const maxBoundary = options.maxBoundary.getUnixTime();
        const minBoundary = options.minBoundary.getUnixTime();

        expect(unitWidth).toEqual(20);
        expect(start).toEqual(new GanttDate('2019-12-30 00:00:00').getUnixTime());
        expect(end).toEqual(new GanttDate('2021-01-03 23:59:59').getUnixTime());
        expect(maxBoundary).toEqual(new GanttDate().addYears(1).endOfYear().getUnixTime());
        expect(minBoundary).toEqual(new GanttDate().addYears(-1).startOfYear().getUnixTime());
    });

    it(`should has correct start and end`, () => {
        const start = ganttView.start.getUnixTime();
        const end = ganttView.end.getUnixTime();
        expect(start).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
        expect(end).toEqual(new GanttDate('2020-12-31 23:59:59').getUnixTime());
    });

    it(`should add start date`, () => {
        const newDate = ganttView.addStartDate();
        if (ganttView.options.minBoundary.value > new GanttDate('2020-01-01 00:00:00').value) {
            expect(newDate).toBe(null);
        } else {
            expect(newDate.start.getUnixTime()).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
            expect(newDate.end.getUnixTime()).toEqual(new GanttDate('2020-01-01 00:00:00').getUnixTime());
        }
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
        const unitWidth = ganttView.getUnitWidth();
        expect(unitWidth).toEqual(20);
    });

    it(`should get today x point`, () => {
        const xPoint = ganttView.getNowX();
        expect(xPoint).toEqual(null);
    });

    it(`should get x point by date`, () => {
        const xPoint = ganttView.getXAtDate(new GanttDate('2020-02-01 00:00:00'));
        expect(xPoint).toEqual(310);
    });

    it(`should get date by x point`, () => {
        ganttView.getUnitTicks();
        const tickDate = ganttView.getDateAtX(60);
        expect(tickDate.getUnixTime()).toEqual(new GanttDate('2020-10-01 00:00:00').getUnixTime());
    });

    it(`should get date range width`, () => {
        const width = ganttView.calculateRangeWidth(new GanttDate('2020-03-01 00:00:00'), new GanttDate('2020-05-01 00:00:00'));
        expect(width).toEqual(620);
    });

    it(`should get diff precision date`, () => {
        let view = new GanttViewMock(date.start, date.end, { precisionUnit: 'hour' });
        const dateWithTime = new GanttDate('2022-10-10 12:50:34');
        expect(view.alignToPrecisionStart(dateWithTime).getUnixTime()).toEqual(dateWithTime.startOfHour().getUnixTime());
        expect(view.alignToPrecisionEnd(dateWithTime).getUnixTime()).toEqual(dateWithTime.endOfHour().getUnixTime());

        view = new GanttViewMock(date.start, date.end, { precisionUnit: 'minute' });
        expect(view.alignToPrecisionStart(dateWithTime).getUnixTime()).toEqual(dateWithTime.startOfMinute().getUnixTime());
        expect(view.alignToPrecisionEnd(dateWithTime).getUnixTime()).toEqual(dateWithTime.endOfMinute().getUnixTime());
    });
});
