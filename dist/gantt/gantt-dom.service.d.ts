import { ElementRef, OnDestroy, NgZone, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare enum ScrollDirection {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2
}
export interface ScrollEvent {
    target: Element;
    direction: ScrollDirection;
}
export declare class GanttDomService implements OnDestroy {
    private ngZone;
    private platformId;
    root: Element;
    side: Element;
    container: Element;
    sideContainer: Element;
    mainContainer: Element;
    verticalScrollContainer: Element;
    calendarHeader: Element;
    mainItems: Element;
    calendarOverlay: Element;
    linksOverlay: Element;
    visibleRangeX: WritableSignal<{
        min: number;
        max: number;
    }>;
    private mainFooter;
    private mainScrollbar;
    private unsubscribe$;
    constructor(ngZone: NgZone, platformId: string);
    private monitorScrollChange;
    private syncScroll;
    private disableBrowserWheelEvent;
    initialize(root: ElementRef<HTMLElement>): void;
    /**
     * @returns An observable that will emit outside the Angular zone. Note, consumers should re-enter the Angular zone
     * to run the change detection if needed.
     */
    getViewerScroll(options?: AddEventListenerOptions): Observable<ScrollEvent>;
    getResize(): Observable<Event>;
    getResizeByElement(element: Element): Observable<unknown>;
    scrollMainContainer(left: number): void;
    setVisibleRangeX(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttDomService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GanttDomService>;
}
