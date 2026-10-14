import { GanttDate, differenceInDays } from '../../utils/date';
import { GanttViewDay } from '../../views/day';
import { GanttViewMonth } from '../../views/month';
import { GanttViewQuarter } from '../../views/quarter';
import { GanttView, GanttViewDate } from '../../views/view';
import { GanttViewWeek } from '../../views/week';
import { GanttViewYear } from '../../views/year';

// The interval width as a day-by-day sum of getDayWidth().
function referenceIntervalWidth(view: GanttView, start: GanttDate, end: GanttDate) {
    let result = 0;
    const days = differenceInDays(end.value, start.value);
    for (let i = 0; i < Math.abs(days); i++) {
        result += view.getDayWidth(start.addDays(i));
    }
    result = days >= 0 ? result : -result;
    return Number(result.toFixed(3));
}

const range: { start: GanttViewDate; end: GanttViewDate } = {
    start: { date: new GanttDate('2020-01-01 00:00:00'), isCustom: true },
    end: { date: new GanttDate('2022-12-31 00:00:00'), isCustom: true }
};

const views: [string, () => GanttView][] = [
    ['day', () => new GanttViewDay(range.start, range.end, { unitWidth: 35 })],
    [
        'day with hidden holidays',
        () =>
            new GanttViewDay(range.start, range.end, {
                unitWidth: 35,
                holiday: { isHoliday: (date: GanttDate) => date.isWeekend(), hideHoliday: true }
            })
    ],
    ['week', () => new GanttViewWeek(range.start, range.end, { unitWidth: 140 })],
    ['month', () => new GanttViewMonth(range.start, range.end, { unitWidth: 280 })],
    ['quarter', () => new GanttViewQuarter(range.start, range.end, { unitWidth: 380 })],
    ['year', () => new GanttViewYear(range.start, range.end, { unitWidth: 480 })]
];

// Interval ends spread over the view, plus some before its start and some not at midnight.
const dates = [
    '2019-11-20 00:00:00',
    '2020-01-01 00:00:00',
    '2020-01-01 13:30:00',
    '2020-02-29 00:00:00',
    '2020-03-08 00:00:00',
    '2020-07-15 08:00:00',
    '2020-11-01 00:00:00',
    '2021-02-28 23:59:59',
    '2021-06-30 00:00:00',
    '2022-01-01 00:00:00',
    '2022-12-31 23:59:59'
].map((value) => new GanttDate(value));

describe('GanttView calculateIntervalWidth', () => {
    for (const [name, create] of views) {
        it(`should match the day-by-day sum in the ${name} view`, () => {
            const view = create();
            for (const start of dates) {
                for (const end of dates) {
                    expect(Math.abs(view.calculateIntervalWidth(start, end) - referenceIntervalWidth(view, start, end))).toBeLessThan(
                        0.0015,
                        `${start.format('yyyy-MM-dd HH:mm')} → ${end.format('yyyy-MM-dd HH:mm')}`
                    );
                }
            }
        });
    }

    it('should match the day-by-day sum after the view start moves', () => {
        const view = new GanttViewMonth(range.start, range.end, {
            unitWidth: 280,
            minBoundary: new GanttDate('2018-01-01 00:00:00')
        });
        const date = new GanttDate('2021-06-30 00:00:00');
        const before = view.getXAtDate(date);
        expect(view.extendStart()).not.toBeNull();
        expect(view.getXAtDate(date)).toBeGreaterThan(before);
        expect(Math.abs(view.getXAtDate(date) - referenceIntervalWidth(view, view.start, date))).toBeLessThan(0.0015);
    });

    it('should call getDayWidth at most once per day of the view, however many dates are positioned', () => {
        const view = new GanttViewMonth(range.start, range.end, { unitWidth: 280 });
        const spy = spyOn(view, 'getDayWidth').and.callThrough();
        const daysInView = differenceInDays(view.end.value, view.start.value) + 1;
        for (let i = 0; i < 500; i++) {
            const start = view.start.addDays((i * 7) % (daysInView - 31));
            view.getXAtDate(start);
            view.calculateRangeWidth(start, start.addDays(30));
        }
        expect(spy.calls.count()).toBeLessThanOrEqual(daysInView);
    });
});
