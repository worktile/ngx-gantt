import { InjectionToken } from '@angular/core';
import { GanttView } from './views/view';
import { GanttStyles } from './gantt.styles';

export interface GanttRef {
    element: HTMLElement;
    view: GanttView;
    styles: GanttStyles;
    draggable: boolean;
    linkable?: boolean;
    expandChange(): void;
    detectChanges(): void;
}

export const GANTT_REF_TOKEN = new InjectionToken<GanttRef>('GANTT_REF_TOKEN');
