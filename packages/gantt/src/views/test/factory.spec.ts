import { GanttViewMonth } from '../month';
import { GanttViewDay } from '../day';
import { GanttViewQuarter } from '../quarter';
import { createViewFactory, registerView } from '../factory';
import { GanttViewType } from '../../class';
import { date } from './mock';
import { GanttViewYear } from '../year';
import { GanttViewWeek } from '../week';
import { GanttViewCustom } from './custom-view.mock';

describe('CreateViewFactory', () => {
    it(`should be day view`, () => {
        const dayView = createViewFactory(GanttViewType.day, date.start, date.end);
        expect(dayView).toEqual(jasmine.any(GanttViewDay));
    });

    it(`should be week view`, () => {
        const weekView = createViewFactory(GanttViewType.week, date.start, date.end);
        expect(weekView).toEqual(jasmine.any(GanttViewWeek));
    });

    it(`should be month view`, () => {
        const monthView = createViewFactory(GanttViewType.month, date.start, date.end);
        expect(monthView).toEqual(jasmine.any(GanttViewMonth));
    });

    it(`should be quarter view`, () => {
        const quarterView = createViewFactory(GanttViewType.quarter, date.start, date.end);
        expect(quarterView).toEqual(jasmine.any(GanttViewQuarter));
    });

    it('should be year view', () => {
        const yearView = createViewFactory(GanttViewType.year, date.start, date.end);
        expect(yearView).toEqual(jasmine.any(GanttViewYear));
    });

    // it(`should throw error`, () => {
    //     expect(() => {
    //         createViewFactory(GanttViewType.year, date.start, date.end);
    //     }).toThrow(new Error('gantt view type invalid'));
    // });
});

describe('RegisterView', () => {
    it(`should register custom view`, () => {
        const viewType = 'custom';
        registerView(viewType, GanttViewCustom);
        const customView = createViewFactory(viewType as GanttViewType, date.start, date.end);
        expect(customView).toEqual(jasmine.any(GanttViewCustom));
    });
});
