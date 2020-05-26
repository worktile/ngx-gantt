import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt.component';
import { GanttCalendarComponent } from './calendar/calendar.component';
import { GanttTableComponent } from './table/gantt-table.component';
import { GanttContainerComponent } from './layout/gantt-container.component';
import { GanttSideComponent } from './layout/gantt-side.component';
import { GanttFlatComponent } from './flat/gantt-flat.component';

@NgModule({
    imports: [CommonModule],
    exports: [GanttComponent],
    declarations: [
        GanttComponent,
        GanttTableComponent,
        GanttFlatComponent,
        GanttSideComponent,
        GanttContainerComponent,
        GanttCalendarComponent,
    ],
    providers: [],
})
export class NgxGanttModule {}
