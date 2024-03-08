import { GanttViewOptions, GanttViewDate, GanttView } from './view';
import { GanttViewMonth } from './month';
import { GanttViewType } from '../class/view-type';
import { GanttViewQuarter } from './quarter';
import { GanttViewDay } from './day';
import { GanttViewWeek } from './week';
import { GanttViewYear } from './year';
import { GanttViewHour } from './hour';

const ganttViewsMap = {
    [GanttViewType.hour]: GanttViewHour,
    [GanttViewType.day]: GanttViewDay,
    [GanttViewType.week]: GanttViewWeek,
    [GanttViewType.month]: GanttViewMonth,
    [GanttViewType.quarter]: GanttViewQuarter,
    [GanttViewType.year]: GanttViewYear
};

export function registerView<T extends typeof GanttView>(type: string, view: T) {
    ganttViewsMap[type] = view;
}

export function createViewFactory(type: GanttViewType, start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    return new ganttViewsMap[type](start, end, options);
}
