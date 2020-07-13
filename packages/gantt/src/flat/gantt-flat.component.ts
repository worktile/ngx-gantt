import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ElementRef,
    NgZone,
    HostBinding,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../gantt-upper';
import { GanttGroupInternal, GanttItemInternal } from '../class';
import { startWith, takeUntil } from 'rxjs/operators';

export class GanttFlatGroupInternal extends GanttGroupInternal {
    sprints: GanttItemInternal[][];
    versions: GanttItemInternal[][];
}

@Component({
    selector: 'ngx-gantt-flat',
    templateUrl: './gantt-flat.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: NgxGanttFlatComponent
        }
    ]
})
export class NgxGanttFlatComponent extends GanttUpper implements OnInit, OnChanges, OnDestroy {
    mergeIntervalDays = 3;

    groups: GanttFlatGroupInternal[] = [];

    @HostBinding('class.gantt-flat') ganttFlatClass = true;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone) {
        super(elementRef, cdr, ngZone);
    }

    private buildGroupMergedItems(items: GanttItemInternal[]) {
        const mergedItems: GanttItemInternal[][] = [];
        items = items.filter((item) => item.start && item.end).sort((a, b) => a.start.getUnixTime() - b.start.getUnixTime());
        items.forEach((item) => {
            let indexOfMergedItems = -1;
            for (let i = 0; i < mergedItems.length; i++) {
                const subItems = mergedItems[i];
                if (item.start.value > subItems[subItems.length - 1].end.addDays(this.mergeIntervalDays).value) {
                    subItems.push(item);
                    indexOfMergedItems = i;
                    break;
                }
            }
            // 如果没有合适的位置插入，则插入到最后一行
            if (indexOfMergedItems === -1) {
                mergedItems.push([item]);
                indexOfMergedItems = mergedItems.length - 1;
            }
        });
        return mergedItems;
    }

    ngOnInit() {
        super.onInit();
        this.dragEnded.pipe(startWith(null), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.buildGroupItems();
        });
    }

    private buildGroupItems() {
        this.groups.forEach((group) => {
            group.versions = this.buildGroupMergedItems(group.items.filter((item, index) => index % 2 === 1));
            group.sprints = this.buildGroupMergedItems(group.items.filter((item, index) => index % 2 === 0));
            // 如果没有数据，默认填充一行空行
            group.versions = group.versions.length === 0 ? [[]] : group.versions;
            group.sprints = group.sprints.length === 0 ? [[]] : group.sprints;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.onChanges(changes);
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
