import { Component, HostBinding, TemplateRef, OnInit, NgZone, inject, input, output, afterNextRender } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal, GanttBarClickEvent, GanttLineClickEvent, GanttItem } from '../../class';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { IsGanttRangeItemPipe, IsGanttBarItemPipe, IsGanttCustomItemPipe, IsGanttGroupPipe } from '../../gantt.pipe';
import { NgxGanttBaselineComponent } from '../baseline/baseline.component';
import { NgxGanttBarComponent } from '../bar/bar.component';
import { NgxGanttRangeComponent } from '../range/range.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { GanttLinksComponent } from '../links/links.component';
import { NgxGanttRootComponent } from './../../root.component';
import { GanttIconComponent } from '../icon/icon.component';
import { GanttDomService } from '../../gantt-dom.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { NgxGanttPlaceholderComponent } from '../bar/placeholder.component';

@Component({
    selector: 'gantt-main',
    templateUrl: './gantt-main.component.html',
    imports: [
        GanttLinksComponent,
        NgClass,
        NgTemplateOutlet,
        NgxGanttRangeComponent,
        NgxGanttBarComponent,
        NgxGanttBaselineComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe,
        IsGanttGroupPipe,
        GanttIconComponent,
        NgxGanttPlaceholderComponent
    ]
})
export class GanttMainComponent {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    dom = inject(GanttDomService);

    protected ngZone = inject(NgZone);

    readonly viewportItems = input<(GanttGroupInternal | GanttItemInternal)[]>(undefined);

    readonly flatItems = input<(GanttGroupInternal | GanttItemInternal)[]>(undefined);

    readonly groupHeaderTemplate = input<TemplateRef<any>>(undefined);

    readonly itemTemplate = input<TemplateRef<any>>(undefined);

    readonly barTemplate = input<TemplateRef<any>>(undefined);

    readonly rangeTemplate = input<TemplateRef<any>>(undefined);

    readonly baselineTemplate = input<TemplateRef<any>>(undefined);

    readonly ganttRoot = input<NgxGanttRootComponent>(undefined);

    readonly quickTimeFocus = input<boolean>(undefined);

    readonly barClick = output<GanttBarClickEvent>();

    readonly lineClick = output<GanttLineClickEvent>();

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

    private unsubscribe$ = new Subject<void>();

    constructor() {
        afterNextRender(() => {
            this.ngZone.runOutsideAngular(() => {
                this.setupResize();
            });
        });
    }

    toItemType(data: GanttItemInternal | GanttGroupInternal) {
        return data as GanttItemInternal;
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }

    private setupResize() {
        combineLatest([this.dom.getResize(), this.dom.getResizeByElement(this.dom.mainContainer)])
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.dom.setVisibleRangeX();
            });
    }

    quickTime(item: GanttItem, type: 'left' | 'right') {
        const date = type === 'left' ? item.start || item.end : item.end || item.start;
        this.ganttRoot().scrollToDate(date);
    }
}
