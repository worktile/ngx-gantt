import { GanttViewMonth } from '../month';
import { GanttViewDay } from '../day';
import { GanttViewQuarter } from '../quarter';
import { createViewFactory } from '../factory';
import { GanttViewType } from '../../class';
import { date } from './mock';

describe('CreateViewFactory', () => {
    it(`should be day view`, () => {
        const dayView = createViewFactory(GanttViewType.day, date.start, date.end);
        expect(dayView).toEqual(jasmine.any(GanttViewDay));
    });

    it(`should be month view`, () => {
        const monthView = createViewFactory(GanttViewType.month, date.start, date.end);
        expect(monthView).toEqual(jasmine.any(GanttViewMonth));
    });

    it(`should be quarter view`, () => {
        const quarterView = createViewFactory(GanttViewType.quarter, date.start, date.end);
        expect(quarterView).toEqual(jasmine.any(GanttViewQuarter));
    });

    it(`should throw error`, () => {
        expect(() => {
            createViewFactory(GanttViewType.year, date.start, date.end);
        }).toThrow(new Error('gantt view type invalid'));
    });
});
