import { DocgeniTemplateModule, CONFIG_TOKEN, routes, initializeDocgeniSite, GlobalContext } from '@docgeni/template';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { config } from './content/config';
import { RouterModule } from '@angular/router';
import { LIB_EXAMPLE_LOADER_PROVIDER } from './content/example-loader';
import './content/navigations.json';
import { NgxGanttModule } from 'ngx-gantt';
import { AppComponent } from './app.component';
import { AppGanttExampleComponent } from './gantt/gantt.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppGanttFlatExampleComponent } from './gantt-flat/flat.component';
import { EXAMPLE_MODULES } from './content/example-modules';
import { AppGanttRangeExampleComponent } from './gantt-range/gantt-range.component';
import { AppGanttFlatComponent } from './gantt-flat/component/flat.component';

@NgModule({
    declarations: [
        AppComponent,
        AppGanttExampleComponent,
        AppGanttFlatExampleComponent,
        AppGanttRangeExampleComponent,
        AppGanttFlatComponent
    ],
    imports: [CommonModule, DocgeniTemplateModule, NgxGanttModule, AppRoutingModule, RouterModule.forRoot([...routes]), ...EXAMPLE_MODULES],
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
