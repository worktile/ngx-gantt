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
import { GANTT_REF_TOKEN } from '../gantt-ref';
import { GanttUpper } from '../gantt-upper';
import { GanttDomService } from '../gantt-dom.service';
import { GanttDragContainer } from '../gantt-drag-container';
import { GanttGroupInternal, GanttItemInternal } from '../class';
import { GanttRef } from '../gantt-ref';

@Component({
    selector: 'ngx-gantt-flat',
    templateUrl: './gantt-flat.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: NgxGanttFlatComponent
        },
        GanttDomService,
        GanttDragContainer
    ]
})
export class NgxGanttFlatComponent extends GanttUpper implements GanttRef, OnInit, OnChanges, OnDestroy {
    @Input() mergeIntervalDays = 0;

    @Input() sideTitle: string;

    @HostBinding('class.gantt-flat') ganttFlatClass = true;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        dom: GanttDomService,
        dragContainer: GanttDragContainer
    ) {
        super(elementRef, cdr, ngZone, dom, dragContainer);
    }

    private buildGroupMergedItems(group: GanttGroupInternal) {
        const mergedItems: GanttItemInternal[][] = [];
        const groupItems = group.items
            .filter((item) => item.start && item.end)
            .sort((a, b) => a.start.getUnixTime() - b.start.getUnixTime());
        groupItems.forEach((item) => {
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

    private computeItemRef(item: GanttItemInternal) {
        item.updateRefs({
            width: item.start && item.end ? this.view.getDateRangeWidth(item.start.startOfDay(), item.end.endOfDay()) : 0,
            x: item.start ? this.view.getXPointByDate(item.start) : 0,
            y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
        });
    }

    ngOnInit() {
        super.onInit();
    }

    computeRefs(): void {
        this.groups.forEach((group) => {
            group.items.forEach((item) => {
                this.computeItemRef(item);
            });
            group.mergedItems = this.buildGroupMergedItems(group);
            // 如果没有数据，默认填充一行空行
            group.mergedItems = group.mergedItems.length === 0 ? [[]] : group.mergedItems;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.onChanges(changes);
        if (!this.firstChange && changes.mergeIntervalDays) {
            this.computeRefs();
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
