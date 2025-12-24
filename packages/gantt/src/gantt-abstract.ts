import { InjectionToken, ChangeDetectorRef, Signal } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal } from './class';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GanttStyleOptions } from './gantt.config';

export interface GanttAbstractComponent {
    table: Signal<NgxGanttTableComponent>;
    fullStyles: Signal<GanttStyleOptions>;
    maxLevel: Signal<number>;
    async: Signal<boolean>;
    cdr: ChangeDetectorRef;
    expandGroup(group: GanttGroupInternal): void;
    expandChildren(item: GanttItemInternal): void;
}

export const GANTT_ABSTRACT_TOKEN = new InjectionToken<GanttAbstractComponent>('gantt-abstract-token');
