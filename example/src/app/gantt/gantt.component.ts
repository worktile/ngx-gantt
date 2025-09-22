import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import {
    GanttBarClickEvent,
    GanttBaselineItem,
    GanttDragEvent,
    GanttItem,
    GanttLineClickEvent,
    GanttLinkDragEvent,
    GanttPrintService,
    GanttSelectedEvent,
    GanttTableDragDroppedEvent,
    GanttTableDragEndedEvent,
    GanttTableDragEnterPredicateContext,
    GanttTableDragStartedEvent,
    GanttTableItemClickEvent,
    GanttToolbarOptions,
    GanttView,
    GanttViewType,
    NgxGanttComponent
} from 'ngx-gantt';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { finalize, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { random, randomItems } from '../helper';

const cacheKeys = 'GANTT_TABLE_KEYS';

@Component({
    selector: 'app-gantt-example',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.scss'],
    providers: [GanttPrintService],
    standalone: false
})
export class AppGanttExampleComponent implements OnInit, AfterViewInit {
    toolbarOptions: GanttToolbarOptions = {
        viewTypes: [
            GanttViewType.hour,
            GanttViewType.day,
            GanttViewType.week,
            GanttViewType.month,
            GanttViewType.quarter,
            GanttViewType.year
        ]
    };

    viewType: GanttViewType = GanttViewType.month;

    selectedViewType: GanttViewType = GanttViewType.month;

    isBaselineChecked = false;

    isShowToolbarChecked = true;

    loading = false;

    items: GanttItem[] = [
        { id: '000000', title: 'Task 0', start: 1627729997, end: 1627769997, draggable: false, linkable: false },
        // { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'],  },
        
    ];

    baselineItems: GanttBaselineItem[] = [];

    options = {
        viewType: GanttViewType.day
    };

    viewOptions = {};

    width = JSON.parse(localStorage.getItem(cacheKeys));

    @HostBinding('class.gantt-example-component') class = true;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
        return true;
    };

    constructor(
        private printService: GanttPrintService,
        private thyNotify: ThyNotifyService
    ) {}

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

    itemClick(event: GanttTableItemClickEvent) {
       // console.log(`点击了数据行 ${event.current.id}`);
    }

    selectedChange(event: GanttSelectedEvent) {
        // event.current && this.ganttComponent.scrollToDate(event.current?.start);

        // this.thyNotify.info(
        //     'Event: selectedChange',
        //     `当前选中的 item 的 id 为 ${(event.selectedValue as GanttItem[]).map((item) => item.id).join('、')}`
        // );
    }

    linkDragEnded(event: GanttLinkDragEvent) {
        this.items = [...this.items];
        this.thyNotify.info('Event: linkDragEnded', `创建了关联关系`);
    }

    print(name: string) {
        this.printService.print(name);
    }

    scrollToToday() {
        this.ganttComponent.scrollToToday();
    }

    switchChange() {
        if (this.isBaselineChecked) {
            this.baselineItems = [
                { id: '000000', start: 1627728888, end: 1628421197 },
                { id: '000001', start: 1617361997, end: 1625483597 },
                { id: '000002', start: 1610536397, end: 1610622797 },
                { id: '000003', start: 1628507597, end: 1633345997 },
                { id: '000004', start: 1624705997 }
            ];
        } else {
            this.baselineItems = [];
        }
    }

    selectView(type: GanttViewType) {
        this.viewType = type;
        this.selectedViewType = type;
    }

    viewChange(event: GanttView) {
        console.log(event.viewType);
        this.selectedViewType = event.viewType;
    }

    refresh() {
        this.loading = true;
        of(randomItems(30))
            .pipe(
                delay(2000),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((res) => {
                this.items = res;
            });
    }

    onDragDropped(event: GanttTableDragDroppedEvent) {
        const sourceItems = event.sourceParent?.children || this.items;
        sourceItems.splice(sourceItems.indexOf(event.source), 1);
        if (event.dropPosition === 'inside') {
            event.target.children = [...(event.target.children || []), event.source];
        } else {
            const targetItems = event.targetParent?.children || this.items;
            if (event.dropPosition === 'before') {
                targetItems.splice(targetItems.indexOf(event.target), 0, event.source);
            } else {
                targetItems.splice(targetItems.indexOf(event.target) + 1, 0, event.source);
            }
        }
        this.items = [...this.items];
    }

    onDragStarted(event: GanttTableDragStartedEvent) {
        console.log('拖拽开始了', event);
    }

    onDragEnded(event: GanttTableDragEndedEvent) {
        console.log('拖拽结束了', event);
    }

    resizeChange(width: number) {
        this.width = width;
        localStorage.setItem(cacheKeys, JSON.stringify(width));
    }
}
