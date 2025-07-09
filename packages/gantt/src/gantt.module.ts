import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
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
import { GANTT_GLOBAL_CONFIG, GanttConfigService, GanttGlobalConfig, defaultConfig } from './gantt.config';
import { IsGanttBarItemPipe, IsGanttCustomItemPipe, IsGanttGroupPipe, IsGanttRangeItemPipe } from './gantt.pipe';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GanttScrollbarComponent } from './components/scrollbar/scrollbar.component';
import { i18nLocaleProvides } from './i18n';
import { GanttSyncScrollDirective } from './directives/sync-scroll.directive';

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
        GanttScrollbarComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe,
        IsGanttGroupPipe
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
        GanttDragBackdropComponent,
        GanttScrollbarComponent
    ],
    providers: [
        CdkVirtualScrollViewport,
        {
            provide: GANTT_GLOBAL_CONFIG,
            useValue: defaultConfig
        },
        ...i18nLocaleProvides
    ]
})
export class NgxGanttModule {
    constructor() {
        const configService = inject(GanttConfigService);

        setDefaultOptions({
            locale: configService.getDateLocale(),
            weekStartsOn: configService.config?.dateOptions?.weekStartsOn
        });
    }
}
