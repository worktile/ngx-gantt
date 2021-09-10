import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGanttComponent } from './gantt.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttBarComponent } from './components/bar/bar.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttLinksComponent } from './components/links/links.component';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttRangeComponent } from './components/range/range.component';
import { IsGanttRangeItemPipe, IsGanttBarItemPipe, IsGanttCustomItemPipe } from './gantt.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { GanttTableHeaderComponent } from './components/table/header/gantt-table-header.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttTableBodyComponent } from './components/table/body/gantt-table-body.component';

@NgModule({
    imports: [CommonModule, DragDropModule, ScrollingModule],
    exports: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        NgxGanttRootComponent,
        NgxGanttBarComponent,
        NgxGanttRangeComponent
    ],
    declarations: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        GanttTableHeaderComponent,
        GanttTableBodyComponent,
        GanttMainComponent,
        GanttCalendarHeaderComponent,
        GanttCalendarGridComponent,
        GanttLinksComponent,
        NgxGanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent,
        NgxGanttRangeComponent,
        NgxGanttRootComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe
    ],
    providers: [CdkVirtualScrollViewport]
})
export class NgxGanttModule {}
