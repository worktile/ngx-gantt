import { ThyLayoutModule } from 'ngx-tethys/layout';
import { setPrintErrorWhenIconNotFound } from 'ngx-tethys/icon';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThySwitchModule } from 'ngx-tethys/switch';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyDatePickerModule } from 'ngx-tethys/date-picker';
import { inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GANTT_GLOBAL_CONFIG, GanttI18nLocale, NgxGanttModule } from 'ngx-gantt';
import { AppComponent } from './app.component';
import { AppGanttExampleComponent } from './gantt/gantt.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppGanttAdvancedExampleComponent } from './gantt-advanced/gantt-advanced.component';
import { AppGanttRangeExampleComponent } from './gantt-range/gantt-range.component';
import { DOCGENI_SITE_PROVIDERS } from './content/index';
import { DocgeniTemplateModule, GlobalContext } from '@docgeni/template';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppGanttFlatComponent } from './gantt-advanced/component/flat.component';
import { EXAMPLE_MODULES } from './content/example-modules';
import { AppExampleComponentsComponent } from './components/components.component';
import { AppGanttGroupsExampleComponent } from './gantt-groups/gantt-groups.component';
import { AppGanttCustomViewExampleComponent } from './gantt-custom-view/gantt.component';
import { AppGanttVirtualScrollExampleComponent } from './gantt-virtual-scroll/gantt.component';
import { GanttDateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
    declarations: [
        AppComponent,
        AppExampleComponentsComponent,
        AppGanttExampleComponent,
        AppGanttAdvancedExampleComponent,
        AppGanttGroupsExampleComponent,
        AppGanttVirtualScrollExampleComponent,
        AppGanttRangeExampleComponent,
        AppGanttCustomViewExampleComponent,
        AppGanttFlatComponent,
        GanttDateFormatPipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        DocgeniTemplateModule,
        NgxGanttModule,
        AppRoutingModule,
        RouterModule.forRoot([]),
        ThyButtonModule,
        ThyNavModule,
        ThyLayoutModule,
        ThyCheckboxModule,
        ThyNotifyModule,
        ThySwitchModule,
        ThyDatePickerModule,
        ...EXAMPLE_MODULES
    ],
    providers: [
        ...DOCGENI_SITE_PROVIDERS,
        {
            provide: GANTT_GLOBAL_CONFIG,
            useFactory: () => {
                const docgeniGlobalContext = inject(GlobalContext);
                return {
                    locale: docgeniGlobalContext.locale === 'en-us' ? GanttI18nLocale.enUs : GanttI18nLocale.zhHans
                };
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        setPrintErrorWhenIconNotFound(false);
    }
}
