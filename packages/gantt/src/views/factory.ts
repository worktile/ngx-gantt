import { GanttViewOptions } from './view';
import { GanttViewMonth } from './month';
import { GanttDate } from '../date';
import { GanttViewType } from '../class/view-types.enum';
import { GanttViewQuarter } from './quarter';
import { GanttViewDay } from './day';
import { GanttOptions } from '../gantt.options';

export function createViewFactory(type: GanttViewType, start: GanttDate, end: GanttDate, options?: GanttOptions) {
    switch (type) {
        case GanttViewType.month:
            return new GanttViewMonth(start, end, options);
        case GanttViewType.quarter:
            return new GanttViewQuarter(start, end, options);
        case GanttViewType.day:
            return new GanttViewDay(start, end, options);
        default:
            throw new Error('gantt view type invalid');
    }
}
