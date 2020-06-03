import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttCalendarComponent } from './components/calendar/calendar.component';
import { GanttTableComponent } from './components/table/gantt-table.component';
import { NgxGanttFlatComponent } from './flat/gantt-flat.component';
import { GanttBarComponent } from './components/bar/bar.component';
import { GanttTableColumnComponent } from './components/table/column/column.component';
import { NgxGanttComponent } from './gantt.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';

@NgModule({
    imports: [CommonModule],
    exports: [NgxGanttComponent, NgxGanttFlatComponent, GanttTableColumnComponent],
    declarations: [
        NgxGanttComponent,
        NgxGanttFlatComponent,
        GanttTableColumnComponent,
        GanttMainComponent,
        GanttTableComponent,
        GanttCalendarComponent,
        GanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent
    ],
    providers: []
})
export class NgxGanttModule {}
