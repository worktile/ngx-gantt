import { GanttUpper } from '../../gantt-upper';
import { NgxGanttRootComponent } from '../../root.component';
import * as i0 from "@angular/core";
export declare class GanttScrollbarComponent {
    ganttUpper: GanttUpper;
    hasFooter: boolean;
    tableWidth: number;
    ganttRoot: NgxGanttRootComponent;
    constructor(ganttUpper: GanttUpper);
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttScrollbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GanttScrollbarComponent, "gantt-scrollbar", never, { "hasFooter": { "alias": "hasFooter"; "required": false; }; "tableWidth": { "alias": "tableWidth"; "required": false; }; "ganttRoot": { "alias": "ganttRoot"; "required": false; }; }, {}, never, never, true, never>;
}
