import { TemplateRef } from '@angular/core';
import { GanttViewType } from '../../class';
import { GanttUpper } from '../../gantt-upper';
import * as i0 from "@angular/core";
export declare class NgxGanttToolbarComponent {
    protected ganttUpper: GanttUpper;
    template: TemplateRef<any>;
    ganttItemClass: boolean;
    get top(): string;
    views: Record<GanttViewType, {
        label: string;
        dateFormats: {
            primary?: string;
            secondary?: string;
        };
    }>;
    constructor(ganttUpper: GanttUpper);
    selectView(view: GanttViewType): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGanttToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGanttToolbarComponent, "ngx-gantt-toolbar,gantt-toolbar", never, { "template": { "alias": "template"; "required": false; }; }, {}, never, never, true, never>;
}
