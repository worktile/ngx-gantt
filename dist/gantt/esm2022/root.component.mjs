import { Component, ElementRef, Inject, ContentChild, Input, Optional, ViewChild, HostListener } from '@angular/core';
import { GanttDomService, ScrollDirection } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { take, takeUntil, startWith } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { GANTT_UPPER_TOKEN } from './gantt-upper';
import { passiveListenerOptions } from './utils/passive-listeners';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttDate } from './utils/date';
import { NgxGanttToolbarComponent } from './components/toolbar/toolbar.component';
import { GanttCalendarGridComponent } from './components/calendar/grid/calendar-grid.component';
import { GanttCalendarHeaderComponent } from './components/calendar/header/calendar-header.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./gantt-dom.service";
import * as i2 from "./gantt-drag-container";
import * as i3 from "./gantt-print.service";
import * as i4 from "./gantt-upper";
export class NgxGanttRootComponent {
    get view() {
        return this.ganttUpper.view;
    }
    onWindowResize() {
        this.computeScrollBarOffset();
    }
    constructor(elementRef, ngZone, dom, dragContainer, ganttUpper, printService) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.dom = dom;
        this.dragContainer = dragContainer;
        this.ganttUpper = ganttUpper;
        this.printService = printService;
        this.verticalScrollbarWidth = 0;
        this.horizontalScrollbarHeight = 0;
        this.unsubscribe$ = new Subject();
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
                this.ganttUpper.viewChange.pipe(startWith(null), takeUntil(this.unsubscribe$)).subscribe(() => {
                    this.scrollToToday();
                });
                this.computeScrollBarOffset();
            });
        });
    }
    computeScrollBarOffset() {
        const ganttMainContainer = this.dom.mainContainer;
        const ganttVerticalScrollContainer = this.dom.verticalScrollContainer;
        let verticalScrollbarWidth = 0;
        if (ganttVerticalScrollContainer) {
            verticalScrollbarWidth = ganttVerticalScrollContainer.offsetWidth - ganttVerticalScrollContainer.clientWidth;
        }
        else {
            verticalScrollbarWidth = ganttMainContainer?.offsetWidth - ganttMainContainer?.clientWidth;
        }
        const horizontalScrollbarHeight = ganttMainContainer?.offsetHeight - ganttMainContainer?.clientHeight;
        this.verticalScrollbarWidth = verticalScrollbarWidth;
        this.horizontalScrollbarHeight = horizontalScrollbarHeight;
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
    }
    setupViewScroll() {
        if (this.ganttUpper.disabledLoadOnScroll && !this.ganttUpper.quickTimeFocus) {
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
                        this.ngZone.run(() => this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() }));
                    }
                }
            }
            if (event.direction === ScrollDirection.RIGHT) {
                const dates = this.view.addEndDate();
                if (dates && this.ganttUpper.loadOnScroll.observers) {
                    this.ngZone.run(() => this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() }));
                }
            }
        });
    }
    setupResize() {
        this.dom
            .getResize()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
            this.setupScrollClass();
        });
    }
    setupScrollClass() {
        const mainContainer = this.dom.mainContainer;
        const height = mainContainer.offsetHeight;
        const scrollHeight = mainContainer.scrollHeight;
        if (scrollHeight > height) {
            this.elementRef.nativeElement.className = 'gantt gantt-scroll';
        }
        else {
            this.elementRef.nativeElement.className = 'gantt';
        }
    }
    scrollToToday() {
        const x = this.view.getTodayXPoint();
        this.dom.scrollMainContainer(x);
    }
    scrollToDate(date) {
        let x;
        if (typeof date === 'number' || date instanceof Date) {
            x = this.view.getXPointByDate(new GanttDate(date));
        }
        else {
            x = this.view.getXPointByDate(date);
        }
        this.dom.scrollMainContainer(x);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttRootComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.GanttDomService }, { token: i2.GanttDragContainer }, { token: GANTT_UPPER_TOKEN }, { token: i3.GanttPrintService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttRootComponent, isStandalone: true, selector: "ngx-gantt-root", inputs: { sideWidth: "sideWidth" }, host: { listeners: { "window:resize": "onWindowResize()" }, classAttribute: "gantt" }, providers: [GanttDomService, GanttDragContainer], queries: [{ propertyName: "sideTemplate", first: true, predicate: ["sideTemplate"], descendants: true, static: true }, { propertyName: "mainTemplate", first: true, predicate: ["mainTemplate"], descendants: true, static: true }], viewQueries: [{ propertyName: "backdrop", first: true, predicate: GanttDragBackdropComponent, descendants: true, read: ElementRef, static: true }], ngImport: i0, template: "<div class=\"gantt-side\" *ngIf=\"sideTemplate\" [style.width.px]=\"sideWidth\" [style.padding-bottom.px]=\"horizontalScrollbarHeight\">\n  <div class=\"gantt-side-container\" cdkScrollable>\n    <ng-template [ngTemplateOutlet]=\"sideTemplate\"></ng-template>\n  </div>\n</div>\n<div class=\"gantt-container\" *ngIf=\"mainTemplate\">\n  <gantt-calendar-header [style.padding-right.px]=\"verticalScrollbarWidth\"></gantt-calendar-header>\n  <gantt-calendar-grid\n    [style.padding-right.px]=\"verticalScrollbarWidth\"\n    [style.padding-bottom.px]=\"horizontalScrollbarHeight\"\n  ></gantt-calendar-grid>\n  <gantt-drag-backdrop></gantt-drag-backdrop>\n  <div class=\"gantt-main\">\n    <ng-template [ngTemplateOutlet]=\"mainTemplate\"></ng-template>\n  </div>\n</div>\n<ng-content></ng-content>\n<gantt-toolbar *ngIf=\"ganttUpper.showToolbar || ganttUpper.toolbarTemplate\" [template]=\"ganttUpper.toolbarTemplate\"> </gantt-toolbar>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: GanttCalendarHeaderComponent, selector: "gantt-calendar-header" }, { kind: "component", type: GanttCalendarGridComponent, selector: "gantt-calendar-grid" }, { kind: "component", type: GanttDragBackdropComponent, selector: "gantt-drag-backdrop" }, { kind: "component", type: NgxGanttToolbarComponent, selector: "ngx-gantt-toolbar,gantt-toolbar", inputs: ["template"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttRootComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-root', providers: [GanttDomService, GanttDragContainer], host: {
                        class: 'gantt'
                    }, standalone: true, imports: [
                        NgIf,
                        CdkScrollable,
                        NgTemplateOutlet,
                        GanttCalendarHeaderComponent,
                        GanttCalendarGridComponent,
                        GanttDragBackdropComponent,
                        NgxGanttToolbarComponent
                    ], template: "<div class=\"gantt-side\" *ngIf=\"sideTemplate\" [style.width.px]=\"sideWidth\" [style.padding-bottom.px]=\"horizontalScrollbarHeight\">\n  <div class=\"gantt-side-container\" cdkScrollable>\n    <ng-template [ngTemplateOutlet]=\"sideTemplate\"></ng-template>\n  </div>\n</div>\n<div class=\"gantt-container\" *ngIf=\"mainTemplate\">\n  <gantt-calendar-header [style.padding-right.px]=\"verticalScrollbarWidth\"></gantt-calendar-header>\n  <gantt-calendar-grid\n    [style.padding-right.px]=\"verticalScrollbarWidth\"\n    [style.padding-bottom.px]=\"horizontalScrollbarHeight\"\n  ></gantt-calendar-grid>\n  <gantt-drag-backdrop></gantt-drag-backdrop>\n  <div class=\"gantt-main\">\n    <ng-template [ngTemplateOutlet]=\"mainTemplate\"></ng-template>\n  </div>\n</div>\n<ng-content></ng-content>\n<gantt-toolbar *ngIf=\"ganttUpper.showToolbar || ganttUpper.toolbarTemplate\" [template]=\"ganttUpper.toolbarTemplate\"> </gantt-toolbar>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.GanttDomService }, { type: i2.GanttDragContainer }, { type: i4.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i3.GanttPrintService, decorators: [{
                    type: Optional
                }] }], propDecorators: { sideWidth: [{
                type: Input
            }], sideTemplate: [{
                type: ContentChild,
                args: ['sideTemplate', { static: true }]
            }], mainTemplate: [{
                type: ContentChild,
                args: ['mainTemplate', { static: true }]
            }], backdrop: [{
                type: ViewChild,
                args: [GanttDragBackdropComponent, { static: true, read: ElementRef }]
            }], onWindowResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvcm9vdC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvcm9vdC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUdULFVBQVUsRUFDVixNQUFNLEVBQ04sWUFBWSxFQUVaLEtBQUssRUFDTCxRQUFRLEVBRVIsU0FBUyxFQUNULFlBQVksRUFDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JDLE9BQU8sRUFBYyxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNoRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2hHLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFF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MEJBQTBCLGdFQUMxQiwwQkFBMEIsZ0VBQzFCLHdCQUF3Qjs7MkZBR25CLHFCQUFxQjtrQkFsQmpDLFNBQVM7K0JBQ0ksZ0JBQWdCLGFBRWYsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsUUFDMUM7d0JBQ0YsS0FBSyxFQUFFLE9BQU87cUJBQ2pCLGNBQ1csSUFBSSxXQUNQO3dCQUNMLElBQUk7d0JBQ0osYUFBYTt3QkFDYixnQkFBZ0I7d0JBQ2hCLDRCQUE0Qjt3QkFDNUIsMEJBQTBCO3dCQUMxQiwwQkFBMEI7d0JBQzFCLHdCQUF3QjtxQkFDM0I7OzBCQWdDSSxNQUFNOzJCQUFDLGlCQUFpQjs7MEJBQ3hCLFFBQVE7eUNBOUJKLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRTBDLFlBQVk7c0JBQTNELFlBQVk7dUJBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFFRSxZQUFZO3NCQUEzRCxZQUFZO3VCQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBRzZCLFFBQVE7c0JBQWxGLFNBQVM7dUJBQUMsMEJBQTBCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBYXpFLGNBQWM7c0JBRGIsWUFBWTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgT25Jbml0LFxuICAgIE5nWm9uZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEluamVjdCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgSW5wdXQsXG4gICAgT3B0aW9uYWwsXG4gICAgT25EZXN0cm95LFxuICAgIFZpZXdDaGlsZCxcbiAgICBIb3N0TGlzdGVuZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHYW50dERvbVNlcnZpY2UsIFNjcm9sbERpcmVjdGlvbiB9IGZyb20gJy4vZ2FudHQtZG9tLnNlcnZpY2UnO1xuaW1wb3J0IHsgR2FudHREcmFnQ29udGFpbmVyIH0gZnJvbSAnLi9nYW50dC1kcmFnLWNvbnRhaW5lcic7XG5pbXBvcnQgeyB0YWtlLCB0YWtlVW50aWwsIHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGZyb20sIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEdhbnR0VXBwZXIsIEdBTlRUX1VQUEVSX1RPS0VOIH0gZnJvbSAnLi9nYW50dC11cHBlcic7XG5pbXBvcnQgeyBHYW50dFByaW50U2VydmljZSB9IGZyb20gJy4vZ2FudHQtcHJpbnQuc2VydmljZSc7XG5pbXBvcnQgeyBwYXNzaXZlTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnLi91dGlscy9wYXNzaXZlLWxpc3RlbmVycyc7XG5pbXBvcnQgeyBHYW50dERyYWdCYWNrZHJvcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kcmFnLWJhY2tkcm9wL2RyYWctYmFja2Ryb3AuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0RGF0ZSB9IGZyb20gJy4vdXRpbHMvZGF0ZSc7XG5pbXBvcnQgeyBOZ3hHYW50dFRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbGJhci90b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBHYW50dENhbGVuZGFyR3JpZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhci9ncmlkL2NhbGVuZGFyLWdyaWQuY29tcG9uZW50JztcbmltcG9ydCB7IEdhbnR0Q2FsZW5kYXJIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXIvaGVhZGVyL2NhbGVuZGFyLWhlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2RrU2Nyb2xsYWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHsgTmdJZiwgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWdhbnR0LXJvb3QnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yb290LmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtHYW50dERvbVNlcnZpY2UsIEdhbnR0RHJhZ0NvbnRhaW5lcl0sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ2dhbnR0J1xuICAgIH0sXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIE5nSWYsXG4gICAgICAgIENka1Njcm9sbGFibGUsXG4gICAgICAgIE5nVGVtcGxhdGVPdXRsZXQsXG4gICAgICAgIEdhbnR0Q2FsZW5kYXJIZWFkZXJDb21wb25lbnQsXG4gICAgICAgIEdhbnR0Q2FsZW5kYXJHcmlkQ29tcG9uZW50LFxuICAgICAgICBHYW50dERyYWdCYWNrZHJvcENvbXBvbmVudCxcbiAgICAgICAgTmd4R2FudHRUb29sYmFyQ29tcG9uZW50XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYW50dFJvb3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgc2lkZVdpZHRoOiBudW1iZXI7XG5cbiAgICBAQ29udGVudENoaWxkKCdzaWRlVGVtcGxhdGUnLCB7IHN0YXRpYzogdHJ1ZSB9KSBzaWRlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAQ29udGVudENoaWxkKCdtYWluVGVtcGxhdGUnLCB7IHN0YXRpYzogdHJ1ZSB9KSBtYWluVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKiogVGhlIG5hdGl2ZSBgPGdhbnR0LWRyYWctYmFja2Ryb3A+PC9nYW50dC1kcmFnLWJhY2tkcm9wPmAgZWxlbWVudC4gKi9cbiAgICBAVmlld0NoaWxkKEdhbnR0RHJhZ0JhY2tkcm9wQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogRWxlbWVudFJlZiB9KSBiYWNrZHJvcDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICB2ZXJ0aWNhbFNjcm9sbGJhcldpZHRoID0gMDtcblxuICAgIGhvcml6b250YWxTY3JvbGxiYXJIZWlnaHQgPSAwO1xuXG4gICAgcHJpdmF0ZSB1bnN1YnNjcmliZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgcHJpdmF0ZSBnZXQgdmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FudHRVcHBlci52aWV3O1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICAgIG9uV2luZG93UmVzaXplKCkge1xuICAgICAgICB0aGlzLmNvbXB1dGVTY3JvbGxCYXJPZmZzZXQoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgcHJpdmF0ZSBkb206IEdhbnR0RG9tU2VydmljZSxcbiAgICAgICAgcHVibGljIGRyYWdDb250YWluZXI6IEdhbnR0RHJhZ0NvbnRhaW5lcixcbiAgICAgICAgQEluamVjdChHQU5UVF9VUFBFUl9UT0tFTikgcHVibGljIGdhbnR0VXBwZXI6IEdhbnR0VXBwZXIsXG4gICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcHJpbnRTZXJ2aWNlOiBHYW50dFByaW50U2VydmljZVxuICAgICkge1xuICAgICAgICB0aGlzLmdhbnR0VXBwZXIuZHJhZ0NvbnRhaW5lciA9IGRyYWdDb250YWluZXI7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIC8vIE5vdGU6IHRoZSB6b25lIG1heSBiZSBub29wZWQgdGhyb3VnaCBgQm9vdHN0cmFwT3B0aW9uc2Agd2hlbiBib290c3RyYXBwaW5nIHRoZSByb290IG1vZHVsZS4gVGhpcyBtZWFuc1xuICAgICAgICAvLyB0aGUgYG9uU3RhYmxlYCB3aWxsIG5ldmVyIGVtaXQgYW55IHZhbHVlLlxuICAgICAgICBjb25zdCBvblN0YWJsZSQgPSB0aGlzLm5nWm9uZS5pc1N0YWJsZSA/IGZyb20oUHJvbWlzZS5yZXNvbHZlKCkpIDogdGhpcy5uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKTtcbiAgICAgICAgLy8gTm9ybWFsbHkgdGhpcyBpc24ndCBpbiB0aGUgem9uZSwgYnV0IGl0IGNhbiBjYXVzZSBwZXJmb3JtYW5jZSByZWdyZXNzaW9ucyBmb3IgYXBwc1xuICAgICAgICAvLyB1c2luZyBgem9uZS1wYXRjaC1yeGpzYCBiZWNhdXNlIGl0J2xsIHRyaWdnZXIgYSBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW4gaXQgdW5zdWJzY3JpYmVzLlxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBvblN0YWJsZSQucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tLmluaXRpYWxpemUodGhpcy5lbGVtZW50UmVmKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByaW50U2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50U2VydmljZS5yZWdpc3Rlcih0aGlzLmVsZW1lbnRSZWYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwU2Nyb2xsQ2xhc3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwUmVzaXplKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cFZpZXdTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAvLyDkvJjljJbliJ3lp4vljJbml7ZTY3JvbGzmu5rliqjkvZPpqozpl67popjvvIzpgJrov4fpgI/mmI7luqbop6PlhrPvvIzpu5jorqTpgI/mmI7luqbkuLow77yM5rua5Yqo57uT5p2f5ZCO5oGi5aSNXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgICAgICAgICB0aGlzLmdhbnR0VXBwZXIudmlld0NoYW5nZS5waXBlKHN0YXJ0V2l0aDxudWxsLCBudWxsPihudWxsKSwgdGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1RvZGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlU2Nyb2xsQmFyT2Zmc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tcHV0ZVNjcm9sbEJhck9mZnNldCgpIHtcbiAgICAgICAgY29uc3QgZ2FudHRNYWluQ29udGFpbmVyID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lciBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgY29uc3QgZ2FudHRWZXJ0aWNhbFNjcm9sbENvbnRhaW5lciA9IHRoaXMuZG9tLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIGxldCB2ZXJ0aWNhbFNjcm9sbGJhcldpZHRoID0gMDtcbiAgICAgICAgaWYgKGdhbnR0VmVydGljYWxTY3JvbGxDb250YWluZXIpIHtcbiAgICAgICAgICAgIHZlcnRpY2FsU2Nyb2xsYmFyV2lkdGggPSBnYW50dFZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLm9mZnNldFdpZHRoIC0gZ2FudHRWZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlcnRpY2FsU2Nyb2xsYmFyV2lkdGggPSBnYW50dE1haW5Db250YWluZXI/Lm9mZnNldFdpZHRoIC0gZ2FudHRNYWluQ29udGFpbmVyPy5jbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBob3Jpem9udGFsU2Nyb2xsYmFySGVpZ2h0ID0gZ2FudHRNYWluQ29udGFpbmVyPy5vZmZzZXRIZWlnaHQgLSBnYW50dE1haW5Db250YWluZXI/LmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbGJhcldpZHRoID0gdmVydGljYWxTY3JvbGxiYXJXaWR0aDtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsYmFySGVpZ2h0ID0gaG9yaXpvbnRhbFNjcm9sbGJhckhlaWdodDtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSQubmV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBWaWV3U2Nyb2xsKCkge1xuICAgICAgICBpZiAodGhpcy5nYW50dFVwcGVyLmRpc2FibGVkTG9hZE9uU2Nyb2xsICYmICF0aGlzLmdhbnR0VXBwZXIucXVpY2tUaW1lRm9jdXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRvbVxuICAgICAgICAgICAgLmdldFZpZXdlclNjcm9sbChwYXNzaXZlTGlzdGVuZXJPcHRpb25zKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmRpcmVjdGlvbiA9PT0gU2Nyb2xsRGlyZWN0aW9uLkxFRlQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZXMgPSB0aGlzLnZpZXcuYWRkU3RhcnREYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQgKz0gdGhpcy52aWV3LmdldERhdGVSYW5nZVdpZHRoKGRhdGVzLnN0YXJ0LCBkYXRlcy5lbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FudHRVcHBlci5sb2FkT25TY3JvbGwub2JzZXJ2ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FudHRVcHBlci5sb2FkT25TY3JvbGwuZW1pdCh7IHN0YXJ0OiBkYXRlcy5zdGFydC5nZXRVbml4VGltZSgpLCBlbmQ6IGRhdGVzLmVuZC5nZXRVbml4VGltZSgpIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZGlyZWN0aW9uID09PSBTY3JvbGxEaXJlY3Rpb24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZXMgPSB0aGlzLnZpZXcuYWRkRW5kRGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0ZXMgJiYgdGhpcy5nYW50dFVwcGVyLmxvYWRPblNjcm9sbC5vYnNlcnZlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FudHRVcHBlci5sb2FkT25TY3JvbGwuZW1pdCh7IHN0YXJ0OiBkYXRlcy5zdGFydC5nZXRVbml4VGltZSgpLCBlbmQ6IGRhdGVzLmVuZC5nZXRVbml4VGltZSgpIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFJlc2l6ZSgpIHtcbiAgICAgICAgdGhpcy5kb21cbiAgICAgICAgICAgIC5nZXRSZXNpemUoKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBTY3JvbGxDbGFzcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFNjcm9sbENsYXNzKCkge1xuICAgICAgICBjb25zdCBtYWluQ29udGFpbmVyID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lciBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gbWFpbkNvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IG1haW5Db250YWluZXIuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICBpZiAoc2Nyb2xsSGVpZ2h0ID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnZ2FudHQgZ2FudHQtc2Nyb2xsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICdnYW50dCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2Nyb2xsVG9Ub2RheSgpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMudmlldy5nZXRUb2RheVhQb2ludCgpO1xuICAgICAgICB0aGlzLmRvbS5zY3JvbGxNYWluQ29udGFpbmVyKHgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzY3JvbGxUb0RhdGUoZGF0ZTogbnVtYmVyIHwgRGF0ZSB8IEdhbnR0RGF0ZSkge1xuICAgICAgICBsZXQgeDogbnVtYmVyO1xuICAgICAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInIHx8IGRhdGUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICB4ID0gdGhpcy52aWV3LmdldFhQb2ludEJ5RGF0ZShuZXcgR2FudHREYXRlKGRhdGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHggPSB0aGlzLnZpZXcuZ2V0WFBvaW50QnlEYXRlKGRhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb20uc2Nyb2xsTWFpbkNvbnRhaW5lcih4KTtcbiAgICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwiZ2FudHQtc2lkZVwiICpuZ0lmPVwic2lkZVRlbXBsYXRlXCIgW3N0eWxlLndpZHRoLnB4XT1cInNpZGVXaWR0aFwiIFtzdHlsZS5wYWRkaW5nLWJvdHRvbS5weF09XCJob3Jpem9udGFsU2Nyb2xsYmFySGVpZ2h0XCI+XG4gIDxkaXYgY2xhc3M9XCJnYW50dC1zaWRlLWNvbnRhaW5lclwiIGNka1Njcm9sbGFibGU+XG4gICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInNpZGVUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gIDwvZGl2PlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwiZ2FudHQtY29udGFpbmVyXCIgKm5nSWY9XCJtYWluVGVtcGxhdGVcIj5cbiAgPGdhbnR0LWNhbGVuZGFyLWhlYWRlciBbc3R5bGUucGFkZGluZy1yaWdodC5weF09XCJ2ZXJ0aWNhbFNjcm9sbGJhcldpZHRoXCI+PC9nYW50dC1jYWxlbmRhci1oZWFkZXI+XG4gIDxnYW50dC1jYWxlbmRhci1ncmlkXG4gICAgW3N0eWxlLnBhZGRpbmctcmlnaHQucHhdPVwidmVydGljYWxTY3JvbGxiYXJXaWR0aFwiXG4gICAgW3N0eWxlLnBhZGRpbmctYm90dG9tLnB4XT1cImhvcml6b250YWxTY3JvbGxiYXJIZWlnaHRcIlxuICA+PC9nYW50dC1jYWxlbmRhci1ncmlkPlxuICA8Z2FudHQtZHJhZy1iYWNrZHJvcD48L2dhbnR0LWRyYWctYmFja2Ryb3A+XG4gIDxkaXYgY2xhc3M9XCJnYW50dC1tYWluXCI+XG4gICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm1haW5UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gIDwvZGl2PlxuPC9kaXY+XG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48Z2FudHQtdG9vbGJhciAqbmdJZj1cImdhbnR0VXBwZXIuc2hvd1Rvb2xiYXIgfHwgZ2FudHRVcHBlci50b29sYmFyVGVtcGxhdGVcIiBbdGVtcGxhdGVdPVwiZ2FudHRVcHBlci50b29sYmFyVGVtcGxhdGVcIj4gPC9nYW50dC10b29sYmFyPlxuIl19