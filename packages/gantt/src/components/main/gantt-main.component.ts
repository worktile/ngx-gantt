import { Component, HostBinding, Inject, Input, TemplateRef, Output, EventEmitter, OnInit, AfterViewInit, NgZone } from '@angular/core';
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
import { combineLatest, from, Subject, take, takeUntil } from 'rxjs';

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
        GanttIconComponent
    ]
})
export class GanttMainComponent implements OnInit {
    @Input() viewportItems: (GanttGroupInternal | GanttItemInternal)[];

    @Input() flatItems: (GanttGroupInternal | GanttItemInternal)[];

    @Input() groupHeaderTemplate: TemplateRef<any>;

    @Input() itemTemplate: TemplateRef<any>;

    @Input() barTemplate: TemplateRef<any>;

    @Input() rangeTemplate: TemplateRef<any>;

    @Input() baselineTemplate: TemplateRef<any>;

    @Input() ganttRoot: NgxGanttRootComponent;

    @Input() quickTimeFocus: boolean;

    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

    private unsubscribe$ = new Subject<void>();

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        public dom: GanttDomService,
        protected ngZone: NgZone
    ) {}

    ngOnInit(): void {
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
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
        this.ganttRoot.scrollToDate(date);
    }
}
