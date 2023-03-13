import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGanttComponent } from './gantt.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { GanttCalendarComponent } from './components/calendar/calendar.component';
import { GanttTableComponent } from './components/table/gantt-table.component';
import { NgxGanttBarComponent } from './components/bar/bar.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttLinksComponent } from './components/links/links.component';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttRangeComponent } from './components/range/range.component';
import { IsGanttRangeItemPipe, IsGanttBarItemPipe, IsGanttCustomItemPipe } from './gantt.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GANTT_GLOBAL_CONFIG, defaultConfig } from './gantt.config';
import { NgxGanttBaselineComponent } from './components/baseline/baseline.component';
import { NgxGanttToolbarComponent } from './components/toolbar/toolbar.component';

import { TreeDragDropDirective } from './drag-drop/directives/drag-drop.directive';
import { TreeDragItemDirective } from './drag-drop/directives/drag-item.directive';
import { TreeDragItemHandleDirective } from './drag-drop/directives/drag-handle.directive';

const treeDragDropDirectives = [TreeDragDropDirective, TreeDragItemDirective, TreeDragItemHandleDirective];

@NgModule({
    imports: [CommonModule, DragDropModule],
    exports: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        NgxGanttRootComponent,
        NgxGanttBarComponent,
        NgxGanttRangeComponent,
        NgxGanttBaselineComponent,
        NgxGanttToolbarComponent
    ],
    declarations: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        GanttTableComponent,
        GanttMainComponent,
        GanttCalendarComponent,
        GanttLinksComponent,
        NgxGanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent,
        NgxGanttRangeComponent,
        NgxGanttRootComponent,
        NgxGanttBaselineComponent,
        NgxGanttToolbarComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe,
        ...treeDragDropDirectives
    ],
    providers: [
        {
            provide: GANTT_GLOBAL_CONFIG,
            useValue: defaultConfig
        }
    ]
})
export class NgxGanttModule {}
