import { OnInit, ElementRef, OnChanges, OnDestroy, EventEmitter, AfterViewInit, QueryList, NgZone, SimpleChanges } from '@angular/core';
import { GanttBarDrag } from './bar-drag';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GanttBarClickEvent } from '../../class';
import { GanttUpper } from '../../gantt-upper';
import { GanttItemUpper } from '../../gantt-item-upper';
import * as i0 from "@angular/core";
export declare class NgxGanttBarComponent extends GanttItemUpper implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private dragContainer;
    private drag;
    ganttUpper: GanttUpper;
    private ngZone;
    barClick: EventEmitter<GanttBarClickEvent<unknown>>;
    contentElementRef: ElementRef<HTMLDivElement>;
    ganttItemClass: boolean;
    handles: QueryList<ElementRef<HTMLElement>>;
    constructor(dragContainer: GanttDragContainer, drag: GanttBarDrag, elementRef: ElementRef<HTMLDivElement>, ganttUpper: GanttUpper, ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    onBarClick(event: Event): void;
    private setContentBackground;
    stopPropagation(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGanttBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGanttBarComponent, "ngx-gantt-bar,gantt-bar", never, {}, { "barClick": "barClick"; }, never, never, true, never>;
}
