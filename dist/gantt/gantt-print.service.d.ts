import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class GanttPrintService {
    private root;
    private mainContainer;
    constructor();
    private setInlineStyles;
    private recursElementChildren;
    register(root: ElementRef<HTMLElement>): void;
    print(name?: string, ignoreElementClass?: string): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttPrintService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GanttPrintService>;
}
