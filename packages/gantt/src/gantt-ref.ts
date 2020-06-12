import { InjectionToken } from '@angular/core';
import { GanttView } from './views/view';
import { GanttStyles } from './gantt.styles';
import { Subject } from 'rxjs';

export interface GanttRef {
    element: HTMLElement;
    view: GanttView;
    styles: GanttStyles;
    draggable: boolean;
    linkable?: boolean;
    groupExpand$: Subject<void>;
    detectChanges(): void;
}

export const GANTT_REF_TOKEN = new InjectionToken<GanttRef>('GANTT_REF_TOKEN');
