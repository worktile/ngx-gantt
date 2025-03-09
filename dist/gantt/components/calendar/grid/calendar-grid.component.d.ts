import { OnInit, OnDestroy, NgZone, ElementRef } from '@angular/core';
import { GanttUpper } from '../../../gantt-upper';
import { GanttViewType } from './../../../class/view-type';
import * as i0 from "@angular/core";
export declare class GanttCalendarGridComponent implements OnInit, OnDestroy {
    ganttUpper: GanttUpper;
    private ngZone;
    private elementRef;
    get view(): import("@worktile/gantt").GanttView;
    private unsubscribe$;
    mainHeight: number;
    todayBorderRadius: number;
    viewTypes: typeof GanttViewType;
    className: string;
    constructor(ganttUpper: GanttUpper, ngZone: NgZone, elementRef: ElementRef<HTMLElement>);
    setTodayPoint(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttCalendarGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GanttCalendarGridComponent, "gantt-calendar-grid", never, {}, {}, never, never, true, never>;
}
