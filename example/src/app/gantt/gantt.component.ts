import { AfterViewInit, Component, HostBinding, OnInit, ViewChild, inject } from '@angular/core';
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
    private printService = inject(GanttPrintService);
    private thyNotify = inject(ThyNotifyService);

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
        { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '0000029'], draggable: false },
        { id: '000002', title: 'Task 2', start: 1617361997, end: 1625483597, progress: 0.5, linkable: false },
        { id: '000003', title: 'Task 3 (不可拖动)', start: 1628507597, end: 1633345997, itemDraggable: false },
        { id: '000004', title: 'Task 4', start: 1624705997 },
        { id: '000005', title: 'Task 5', start: 1628075597, end: 1629544397, color: '#709dc1' },
        { id: '000006', title: 'Task 6', start: 1641121997, end: 1645528397 },
        { id: '000007', title: 'Task 7', start: 1639393997, end: 1640862797 },
        { id: '000008', title: 'Task 8', end: 1628783999, color: '#709dc1' },
        { id: '000009', title: 'Task 9', start: 1639307597, end: 1640344397 },
        { id: '0000010', title: 'Task 10', start: 1609067597, end: 1617275597 },
        { id: '0000011', title: 'Task 11', start: new Date(1611918797 * 1000), end: new Date(1611918797 * 1000) },
        { id: '0000012', title: 'Task 12', start: new Date(1627816397 * 1000), end: new Date(1631358797 * 1000) },
        { id: '0000013', title: 'Task 13', start: new Date(1625051597 * 1000), end: new Date(1630667597 * 1000), links: ['0000012'] },
        { id: '0000014', title: 'Task 14', start: new Date(1627920000 * 1000), end: new Date(1629129599 * 1000) },
        { id: '0000015', title: 'Task 15', start: new Date(1633259597 * 1000), end: new Date(1639480397 * 1000) },
        { id: '0000016', title: 'Task 16', start: new Date(1624965197 * 1000), end: new Date(1627211597 * 1000) },
        { id: '0000017', title: 'Task 17', start: new Date(1641035597 * 1000), end: new Date(1649157197 * 1000) },
        { id: '0000018', title: 'Task 18', start: new Date(1637061197 * 1000), end: new Date(1642677197 * 1000) },
        { id: '0000019', title: 'Task 19', start: new Date(1637925197 * 1000), end: new Date(1646305997 * 1000) },
        { id: '0000020', title: 'Task 20', start: new Date(1628334797 * 1000), end: new Date(1629889997 * 1000) },
        { id: '0000021', title: 'Task 21', start: new Date(1622891597 * 1000), end: new Date(1627643597 * 1000) },
        { id: '0000022', title: 'Task 22', start: new Date(1616238797 * 1000), end: new Date(1620731597 * 1000) },
        { id: '0000023', title: 'Task 23', start: new Date(1626693197 * 1000), end: new Date(1630149197 * 1000) },
        { id: '0000024', title: 'Task 24', start: new Date(1626174797 * 1000), end: new Date(1626952397 * 1000) },
        { id: '0000025', title: 'Task 25', start: new Date(1631013197 * 1000), end: new Date(1637493197 * 1000) },
        { id: '0000026', title: 'Task 26', start: new Date(1635937997 * 1000), end: new Date(1643886797 * 1000) },
        { id: '0000027', title: 'Task 27', start: new Date(1637665997 * 1000), end: new Date(1644059597 * 1000) },
        { id: '0000028', title: 'Task 28', start: new Date(1611400397 * 1000), end: new Date(1615547597 * 1000) },
        { id: '0000029', title: 'Task 29', start: new Date(1618053197 * 1000), end: new Date(1619176397 * 1000) }
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
        console.log(`点击了数据行 ${event.current.id}`);
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

    viewChange(event: GanttView) {
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
