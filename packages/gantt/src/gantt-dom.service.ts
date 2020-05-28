import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject, merge } from 'rxjs';
import { pairwise, map, auditTime, takeUntil } from 'rxjs/operators';
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

    public sideContainer: Element;

    public viewerContainer: Element;

    public calendarOverlay: Element;

    private unsubscribe$ = new Subject<void>();

    constructor() {}

    private monitorScrollChange() {
        merge(fromEvent(this.viewerContainer, 'scroll'), fromEvent(this.sideContainer, 'scroll'))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                this.syncScroll(event);
            });
    }

    private syncScroll(event: Event) {
        const target = event.target as HTMLElement;
        this.calendarOverlay.scrollLeft = this.viewerContainer.scrollLeft;
        this.sideContainer.scrollTop = target.scrollTop;
        this.viewerContainer.scrollTop = target.scrollTop;
    }

    initialize(root: ElementRef<HTMLElement>) {
        this.root = root.nativeElement;
        this.sideContainer = this.root.getElementsByClassName('gantt-side-container')[0];
        this.viewerContainer = this.root.getElementsByClassName('gantt-viewer-container')[0];
        this.calendarOverlay = this.root.getElementsByClassName('gantt-calendar-overlay')[0];
        this.monitorScrollChange();
    }

    getViewerScroll() {
        return fromEvent<Event>(this.viewerContainer, 'scroll').pipe(
            map(() => this.viewerContainer.scrollLeft),
            pairwise(),
            map(([previous, current]) => {
                const event: ScrollEvent = {
                    target: this.viewerContainer,
                    direction: ScrollDirection.NONE
                };
                if (current - previous < 0) {
                    if (this.viewerContainer.scrollLeft < scrollThreshold && this.viewerContainer.scrollLeft > 0) {
                        event.direction = ScrollDirection.LEFT;
                    }
                }
                if (current - previous > 0) {
                    if (
                        this.viewerContainer.scrollWidth - this.viewerContainer.clientWidth - this.viewerContainer.scrollLeft <
                        scrollThreshold
                    ) {
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
            const scrollLeft = left - this.viewerContainer.clientWidth / 2;
            this.viewerContainer.scrollLeft = scrollLeft > scrollThreshold ? scrollLeft : 0;
            this.calendarOverlay.scrollLeft = this.viewerContainer.scrollLeft;
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
