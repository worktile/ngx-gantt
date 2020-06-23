import { InjectionToken } from '@angular/core';
import { GanttView } from './views/view';
import { GanttStyles } from './gantt.styles';
import { Subject } from 'rxjs';
import { GanttGroupInternal } from './class/group';
import { GanttItemInternal } from './class/item';

export interface GanttRef {
    element: HTMLElement;
    view: GanttView;
    styles: GanttStyles;
    draggable: boolean;
    linkable?: boolean;
    maxLevel?: number;
    viewChange: Subject<GanttView>;
    expandChange?: Subject<void>;
    expandGroup?(group: GanttGroupInternal);
    expandChildren?(item: GanttItemInternal);
}

export const GANTT_REF_TOKEN = new InjectionToken<GanttRef>('GANTT_REF_TOKEN');
