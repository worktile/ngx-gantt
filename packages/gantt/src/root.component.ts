import { Component, OnInit, HostBinding, NgZone, ElementRef, Inject, ContentChild, TemplateRef, Input, Optional } from '@angular/core';
import { GanttDomService, ScrollDirection } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { take, takeUntil, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttPrintService } from './gantt-print.service';

@Component({
    selector: 'ngx-gantt-root',
    templateUrl: './root.component.html',
    providers: [GanttDomService, GanttDragContainer]
})
export class NgxGanttRootComponent implements OnInit {
    @Input() sideWidth: number;

    @HostBinding('class.gantt') ganttClass = true;

    @ContentChild('sideTemplate', { static: true }) sideTemplate: TemplateRef<any>;

    @ContentChild('mainTemplate', { static: true }) mainTemplate: TemplateRef<any>;

    private unsubscribe$ = new Subject();

    private get view() {
        return this.ganttUpper.view;
    }

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private ngZone: NgZone,
        private dom: GanttDomService,
        public dragContainer: GanttDragContainer,
        @Inject(GANTT_UPPER_TOKEN) private ganttUpper: GanttUpper,
        @Optional() private printService: GanttPrintService
    ) {
        this.ganttUpper.dragContainer = dragContainer;
    }

    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.dom.initialize(this.elementRef);

            if (this.printService) {
                this.printService.register(this.elementRef);
            }
            this.setupScrollClass();
            this.setupResize();
            this.setupViewScroll();

            // 优化初始化时Scroll滚动体验问题，通过透明度解决，默认透明度为0，滚动结束后恢复
            this.elementRef.nativeElement.style.opacity = '1';
            this.ganttUpper.viewChange.pipe(startWith(null)).subscribe(() => {
                this.scrollToToday();
            });
        });
    }

    private setupViewScroll() {
        if (this.ganttUpper.disabledLoadOnScroll) {
            return;
        }
        this.dom
            .getViewerScroll()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                if (event.direction === ScrollDirection.LEFT) {
                    const dates = this.view.addStartDate();
                    if (dates) {
                        event.target.scrollLeft += this.view.getDateRangeWidth(dates.start, dates.end);
                        this.ngZone.run(() => {
                            this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() });
                        });
                    }
                }
                if (event.direction === ScrollDirection.RIGHT) {
                    const dates = this.view.addEndDate();
                    if (dates) {
                        this.ngZone.run(() => {
                            this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() });
                        });
                    }
                }
            });
    }

    private setupResize() {
        this.dom
            .getResize()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.setupScrollClass();
            });
    }

    private setupScrollClass() {
        const mainContainer = this.dom.mainContainer as HTMLElement;
        const height = mainContainer.offsetHeight;
        const scrollHeight = mainContainer.scrollHeight;
        if (scrollHeight > height) {
            this.elementRef.nativeElement.className = 'gantt gantt-scroll';
        } else {
            this.elementRef.nativeElement.className = 'gantt';
        }
    }

    private scrollToToday() {
        const x = this.view.getTodayXPoint();
        this.dom.scrollMainContainer(x);
    }
}
