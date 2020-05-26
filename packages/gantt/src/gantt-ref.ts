import { InjectionToken } from '@angular/core';
import { GanttView } from './views/view';
import { GanttOptions } from './gantt.options';

export interface GanttRef {
    element: HTMLElement;
    view: GanttView;
    styles: GanttOptions;
}

export const GANTT_REF_TOKEN = new InjectionToken<GanttRef>('GANTT_REF_TOKEN');
