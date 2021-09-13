import { InjectionToken } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal } from './class';
import { GanttStyles } from './gantt.styles';
import { NgxGanttTableComponent } from './table/gantt-table.component';

export interface GanttAbstractComponent {
    table: NgxGanttTableComponent;
    styles: GanttStyles;
    maxLevel: number;
    expandGroup(group: GanttGroupInternal): void;
    expandChildren(item: GanttItemInternal): void;
}

export const GANTT_ABSTRACT_TOKEN = new InjectionToken<GanttAbstractComponent>('gantt-abstract-token');
