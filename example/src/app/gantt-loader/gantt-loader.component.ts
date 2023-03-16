import { Component, OnInit, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
import {
    GanttBarClickEvent,
    GanttViewType,
    GanttDragEvent,
    GanttLineClickEvent,
    GanttLinkDragEvent,
    GanttItem,
    GanttPrintService,
    NgxGanttComponent,
    GanttSelectedEvent,
    GanttBaselineItem,
    GanttView,
    GanttToolbarOptions,
    GanttTableDragEnterPredicateContext
} from 'ngx-gantt';
import { finalize, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { randomItems, random } from '../helper';
import { items } from './mocks';

enum Direction {
    default = 0,
    ascending = 1,
    descending = -1
}

@Component({
    selector: 'app-gantt-loader-example',
    templateUrl: './gantt-loader.component.html',
    providers: [GanttPrintService]
})
export class AppGanttLoaderExampleComponent implements OnInit, AfterViewInit {
    views = [
        {
            name: '日',
            value: GanttViewType.day
        },
        {
            name: '周',
            value: GanttViewType.week
        },
        {
            name: '月',
            value: GanttViewType.month
        },
        {
            name: '季',
            value: GanttViewType.quarter
        },
        {
            name: '年',
            value: GanttViewType.year
        }
    ];

    viewType: GanttViewType = GanttViewType.month;

    selectedViewType: GanttViewType = GanttViewType.month;

    isBaselineChecked = false;

    isShowToolbarChecked = true;

    loading = false;

    allColumns: [
        {
            key: 'id';
            name: '编号';
        },
        {
            key: 'title';
            name: '标题';
        },
        {
            key: 'start';
            name: '开始时间';
        },
        {
            key: 'end';
            name: '结束时间';
        }
    ];

    sortType: Direction = 0;

    items: GanttItem[] = [];

    toolbarOptions: GanttToolbarOptions = {
        viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
    };

    baselineItems: GanttBaselineItem[] = [];

    options = {
        viewType: GanttViewType.day
    };

    viewOptions = {
        dateFormat: {
            month: 'M月'
        }
    };

    @HostBinding('class.gantt-example-component') class = true;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    childrenResolve = (item: GanttItem) => {
        const children = randomItems(random(1, 5), item);
        return of(children).pipe(delay(1000));
    };

    dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
        return true;
    };

    constructor(private printService: GanttPrintService, private thyNotify: ThyNotifyService) {}

    ngOnInit(): void {
        this.fetchItems();
    }

    ngAfterViewInit() {
        setTimeout(() => this.ganttComponent.scrollToDate(1627729997), 200);
    }

    barClick(event: GanttBarClickEvent) {
        this.thyNotify.info('Event: barClick', `你点击了 [${event.item.title}]`);
    }

    lineClick(event: GanttLineClickEvent) {
        this.thyNotify.info('Event: lineClick', `你点击了 ${event.source.title} 到 ${event.target.title} 的关联线`);
    }

    dragMoved(event: GanttDragEvent) {}

    dragEnded(event: GanttDragEvent) {
        this.thyNotify.info('Event: dragEnded', `修改了 [${event.item.title}] 的时间`);
        this.items = [...this.items];
    }

    selectedChange(event: GanttSelectedEvent) {
        this.thyNotify.info(
            'Event: selectedChange',
            `当前选中的 item 的 id 为 ${(event.selectedValue as GanttItem[]).map((item) => item.id).join('、')}`
        );
    }

    linkDragEnded(event: GanttLinkDragEvent) {
        this.items = [...this.items];
        this.thyNotify.info('Event: linkDragEnded', `创建了关联关系`);
    }

    fetchItems(direction: Direction = 0, delayTime = 0) {
        this.loading = true;
        const resp = this.sortItems(direction);
        console.log(resp);
        of(resp)
            .pipe(
                delay(delayTime),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((res) => {
                console.log(res);
                this.items = res;
            });
    }

    onSort() {
        console.log(this.sortType);
        if (this.loading) return;
        this.sortType = (this.sortType + 1) % 3;
        this.fetchItems(this.sortType, 3000);
    }

    sortItems(dire: Direction) {
        switch (dire) {
            case Direction.default:
                return items;
            case Direction.ascending:
                return items.sort((a, b) => Number(a.id) - Number(b.id));
            case Direction.descending:
                return items.sort((a, b) => Number(b.id) - Number(a.id));
        }
    }
    viewChange(event: GanttView) {
        console.log(event.viewType);
        this.selectedViewType = event.viewType;
    }

    onDragDropped(event) {
        console.log(event);
    }
}
