import { OnInit, NgZone, ElementRef } from '@angular/core';
import { GanttUpper } from '../../../gantt-upper';
import { GanttViewType } from '../../../class';
import * as i0 from "@angular/core";
export declare class GanttCalendarHeaderComponent implements OnInit {
    ganttUpper: GanttUpper;
    private ngZone;
    private elementRef;
    get view(): import("@worktile/gantt").GanttView;
    private unsubscribe$;
    viewTypes: typeof GanttViewType;
    className: string;
    get height(): string;
    constructor(ganttUpper: GanttUpper, ngZone: NgZone, elementRef: ElementRef<HTMLElement>);
    ngOnInit(): void;
    setTodayPoint(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttCalendarHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GanttCalendarHeaderComponent, "gantt-calendar-header", never, {}, {}, never, never, true, never>;
}
