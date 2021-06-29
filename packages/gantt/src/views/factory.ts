import { GanttViewOptions, GanttViewDate } from './view';
import { GanttViewMonth } from './month';
import { GanttDate } from '../utils/date';
import { GanttViewType } from '../class/view-type';
import { GanttViewQuarter } from './quarter';
import { GanttViewDay } from './day';
import { GanttViewWeek } from './week';

export function createViewFactory(type: GanttViewType, start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    switch (type) {
        case GanttViewType.month:
            return new GanttViewMonth(start, end, options);
        case GanttViewType.week:
            return new GanttViewWeek(start, end, options);
        case GanttViewType.quarter:
            return new GanttViewQuarter(start, end, options);
        case GanttViewType.day:
            return new GanttViewDay(start, end, options);
        default:
            throw new Error('gantt view type invalid');
    }
}
