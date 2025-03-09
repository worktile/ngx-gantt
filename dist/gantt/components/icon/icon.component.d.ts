import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class GanttIconComponent {
    private elementRef;
    isIcon: boolean;
    set iconName(name: string);
    constructor(elementRef: ElementRef<HTMLElement>);
    setSvg(name: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttIconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GanttIconComponent, "gantt-icon", never, { "iconName": { "alias": "iconName"; "required": false; }; }, {}, never, never, true, never>;
}
