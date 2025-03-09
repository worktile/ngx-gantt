import { OnInit, NgZone, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { GanttDomService } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { GanttUpper } from './gantt-upper';
import { GanttPrintService } from './gantt-print.service';
import { GanttDate } from './utils/date';
import * as i0 from "@angular/core";
export declare class NgxGanttRootComponent implements OnInit, OnDestroy {
    private elementRef;
    private ngZone;
    private dom;
    dragContainer: GanttDragContainer;
    ganttUpper: GanttUpper;
    private printService;
    sideWidth: number;
    sideTemplate: TemplateRef<any>;
    mainTemplate: TemplateRef<any>;
    /** The native `<gantt-drag-backdrop></gantt-drag-backdrop>` element. */
    backdrop: ElementRef<HTMLElement>;
    verticalScrollbarWidth: number;
    horizontalScrollbarHeight: number;
    private unsubscribe$;
    private get view();
    onWindowResize(): void;
    constructor(elementRef: ElementRef<HTMLElement>, ngZone: NgZone, dom: GanttDomService, dragContainer: GanttDragContainer, ganttUpper: GanttUpper, printService: GanttPrintService);
    ngOnInit(): void;
    computeScrollBarOffset(): void;
    ngOnDestroy(): void;
    private setupViewScroll;
    private setupResize;
    private setupScrollClass;
    scrollToToday(): void;
    scrollToDate(date: number | Date | GanttDate): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGanttRootComponent, [null, null, null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGanttRootComponent, "ngx-gantt-root", never, { "sideWidth": { "alias": "sideWidth"; "required": false; }; }, {}, ["sideTemplate", "mainTemplate"], ["*"], true, never>;
}
