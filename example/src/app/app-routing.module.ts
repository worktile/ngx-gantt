import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGanttExampleComponent } from './gantt/gantt.component';
import { AppGanttFlatExampleComponent } from './gantt-flat/flat.component';

const routes: Routes = [
    {
        path: 'component',
        component: AppGanttExampleComponent,
    },
    {
        path: 'flat',
        component: AppGanttFlatExampleComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
