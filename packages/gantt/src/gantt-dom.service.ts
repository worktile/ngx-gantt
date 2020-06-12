import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject, merge } from 'rxjs';
import { pairwise, map, auditTime, takeUntil, take, startWith } from 'rxjs/operators';
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
    public root: Element;

    public side: Element;

    public container: Element;

    public sideContainer: Element;

    public mainContainer: Element;

    public calendarOverlay: Element;

    public linksOverlay: Element;

    private unsubscribe$ = new Subject<void>();

    constructor() {}

    private monitorScrollChange() {
        merge(fromEvent(this.mainContainer, 'scroll'), fromEvent(this.sideContainer, 'scroll'))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                this.syncScroll(event);
            });

        fromEvent(this.mainContainer, 'scroll')
            .pipe(startWith(), takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                // if (this.mainContainer.scrollLeft > 0) {
                //     this.side.classList.add('gantt-side-has-shadow');
                // } else {
                //     this.side.classList.remove('gantt-side-has-shadow');
                // }
            });
    }

    private syncScroll(event: Event) {
        const target = event.currentTarget as HTMLElement;
        this.calendarOverlay.scrollLeft = this.mainContainer.scrollLeft;

        this.sideContainer.scrollTop = target.scrollTop;
        this.mainContainer.scrollTop = target.scrollTop;
    }

    private disableBrowserWheelEvent() {
        const container = this.mainContainer as HTMLElement;
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
            });
    }

    initialize(root: ElementRef<HTMLElement>) {
        this.root = root.nativeElement;
        this.side = this.root.getElementsByClassName('gantt-side')[0];
        this.container = this.root.getElementsByClassName('gantt-container')[0];
        this.sideContainer = this.root.getElementsByClassName('gantt-side-container')[0];
        this.mainContainer = this.root.getElementsByClassName('gantt-main-container')[0];
        this.calendarOverlay = this.root.getElementsByClassName('gantt-calendar-overlay')[0];
        this.monitorScrollChange();
        this.disableBrowserWheelEvent();
    }

    getViewerScroll() {
        return fromEvent<Event>(this.mainContainer, 'scroll').pipe(
            map(() => this.mainContainer.scrollLeft),
            pairwise(),
            map(([previous, current]) => {
                const event: ScrollEvent = {
                    target: this.mainContainer,
                    direction: ScrollDirection.NONE
                };
                if (current - previous < 0) {
                    if (this.mainContainer.scrollLeft < scrollThreshold && this.mainContainer.scrollLeft > 0) {
                        event.direction = ScrollDirection.LEFT;
                    }
                }
                if (current - previous > 0) {
                    if (this.mainContainer.scrollWidth - this.mainContainer.clientWidth - this.mainContainer.scrollLeft < scrollThreshold) {
                        event.direction = ScrollDirection.RIGHT;
                    }
                }
                return event;
            })
        );
    }

    getResize() {
        return fromEvent(window, 'resize').pipe(auditTime(150));
    }

    scrollMainContainer(left: number) {
        if (isNumber(left)) {
            const scrollLeft = left - this.mainContainer.clientWidth / 2;
            this.mainContainer.scrollLeft = scrollLeft > scrollThreshold ? scrollLeft : 0;
            this.calendarOverlay.scrollLeft = this.mainContainer.scrollLeft;
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
