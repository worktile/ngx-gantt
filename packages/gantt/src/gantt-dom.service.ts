import { isPlatformServer } from '@angular/common';
import { ElementRef, Injectable, NgZone, OnDestroy, PLATFORM_ID, WritableSignal, signal, inject } from '@angular/core';
import { EMPTY, Observable, Subject, fromEvent, merge } from 'rxjs';
import { auditTime, filter, map, pairwise, takeUntil } from 'rxjs/operators';
import { isNumber } from './utils/helpers';

const scrollThreshold = 50;

export enum ScrollDirection {
    NONE,
    LEFT,
    RIGHT
}

export interface ScrollEvent {
    target: Element;
    direction: ScrollDirection;
}

@Injectable()
export class GanttDomService implements OnDestroy {
    private ngZone = inject(NgZone);
    private platformId = inject(PLATFORM_ID);

    public root: Element;

    public side: Element;

    public container: Element;

    public sideContainer: Element;

    public mainContainer: Element;

    public verticalScrollContainer: Element;

    public calendarHeader: Element;

    public mainItems: Element;

    public calendarOverlay: Element;

    public linksOverlay: Element;

    public visibleRangeX: WritableSignal<{ min: number; max: number }> = signal({ min: 0, max: 0 });

    private mainFooter: Element;

    private mainScrollbar: Element;

    private unsubscribe$ = new Subject<void>();

    constructor() {}

    private disableBrowserWheelEvent() {
        const container = this.mainContainer as HTMLElement;
        this.ngZone.runOutsideAngular(() =>
            fromEvent(container, 'wheel')
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((event: WheelEvent) => {
                    const delta = event.deltaX;
                    if (!delta) {
                        return;
                    }
                    if (
                        (container.scrollLeft + container.offsetWidth === container.scrollWidth && delta > 0) ||
                        (container.scrollLeft === 0 && delta < 0)
                    ) {
                        event.preventDefault();
                    }
                })
        );
    }

    initialize(root: ElementRef<HTMLElement>) {
        this.root = root.nativeElement;
        this.side = this.root.getElementsByClassName('gantt-side')[0];
        this.container = this.root.getElementsByClassName('gantt-container')[0];
        this.sideContainer = this.root.getElementsByClassName('gantt-side-container')[0];
        this.mainContainer = this.root.getElementsByClassName('gantt-main-container')[0];
        this.mainScrollbar = this.root.getElementsByClassName('gantt-main-scrollbar')[0];
        this.mainFooter = this.root.getElementsByClassName('gantt-container-footer')[0];
        this.verticalScrollContainer = this.root.getElementsByClassName('gantt-scroll-container')[0];
        const mainItems = this.mainContainer.getElementsByClassName('gantt-main-items')[0];
        const mainGroups = this.mainContainer.getElementsByClassName('gantt-main-groups')[0];
        this.mainItems = mainItems || mainGroups;
        this.calendarHeader = this.root.getElementsByClassName('gantt-calendar-header')[0];
        this.calendarOverlay = this.root.getElementsByClassName('gantt-calendar-grid')[0];

        this.disableBrowserWheelEvent();
    }

    /**
     * @returns An observable that will emit outside the Angular zone. Note, consumers should re-enter the Angular zone
     * to run the change detection if needed.
     */
    getViewerScroll(options?: AddEventListenerOptions): Observable<ScrollEvent> {
        const scrollObservers = [fromEvent(this.mainContainer, 'scroll', options)];
        this.mainFooter && scrollObservers.push(fromEvent(this.mainFooter, 'scroll', options));
        this.mainScrollbar && scrollObservers.push(fromEvent(this.mainScrollbar, 'scroll', options));

        return new Observable<ScrollEvent>((subscriber) =>
            this.ngZone.runOutsideAngular(() =>
                merge(...scrollObservers)
                    .pipe(
                        map(() => this.mainContainer.scrollLeft),
                        pairwise(),
                        map(([previous, current]) => {
                            this.setVisibleRangeX();
                            // 向左滚动且接近起点 => 左侧扩展；向右滚动且接近末尾 => 右侧扩展
                            let direction = ScrollDirection.NONE;
                            if (current < previous && this.mainContainer.scrollLeft <= scrollThreshold) {
                                direction = ScrollDirection.LEFT;
                            } else if (
                                current > previous &&
                                this.mainContainer.scrollWidth - this.mainContainer.clientWidth - this.mainContainer.scrollLeft <=
                                    scrollThreshold
                            ) {
                                direction = ScrollDirection.RIGHT;
                            }

                            return {
                                target: this.mainContainer,
                                direction
                            };
                        }),
                        filter((event) => event.direction !== ScrollDirection.NONE)
                    )
                    .subscribe(subscriber)
            )
        );
    }

    getResize(): Observable<Event> {
        return isPlatformServer(this.platformId) ? EMPTY : fromEvent(window, 'resize').pipe(auditTime(150));
    }

    getResizeByElement(element: Element) {
        return new Observable((observer) => {
            const resizeObserver = new ResizeObserver(() => {
                observer.next(null);
            });
            resizeObserver.observe(element);
        });
    }

    scrollMainContainer(left: number) {
        if (isNumber(left)) {
            const scrollLeft = left - this.mainContainer.clientWidth / 2;
            this.mainContainer.scrollLeft = scrollLeft > scrollThreshold ? scrollLeft : 0;
            this.calendarHeader.scrollLeft = this.mainContainer.scrollLeft;
            this.calendarOverlay.scrollLeft = this.mainContainer.scrollLeft;
            this.mainScrollbar && (this.mainScrollbar.scrollLeft = this.mainContainer.scrollLeft);
            this.mainFooter && (this.mainFooter.scrollLeft = this.mainContainer.scrollLeft);
        }
    }

    syncHorizontalScroll(left: number) {
        const nextLeft = Math.max(left, 0);
        this.mainContainer.scrollLeft = nextLeft;
        this.calendarHeader.scrollLeft = nextLeft;
        this.calendarOverlay.scrollLeft = nextLeft;
        this.mainScrollbar && (this.mainScrollbar.scrollLeft = nextLeft);
        this.mainFooter && (this.mainFooter.scrollLeft = nextLeft);
        this.setVisibleRangeX();
    }

    setVisibleRangeX() {
        this.visibleRangeX.set({
            min: this.mainContainer.scrollLeft,
            max: this.mainContainer.scrollLeft + this.mainContainer.clientWidth
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
