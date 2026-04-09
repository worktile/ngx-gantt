import { GanttViewMonth } from '../../views/month';
import { GanttViewDay } from '../../views/day';
import { GanttViewQuarter } from '../../views/quarter';
import { createView, registerView } from '../../views/factory';
import { GanttViewType } from '../../class';
import { date } from './mock';
import { GanttViewYear } from '../../views/year';
import { GanttViewWeek } from '../../views/week';
import { GanttViewCustom } from './custom-view.mock';

describe('CreateViewFactory', () => {
    it(`should be day view`, () => {
        const dayView = createView(GanttViewType.day, date.start, date.end);
        expect(dayView).toEqual(jasmine.any(GanttViewDay));
    });

    it(`should be week view`, () => {
        const weekView = createView(GanttViewType.week, date.start, date.end);
        expect(weekView).toEqual(jasmine.any(GanttViewWeek));
    });

    it(`should be month view`, () => {
        const monthView = createView(GanttViewType.month, date.start, date.end);
        expect(monthView).toEqual(jasmine.any(GanttViewMonth));
    });

    it(`should be quarter view`, () => {
        const quarterView = createView(GanttViewType.quarter, date.start, date.end);
        expect(quarterView).toEqual(jasmine.any(GanttViewQuarter));
    });

    it('should be year view', () => {
        const yearView = createView(GanttViewType.year, date.start, date.end);
        expect(yearView).toEqual(jasmine.any(GanttViewYear));
    });

    // it(`should throw error`, () => {
    //     expect(() => {
    //         createView(GanttViewType.year, date.start, date.end);
    //     }).toThrow(new Error('gantt view type invalid'));
    // });
});

describe('RegisterView', () => {
    it(`should register custom view`, () => {
        const viewType = 'custom';
        registerView(viewType, GanttViewCustom);
        const customView = createView(viewType as GanttViewType, date.start, date.end);
        expect(customView).toEqual(jasmine.any(GanttViewCustom));
    });
});
