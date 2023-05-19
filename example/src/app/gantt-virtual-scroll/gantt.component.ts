import { Component, OnInit, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
import { GanttItem, GanttPrintService, NgxGanttComponent } from 'ngx-gantt';
import { randomItems, random } from '../helper';

@Component({
    selector: 'app-gantt-virtual-scroll-example',
    templateUrl: './gantt.component.html',
    providers: [GanttPrintService]
})
export class AppGanttVirtualScrollExampleComponent implements OnInit, AfterViewInit {
    items: GanttItem[] = randomItems(10000);

    @HostBinding('class.gantt-example-component') class = true;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}

    ngOnInit(): void {
        // init items children
        this.items.forEach((item, index) => {
            if (index % 5 === 0) {
                item.children = randomItems(random(1, 5), item);
            }
        });
    }

    ngAfterViewInit() {
        setTimeout(() => this.ganttComponent.scrollToDate(1627729997), 200);
    }
}
