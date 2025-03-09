import { TemplateRef, ElementRef } from '@angular/core';
import { GanttUpper } from '../gantt-upper';
import * as i0 from "@angular/core";
export declare class NgxGanttTableColumnComponent {
    ganttUpper: GanttUpper;
    private elementRef;
    columnWidth: string;
    set width(width: number | string);
    name: string;
    showExpandIcon: boolean;
    templateRef: TemplateRef<any>;
    headerTemplateRef: TemplateRef<any>;
    constructor(ganttUpper: GanttUpper, elementRef: ElementRef);
    get classList(): DOMTokenList;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGanttTableColumnComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGanttTableColumnComponent, "ngx-gantt-column", never, { "width": { "alias": "width"; "required": false; }; "name": { "alias": "name"; "required": false; }; "showExpandIcon": { "alias": "showExpandIcon"; "required": false; }; }, {}, ["templateRef", "headerTemplateRef"], never, true, never>;
}
