import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppExamplesComponent } from './examples/examples.component';
import { AppFlatExampleComponent } from './flat/flat.component';

const routes: Routes = [
    {
        path: 'examples',
        component: AppExamplesComponent,
    },
    {
        path: 'flat',
        component: AppFlatExampleComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
