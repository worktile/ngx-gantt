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
import { GANTT_GLOBAL_CONFIG, GanttConfigService, defaultConfig } from './gantt.config';
import { GanttDateFormatPipe, IsGanttBarItemPipe, IsGanttCustomItemPipe, IsGanttRangeItemPipe } from './gantt.pipe';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GanttScrollbarComponent } from './components/scrollbar/scrollbar.component';
import { i18nLocaleProvides } from './i18n';
import * as i0 from "@angular/core";
export class NgxGanttModule {
    constructor() {
        const configService = inject(GanttConfigService);
        setDefaultOptions({
            locale: configService.getDateLocale(),
            weekStartsOn: configService.config?.dateOptions?.weekStartsOn
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, imports: [CommonModule,
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
            GanttDateFormatPipe], exports: [NgxGanttComponent,
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
            GanttScrollbarComponent,
            GanttDateFormatPipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, providers: [
            CdkVirtualScrollViewport,
            {
                provide: GANTT_GLOBAL_CONFIG,
                useValue: defaultConfig
            },
            ...i18nLocaleProvides
        ], imports: [CommonModule,
            DragDropModule,
            ScrollingModule,
            NgxGanttComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, decorators: [{
            type: NgModule,
            args: [{
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
                        GanttDateFormatPipe
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
                        GanttScrollbarComponent,
                        GanttDateFormatPipe
                    ],
                    providers: [
                        CdkVirtualScrollViewport,
                        {
                            provide: GANTT_GLOBAL_CONFIG,
                            useValue: defaultConfig
                        },
                        ...i18nLocaleProvides
                    ]
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2dhbnR0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ25GLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDN0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDckYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDaEcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDdEcsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDaEcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDNUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDN0YsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sd0RB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d0JBQ3JCLG9CQUFvQjt3QkFDcEIsc0JBQXNCO3dCQUN0Qix5QkFBeUI7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIsNEJBQTRCO3dCQUM1QiwwQkFBMEI7d0JBQzFCLDBCQUEwQjt3QkFDMUIsdUJBQXVCO3dCQUN2QixtQkFBbUI7cUJBQ3RCO29CQUNELFNBQVMsRUFBRTt3QkFDUCx3QkFBd0I7d0JBQ3hCOzRCQUNJLE9BQU8sRUFBRSxtQkFBbUI7NEJBQzVCLFFBQVEsRUFBRSxhQUFhO3lCQUMxQjt3QkFDRCxHQUFHLGtCQUFrQjtxQkFDeEI7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHsgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCBTY3JvbGxpbmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBpbmplY3QsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBzZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IE5neEdhbnR0QmFyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Jhci9iYXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbnR0QmFzZWxpbmVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYmFzZWxpbmUvYmFzZWxpbmUuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0Q2FsZW5kYXJHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NhbGVuZGFyL2dyaWQvY2FsZW5kYXItZ3JpZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgR2FudHRDYWxlbmRhckhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhci9oZWFkZXIvY2FsZW5kYXItaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBHYW50dERyYWdCYWNrZHJvcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kcmFnLWJhY2tkcm9wL2RyYWctYmFja2Ryb3AuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0SWNvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pY29uL2ljb24uY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0TGlua3NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbGlua3MvbGlua3MuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0TG9hZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2xvYWRlci9sb2FkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0TWFpbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9tYWluL2dhbnR0LW1haW4uY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbnR0UmFuZ2VDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcmFuZ2UvcmFuZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0VGFibGVCb2R5Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlL2JvZHkvZ2FudHQtdGFibGUtYm9keS5jb21wb25lbnQnO1xuaW1wb3J0IHsgR2FudHRUYWJsZUhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS9oZWFkZXIvZ2FudHQtdGFibGUtaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYW50dFRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbGJhci90b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYW50dENvbXBvbmVudCB9IGZyb20gJy4vZ2FudHQuY29tcG9uZW50JztcbmltcG9ydCB7IEdBTlRUX0dMT0JBTF9DT05GSUcsIEdhbnR0Q29uZmlnU2VydmljZSwgR2FudHRHbG9iYWxDb25maWcsIGRlZmF1bHRDb25maWcgfSBmcm9tICcuL2dhbnR0LmNvbmZpZyc7XG5pbXBvcnQgeyBHYW50dERhdGVGb3JtYXRQaXBlLCBJc0dhbnR0QmFySXRlbVBpcGUsIElzR2FudHRDdXN0b21JdGVtUGlwZSwgSXNHYW50dFJhbmdlSXRlbVBpcGUgfSBmcm9tICcuL2dhbnR0LnBpcGUnO1xuaW1wb3J0IHsgTmd4R2FudHRSb290Q29tcG9uZW50IH0gZnJvbSAnLi9yb290LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYW50dFRhYmxlQ29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi90YWJsZS9nYW50dC1jb2x1bW4uY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbnR0VGFibGVDb21wb25lbnQgfSBmcm9tICcuL3RhYmxlL2dhbnR0LXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBHYW50dFNjcm9sbGJhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zY3JvbGxiYXIvc2Nyb2xsYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBpMThuTG9jYWxlUHJvdmlkZXMgfSBmcm9tICcuL2kxOG4nO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBEcmFnRHJvcE1vZHVsZSxcbiAgICAgICAgU2Nyb2xsaW5nTW9kdWxlLFxuICAgICAgICBOZ3hHYW50dENvbXBvbmVudCxcbiAgICAgICAgTmd4R2FudHRUYWJsZUNvbXBvbmVudCxcbiAgICAgICAgTmd4R2FudHRUYWJsZUNvbHVtbkNvbXBvbmVudCxcbiAgICAgICAgR2FudHRUYWJsZUhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgR2FudHRUYWJsZUJvZHlDb21wb25lbnQsXG4gICAgICAgIEdhbnR0TWFpbkNvbXBvbmVudCxcbiAgICAgICAgR2FudHRDYWxlbmRhckhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgR2FudHRDYWxlbmRhckdyaWRDb21wb25lbnQsXG4gICAgICAgIEdhbnR0TGlua3NDb21wb25lbnQsXG4gICAgICAgIEdhbnR0TG9hZGVyQ29tcG9uZW50LFxuICAgICAgICBOZ3hHYW50dEJhckNvbXBvbmVudCxcbiAgICAgICAgR2FudHRJY29uQ29tcG9uZW50LFxuICAgICAgICBHYW50dERyYWdCYWNrZHJvcENvbXBvbmVudCxcbiAgICAgICAgTmd4R2FudHRSYW5nZUNvbXBvbmVudCxcbiAgICAgICAgTmd4R2FudHRSb290Q29tcG9uZW50LFxuICAgICAgICBOZ3hHYW50dEJhc2VsaW5lQ29tcG9uZW50LFxuICAgICAgICBOZ3hHYW50dFRvb2xiYXJDb21wb25lbnQsXG4gICAgICAgIEdhbnR0U2Nyb2xsYmFyQ29tcG9uZW50LFxuICAgICAgICBJc0dhbnR0UmFuZ2VJdGVtUGlwZSxcbiAgICAgICAgSXNHYW50dEJhckl0ZW1QaXBlLFxuICAgICAgICBJc0dhbnR0Q3VzdG9tSXRlbVBpcGUsXG4gICAgICAgIEdhbnR0RGF0ZUZvcm1hdFBpcGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgTmd4R2FudHRDb21wb25lbnQsXG4gICAgICAgIE5neEdhbnR0VGFibGVDb21wb25lbnQsXG4gICAgICAgIE5neEdhbnR0VGFibGVDb2x1bW5Db21wb25lbnQsXG4gICAgICAgIE5neEdhbnR0Um9vdENvbXBvbmVudCxcbiAgICAgICAgTmd4R2FudHRCYXJDb21wb25lbnQsXG4gICAgICAgIE5neEdhbnR0UmFuZ2VDb21wb25lbnQsXG4gICAgICAgIE5neEdhbnR0QmFzZWxpbmVDb21wb25lbnQsXG4gICAgICAgIE5neEdhbnR0VG9vbGJhckNvbXBvbmVudCxcbiAgICAgICAgR2FudHRDYWxlbmRhckhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgR2FudHRDYWxlbmRhckdyaWRDb21wb25lbnQsXG4gICAgICAgIEdhbnR0RHJhZ0JhY2tkcm9wQ29tcG9uZW50LFxuICAgICAgICBHYW50dFNjcm9sbGJhckNvbXBvbmVudCxcbiAgICAgICAgR2FudHREYXRlRm9ybWF0UGlwZVxuICAgIF0sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogR0FOVFRfR0xPQkFMX0NPTkZJRyxcbiAgICAgICAgICAgIHVzZVZhbHVlOiBkZWZhdWx0Q29uZmlnXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmkxOG5Mb2NhbGVQcm92aWRlc1xuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FudHRNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBjb25maWdTZXJ2aWNlID0gaW5qZWN0KEdhbnR0Q29uZmlnU2VydmljZSk7XG5cbiAgICAgICAgc2V0RGVmYXVsdE9wdGlvbnMoe1xuICAgICAgICAgICAgbG9jYWxlOiBjb25maWdTZXJ2aWNlLmdldERhdGVMb2NhbGUoKSxcbiAgICAgICAgICAgIHdlZWtTdGFydHNPbjogY29uZmlnU2VydmljZS5jb25maWc/LmRhdGVPcHRpb25zPy53ZWVrU3RhcnRzT25cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19