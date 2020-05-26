import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttCalendarComponent } from './calendar/calendar.component';
import { GanttTableComponent } from './table/gantt-table.component';
import { GanttContainerComponent } from './layout/gantt-container.component';
import { GanttSideComponent } from './layout/gantt-side.component';
import { GanttFlatComponent } from './flat/gantt-flat.component';
import { GanttBarComponent } from './bar/bar.component';

@NgModule({
    imports: [CommonModule],
    exports: [GanttTableComponent, GanttFlatComponent],
    declarations: [
        GanttTableComponent,
        GanttFlatComponent,
        GanttSideComponent,
        GanttContainerComponent,
        GanttCalendarComponent,
        GanttBarComponent,
    ],
    providers: [],
})
export class NgxGanttModule {}
