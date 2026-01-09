import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
    afterNextRender,
    ChangeDetectorRef,
    Component,
    contentChild,
    ElementRef,
    HostListener,
    inject,
    input,
    NgZone,
    OnDestroy,
    TemplateRef,
    viewChild
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { NgxGanttToolbarComponent } from './components/toolbar/toolbar.component';
import { GanttSyncScrollXDirective, GanttSyncScrollYDirective } from './directives/sync-scroll.directive';
import { GanttDomService, ScrollDirection } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { GanttPrintService } from './gantt-print.service';
import { GanttSyncScrollService } from './gantt-sync-scroll.service';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';
import { GanttDate } from './utils/date';
import { passiveListenerOptions } from './utils/passive-listeners';

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
export class NgxGanttRootComponent implements OnDestroy {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    private ngZone = inject(NgZone);

    private dom = inject(GanttDomService);

    dragContainer = inject(GanttDragContainer);

    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    private printService = inject(GanttPrintService, { optional: true })!;

    private cdr = inject(ChangeDetectorRef);

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

        afterNextRender(() => {
            this.ngZone.runOutsideAngular(() => {
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
        // 只在值真正改变时才触发变更检测，避免无限循环
        if (this.verticalScrollbarWidth !== verticalScrollbarWidth || this.horizontalScrollbarHeight !== horizontalScrollbarHeight) {
            this.verticalScrollbarWidth = verticalScrollbarWidth;
            this.horizontalScrollbarHeight = horizontalScrollbarHeight;
            this.cdr.markForCheck();
        }
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
                    const dates = this.ganttUpper.view.extendStart();
                    if (dates) {
                        const offsetWidth = this.ganttUpper.view.calculateRangeWidth(dates.start, dates.end);
                        const currentLeft = (this.dom.mainContainer as HTMLElement).scrollLeft;
                        // 扩展左侧时间后，补偿滚动位置并同步到所有水平容器
                        this.dom.syncHorizontalScroll(currentLeft + offsetWidth);
                        this.cdr.markForCheck();
                        if (this.ganttUpper.loadOnScroll) {
                            this.ngZone.run(() =>
                                this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() })
                            );
                        }
                    }
                }
                if (event.direction === ScrollDirection.RIGHT) {
                    const dates = this.ganttUpper.view.extendEnd();
                    this.cdr.markForCheck();
                    if (dates && this.ganttUpper.loadOnScroll) {
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
