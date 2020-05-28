import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { pairwise, map, auditTime, takeUntil } from 'rxjs/operators';
import { isNumber } from './utils/helpers';

const scrollThreshold = 50;

export enum ScrollDirection {
    NONE,
    LEFT,
    RIGHT,
}

export interface ScrollEvent {
    target: Element;
    direction: ScrollDirection;
}

@Injectable()
export class GanttDomService implements OnDestroy {
    public root: Element;

    public viewer: Element;

    public calendarOverlay: Element;

    public side: Element;

    private unsubscribe$ = new Subject<void>();

    constructor() {}

    private monitorScrollChange() {
        fromEvent(this.viewer, 'scroll')
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.syncScroll();
            });
    }

    private syncScroll() {
        this.calendarOverlay.scrollLeft = this.viewer.scrollLeft;
    }

    initialize(root: ElementRef<HTMLElement>) {
        this.root = root.nativeElement;
        this.viewer = this.root.getElementsByClassName('gantt-viewer-container')[0];
        this.calendarOverlay = this.root.getElementsByClassName('gantt-calendar-overlay')[0];
        this.side = this.root.getElementsByClassName('gantt-side')[0];
        this.monitorScrollChange();
    }

    getViewerScroll() {
        return fromEvent<Event>(this.viewer, 'scroll').pipe(
            map(() => this.viewer.scrollLeft),
            pairwise(),
            map(([previous, current]) => {
                const event: ScrollEvent = {
                    target: this.viewer,
                    direction: ScrollDirection.NONE,
                };
                if (current - previous < 0) {
                    if (this.viewer.scrollLeft < scrollThreshold && this.viewer.scrollLeft > 0) {
                        event.direction = ScrollDirection.LEFT;
                    }
                }
                if (current - previous > 0) {
                    if (this.viewer.scrollWidth - this.viewer.clientWidth - this.viewer.scrollLeft < scrollThreshold) {
                        event.direction = ScrollDirection.RIGHT;
                    }
                }
                return event;
            })
        );
    }

    getResize() {
        return fromEvent(window, 'resize').pipe(auditTime(30));
    }

    scrollViewer(left: number) {
        if (isNumber(left)) {
            const scrollLeft = left - this.viewer.clientWidth / 2;
            if (scrollLeft > scrollThreshold) {
                this.viewer.scrollLeft = scrollLeft;
            } else {
                this.viewer.scrollLeft = 0;
            }
            this.syncScroll();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
