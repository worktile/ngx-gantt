import { ElementRef, TemplateRef, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { GanttItemInternal } from './class';
import { Subject } from 'rxjs';
import { GanttUpper } from './gantt-upper';
import * as i0 from "@angular/core";
export declare abstract class GanttItemUpper implements OnChanges, OnInit, OnDestroy {
    protected elementRef: ElementRef<HTMLElement>;
    protected ganttUpper: GanttUpper;
    template: TemplateRef<any>;
    item: GanttItemInternal;
    firstChange: boolean;
    unsubscribe$: Subject<void>;
    refsUnsubscribe$: Subject<void>;
    constructor(elementRef: ElementRef<HTMLElement>, ganttUpper: GanttUpper);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private itemChange;
    private setPositions;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttItemUpper, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GanttItemUpper, never, never, { "template": { "alias": "template"; "required": false; }; "item": { "alias": "item"; "required": false; }; }, {}, never, never, false, never>;
}
