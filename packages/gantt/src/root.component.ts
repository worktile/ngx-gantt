import {
    Component,
    OnInit,
    NgZone,
    ElementRef,
    TemplateRef,
    OnDestroy,
    HostListener,
    input,
    contentChild,
    viewChild,
    inject
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
import { NgTemplateOutlet } from '@angular/common';
import { GanttSyncScrollXDirective, GanttSyncScrollYDirective } from './directives/sync-scroll.directive';
import { GanttSyncScrollService } from './gantt-sync-scroll.service';
import { outputToObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ngx-gantt-root',
    templateUrl: './root.component.html',
    providers: [GanttDomService, GanttDragContainer, GanttSyncScrollService],
    host: {
        class: 'gantt'
    },
    imports: [
        CdkScrollable,
        NgTemplateOutlet,
        GanttCalendarHeaderComponent,
        GanttCalendarGridComponent,
        GanttDragBackdropComponent,
        NgxGanttToolbarComponent,
        GanttSyncScrollXDirective,
        GanttSyncScrollYDirective
    ]
})
export class NgxGanttRootComponent implements OnInit, OnDestroy {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    private ngZone = inject(NgZone);

    private dom = inject(GanttDomService);

    dragContainer = inject(GanttDragContainer);

    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    private printService = inject(GanttPrintService, { optional: true })!;

    readonly sideWidth = input<number>(undefined);

    readonly sideTemplate = contentChild<TemplateRef<any>>('sideTemplate');

    readonly mainTemplate = contentChild<TemplateRef<any>>('mainTemplate');

    /** The native `<gantt-drag-backdrop></gantt-drag-backdrop>` element. */
    readonly backdrop = viewChild(GanttDragBackdropComponent, { read: ElementRef });

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

    constructor() {
        const dragContainer = this.dragContainer;
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
                outputToObservable(this.ganttUpper.viewChange)
                    .pipe(startWith<null, null>(null), takeUntil(this.unsubscribe$))
                    .subscribe(() => {
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
        if (this.ganttUpper.disableLoadOnScroll() && !this.ganttUpper.quickTimeFocus()) {
            return;
        }
        this.dom
            .getViewerScroll(passiveListenerOptions)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                if (event.direction === ScrollDirection.LEFT) {
                    const dates = this.view.addStartDate();
                    if (dates) {
                        event.target.scrollLeft += this.view.calculateRangeWidth(dates.start, dates.end);
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
        const x = this.view.getNowX();
        this.dom.scrollMainContainer(x);
    }

    public scrollToDate(date: number | Date | GanttDate) {
        let x: number;
        if (typeof date === 'number' || date instanceof Date) {
            x = this.view.getXAtDate(new GanttDate(date));
        } else {
            x = this.view.getXAtDate(date);
        }

        this.dom.scrollMainContainer(x);
    }
}
