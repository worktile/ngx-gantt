import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxGanttFlatComponent } from './flat/gantt-flat.component';
import { NgxGanttComponent } from './gantt.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';

import { GanttCalendarComponent } from './components/calendar/calendar.component';
import { GanttTableComponent } from './components/table/gantt-table.component';
import { GanttBarComponent } from './components/bar/bar.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';

@NgModule({
    imports: [CommonModule],
    exports: [NgxGanttComponent, NgxGanttFlatComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent],
    declarations: [
        NgxGanttComponent,
        NgxGanttFlatComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        GanttTableComponent,
        GanttMainComponent,
        GanttCalendarComponent,
        GanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent
    ],
    providers: []
})
export class NgxGanttModule {}
