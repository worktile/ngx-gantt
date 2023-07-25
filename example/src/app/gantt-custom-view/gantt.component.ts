import { Component, OnInit, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
import {
    GanttBarClickEvent,
    GanttDragEvent,
    GanttLineClickEvent,
    GanttLinkDragEvent,
    GanttItem,
    NgxGanttComponent,
    GanttSelectedEvent,
    registerView
} from 'ngx-gantt';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { randomItems, random } from '../helper';
import { GanttViewCustom } from './custom-day-view';

const customViewType = 'custom';

registerView(customViewType, GanttViewCustom);

@Component({
    selector: 'app-gantt-custom-view-example',
    templateUrl: './gantt.component.html'
})
export class AppGanttCustomViewExampleComponent implements OnInit {
    viewType = customViewType;

    showWeekend = true;

    items: GanttItem[] = [
        { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
        { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
        { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
        { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true },
        { id: '000004', title: 'Task 4', start: 1624705997, expandable: true },
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

    viewOptions = {
        showWeekend: true
    };

    @HostBinding('class.gantt-example-component') class = true;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    childrenResolve = (item: GanttItem) => {
        const children = randomItems(random(1, 5), item);
        return of(children).pipe(delay(1000));
    };

    constructor(private thyNotify: ThyNotifyService) {}

    ngOnInit(): void {}

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

    weekendChange() {
        console.log(this.showWeekend);
        this.viewOptions = { showWeekend: this.showWeekend };
    }
}
