import { ElementRef, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { GanttBaselineItemInternal } from '../../class/baseline';
import { GanttUpper } from '../../gantt-upper';
import * as i0 from "@angular/core";
export declare class NgxGanttBaselineComponent implements OnInit {
    private elementRef;
    ganttUpper: GanttUpper;
    baselineItem: GanttBaselineItemInternal;
    template: TemplateRef<any>;
    unsubscribe$: Subject<void>;
    ganttBaselineClass: boolean;
    constructor(elementRef: ElementRef<HTMLElement>, ganttUpper: GanttUpper);
    ngOnInit(): void;
    private setPositions;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGanttBaselineComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGanttBaselineComponent, "ngx-gantt-baseline,gantt-baseline", never, { "baselineItem": { "alias": "baselineItem"; "required": false; }; "template": { "alias": "template"; "required": false; }; }, {}, never, never, true, never>;
}
