import { DragDrop } from '@angular/cdk/drag-drop';
import { ElementRef, NgZone, OnDestroy } from '@angular/core';
import { GanttItemInternal } from '../../class/item';
import { GanttDomService } from '../../gantt-dom.service';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GanttUpper } from '../../gantt-upper';
import * as i0 from "@angular/core";
export declare class GanttBarDrag implements OnDestroy {
    private dragDrop;
    private dom;
    private dragContainer;
    private _ngZone;
    private ganttUpper;
    private barElement;
    private item;
    private hasMonitorMouseEvent;
    private get dragDisabled();
    private get linkDragDisabled();
    private get barHandleDragMoveAndScrollDistance();
    private get autoScrollStep();
    private linkDraggingLine;
    private barDragRef;
    private linkDragRefs;
    private barHandleDragRefs;
    private destroy$;
    /** Used to signal to the current auto-scroll sequence when to stop. */
    private stopScrollTimers$;
    /** container element scrollLeft */
    private containerScrollLeft;
    /** move distance when drag bar */
    private barDragMoveDistance;
    /** move distance when drag bar handle */
    private barHandleDragMoveDistance;
    /** scrolling state when drag */
    private dragScrolling;
    /** dragScrollDistance */
    private dragScrollDistance;
    /** Horizontal direction in which the list is currently scrolling. */
    private _horizontalScrollDirection;
    /** Record bar days when bar handle drag move. */
    private barHandleDragMoveRecordDiffs;
    /** Speed ratio for auto scroll */
    private autoScrollSpeedRates;
    constructor(dragDrop: DragDrop, dom: GanttDomService, dragContainer: GanttDragContainer, _ngZone: NgZone);
    private createDragRef;
    private createDragScrollEvent;
    private createMouseEvents;
    private createBarDrag;
    private createBarHandleDrags;
    private createLinkHandleDrags;
    private openDragBackdrop;
    private closeDragBackdrop;
    private setDraggingStyles;
    private clearDraggingStyles;
    private barDragMove;
    private barBeforeHandleDragMove;
    private barAfterHandleDragMove;
    private calcLinkLinePositions;
    private createLinkDraggingLine;
    private destroyLinkDraggingLine;
    private startScrollInterval;
    private startScrollingIfNecessary;
    private isStartGreaterThanEndWhenBarHandleDragMove;
    private startOfBarHandle;
    private endOfBarHandle;
    private stopScrolling;
    private isStartOrEndInsideView;
    private updateItemDate;
    initialize(elementRef: ElementRef, item: GanttItemInternal, ganttUpper: GanttUpper): void;
    private createBarDragRef;
    private createBarHandleDragRefs;
    private createLinkDragRefs;
    createDrags(): void;
    updateItem(item: GanttItemInternal): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttBarDrag, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GanttBarDrag>;
}
