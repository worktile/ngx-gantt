import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GanttItem, GanttPrintService, GanttVirtualScrolledIndexChangeEvent, NgxGanttComponent } from 'ngx-gantt';
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

    virtualScrolledIndexChange(event: GanttVirtualScrolledIndexChangeEvent) {
        // 检查滚动位置是否接近列表底部
        if (event.renderedRange.end + 20 >= event.count) {
            // 加载更多数据
            if (!this.loading) {
                const items = randomItems(100);
                this.loading = true;
                of(items)
                    .pipe(delay(1000))
                    .subscribe(() => {
                        console.log('loadDone');
                        this.loading = false;
                        this.items = [...this.items, ...items];
                        this.cdr.detectChanges();
                    });
            }
        }
    }
}
