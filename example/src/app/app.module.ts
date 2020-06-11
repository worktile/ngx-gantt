import { DocgeniTemplateModule, CONFIG_TOKEN, routes, RootComponent, initializeDocgeniSite, GlobalContext } from '@docgeni/template';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { config } from './content/config';
import { RouterModule } from '@angular/router';
import { LIB_EXAMPLE_LOADER_PROVIDER } from './content/example-loader';
import './content/navigations.json';
import { NgxGanttModule } from 'ngx-gantt';
import { AppComponent } from './app.component';
import { AppExamplesComponent } from './examples/examples.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppFlatExampleComponent } from './flat/flat.component';

@NgModule({
    declarations: [AppComponent, AppExamplesComponent, AppFlatExampleComponent],
    imports: [CommonModule, DocgeniTemplateModule, NgxGanttModule, AppRoutingModule, RouterModule.forRoot([...routes])],
    providers: [
        { provide: APP_INITIALIZER, useFactory: initializeDocgeniSite, deps: [GlobalContext], multi: true },
        LIB_EXAMPLE_LOADER_PROVIDER,
        {
            provide: CONFIG_TOKEN,
            useValue: config
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
