import {GanttPrintService} from './../../../../packages/gantt/src/gantt-print.service';
import {Component, HostBinding} from '@angular/core';
import {
    GanttBarClickEvent,
    GanttDragEvent,
    GanttHeaderTemplate,
    GanttItem,
    GanttLineClickEvent,
    GanttLinkDragEvent,
    GanttViewOptions,
    GanttViewType
} from 'ngx-gantt';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {ThyNotifyService} from 'ngx-tethys/notify';
import {random, randomItems} from '../helper';

@Component({
    selector: 'app-gantt-example',
    templateUrl: './gantt.component.html',
    providers: [GanttPrintService]
})
export class AppGanttExampleComponent {
    views = [
        {
            name: 'Hour',
            value: GanttViewType.hour
        },
        {
            name: 'Day日',
            value: GanttViewType.day
        },
        {
            name: 'Week周',
            value: GanttViewType.week
        },
        {
            name: 'Month月',
            value: GanttViewType.month
        },
        {
            name: 'Q 季',
            value: GanttViewType.quarter
        },
        {
            name: 'Year 年',
            value: GanttViewType.year
        }
    ];

    viewType: GanttViewType = GanttViewType.hour;

    viewOptions: GanttViewOptions = {
        headerPatterns: {
            hour: {
                primaryLineTemplate: new GanttHeaderTemplate('{0}/{1}/{2}', ['dd', 'LL', 'yyyy']),
                secondaryLineTemplate: new GanttHeaderTemplate('{0}', ['HH'])
            },
            day: {
                primaryLineTemplate: new GanttHeaderTemplate('{0} {1} (week {2})', ['LLLL', 'yyyy', 'w']),
                secondaryLineTemplate: new GanttHeaderTemplate('{0}', ['d'])
            },
            week: {
                primaryLineTemplate: new GanttHeaderTemplate('{0}', ['yyyy']),
                secondaryLineTemplate: new GanttHeaderTemplate('week {0}', ['w'])
            },
            month: {
                primaryLineTemplate: new GanttHeaderTemplate('{0} of {1}', ['QQQ', 'yyyy']),
                secondaryLineTemplate: new GanttHeaderTemplate('{0}', ['LLLL'])
            },
            quarter: {
                primaryLineTemplate: new GanttHeaderTemplate('{0}', ['yyyy']),
                secondaryLineTemplate: new GanttHeaderTemplate('{0}', ['QQQ'])
            },
            year: {
                primaryLineTemplate: undefined,
                secondaryLineTemplate: new GanttHeaderTemplate('{0}', ['yyyy'])
            }
        }
    };

    items: GanttItem[] = [
        {id: '000000', title: 'Task 0', start: 1641348000, end: 1641355200},
        {id: '000001', title: 'Task 1', start: 1641355200, end: 1641375447},
        {id: '000002', title: 'Task 2', start: 1641398400, end: 1641412800}
    ];

    options = {
        viewType: GanttViewType.day,
    };

    @HostBinding('class.gantt-example-component') class = true;

    childrenResolve = (item: GanttItem) => {
        const children = randomItems(random(1, 5), item);
        return of(children).pipe(delay(1000));
    };

    constructor(private printService: GanttPrintService, private thyNotify: ThyNotifyService) {
    }

    barClick(event: GanttBarClickEvent) {
        this.thyNotify.info('Event: barClick', `你点击了 [${event.item.title}]`);
    }

    lineClick(event: GanttLineClickEvent) {
        this.thyNotify.info('Event: lineClick', `你点击了 ${event.source.title} 到 ${event.target.title} 的关联线`);
    }

    dragEnded(event: GanttDragEvent) {
        this.thyNotify.info('Event: dragEnded', `修改了 [${event.item.title}] 的时间`);
        this.items = [...this.items];
    }

    linkDragEnded(event: GanttLinkDragEvent) {
        this.items = [...this.items];
        this.thyNotify.info('Event: linkDragEnded', `创建了关联关系`);
    }

    print(name: string) {
        this.printService.print(name);
    }
}
