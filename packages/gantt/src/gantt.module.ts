import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Inject, NgModule, Optional } from '@angular/core';
import { setDefaultOptions } from 'date-fns';
import { NgxGanttBarComponent } from './components/bar/bar.component';
import { NgxGanttBaselineComponent } from './components/baseline/baseline.component';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttLinksComponent } from './components/links/links.component';
import { GanttLoaderComponent } from './components/loader/loader.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { NgxGanttRangeComponent } from './components/range/range.component';
import { GanttTableBodyComponent } from './components/table/body/gantt-table-body.component';
import { GanttTableHeaderComponent } from './components/table/header/gantt-table-header.component';
import { NgxGanttToolbarComponent } from './components/toolbar/toolbar.component';
import { NgxGanttComponent } from './gantt.component';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig, defaultConfig } from './gantt.config';
import { IsGanttBarItemPipe, IsGanttCustomItemPipe, IsGanttRangeItemPipe } from './gantt.pipe';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        ScrollingModule,
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        GanttTableHeaderComponent,
        GanttTableBodyComponent,
        GanttMainComponent,
        GanttCalendarHeaderComponent,
        GanttCalendarGridComponent,
        GanttLinksComponent,
        GanttLoaderComponent,
        NgxGanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent,
        NgxGanttRangeComponent,
        NgxGanttRootComponent,
        NgxGanttBaselineComponent,
        NgxGanttToolbarComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe
    ],
    exports: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        NgxGanttRootComponent,
        NgxGanttBarComponent,
        NgxGanttRangeComponent,
        NgxGanttBaselineComponent,
        NgxGanttToolbarComponent,
        GanttCalendarHeaderComponent,
        GanttCalendarGridComponent,
        GanttDragBackdropComponent
    ],
    providers: [
        CdkVirtualScrollViewport,
        {
            provide: GANTT_GLOBAL_CONFIG,
            useValue: defaultConfig
        }
    ]
})
export class NgxGanttModule {
    constructor(@Optional() @Inject(GANTT_GLOBAL_CONFIG) ganttGlobalConfig: GanttGlobalConfig) {
        setDefaultOptions({
            locale: ganttGlobalConfig?.dateOptions?.locale,
            weekStartsOn: ganttGlobalConfig?.dateOptions?.weekStartsOn || 1
        });
    }
}
