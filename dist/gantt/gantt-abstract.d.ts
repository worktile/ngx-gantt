import { InjectionToken, ChangeDetectorRef } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal } from './class';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GanttStyleOptions } from './gantt.config';
export interface GanttAbstractComponent {
    table: NgxGanttTableComponent;
    styles: GanttStyleOptions;
    maxLevel: number;
    async: boolean;
    cdr: ChangeDetectorRef;
    expandGroup(group: GanttGroupInternal): void;
    expandChildren(item: GanttItemInternal): void;
}
export declare const GANTT_ABSTRACT_TOKEN: InjectionToken<GanttAbstractComponent>;
