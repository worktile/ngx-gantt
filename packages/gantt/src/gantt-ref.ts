import { InjectionToken } from '@angular/core';
import { GanttView } from './views/view';
import { GanttStyles } from './gantt.styles';
import { BehaviorSubject } from 'rxjs';

export interface GanttRef {
    element: HTMLElement;
    view: GanttView;
    styles: GanttStyles;
    draggable: boolean;
    linkable?: boolean;
    groupExpand$: BehaviorSubject<boolean>;
    detectChanges(): void;
}

export const GANTT_REF_TOKEN = new InjectionToken<GanttRef>('GANTT_REF_TOKEN');
