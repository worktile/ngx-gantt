import { Component, HostBinding, Inject, Input, TemplateRef, Output, EventEmitter, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal, GanttBarClickEvent, GanttLineClickEvent } from '../../class';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { IsGanttRangeItemPipe, IsGanttBarItemPipe, IsGanttCustomItemPipe } from '../../gantt.pipe';
import { NgxGanttBaselineComponent } from '../baseline/baseline.component';
import { NgxGanttBarComponent } from '../bar/bar.component';
import { NgxGanttRangeComponent } from '../range/range.component';
import { NgFor, NgIf, NgClass, NgTemplateOutlet } from '@angular/common';
import { GanttLinksComponent } from '../links/links.component';
import { NgxGanttRootComponent } from 'ngx-gantt';
import { GanttIconComponent } from '../icon/icon.component';
import { GanttDomService } from '../../gantt-dom.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'gantt-main',
    templateUrl: './gantt-main.component.html',
    standalone: true,
    imports: [
        GanttLinksComponent,
        NgFor,
        NgIf,
        NgClass,
        NgTemplateOutlet,
        NgxGanttRangeComponent,
        NgxGanttBarComponent,
        NgxGanttBaselineComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe,
        GanttIconComponent
    ]
})
export class GanttMainComponent implements AfterViewInit {
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
        public elementRef: ElementRef,
        public dom: GanttDomService,
        protected ngZone: NgZone
    ) {}

    ngAfterViewInit(): void {
        this.setupResize();
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }

    private setupResize() {
        this.dom
            .getResize()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.dom.setVisibleRangeX();
            });
    }

    quickTime(item: GanttItemInternal, type: 'left' | 'right') {
        let date;
        if (type === 'left') {
            date = item.start ? item.start : item.end;
        }
        if (type === 'right') {
            date = item.end ? item.end : item.start;
        }
        this.ganttRoot.scrollToDate(date);
    }
}
