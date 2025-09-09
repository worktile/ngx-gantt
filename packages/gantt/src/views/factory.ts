import { GanttViewType } from '../class/view-type';
import { GanttViewDay } from './day';
import { GanttViewHour } from './hour';
import { GanttViewMonth } from './month';
import { GanttViewQuarter } from './quarter';
import { GanttView, GanttViewDate, GanttViewOptions } from './view';
import { GanttViewWeek } from './week';
import { GanttViewYear } from './year';

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
