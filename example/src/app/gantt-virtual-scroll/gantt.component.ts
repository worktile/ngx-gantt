import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GanttItem, GanttPrintService, NgxGanttComponent } from 'ngx-gantt';
import { delay, of } from 'rxjs';
import { randomItems, random } from '../helper';

@Component({
    selector: 'app-gantt-virtual-scroll-example',
    templateUrl: './gantt.component.html',
    providers: [GanttPrintService]
})
export class AppGanttVirtualScrollExampleComponent implements OnInit, AfterViewInit {
    items: GanttItem[] = [];

    @HostBinding('class.gantt-example-component') class = true;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    loading = false;

    constructor(private cdr: ChangeDetectorRef) {}

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

    loadOnVirtualScroll($event: number) {
        const items = randomItems(100);
        this.loading = true;
        of(items)
            .pipe(delay(1000))
            .subscribe(() => {
                console.log('loadDone', $event);
                this.loading = false;
                this.items = [...this.items, ...items];
                this.cdr.detectChanges();
            });
    }
}
