import { NgModule } from '@angular/core';
import { GanttComponent } from './gantt.component';
import { GanttCalendarComponent } from './calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { NgxTethysModule } from 'ngx-tethys';
import { GanttBarComponent } from './bar/bar.component';
import { GanttHeaderComponent } from './header/header.component';
import { GanttDependenciesComponent } from './dependencies/dependencies.component';
import { NgxStyxSharedModule } from '@worktile/ngx-styx';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    imports: [CommonModule, NgxTethysModule, NgxStyxSharedModule, DragDropModule],
    exports: [GanttComponent],
    declarations: [GanttComponent, GanttHeaderComponent, GanttCalendarComponent, GanttBarComponent, GanttDependenciesComponent],
    providers: [],
})
export class GanttModule {}
