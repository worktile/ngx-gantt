import { Component, OnInit, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
import {
    GanttBarClickEvent,
    GanttViewType,
    GanttLineClickEvent,
    GanttItem,
    GanttPrintService,
    NgxGanttComponent,
    GanttBaselineItem,
    GanttView,
    GanttToolbarOptions
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
    styleUrls: ['./gantt-loader.component.scss'],
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

    sortType: Direction = Direction.default;

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

    constructor(private printService: GanttPrintService, private thyNotify: ThyNotifyService) {}

    ngOnInit(): void {
        this.items = items;
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

    fetchItems(direction: Direction = 0, delayTime = 0) {
        this.loading = true;
        const resp = this.sortItems(direction);
        of(resp)
            .pipe(
                delay(delayTime),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((res) => {
                this.items = res;
            });
    }

    onSort() {
        if (this.loading) return;
        this.sortType =
            this.sortType === Direction.default
                ? Direction.ascending
                : this.sortType === Direction.ascending
                ? Direction.descending
                : Direction.default;
        this.fetchItems(this.sortType, this.sortType === Direction.default ? 500 : 3000);
    }

    deepClone(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    sortItems(dire: Direction) {
        const cloneItems = this.deepClone(items);
        switch (dire) {
            case Direction.default:
                return cloneItems;
            case Direction.ascending:
                return cloneItems.sort((a, b) => Number(a.id) - Number(b.id));
            case Direction.descending:
                return cloneItems.sort((a, b) => Number(b.id) - Number(a.id));
        }
    }
    viewChange(event: GanttView) {
        this.selectedViewType = event.viewType;
    }
}
