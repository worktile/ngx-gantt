import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppExamplesComponent } from './examples/examples.component';

const routes: Routes = [
    {
        path: 'examples',
        component: AppExamplesComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
