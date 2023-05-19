import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGanttExampleComponent } from './gantt/gantt.component';
import { AppGanttAdvancedExampleComponent } from './gantt-advanced/gantt-advanced.component';
import { AppGanttRangeExampleComponent } from './gantt-range/gantt-range.component';
import { AppExampleComponentsComponent } from './components/components.component';
import { AppGanttGroupsExampleComponent } from './gantt-groups/gantt-groups.component';
import { AppGanttCustomViewExampleComponent } from './gantt-custom-view/gantt.component';
import { AppGanttVirtualScrollExampleComponent } from './gantt-virtual-scroll/gantt.component';

const routes: Routes = [
    {
        path: 'components',
        component: AppExampleComponentsComponent,
        children: [
            { path: '', redirectTo: 'basic', pathMatch: 'full' },
            { path: 'basic', component: AppGanttExampleComponent },
            { path: 'groups', component: AppGanttGroupsExampleComponent },
            { path: 'virtual-scroll', component: AppGanttVirtualScrollExampleComponent },
            { path: 'custom-view', component: AppGanttCustomViewExampleComponent },
            { path: 'advanced', component: AppGanttAdvancedExampleComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
