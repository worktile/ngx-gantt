import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttCalendarComponent } from './calendar/calendar.component';
import { GanttTableComponent } from './table/gantt-table.component';
import { GanttFlatComponent } from './flat/gantt-flat.component';
import { GanttBarComponent } from './bar/bar.component';
import { GanttTableColumnComponent } from './table/column/column.component';
import { GanttTableGroupComponent } from './table/group/group.component';
import { GanttTableItemsComponent } from './table/items/items.component';
import { GanttComponent } from './gantt.component';
import { GanttMainComponent } from './main/gantt-main.component';
import { GanttIconComponent } from './icon/icon.component';
import { GanttDragBackdropComponent } from './drag-backdrop/drag-backdrop.component';

@NgModule({
    imports: [CommonModule],
    exports: [GanttComponent, GanttFlatComponent, GanttTableColumnComponent],
    declarations: [
        GanttComponent,
        GanttFlatComponent,
        GanttTableColumnComponent,
        GanttMainComponent,
        GanttTableComponent,
        GanttTableGroupComponent,
        GanttTableItemsComponent,
        GanttCalendarComponent,
        GanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent
    ],
    providers: []
})
export class NgxGanttModule {}
