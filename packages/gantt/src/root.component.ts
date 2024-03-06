import {
    Component,
    OnInit,
    NgZone,
    ElementRef,
    Inject,
    ContentChild,
    TemplateRef,
    Input,
    Optional,
    OnDestroy,
    ViewChild,
    HostListener
} from '@angular/core';
import { GanttDomService, ScrollDirection } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { take, takeUntil, startWith } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttPrintService } from './gantt-print.service';
import { passiveListenerOptions } from './utils/passive-listeners';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttDate } from './utils/date';
import { NgxGanttToolbarComponent } from './components/toolbar/toolbar.component';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'ngx-gantt-root',
    templateUrl: './root.component.html',
    providers: [GanttDomService, GanttDragContainer],
    host: {
        class: 'gantt'
    },
    standalone: true,
    imports: [
        NgIf,
        CdkScrollable,
        NgTemplateOutlet,
        GanttCalendarHeaderComponent,
        GanttCalendarGridComponent,
        GanttDragBackdropComponent,
        NgxGanttToolbarComponent
    ]
})
export class NgxGanttRootComponent implements OnInit, OnDestroy {
    @Input() sideWidth: number;

    @ContentChild('sideTemplate', { static: true }) sideTemplate: TemplateRef<any>;

    @ContentChild('mainTemplate', { static: true }) mainTemplate: TemplateRef<any>;

    /** The native `<gantt-drag-backdrop></gantt-drag-backdrop>` element. */
    @ViewChild(GanttDragBackdropComponent, { static: true, read: ElementRef }) backdrop: ElementRef<HTMLElement>;

    verticalScrollbarWidth = 0;

    horizontalScrollbarHeight = 0;

    private unsubscribe$ = new Subject<void>();

    private get view() {
        return this.ganttUpper.view;
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.computeScrollBarOffset();
    }

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private ngZone: NgZone,
        private dom: GanttDomService,
        public dragContainer: GanttDragContainer,
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        @Optional() private printService: GanttPrintService
    ) {
        this.ganttUpper.dragContainer = dragContainer;
    }

    ngOnInit() {
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.dom.initialize(this.elementRef);

                if (this.printService) {
                    this.printService.register(this.elementRef);
                }
                this.setupScrollClass();
                this.setupResize();
                this.setupViewScroll();
                // 优化初始化时Scroll滚动体验问题，通过透明度解决，默认透明度为0，滚动结束后恢复
                this.elementRef.nativeElement.style.opacity = '1';
                this.ganttUpper.viewChange.pipe(startWith<null, null>(null), takeUntil(this.unsubscribe$)).subscribe(() => {
                    this.scrollToToday();
                });
                this.computeScrollBarOffset();
            });
        });
    }

    computeScrollBarOffset() {
        const ganttMainContainer = this.dom.mainContainer as HTMLElement;
        const ganttVerticalScrollContainer = this.dom.verticalScrollContainer as HTMLElement;

        let verticalScrollbarWidth = 0;
        if (ganttVerticalScrollContainer) {
            verticalScrollbarWidth = ganttVerticalScrollContainer.offsetWidth - ganttVerticalScrollContainer.clientWidth;
        } else {
            verticalScrollbarWidth = ganttMainContainer?.offsetWidth - ganttMainContainer?.clientWidth;
        }
        const horizontalScrollbarHeight = ganttMainContainer?.offsetHeight - ganttMainContainer?.clientHeight;
        this.verticalScrollbarWidth = verticalScrollbarWidth;
        this.horizontalScrollbarHeight = horizontalScrollbarHeight;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
    }

    private setupViewScroll() {
        if (this.ganttUpper.disabledLoadOnScroll) {
            return;
        }
        this.dom
            .getViewerScroll(passiveListenerOptions)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                if (event.direction === ScrollDirection.LEFT) {
                    const dates = this.view.addStartDate();
                    if (dates) {
                        event.target.scrollLeft += this.view.getDateRangeWidth(dates.start, dates.end);
                        if (this.ganttUpper.loadOnScroll.observers) {
                            this.ngZone.run(() =>
                                this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() })
                            );
                        }
                    }
                }
                if (event.direction === ScrollDirection.RIGHT) {
                    const dates = this.view.addEndDate();
                    if (dates && this.ganttUpper.loadOnScroll.observers) {
                        this.ngZone.run(() =>
                            this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() })
                        );
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

    public scrollToToday() {
        const x = this.view.getTodayXPoint();
        this.dom.scrollMainContainer(x);
    }

    public scrollToDate(date: number | GanttDate) {
        let x: number;
        if (typeof date === 'number') {
            x = this.view.getXPointByDate(new GanttDate(date));
        } else {
            x = this.view.getXPointByDate(date);
        }

        this.dom.scrollMainContainer(x);
    }
}
