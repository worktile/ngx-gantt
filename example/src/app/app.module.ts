import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxGanttModule } from 'ngx-gantt';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, NgxGanttModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
