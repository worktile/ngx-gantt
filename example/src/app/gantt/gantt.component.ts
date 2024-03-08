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
    GanttToolbarOptions,
    GanttView,
    GanttViewType,
    NgxGanttComponent
} from 'ngx-gantt';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { finalize, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { random, randomItems } from '../helper';

@Component({
    selector: 'app-gantt-example',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.scss'],
    providers: [GanttPrintService]
})
export class AppGanttExampleComponent implements OnInit, AfterViewInit {
    views = [
        {
            name: '小时',
            value: GanttViewType.hour
        },
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

    items: GanttItem[] = [
        { id: '000000', title: 'Task 0', start: 1627729997, end: 1627769997 },
        // { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'],  },
        { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '0000029'] },
        { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797, progress: 0.5 },
        { id: '000003', title: 'Task 3 (不可拖动)', start: 1628507597, end: 1633345997, itemDraggable: false },
        { id: '000004', title: 'Task 4', start: 1624705997 },
        { id: '000005', title: 'Task 5', start: 1628075597, end: 1629544397, color: '#709dc1' },
        { id: '000006', title: 'Task 6', start: 1641121997, end: 1645528397 },
        { id: '000007', title: 'Task 7', start: 1639393997, end: 1640862797 },
        { id: '000008', title: 'Task 8', end: 1628783999, color: '#709dc1' },
        { id: '000009', title: 'Task 9', start: 1639307597, end: 1640344397 },
        { id: '0000010', title: 'Task 10', start: 1609067597, end: 1617275597 },
        { id: '0000011', title: 'Task 11', start: 1611918797, end: 1611918797 },
        { id: '0000012', title: 'Task 12', start: 1627816397, end: 1631358797 },
        { id: '0000013', title: 'Task 13', start: 1625051597, end: 1630667597, links: ['0000012'] },
        { id: '0000014', title: 'Task 14', start: 1627920000, end: 1629129599 },
        { id: '0000015', title: 'Task 15', start: 1633259597, end: 1639480397 },
        { id: '0000016', title: 'Task 16', start: 1624965197, end: 1627211597 },
        { id: '0000017', title: 'Task 17', start: 1641035597, end: 1649157197 },
        { id: '0000018', title: 'Task 18', start: 1637061197, end: 1642677197 },
        { id: '0000019', title: 'Task 19', start: 1637925197, end: 1646305997 },
        { id: '0000020', title: 'Task 20', start: 1628334797, end: 1629889997 },
        { id: '0000021', title: 'Task 21', start: 1622891597, end: 1627643597 },
        { id: '0000022', title: 'Task 22', start: 1616238797, end: 1620731597 },
        { id: '0000023', title: 'Task 23', start: 1626693197, end: 1630149197 },
        { id: '0000024', title: 'Task 24', start: 1626174797, end: 1626952397 },
        { id: '0000025', title: 'Task 25', start: 1631013197, end: 1637493197 },
        { id: '0000026', title: 'Task 26', start: 1635937997, end: 1643886797 },
        { id: '0000027', title: 'Task 27', start: 1637665997, end: 1644059597 },
        { id: '0000028', title: 'Task 28', start: 1611400397, end: 1615547597 },
        { id: '0000029', title: 'Task 29', start: 1618053197, end: 1619176397 }
    ];

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

    dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
        return true;
    };

    constructor(private printService: GanttPrintService, private thyNotify: ThyNotifyService) {}

    ngOnInit(): void {
        // init items children
        this.items.forEach((item, index) => {
            if (index % 5 === 0) {
                item.children = randomItems(random(1, 5), item);
            }
        });

        console.log(this.items);
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
        event.current && this.ganttComponent.scrollToDate(event.current?.start);

        this.thyNotify.info(
            'Event: selectedChange',
            `当前选中的 item 的 id 为 ${(event.selectedValue as GanttItem[]).map((item) => item.id).join('、')}`
        );
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
}
