import { effect, Injectable, signal } from '@angular/core';
import { Subject, animationFrameScheduler, fromEvent, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttViewType } from '../../class';
import { GanttLinkType } from '../../class/link';
import { InBarPosition } from '../../gantt-drag-container';
import { getAutoScrollSpeedRates, getHorizontalScrollDirection, isPointerNearClientRect } from '../../utils/drag-scroll';
import { passiveListenerOptions } from '../../utils/passive-listeners';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/drag-drop";
import * as i2 from "../../gantt-dom.service";
import * as i3 from "../../gantt-drag-container";
/**
 * Proximity, as a ratio to width/height, at which a
 * dragged item will affect the drop container.
 */
const DROP_PROXIMITY_THRESHOLD = 0.05;
const dragMinWidth = 10;
const autoScrollBaseStep = 2;
const activeClass = 'gantt-bar-active';
const dropActiveClass = 'gantt-bar-drop-active';
const singleDropActiveClass = 'gantt-bar-single-drop-active';
function createSvgElement(qualifiedName, className) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
    element.classList.add(className);
    return element;
}
export class GanttBarDrag {
    get dragDisabled() {
        return !this.item().draggable || !this.ganttUpper.draggable;
    }
    get linkDragDisabled() {
        return !this.item().linkable || !this.ganttUpper.linkable;
    }
    get barHandleDragMoveAndScrollDistance() {
        return this.barHandleDragMoveDistance + this.dragScrollDistance;
    }
    get autoScrollStep() {
        return Math.pow(autoScrollBaseStep, this.autoScrollSpeedRates);
    }
    constructor(dragDrop, dom, dragContainer, _ngZone) {
        this.dragDrop = dragDrop;
        this.dom = dom;
        this.dragContainer = dragContainer;
        this._ngZone = _ngZone;
        this.item = signal(null);
        this.linkDragRefs = [];
        this.barHandleDragRefs = [];
        this.destroy$ = new Subject();
        /** Used to signal to the current auto-scroll sequence when to stop. */
        this.stopScrollTimers$ = new Subject();
        /** move distance when drag bar */
        this.barDragMoveDistance = 0;
        /** move distance when drag bar handle */
        this.barHandleDragMoveDistance = 0;
        /** scrolling state when drag */
        this.dragScrolling = false;
        /** dragScrollDistance */
        this.dragScrollDistance = 0;
        /** Horizontal direction in which the list is currently scrolling. */
        this._horizontalScrollDirection = 0 /* AutoScrollHorizontalDirection.NONE */;
        /** Speed ratio for auto scroll */
        this.autoScrollSpeedRates = 1;
        this.startScrollInterval = () => {
            this.stopScrolling();
            interval(0, animationFrameScheduler)
                .pipe(takeUntil(this.stopScrollTimers$))
                .subscribe(() => {
                const node = this.dom.mainContainer;
                const scrollStep = this.autoScrollStep;
                if (this._horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */) {
                    node.scrollBy(-scrollStep, 0);
                }
                else if (this._horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */) {
                    node.scrollBy(scrollStep, 0);
                }
            });
        };
        effect(() => {
            const item = this.item();
            if (item) {
                this.createDrags();
            }
        });
    }
    createDragRef(element) {
        const dragRef = this.dragDrop.createDrag(element);
        return dragRef;
    }
    createDragScrollEvent(dragRef) {
        return fromEvent(this.dom.mainContainer, 'scroll', passiveListenerOptions).pipe(takeUntil(dragRef.ended));
    }
    createMouseEvents() {
        if (!this.hasMonitorMouseEvent && (!this.dragDisabled || !this.linkDragDisabled)) {
            this.hasMonitorMouseEvent = true;
            const dropClass = this.ganttUpper.linkOptions?.dependencyTypes?.length === 1 &&
                this.ganttUpper.linkOptions?.dependencyTypes[0] === GanttLinkType.fs
                ? singleDropActiveClass
                : dropActiveClass;
            fromEvent(this.barElement, 'mouseenter', passiveListenerOptions)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                if (this.dragContainer.linkDraggingId && this.dragContainer.linkDraggingId !== this.item().id) {
                    if (!this.linkDragDisabled) {
                        this.barElement.classList.add(dropClass);
                        this.dragContainer.emitLinkDragEntered({
                            item: this.item(),
                            element: this.barElement
                        });
                    }
                }
                else {
                    if (!this.dragDisabled || !this.linkDragDisabled) {
                        this.barElement.classList.add(activeClass);
                    }
                }
            });
            fromEvent(this.barElement, 'mouseleave', passiveListenerOptions)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                if (!this.dragContainer.linkDraggingId) {
                    this.barElement.classList.remove(activeClass);
                }
                else {
                    this.dragContainer.emitLinkDragLeaved();
                }
                this.barElement.classList.remove(dropClass);
            });
        }
    }
    createBarDrag() {
        const dragRef = this.createDragRef(this.barElement);
        dragRef.disabled = this.dragDisabled;
        dragRef.lockAxis = 'x';
        dragRef.withBoundaryElement(this.dom.mainItems);
        dragRef.started.subscribe(() => {
            this.setDraggingStyles();
            this.containerScrollLeft = this.dom.mainContainer.scrollLeft;
            this.createDragScrollEvent(dragRef).subscribe(() => {
                if (dragRef.isDragging()) {
                    const dragScrollDistance = this.dom.mainContainer.scrollLeft - this.containerScrollLeft;
                    this.dragScrollDistance = dragScrollDistance;
                    dragRef['_boundaryRect'] = this.dom.mainItems.getBoundingClientRect();
                    this.barDragMove();
                }
            });
            this.dragContainer.dragStarted.emit({ item: this.item().origin });
        });
        dragRef.moved.subscribe((event) => {
            this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
            this.barDragMoveDistance = event.distance.x;
            if (!this.dragScrolling) {
                this.barDragMove();
            }
        });
        dragRef.ended.subscribe((event) => {
            this.clearDraggingStyles();
            this.closeDragBackdrop();
            event.source.reset();
            this.stopScrolling();
            this.dragScrolling = false;
            this.dragScrollDistance = 0;
            this.barDragMoveDistance = 0;
            this.item().updateRefs({
                width: this.ganttUpper.view.getDateRangeWidth(this.item().start, this.item().end),
                x: this.ganttUpper.view.getXPointByDate(this.item().start),
                y: (this.ganttUpper.styles.lineHeight - this.ganttUpper.styles.barHeight) / 2 - 1
            });
            this.dragContainer.dragEnded.emit({ item: this.item().origin });
        });
        return dragRef;
    }
    createBarHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll('.drag-handles .handle');
        handles.forEach((handle, index) => {
            const isBefore = index === 0;
            const dragRef = this.createDragRef(handle);
            dragRef.disabled = this.dragDisabled;
            dragRef.lockAxis = 'x';
            dragRef.withBoundaryElement(this.dom.mainItems);
            dragRef.started.subscribe(() => {
                this.setDraggingStyles();
                this.containerScrollLeft = this.dom.mainContainer.scrollLeft;
                this.createDragScrollEvent(dragRef).subscribe(() => {
                    if (dragRef.isDragging()) {
                        const dragScrollDistance = this.dom.mainContainer.scrollLeft - this.containerScrollLeft;
                        this.dragScrollDistance = dragScrollDistance;
                        dragRef['_boundaryRect'] = this.dom.mainItems.getBoundingClientRect();
                        if (this.dragScrolling && this.isStartGreaterThanEndWhenBarHandleDragMove(isBefore)) {
                            this.stopScrolling();
                            this.dragScrolling = false;
                        }
                        if (isBefore) {
                            this.barBeforeHandleDragMove();
                        }
                        else {
                            this.barAfterHandleDragMove();
                        }
                    }
                });
                this.dragContainer.dragStarted.emit({ item: this.item().origin });
            });
            dragRef.moved.subscribe((event) => {
                if (this.barHandleDragMoveRecordDiffs && this.barHandleDragMoveRecordDiffs > 0) {
                    this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
                }
                this.barHandleDragMoveDistance = event.distance.x;
                if (!this.dragScrolling) {
                    if (isBefore) {
                        this.barBeforeHandleDragMove();
                    }
                    else {
                        this.barAfterHandleDragMove();
                    }
                }
            });
            dragRef.ended.subscribe((event) => {
                this.clearDraggingStyles();
                this.closeDragBackdrop();
                event.source.reset();
                this.stopScrolling();
                this.dragScrolling = false;
                this.dragScrollDistance = 0;
                this.barHandleDragMoveDistance = 0;
                this.item().updateRefs({
                    width: this.ganttUpper.view.getDateRangeWidth(this.item().start, this.item().end),
                    x: this.ganttUpper.view.getXPointByDate(this.item().start),
                    y: (this.ganttUpper.styles.lineHeight - this.ganttUpper.styles.barHeight) / 2 - 1
                });
                this.dragContainer.dragEnded.emit({ item: this.item().origin });
            });
            dragRefs.push(dragRef);
        });
        return dragRefs;
    }
    createLinkHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll('.link-handles .handle');
        handles.forEach((handle, index) => {
            const isBegin = index === 0;
            const dragRef = this.dragDrop.createDrag(handle);
            dragRef.disabled = this.linkDragDisabled;
            dragRef.withBoundaryElement(this.dom.root);
            dragRef.beforeStarted.subscribe(() => {
                handle.style.pointerEvents = 'none';
                if (this.barDragRef) {
                    this.barDragRef.disabled = true;
                }
                this.createLinkDraggingLine();
                this.dragContainer.emitLinkDragStarted({
                    element: this.barElement,
                    item: this.item(),
                    pos: isBegin ? InBarPosition.start : InBarPosition.finish
                });
            });
            dragRef.moved.subscribe(() => {
                const positions = this.calcLinkLinePositions(handle, isBegin);
                this.linkDraggingLine.setAttribute('x1', positions.x1.toString());
                this.linkDraggingLine.setAttribute('y1', positions.y1.toString());
                this.linkDraggingLine.setAttribute('x2', positions.x2.toString());
                this.linkDraggingLine.setAttribute('y2', positions.y2.toString());
            });
            dragRef.ended.subscribe((event) => {
                handle.style.pointerEvents = '';
                if (this.barDragRef) {
                    this.barDragRef.disabled = false;
                }
                // 计算line拖动的落点位于目标Bar的值，如果值大于Bar宽度的一半，说明是拖动到Begin位置，否则则为拖动到End位置
                if (this.dragContainer.linkDragPath.to) {
                    const placePointX = event.source.getRootElement().getBoundingClientRect().x -
                        this.dragContainer.linkDragPath.to.element.getBoundingClientRect().x;
                    this.dragContainer.emitLinkDragEnded({
                        ...this.dragContainer.linkDragPath.to,
                        pos: placePointX < this.dragContainer.linkDragPath.to.item.refs.width / 2
                            ? InBarPosition.start
                            : InBarPosition.finish
                    });
                }
                else {
                    this.dragContainer.emitLinkDragEnded();
                }
                event.source.reset();
                this.barElement.classList.remove(activeClass);
                this.destroyLinkDraggingLine();
            });
            dragRefs.push(dragRef);
        });
        return dragRefs;
    }
    openDragBackdrop(dragElement, start, end) {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop');
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask');
        const rootRect = this.dom.root.getBoundingClientRect();
        const dragRect = dragElement.getBoundingClientRect();
        let left = dragRect.left - rootRect.left - (this.dom.side.clientWidth + 1);
        if (this.dragScrolling) {
            if (this._horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */) {
                left += this.autoScrollStep;
            }
            else if (this._horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */) {
                left -= this.autoScrollStep;
            }
        }
        const width = dragRect.right - dragRect.left;
        // Note: updating styles will cause re-layout so we have to place them consistently one by one.
        dragMaskElement.style.left = left + 'px';
        dragMaskElement.style.width = width + 'px';
        dragMaskElement.style.display = 'block';
        dragBackdropElement.style.display = 'block';
        // This will invalidate the layout, but we won't need re-layout, because we set styles previously.
        dragMaskElement.querySelector('.start').innerHTML = start.format(this.ganttUpper.view.options.dragPreviewDateFormat);
        dragMaskElement.querySelector('.end').innerHTML = end.format(this.ganttUpper.view.options.dragPreviewDateFormat);
    }
    closeDragBackdrop() {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop');
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask');
        dragMaskElement.style.display = 'none';
        dragBackdropElement.style.display = 'none';
    }
    setDraggingStyles() {
        this.barElement.classList.add('gantt-bar-draggable-drag');
    }
    clearDraggingStyles() {
        this.barElement.classList.remove('gantt-bar-draggable-drag');
    }
    barDragMove() {
        const currentX = this.item().refs.x + this.barDragMoveDistance + this.dragScrollDistance;
        const currentDate = this.ganttUpper.view.getDateByXPoint(currentX);
        const currentStartX = this.ganttUpper.view.getXPointByDate(currentDate);
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(this.item().end, this.item().start);
        let start = currentDate;
        let end = currentDate.add(diffs, this.ganttUpper.view?.options?.datePrecisionUnit);
        // 日视图特殊逻辑处理
        if (this.ganttUpper.view.viewType === GanttViewType.day) {
            const dayWidth = this.ganttUpper.view.getDayOccupancyWidth(currentDate);
            if (currentX > currentStartX + dayWidth / 2) {
                start = start.addDays(1);
                end = end.addDays(1);
            }
        }
        if (this.dragScrolling) {
            const left = currentX - this.barDragMoveDistance;
            this.barElement.style.left = left + 'px';
        }
        this.openDragBackdrop(this.barElement, this.ganttUpper.view.getDateByXPoint(currentX), this.ganttUpper.view.getDateByXPoint(currentX + this.item().refs.width));
        if (!this.isStartOrEndInsideView(start, end)) {
            return;
        }
        this.updateItemDate(start, end);
        this.dragContainer.dragMoved.emit({ item: this.item().origin });
    }
    barBeforeHandleDragMove() {
        const { x, start, minRangeWidthWidth } = this.startOfBarHandle();
        const width = this.item().refs.width + this.barHandleDragMoveAndScrollDistance * -1;
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(this.item().end, start);
        if (width > dragMinWidth && diffs > 0) {
            this.barElement.style.width = width + 'px';
            this.barElement.style.left = x + 'px';
            this.openDragBackdrop(this.barElement, start, this.item().end);
            if (!this.isStartOrEndInsideView(start, this.item().end)) {
                return;
            }
            this.updateItemDate(start, this.item().end);
        }
        else {
            if (this.barHandleDragMoveRecordDiffs > 0 && diffs <= 0) {
                this.barElement.style.width = minRangeWidthWidth + 'px';
                const x = this.ganttUpper.view.getXPointByDate(this.item().end);
                this.barElement.style.left = x + 'px';
            }
            this.openDragBackdrop(this.barElement, this.item().end, this.item().end);
            this.updateItemDate(this.item().end, this.item().end);
        }
        this.barHandleDragMoveRecordDiffs = diffs;
        this.dragContainer.dragMoved.emit({ item: this.item().origin });
    }
    barAfterHandleDragMove() {
        const { width, end } = this.endOfBarHandle();
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(end, this.item().start);
        if (width > dragMinWidth && diffs > 0) {
            this.barElement.style.width = width + 'px';
            this.openDragBackdrop(this.barElement, this.item().start, end);
            if (!this.isStartOrEndInsideView(this.item().start, end)) {
                return;
            }
            this.updateItemDate(this.item().start, end);
        }
        else {
            if (this.barHandleDragMoveRecordDiffs > 0 && diffs <= 0) {
                const minRangeWidth = this.ganttUpper.view.getMinRangeWidthByPrecisionUnit(this.item().start);
                this.barElement.style.width = minRangeWidth + 'px';
            }
            this.openDragBackdrop(this.barElement, this.item().start, this.item().start);
            this.updateItemDate(this.item().start, this.item().start);
        }
        this.barHandleDragMoveRecordDiffs = diffs;
        this.dragContainer.dragMoved.emit({ item: this.item().origin });
    }
    calcLinkLinePositions(target, isBefore) {
        const rootRect = this.dom.root.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const layerRect = target.parentElement.parentElement.getBoundingClientRect();
        return {
            x1: layerRect.left + (isBefore ? 0 : layerRect.width) - rootRect.left,
            y1: layerRect.top + layerRect.height / 2 - rootRect.top,
            x2: targetRect.left - rootRect.left + targetRect.width / 2,
            y2: targetRect.top - rootRect.top + targetRect.height / 2
        };
    }
    createLinkDraggingLine() {
        if (!this.linkDraggingLine) {
            const svgElement = createSvgElement('svg', 'gantt-link-drag-container');
            const linElement = createSvgElement('line', 'link-dragging-line');
            linElement.style.pointerEvents = 'none';
            svgElement.appendChild(linElement);
            this.dom.root.appendChild(svgElement);
            this.linkDraggingLine = linElement;
        }
    }
    destroyLinkDraggingLine() {
        if (this.linkDraggingLine) {
            this.linkDraggingLine.parentElement.remove();
            this.linkDraggingLine = null;
        }
    }
    startScrollingIfNecessary(pointerX, pointerY) {
        const clientRect = this.dom.mainContainer.getBoundingClientRect();
        const scrollLeft = this.dom.mainContainer.scrollLeft;
        if (isPointerNearClientRect(clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY)) {
            const horizontalScrollDirection = getHorizontalScrollDirection(clientRect, pointerX);
            if ((horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */ && scrollLeft > 0) ||
                (horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */ &&
                    scrollLeft < this.ganttUpper.view.width - clientRect.width)) {
                this._horizontalScrollDirection = horizontalScrollDirection;
                this.autoScrollSpeedRates = getAutoScrollSpeedRates(clientRect, pointerX, horizontalScrollDirection);
                this.dragScrolling = true;
                this._ngZone.runOutsideAngular(this.startScrollInterval);
            }
            else {
                this.dragScrolling = false;
                this.stopScrolling();
            }
        }
    }
    // Conditions to stop auto-scroll: when the start is greater than the end and the bar appears in the view
    isStartGreaterThanEndWhenBarHandleDragMove(isBefore) {
        let isStartGreaterThanEnd;
        let isBarAppearsInView;
        const scrollLeft = this.dom.mainContainer.scrollLeft;
        const clientWidth = this.dom.mainContainer.clientWidth;
        const xThreshold = clientWidth * DROP_PROXIMITY_THRESHOLD;
        if (isBefore) {
            const { start, minRangeWidthWidth } = this.startOfBarHandle();
            const xPointerByEndDate = this.ganttUpper.view.getXPointByDate(this.item().end);
            isStartGreaterThanEnd = start.value > this.item().end.value;
            isBarAppearsInView = xPointerByEndDate + minRangeWidthWidth + xThreshold <= scrollLeft + clientWidth;
        }
        else {
            const { end } = this.endOfBarHandle();
            const xPointerByStartDate = this.ganttUpper.view.getXPointByDate(this.item().start);
            isStartGreaterThanEnd = end.value < this.item().start.value;
            isBarAppearsInView = scrollLeft + xThreshold <= xPointerByStartDate;
        }
        return isStartGreaterThanEnd && isBarAppearsInView ? true : false;
    }
    // Some data information about dragging start until it is equal to or greater than end
    startOfBarHandle() {
        const x = this.item().refs.x + this.barHandleDragMoveAndScrollDistance;
        return {
            x,
            start: this.ganttUpper.view.getDateByXPoint(x),
            minRangeWidthWidth: this.ganttUpper.view.getMinRangeWidthByPrecisionUnit(this.item().end)
        };
    }
    // Some data information about dragging end of bar handle
    endOfBarHandle() {
        const width = this.item().refs.width + this.barHandleDragMoveAndScrollDistance;
        return {
            width,
            end: this.ganttUpper.view.getDateByXPoint(this.item().refs.x + width)
        };
    }
    stopScrolling() {
        this.stopScrollTimers$.next();
    }
    isStartOrEndInsideView(start, end) {
        const itemStart = start.getUnixTime();
        const itemEnd = end.getUnixTime();
        const viewStart = this.ganttUpper.view.start.getUnixTime();
        const viewEnd = this.ganttUpper.view.end.getUnixTime();
        if (itemStart < viewStart || itemEnd > viewEnd) {
            return false;
        }
        else {
            return true;
        }
    }
    updateItemDate(start, end) {
        this.item().updateDate(this.ganttUpper.view.startOfPrecision(start), this.ganttUpper.view.endOfPrecision(end));
    }
    initialize(elementRef, item, ganttUpper) {
        this.barElement = elementRef.nativeElement;
        this.ganttUpper = ganttUpper;
        this.item.set(item);
    }
    createBarDragRef() {
        if (this.barDragRef) {
            this.barDragRef.disabled = this.dragDisabled;
        }
        else if (!this.dragDisabled) {
            this.barDragRef = this.createBarDrag();
        }
    }
    createBarHandleDragRefs() {
        if (this.barHandleDragRefs.length > 0) {
            this.barHandleDragRefs.forEach((dragRef) => {
                dragRef.disabled = this.dragDisabled;
            });
        }
        else if (!this.dragDisabled) {
            this.barHandleDragRefs = this.createBarHandleDrags();
        }
    }
    createLinkDragRefs() {
        if (this.linkDragRefs.length > 0) {
            this.linkDragRefs.forEach((dragRef) => {
                dragRef.disabled = this.linkDragDisabled;
            });
        }
        else if (!this.linkDragDisabled) {
            this.linkDragRefs = this.createLinkHandleDrags();
        }
    }
    createDrags() {
        this.createMouseEvents();
        this.createBarDragRef();
        this.createBarHandleDragRefs();
        this.createLinkDragRefs();
    }
    updateItem(item) {
        this.item.set(item);
    }
    ngOnDestroy() {
        this.closeDragBackdrop();
        this.barDragRef?.dispose();
        this.linkDragRefs?.forEach((dragRef) => dragRef.dispose());
        this.barHandleDragRefs?.forEach((dragRef) => dragRef.dispose());
        this.destroy$.next();
        this.destroy$.complete();
        this.stopScrolling();
        this.stopScrollTimers$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttBarDrag, deps: [{ token: i1.DragDrop }, { token: i2.GanttDomService }, { token: i3.GanttDragContainer }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttBarDrag }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttBarDrag, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DragDrop }, { type: i2.GanttDomService }, { type: i3.GanttDragContainer }, { type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLWRyYWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvY29tcG9uZW50cy9iYXIvYmFyLWRyYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sRUFBYyxVQUFVLEVBQXFCLE1BQU0sRUFBa0IsTUFBTSxlQUFlLENBQUM7QUFDMUcsT0FBTyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVqRCxPQUFPLEVBQXNCLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRy9FLE9BQU8sRUFFSCx1QkFBdUIsRUFDdkIsNEJBQTRCLEVBQzVCLHVCQUF1QixFQUMxQixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLCtCQUErQixDQUFDOzs7OztBQUV2RTs7O0dBR0c7QUFDSCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQztBQUV0QyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDeEIsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7QUFDN0IsTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7QUFDdkMsTUFBTSxlQUFlLEdBQUcsdUJBQXVCLENBQUM7QUFDaEQsTUFBTSxxQkFBcUIsR0FBRyw4QkFBOEIsQ0FBQztBQUU3RCxTQUFTLGdCQUFnQixDQUFDLGFBQXFCLEVBQUUsU0FBaUI7SUFDOUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN0RixP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QUMsUUFBUSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxDQUFDOzhHQXRtQlEsWUFBWTtrSEFBWixZQUFZOzsyRkFBWixZQUFZO2tCQUR4QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHJhZ0Ryb3AsIERyYWdSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcbmltcG9ydCB7IGVmZmVjdCwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3ksIHNpZ25hbCwgV3JpdGFibGVTaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBmcm9tRXZlbnQsIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBHYW50dFZpZXdUeXBlIH0gZnJvbSAnLi4vLi4vY2xhc3MnO1xuaW1wb3J0IHsgR2FudHRJdGVtSW50ZXJuYWwgfSBmcm9tICcuLi8uLi9jbGFzcy9pdGVtJztcbmltcG9ydCB7IEdhbnR0TGlua1R5cGUgfSBmcm9tICcuLi8uLi9jbGFzcy9saW5rJztcbmltcG9ydCB7IEdhbnR0RG9tU2VydmljZSB9IGZyb20gJy4uLy4uL2dhbnR0LWRvbS5zZXJ2aWNlJztcbmltcG9ydCB7IEdhbnR0RHJhZ0NvbnRhaW5lciwgSW5CYXJQb3NpdGlvbiB9IGZyb20gJy4uLy4uL2dhbnR0LWRyYWctY29udGFpbmVyJztcbmltcG9ydCB7IEdhbnR0VXBwZXIgfSBmcm9tICcuLi8uLi9nYW50dC11cHBlcic7XG5pbXBvcnQgeyBHYW50dERhdGUgfSBmcm9tICcuLi8uLi91dGlscy9kYXRlJztcbmltcG9ydCB7XG4gICAgQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24sXG4gICAgZ2V0QXV0b1Njcm9sbFNwZWVkUmF0ZXMsXG4gICAgZ2V0SG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbixcbiAgICBpc1BvaW50ZXJOZWFyQ2xpZW50UmVjdFxufSBmcm9tICcuLi8uLi91dGlscy9kcmFnLXNjcm9sbCc7XG5pbXBvcnQgeyBwYXNzaXZlTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vdXRpbHMvcGFzc2l2ZS1saXN0ZW5lcnMnO1xuXG4vKipcbiAqIFByb3hpbWl0eSwgYXMgYSByYXRpbyB0byB3aWR0aC9oZWlnaHQsIGF0IHdoaWNoIGFcbiAqIGRyYWdnZWQgaXRlbSB3aWxsIGFmZmVjdCB0aGUgZHJvcCBjb250YWluZXIuXG4gKi9cbmNvbnN0IERST1BfUFJPWElNSVRZX1RIUkVTSE9MRCA9IDAuMDU7XG5cbmNvbnN0IGRyYWdNaW5XaWR0aCA9IDEwO1xuY29uc3QgYXV0b1Njcm9sbEJhc2VTdGVwID0gMjtcbmNvbnN0IGFjdGl2ZUNsYXNzID0gJ2dhbnR0LWJhci1hY3RpdmUnO1xuY29uc3QgZHJvcEFjdGl2ZUNsYXNzID0gJ2dhbnR0LWJhci1kcm9wLWFjdGl2ZSc7XG5jb25zdCBzaW5nbGVEcm9wQWN0aXZlQ2xhc3MgPSAnZ2FudHQtYmFyLXNpbmdsZS1kcm9wLWFjdGl2ZSc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVN2Z0VsZW1lbnQocXVhbGlmaWVkTmFtZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgcXVhbGlmaWVkTmFtZSk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBHYW50dEJhckRyYWcgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgZ2FudHRVcHBlcjogR2FudHRVcHBlcjtcblxuICAgIHByaXZhdGUgYmFyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIGl0ZW06IFdyaXRhYmxlU2lnbmFsPEdhbnR0SXRlbUludGVybmFsPiA9IHNpZ25hbChudWxsKTtcblxuICAgIHByaXZhdGUgaGFzTW9uaXRvck1vdXNlRXZlbnQ6IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIGdldCBkcmFnRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pdGVtKCkuZHJhZ2dhYmxlIHx8ICF0aGlzLmdhbnR0VXBwZXIuZHJhZ2dhYmxlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGxpbmtEcmFnRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pdGVtKCkubGlua2FibGUgfHwgIXRoaXMuZ2FudHRVcHBlci5saW5rYWJsZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBiYXJIYW5kbGVEcmFnTW92ZUFuZFNjcm9sbERpc3RhbmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXJIYW5kbGVEcmFnTW92ZURpc3RhbmNlICsgdGhpcy5kcmFnU2Nyb2xsRGlzdGFuY2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgYXV0b1Njcm9sbFN0ZXAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdyhhdXRvU2Nyb2xsQmFzZVN0ZXAsIHRoaXMuYXV0b1Njcm9sbFNwZWVkUmF0ZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbGlua0RyYWdnaW5nTGluZTogU1ZHRWxlbWVudDtcblxuICAgIHByaXZhdGUgYmFyRHJhZ1JlZjogRHJhZ1JlZjtcblxuICAgIHByaXZhdGUgbGlua0RyYWdSZWZzOiBEcmFnUmVmW10gPSBbXTtcblxuICAgIHByaXZhdGUgYmFySGFuZGxlRHJhZ1JlZnM6IERyYWdSZWZbXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICAvKiogVXNlZCB0byBzaWduYWwgdG8gdGhlIGN1cnJlbnQgYXV0by1zY3JvbGwgc2VxdWVuY2Ugd2hlbiB0byBzdG9wLiAqL1xuICAgIHByaXZhdGUgc3RvcFNjcm9sbFRpbWVycyQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgLyoqIGNvbnRhaW5lciBlbGVtZW50IHNjcm9sbExlZnQgKi9cbiAgICBwcml2YXRlIGNvbnRhaW5lclNjcm9sbExlZnQ6IG51bWJlcjtcblxuICAgIC8qKiBtb3ZlIGRpc3RhbmNlIHdoZW4gZHJhZyBiYXIgKi9cbiAgICBwcml2YXRlIGJhckRyYWdNb3ZlRGlzdGFuY2UgPSAwO1xuXG4gICAgLyoqIG1vdmUgZGlzdGFuY2Ugd2hlbiBkcmFnIGJhciBoYW5kbGUgKi9cbiAgICBwcml2YXRlIGJhckhhbmRsZURyYWdNb3ZlRGlzdGFuY2UgPSAwO1xuXG4gICAgLyoqIHNjcm9sbGluZyBzdGF0ZSB3aGVuIGRyYWcgKi9cbiAgICBwcml2YXRlIGRyYWdTY3JvbGxpbmcgPSBmYWxzZTtcblxuICAgIC8qKiBkcmFnU2Nyb2xsRGlzdGFuY2UgKi9cbiAgICBwcml2YXRlIGRyYWdTY3JvbGxEaXN0YW5jZSA9IDA7XG5cbiAgICAvKiogSG9yaXpvbnRhbCBkaXJlY3Rpb24gaW4gd2hpY2ggdGhlIGxpc3QgaXMgY3VycmVudGx5IHNjcm9sbGluZy4gKi9cbiAgICBwcml2YXRlIF9ob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uID0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uTk9ORTtcblxuICAgIC8qKiBSZWNvcmQgYmFyIGRheXMgd2hlbiBiYXIgaGFuZGxlIGRyYWcgbW92ZS4gKi9cbiAgICBwcml2YXRlIGJhckhhbmRsZURyYWdNb3ZlUmVjb3JkRGlmZnM6IG51bWJlcjtcblxuICAgIC8qKiBTcGVlZCByYXRpbyBmb3IgYXV0byBzY3JvbGwgKi9cbiAgICBwcml2YXRlIGF1dG9TY3JvbGxTcGVlZFJhdGVzID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGRyYWdEcm9wOiBEcmFnRHJvcCxcbiAgICAgICAgcHJpdmF0ZSBkb206IEdhbnR0RG9tU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBkcmFnQ29udGFpbmVyOiBHYW50dERyYWdDb250YWluZXIsXG4gICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lXG4gICAgKSB7XG4gICAgICAgIGVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtOiBHYW50dEl0ZW1JbnRlcm5hbCA9IHRoaXMuaXRlbSgpO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZURyYWdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRHJhZ1JlZjxUID0gYW55PihlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiB8IEhUTUxFbGVtZW50KTogRHJhZ1JlZjxUPiB7XG4gICAgICAgIGNvbnN0IGRyYWdSZWYgPSB0aGlzLmRyYWdEcm9wLmNyZWF0ZURyYWcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiBkcmFnUmVmO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRHJhZ1Njcm9sbEV2ZW50KGRyYWdSZWY6IERyYWdSZWYpIHtcbiAgICAgICAgcmV0dXJuIGZyb21FdmVudCh0aGlzLmRvbS5tYWluQ29udGFpbmVyLCAnc2Nyb2xsJywgcGFzc2l2ZUxpc3RlbmVyT3B0aW9ucykucGlwZSh0YWtlVW50aWwoZHJhZ1JlZi5lbmRlZCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTW91c2VFdmVudHMoKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNNb25pdG9yTW91c2VFdmVudCAmJiAoIXRoaXMuZHJhZ0Rpc2FibGVkIHx8ICF0aGlzLmxpbmtEcmFnRGlzYWJsZWQpKSB7XG4gICAgICAgICAgICB0aGlzLmhhc01vbml0b3JNb3VzZUV2ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IGRyb3BDbGFzcyA9XG4gICAgICAgICAgICAgICAgdGhpcy5nYW50dFVwcGVyLmxpbmtPcHRpb25zPy5kZXBlbmRlbmN5VHlwZXM/Lmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FudHRVcHBlci5saW5rT3B0aW9ucz8uZGVwZW5kZW5jeVR5cGVzWzBdID09PSBHYW50dExpbmtUeXBlLmZzXG4gICAgICAgICAgICAgICAgICAgID8gc2luZ2xlRHJvcEFjdGl2ZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgIDogZHJvcEFjdGl2ZUNsYXNzO1xuXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5iYXJFbGVtZW50LCAnbW91c2VlbnRlcicsIHBhc3NpdmVMaXN0ZW5lck9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnQ29udGFpbmVyLmxpbmtEcmFnZ2luZ0lkICYmIHRoaXMuZHJhZ0NvbnRhaW5lci5saW5rRHJhZ2dpbmdJZCAhPT0gdGhpcy5pdGVtKCkuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5saW5rRHJhZ0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoZHJvcENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZW1pdExpbmtEcmFnRW50ZXJlZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW06IHRoaXMuaXRlbSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLmJhckVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcmFnRGlzYWJsZWQgfHwgIXRoaXMubGlua0RyYWdEaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFyRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5iYXJFbGVtZW50LCAnbW91c2VsZWF2ZScsIHBhc3NpdmVMaXN0ZW5lck9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZHJhZ0NvbnRhaW5lci5saW5rRHJhZ2dpbmdJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLmVtaXRMaW5rRHJhZ0xlYXZlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGRyb3BDbGFzcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhckRyYWcoKSB7XG4gICAgICAgIGNvbnN0IGRyYWdSZWYgPSB0aGlzLmNyZWF0ZURyYWdSZWYodGhpcy5iYXJFbGVtZW50KTtcbiAgICAgICAgZHJhZ1JlZi5kaXNhYmxlZCA9IHRoaXMuZHJhZ0Rpc2FibGVkO1xuICAgICAgICBkcmFnUmVmLmxvY2tBeGlzID0gJ3gnO1xuICAgICAgICBkcmFnUmVmLndpdGhCb3VuZGFyeUVsZW1lbnQodGhpcy5kb20ubWFpbkl0ZW1zIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgZHJhZ1JlZi5zdGFydGVkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERyYWdnaW5nU3R5bGVzKCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lclNjcm9sbExlZnQgPSB0aGlzLmRvbS5tYWluQ29udGFpbmVyLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZURyYWdTY3JvbGxFdmVudChkcmFnUmVmKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkcmFnUmVmLmlzRHJhZ2dpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkcmFnU2Nyb2xsRGlzdGFuY2UgPSB0aGlzLmRvbS5tYWluQ29udGFpbmVyLnNjcm9sbExlZnQgLSB0aGlzLmNvbnRhaW5lclNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1Njcm9sbERpc3RhbmNlID0gZHJhZ1Njcm9sbERpc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICBkcmFnUmVmWydfYm91bmRhcnlSZWN0J10gPSB0aGlzLmRvbS5tYWluSXRlbXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFyRHJhZ01vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0NvbnRhaW5lci5kcmFnU3RhcnRlZC5lbWl0KHsgaXRlbTogdGhpcy5pdGVtKCkub3JpZ2luIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnUmVmLm1vdmVkLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRTY3JvbGxpbmdJZk5lY2Vzc2FyeShldmVudC5wb2ludGVyUG9zaXRpb24ueCwgZXZlbnQucG9pbnRlclBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgdGhpcy5iYXJEcmFnTW92ZURpc3RhbmNlID0gZXZlbnQuZGlzdGFuY2UueDtcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYXJEcmFnTW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnUmVmLmVuZGVkLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEcmFnZ2luZ1N0eWxlcygpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZURyYWdCYWNrZHJvcCgpO1xuICAgICAgICAgICAgZXZlbnQuc291cmNlLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLnN0b3BTY3JvbGxpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsRGlzdGFuY2UgPSAwO1xuICAgICAgICAgICAgdGhpcy5iYXJEcmFnTW92ZURpc3RhbmNlID0gMDtcbiAgICAgICAgICAgIHRoaXMuaXRlbSgpLnVwZGF0ZVJlZnMoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXREYXRlUmFuZ2VXaWR0aCh0aGlzLml0ZW0oKS5zdGFydCwgdGhpcy5pdGVtKCkuZW5kKSxcbiAgICAgICAgICAgICAgICB4OiB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXRYUG9pbnRCeURhdGUodGhpcy5pdGVtKCkuc3RhcnQpLFxuICAgICAgICAgICAgICAgIHk6ICh0aGlzLmdhbnR0VXBwZXIuc3R5bGVzLmxpbmVIZWlnaHQgLSB0aGlzLmdhbnR0VXBwZXIuc3R5bGVzLmJhckhlaWdodCkgLyAyIC0gMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZHJhZ0VuZGVkLmVtaXQoeyBpdGVtOiB0aGlzLml0ZW0oKS5vcmlnaW4gfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkcmFnUmVmO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQmFySGFuZGxlRHJhZ3MoKSB7XG4gICAgICAgIGNvbnN0IGRyYWdSZWZzID0gW107XG4gICAgICAgIGNvbnN0IGhhbmRsZXMgPSB0aGlzLmJhckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5kcmFnLWhhbmRsZXMgLmhhbmRsZScpO1xuICAgICAgICBoYW5kbGVzLmZvckVhY2goKGhhbmRsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzQmVmb3JlID0gaW5kZXggPT09IDA7XG4gICAgICAgICAgICBjb25zdCBkcmFnUmVmID0gdGhpcy5jcmVhdGVEcmFnUmVmKGhhbmRsZSk7XG4gICAgICAgICAgICBkcmFnUmVmLmRpc2FibGVkID0gdGhpcy5kcmFnRGlzYWJsZWQ7XG4gICAgICAgICAgICBkcmFnUmVmLmxvY2tBeGlzID0gJ3gnO1xuICAgICAgICAgICAgZHJhZ1JlZi53aXRoQm91bmRhcnlFbGVtZW50KHRoaXMuZG9tLm1haW5JdGVtcyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICBkcmFnUmVmLnN0YXJ0ZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERyYWdnaW5nU3R5bGVzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJTY3JvbGxMZWZ0ID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lci5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRHJhZ1Njcm9sbEV2ZW50KGRyYWdSZWYpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkcmFnUmVmLmlzRHJhZ2dpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZHJhZ1Njcm9sbERpc3RhbmNlID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lci5zY3JvbGxMZWZ0IC0gdGhpcy5jb250YWluZXJTY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsRGlzdGFuY2UgPSBkcmFnU2Nyb2xsRGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnUmVmWydfYm91bmRhcnlSZWN0J10gPSB0aGlzLmRvbS5tYWluSXRlbXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdTY3JvbGxpbmcgJiYgdGhpcy5pc1N0YXJ0R3JlYXRlclRoYW5FbmRXaGVuQmFySGFuZGxlRHJhZ01vdmUoaXNCZWZvcmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wU2Nyb2xsaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0JlZm9yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFyQmVmb3JlSGFuZGxlRHJhZ01vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJBZnRlckhhbmRsZURyYWdNb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZHJhZ1N0YXJ0ZWQuZW1pdCh7IGl0ZW06IHRoaXMuaXRlbSgpLm9yaWdpbiB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkcmFnUmVmLm1vdmVkLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYXJIYW5kbGVEcmFnTW92ZVJlY29yZERpZmZzICYmIHRoaXMuYmFySGFuZGxlRHJhZ01vdmVSZWNvcmREaWZmcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydFNjcm9sbGluZ0lmTmVjZXNzYXJ5KGV2ZW50LnBvaW50ZXJQb3NpdGlvbi54LCBldmVudC5wb2ludGVyUG9zaXRpb24ueSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYmFySGFuZGxlRHJhZ01vdmVEaXN0YW5jZSA9IGV2ZW50LmRpc3RhbmNlLng7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdTY3JvbGxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhckJlZm9yZUhhbmRsZURyYWdNb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhckFmdGVySGFuZGxlRHJhZ01vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkcmFnUmVmLmVuZGVkLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyRHJhZ2dpbmdTdHlsZXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRHJhZ0JhY2tkcm9wKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wU2Nyb2xsaW5nKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsRGlzdGFuY2UgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFySGFuZGxlRHJhZ01vdmVEaXN0YW5jZSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtKCkudXBkYXRlUmVmcyh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXREYXRlUmFuZ2VXaWR0aCh0aGlzLml0ZW0oKS5zdGFydCwgdGhpcy5pdGVtKCkuZW5kKSxcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy5nYW50dFVwcGVyLnZpZXcuZ2V0WFBvaW50QnlEYXRlKHRoaXMuaXRlbSgpLnN0YXJ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogKHRoaXMuZ2FudHRVcHBlci5zdHlsZXMubGluZUhlaWdodCAtIHRoaXMuZ2FudHRVcHBlci5zdHlsZXMuYmFySGVpZ2h0KSAvIDIgLSAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLmRyYWdFbmRlZC5lbWl0KHsgaXRlbTogdGhpcy5pdGVtKCkub3JpZ2luIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkcmFnUmVmcy5wdXNoKGRyYWdSZWYpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRyYWdSZWZzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTGlua0hhbmRsZURyYWdzKCkge1xuICAgICAgICBjb25zdCBkcmFnUmVmcyA9IFtdO1xuICAgICAgICBjb25zdCBoYW5kbGVzID0gdGhpcy5iYXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcubGluay1oYW5kbGVzIC5oYW5kbGUnKTtcbiAgICAgICAgaGFuZGxlcy5mb3JFYWNoKChoYW5kbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0JlZ2luID0gaW5kZXggPT09IDA7XG4gICAgICAgICAgICBjb25zdCBkcmFnUmVmID0gdGhpcy5kcmFnRHJvcC5jcmVhdGVEcmFnKGhhbmRsZSk7XG4gICAgICAgICAgICBkcmFnUmVmLmRpc2FibGVkID0gdGhpcy5saW5rRHJhZ0Rpc2FibGVkO1xuICAgICAgICAgICAgZHJhZ1JlZi53aXRoQm91bmRhcnlFbGVtZW50KHRoaXMuZG9tLnJvb3QgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgZHJhZ1JlZi5iZWZvcmVTdGFydGVkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaGFuZGxlLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFyRHJhZ1JlZikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhckRyYWdSZWYuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUxpbmtEcmFnZ2luZ0xpbmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZW1pdExpbmtEcmFnU3RhcnRlZCh7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuYmFyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogdGhpcy5pdGVtKCksXG4gICAgICAgICAgICAgICAgICAgIHBvczogaXNCZWdpbiA/IEluQmFyUG9zaXRpb24uc3RhcnQgOiBJbkJhclBvc2l0aW9uLmZpbmlzaFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRyYWdSZWYubW92ZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLmNhbGNMaW5rTGluZVBvc2l0aW9ucyhoYW5kbGUsIGlzQmVnaW4pO1xuICAgICAgICAgICAgICAgIHRoaXMubGlua0RyYWdnaW5nTGluZS5zZXRBdHRyaWJ1dGUoJ3gxJywgcG9zaXRpb25zLngxLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlua0RyYWdnaW5nTGluZS5zZXRBdHRyaWJ1dGUoJ3kxJywgcG9zaXRpb25zLnkxLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlua0RyYWdnaW5nTGluZS5zZXRBdHRyaWJ1dGUoJ3gyJywgcG9zaXRpb25zLngyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlua0RyYWdnaW5nTGluZS5zZXRBdHRyaWJ1dGUoJ3kyJywgcG9zaXRpb25zLnkyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRyYWdSZWYuZW5kZWQuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGhhbmRsZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFyRHJhZ1JlZikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhckRyYWdSZWYuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g6K6h566XbGluZeaLluWKqOeahOiQveeCueS9jeS6juebruagh0JhcueahOWAvO+8jOWmguaenOWAvOWkp+S6jkJhcuWuveW6pueahOS4gOWNiu+8jOivtOaYjuaYr+aLluWKqOWIsEJlZ2lu5L2N572u77yM5ZCm5YiZ5YiZ5Li65ouW5Yqo5YiwRW5k5L2N572uXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ0NvbnRhaW5lci5saW5rRHJhZ1BhdGgudG8pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGxhY2VQb2ludFggPVxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLmdldFJvb3RFbGVtZW50KCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCAtXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIubGlua0RyYWdQYXRoLnRvLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueDtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZW1pdExpbmtEcmFnRW5kZWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5kcmFnQ29udGFpbmVyLmxpbmtEcmFnUGF0aC50byxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZVBvaW50WCA8IHRoaXMuZHJhZ0NvbnRhaW5lci5saW5rRHJhZ1BhdGgudG8uaXRlbS5yZWZzLndpZHRoIC8gMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IEluQmFyUG9zaXRpb24uc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBJbkJhclBvc2l0aW9uLmZpbmlzaFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZW1pdExpbmtEcmFnRW5kZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveUxpbmtEcmFnZ2luZ0xpbmUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkcmFnUmVmcy5wdXNoKGRyYWdSZWYpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRyYWdSZWZzO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3BlbkRyYWdCYWNrZHJvcChkcmFnRWxlbWVudDogSFRNTEVsZW1lbnQsIHN0YXJ0OiBHYW50dERhdGUsIGVuZDogR2FudHREYXRlKSB7XG4gICAgICAgIGNvbnN0IGRyYWdCYWNrZHJvcEVsZW1lbnQgPSB0aGlzLmRvbS5yb290LnF1ZXJ5U2VsZWN0b3IoJy5nYW50dC1kcmFnLWJhY2tkcm9wJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGRyYWdNYXNrRWxlbWVudCA9IHRoaXMuZG9tLnJvb3QucXVlcnlTZWxlY3RvcignLmdhbnR0LWRyYWctbWFzaycpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBjb25zdCByb290UmVjdCA9IHRoaXMuZG9tLnJvb3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IGRyYWdSZWN0ID0gZHJhZ0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGxldCBsZWZ0ID0gZHJhZ1JlY3QubGVmdCAtIHJvb3RSZWN0LmxlZnQgLSAodGhpcy5kb20uc2lkZS5jbGllbnRXaWR0aCArIDEpO1xuICAgICAgICBpZiAodGhpcy5kcmFnU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uTEVGVCkge1xuICAgICAgICAgICAgICAgIGxlZnQgKz0gdGhpcy5hdXRvU2Nyb2xsU3RlcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5faG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICBsZWZ0IC09IHRoaXMuYXV0b1Njcm9sbFN0ZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd2lkdGggPSBkcmFnUmVjdC5yaWdodCAtIGRyYWdSZWN0LmxlZnQ7XG5cbiAgICAgICAgLy8gTm90ZTogdXBkYXRpbmcgc3R5bGVzIHdpbGwgY2F1c2UgcmUtbGF5b3V0IHNvIHdlIGhhdmUgdG8gcGxhY2UgdGhlbSBjb25zaXN0ZW50bHkgb25lIGJ5IG9uZS5cbiAgICAgICAgZHJhZ01hc2tFbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgZHJhZ01hc2tFbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICBkcmFnTWFza0VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRyYWdCYWNrZHJvcEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIC8vIFRoaXMgd2lsbCBpbnZhbGlkYXRlIHRoZSBsYXlvdXQsIGJ1dCB3ZSB3b24ndCBuZWVkIHJlLWxheW91dCwgYmVjYXVzZSB3ZSBzZXQgc3R5bGVzIHByZXZpb3VzbHkuXG4gICAgICAgIGRyYWdNYXNrRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQnKS5pbm5lckhUTUwgPSBzdGFydC5mb3JtYXQodGhpcy5nYW50dFVwcGVyLnZpZXcub3B0aW9ucy5kcmFnUHJldmlld0RhdGVGb3JtYXQpO1xuICAgICAgICBkcmFnTWFza0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmVuZCcpLmlubmVySFRNTCA9IGVuZC5mb3JtYXQodGhpcy5nYW50dFVwcGVyLnZpZXcub3B0aW9ucy5kcmFnUHJldmlld0RhdGVGb3JtYXQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xvc2VEcmFnQmFja2Ryb3AoKSB7XG4gICAgICAgIGNvbnN0IGRyYWdCYWNrZHJvcEVsZW1lbnQgPSB0aGlzLmRvbS5yb290LnF1ZXJ5U2VsZWN0b3IoJy5nYW50dC1kcmFnLWJhY2tkcm9wJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGRyYWdNYXNrRWxlbWVudCA9IHRoaXMuZG9tLnJvb3QucXVlcnlTZWxlY3RvcignLmdhbnR0LWRyYWctbWFzaycpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBkcmFnTWFza0VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZHJhZ0JhY2tkcm9wRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RHJhZ2dpbmdTdHlsZXMoKSB7XG4gICAgICAgIHRoaXMuYmFyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdnYW50dC1iYXItZHJhZ2dhYmxlLWRyYWcnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyRHJhZ2dpbmdTdHlsZXMoKSB7XG4gICAgICAgIHRoaXMuYmFyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdnYW50dC1iYXItZHJhZ2dhYmxlLWRyYWcnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJhckRyYWdNb3ZlKCkge1xuICAgICAgICBjb25zdCBjdXJyZW50WCA9IHRoaXMuaXRlbSgpLnJlZnMueCArIHRoaXMuYmFyRHJhZ01vdmVEaXN0YW5jZSArIHRoaXMuZHJhZ1Njcm9sbERpc3RhbmNlO1xuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHRoaXMuZ2FudHRVcHBlci52aWV3LmdldERhdGVCeVhQb2ludChjdXJyZW50WCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTdGFydFggPSB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXRYUG9pbnRCeURhdGUoY3VycmVudERhdGUpO1xuXG4gICAgICAgIGNvbnN0IGRpZmZzID0gdGhpcy5nYW50dFVwcGVyLnZpZXcuZGlmZmVyZW5jZUJ5UHJlY2lzaW9uVW5pdCh0aGlzLml0ZW0oKS5lbmQsIHRoaXMuaXRlbSgpLnN0YXJ0KTtcblxuICAgICAgICBsZXQgc3RhcnQgPSBjdXJyZW50RGF0ZTtcbiAgICAgICAgbGV0IGVuZCA9IGN1cnJlbnREYXRlLmFkZChkaWZmcywgdGhpcy5nYW50dFVwcGVyLnZpZXc/Lm9wdGlvbnM/LmRhdGVQcmVjaXNpb25Vbml0KTtcblxuICAgICAgICAvLyDml6Xop4blm77nibnmrorpgLvovpHlpITnkIZcbiAgICAgICAgaWYgKHRoaXMuZ2FudHRVcHBlci52aWV3LnZpZXdUeXBlID09PSBHYW50dFZpZXdUeXBlLmRheSkge1xuICAgICAgICAgICAgY29uc3QgZGF5V2lkdGggPSB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXREYXlPY2N1cGFuY3lXaWR0aChjdXJyZW50RGF0ZSk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFggPiBjdXJyZW50U3RhcnRYICsgZGF5V2lkdGggLyAyKSB7XG4gICAgICAgICAgICAgICAgc3RhcnQgPSBzdGFydC5hZGREYXlzKDEpO1xuICAgICAgICAgICAgICAgIGVuZCA9IGVuZC5hZGREYXlzKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhZ1Njcm9sbGluZykge1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGN1cnJlbnRYIC0gdGhpcy5iYXJEcmFnTW92ZURpc3RhbmNlO1xuICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3BlbkRyYWdCYWNrZHJvcChcbiAgICAgICAgICAgIHRoaXMuYmFyRWxlbWVudCxcbiAgICAgICAgICAgIHRoaXMuZ2FudHRVcHBlci52aWV3LmdldERhdGVCeVhQb2ludChjdXJyZW50WCksXG4gICAgICAgICAgICB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXREYXRlQnlYUG9pbnQoY3VycmVudFggKyB0aGlzLml0ZW0oKS5yZWZzLndpZHRoKVxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghdGhpcy5pc1N0YXJ0T3JFbmRJbnNpZGVWaWV3KHN0YXJ0LCBlbmQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVJdGVtRGF0ZShzdGFydCwgZW5kKTtcbiAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLmRyYWdNb3ZlZC5lbWl0KHsgaXRlbTogdGhpcy5pdGVtKCkub3JpZ2luIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYmFyQmVmb3JlSGFuZGxlRHJhZ01vdmUoKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgc3RhcnQsIG1pblJhbmdlV2lkdGhXaWR0aCB9ID0gdGhpcy5zdGFydE9mQmFySGFuZGxlKCk7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5pdGVtKCkucmVmcy53aWR0aCArIHRoaXMuYmFySGFuZGxlRHJhZ01vdmVBbmRTY3JvbGxEaXN0YW5jZSAqIC0xO1xuICAgICAgICBjb25zdCBkaWZmcyA9IHRoaXMuZ2FudHRVcHBlci52aWV3LmRpZmZlcmVuY2VCeVByZWNpc2lvblVuaXQodGhpcy5pdGVtKCkuZW5kLCBzdGFydCk7XG5cbiAgICAgICAgaWYgKHdpZHRoID4gZHJhZ01pbldpZHRoICYmIGRpZmZzID4gMCkge1xuICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMub3BlbkRyYWdCYWNrZHJvcCh0aGlzLmJhckVsZW1lbnQsIHN0YXJ0LCB0aGlzLml0ZW0oKS5lbmQpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTdGFydE9yRW5kSW5zaWRlVmlldyhzdGFydCwgdGhpcy5pdGVtKCkuZW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtRGF0ZShzdGFydCwgdGhpcy5pdGVtKCkuZW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhckhhbmRsZURyYWdNb3ZlUmVjb3JkRGlmZnMgPiAwICYmIGRpZmZzIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhckVsZW1lbnQuc3R5bGUud2lkdGggPSBtaW5SYW5nZVdpZHRoV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmdhbnR0VXBwZXIudmlldy5nZXRYUG9pbnRCeURhdGUodGhpcy5pdGVtKCkuZW5kKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJhckVsZW1lbnQuc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcGVuRHJhZ0JhY2tkcm9wKHRoaXMuYmFyRWxlbWVudCwgdGhpcy5pdGVtKCkuZW5kLCB0aGlzLml0ZW0oKS5lbmQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtRGF0ZSh0aGlzLml0ZW0oKS5lbmQsIHRoaXMuaXRlbSgpLmVuZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iYXJIYW5kbGVEcmFnTW92ZVJlY29yZERpZmZzID0gZGlmZnM7XG5cbiAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLmRyYWdNb3ZlZC5lbWl0KHsgaXRlbTogdGhpcy5pdGVtKCkub3JpZ2luIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYmFyQWZ0ZXJIYW5kbGVEcmFnTW92ZSgpIHtcbiAgICAgICAgY29uc3QgeyB3aWR0aCwgZW5kIH0gPSB0aGlzLmVuZE9mQmFySGFuZGxlKCk7XG4gICAgICAgIGNvbnN0IGRpZmZzID0gdGhpcy5nYW50dFVwcGVyLnZpZXcuZGlmZmVyZW5jZUJ5UHJlY2lzaW9uVW5pdChlbmQsIHRoaXMuaXRlbSgpLnN0YXJ0KTtcblxuICAgICAgICBpZiAod2lkdGggPiBkcmFnTWluV2lkdGggJiYgZGlmZnMgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmJhckVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgICAgICB0aGlzLm9wZW5EcmFnQmFja2Ryb3AodGhpcy5iYXJFbGVtZW50LCB0aGlzLml0ZW0oKS5zdGFydCwgZW5kKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1N0YXJ0T3JFbmRJbnNpZGVWaWV3KHRoaXMuaXRlbSgpLnN0YXJ0LCBlbmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtRGF0ZSh0aGlzLml0ZW0oKS5zdGFydCwgZW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhckhhbmRsZURyYWdNb3ZlUmVjb3JkRGlmZnMgPiAwICYmIGRpZmZzIDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaW5SYW5nZVdpZHRoID0gdGhpcy5nYW50dFVwcGVyLnZpZXcuZ2V0TWluUmFuZ2VXaWR0aEJ5UHJlY2lzaW9uVW5pdCh0aGlzLml0ZW0oKS5zdGFydCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iYXJFbGVtZW50LnN0eWxlLndpZHRoID0gbWluUmFuZ2VXaWR0aCArICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9wZW5EcmFnQmFja2Ryb3AodGhpcy5iYXJFbGVtZW50LCB0aGlzLml0ZW0oKS5zdGFydCwgdGhpcy5pdGVtKCkuc3RhcnQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtRGF0ZSh0aGlzLml0ZW0oKS5zdGFydCwgdGhpcy5pdGVtKCkuc3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmFySGFuZGxlRHJhZ01vdmVSZWNvcmREaWZmcyA9IGRpZmZzO1xuICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuZHJhZ01vdmVkLmVtaXQoeyBpdGVtOiB0aGlzLml0ZW0oKS5vcmlnaW4gfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjTGlua0xpbmVQb3NpdGlvbnModGFyZ2V0OiBIVE1MRWxlbWVudCwgaXNCZWZvcmU6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgcm9vdFJlY3QgPSB0aGlzLmRvbS5yb290LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB0YXJnZXRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBsYXllclJlY3QgPSB0YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDE6IGxheWVyUmVjdC5sZWZ0ICsgKGlzQmVmb3JlID8gMCA6IGxheWVyUmVjdC53aWR0aCkgLSByb290UmVjdC5sZWZ0LFxuICAgICAgICAgICAgeTE6IGxheWVyUmVjdC50b3AgKyBsYXllclJlY3QuaGVpZ2h0IC8gMiAtIHJvb3RSZWN0LnRvcCxcbiAgICAgICAgICAgIHgyOiB0YXJnZXRSZWN0LmxlZnQgLSByb290UmVjdC5sZWZ0ICsgdGFyZ2V0UmVjdC53aWR0aCAvIDIsXG4gICAgICAgICAgICB5MjogdGFyZ2V0UmVjdC50b3AgLSByb290UmVjdC50b3AgKyB0YXJnZXRSZWN0LmhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxpbmtEcmFnZ2luZ0xpbmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5saW5rRHJhZ2dpbmdMaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBzdmdFbGVtZW50ID0gY3JlYXRlU3ZnRWxlbWVudCgnc3ZnJywgJ2dhbnR0LWxpbmstZHJhZy1jb250YWluZXInKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbkVsZW1lbnQgPSBjcmVhdGVTdmdFbGVtZW50KCdsaW5lJywgJ2xpbmstZHJhZ2dpbmctbGluZScpO1xuICAgICAgICAgICAgbGluRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgICAgICAgICAgc3ZnRWxlbWVudC5hcHBlbmRDaGlsZChsaW5FbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuZG9tLnJvb3QuYXBwZW5kQ2hpbGQoc3ZnRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmxpbmtEcmFnZ2luZ0xpbmUgPSBsaW5FbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95TGlua0RyYWdnaW5nTGluZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubGlua0RyYWdnaW5nTGluZSkge1xuICAgICAgICAgICAgdGhpcy5saW5rRHJhZ2dpbmdMaW5lLnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmxpbmtEcmFnZ2luZ0xpbmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydFNjcm9sbEludGVydmFsID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnN0b3BTY3JvbGxpbmcoKTtcbiAgICAgICAgaW50ZXJ2YWwoMCwgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5zdG9wU2Nyb2xsVGltZXJzJCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxTdGVwID0gdGhpcy5hdXRvU2Nyb2xsU3RlcDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uTEVGVCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnNjcm9sbEJ5KC1zY3JvbGxTdGVwLCAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2hvcml6b250YWxTY3JvbGxEaXJlY3Rpb24gPT09IEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uLlJJR0hUKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc2Nyb2xsQnkoc2Nyb2xsU3RlcCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhcnRTY3JvbGxpbmdJZk5lY2Vzc2FyeShwb2ludGVyWDogbnVtYmVyLCBwb2ludGVyWTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLmRvbS5tYWluQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lci5zY3JvbGxMZWZ0O1xuICAgICAgICBpZiAoaXNQb2ludGVyTmVhckNsaWVudFJlY3QoY2xpZW50UmVjdCwgRFJPUF9QUk9YSU1JVFlfVEhSRVNIT0xELCBwb2ludGVyWCwgcG9pbnRlclkpKSB7XG4gICAgICAgICAgICBjb25zdCBob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uID0gZ2V0SG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbihjbGllbnRSZWN0LCBwb2ludGVyWCk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uTEVGVCAmJiBzY3JvbGxMZWZ0ID4gMCkgfHxcbiAgICAgICAgICAgICAgICAoaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uUklHSFQgJiZcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdCA8IHRoaXMuZ2FudHRVcHBlci52aWV3LndpZHRoIC0gY2xpZW50UmVjdC53aWR0aClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hvcml6b250YWxTY3JvbGxEaXJlY3Rpb24gPSBob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Njcm9sbFNwZWVkUmF0ZXMgPSBnZXRBdXRvU2Nyb2xsU3BlZWRSYXRlcyhjbGllbnRSZWN0LCBwb2ludGVyWCwgaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIodGhpcy5zdGFydFNjcm9sbEludGVydmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wU2Nyb2xsaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb25kaXRpb25zIHRvIHN0b3AgYXV0by1zY3JvbGw6IHdoZW4gdGhlIHN0YXJ0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgZW5kIGFuZCB0aGUgYmFyIGFwcGVhcnMgaW4gdGhlIHZpZXdcbiAgICBwcml2YXRlIGlzU3RhcnRHcmVhdGVyVGhhbkVuZFdoZW5CYXJIYW5kbGVEcmFnTW92ZShpc0JlZm9yZTogYm9vbGVhbikge1xuICAgICAgICBsZXQgaXNTdGFydEdyZWF0ZXJUaGFuRW5kOiBib29sZWFuO1xuICAgICAgICBsZXQgaXNCYXJBcHBlYXJzSW5WaWV3OiBib29sZWFuO1xuXG4gICAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSB0aGlzLmRvbS5tYWluQ29udGFpbmVyLnNjcm9sbExlZnQ7XG4gICAgICAgIGNvbnN0IGNsaWVudFdpZHRoID0gdGhpcy5kb20ubWFpbkNvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICAgICAgY29uc3QgeFRocmVzaG9sZCA9IGNsaWVudFdpZHRoICogRFJPUF9QUk9YSU1JVFlfVEhSRVNIT0xEO1xuXG4gICAgICAgIGlmIChpc0JlZm9yZSkge1xuICAgICAgICAgICAgY29uc3QgeyBzdGFydCwgbWluUmFuZ2VXaWR0aFdpZHRoIH0gPSB0aGlzLnN0YXJ0T2ZCYXJIYW5kbGUoKTtcbiAgICAgICAgICAgIGNvbnN0IHhQb2ludGVyQnlFbmREYXRlID0gdGhpcy5nYW50dFVwcGVyLnZpZXcuZ2V0WFBvaW50QnlEYXRlKHRoaXMuaXRlbSgpLmVuZCk7XG5cbiAgICAgICAgICAgIGlzU3RhcnRHcmVhdGVyVGhhbkVuZCA9IHN0YXJ0LnZhbHVlID4gdGhpcy5pdGVtKCkuZW5kLnZhbHVlO1xuICAgICAgICAgICAgaXNCYXJBcHBlYXJzSW5WaWV3ID0geFBvaW50ZXJCeUVuZERhdGUgKyBtaW5SYW5nZVdpZHRoV2lkdGggKyB4VGhyZXNob2xkIDw9IHNjcm9sbExlZnQgKyBjbGllbnRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZW5kIH0gPSB0aGlzLmVuZE9mQmFySGFuZGxlKCk7XG4gICAgICAgICAgICBjb25zdCB4UG9pbnRlckJ5U3RhcnREYXRlID0gdGhpcy5nYW50dFVwcGVyLnZpZXcuZ2V0WFBvaW50QnlEYXRlKHRoaXMuaXRlbSgpLnN0YXJ0KTtcblxuICAgICAgICAgICAgaXNTdGFydEdyZWF0ZXJUaGFuRW5kID0gZW5kLnZhbHVlIDwgdGhpcy5pdGVtKCkuc3RhcnQudmFsdWU7XG4gICAgICAgICAgICBpc0JhckFwcGVhcnNJblZpZXcgPSBzY3JvbGxMZWZ0ICsgeFRocmVzaG9sZCA8PSB4UG9pbnRlckJ5U3RhcnREYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzU3RhcnRHcmVhdGVyVGhhbkVuZCAmJiBpc0JhckFwcGVhcnNJblZpZXcgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gU29tZSBkYXRhIGluZm9ybWF0aW9uIGFib3V0IGRyYWdnaW5nIHN0YXJ0IHVudGlsIGl0IGlzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBlbmRcbiAgICBwcml2YXRlIHN0YXJ0T2ZCYXJIYW5kbGUoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLml0ZW0oKS5yZWZzLnggKyB0aGlzLmJhckhhbmRsZURyYWdNb3ZlQW5kU2Nyb2xsRGlzdGFuY2U7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgc3RhcnQ6IHRoaXMuZ2FudHRVcHBlci52aWV3LmdldERhdGVCeVhQb2ludCh4KSxcbiAgICAgICAgICAgIG1pblJhbmdlV2lkdGhXaWR0aDogdGhpcy5nYW50dFVwcGVyLnZpZXcuZ2V0TWluUmFuZ2VXaWR0aEJ5UHJlY2lzaW9uVW5pdCh0aGlzLml0ZW0oKS5lbmQpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gU29tZSBkYXRhIGluZm9ybWF0aW9uIGFib3V0IGRyYWdnaW5nIGVuZCBvZiBiYXIgaGFuZGxlXG4gICAgcHJpdmF0ZSBlbmRPZkJhckhhbmRsZSgpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLml0ZW0oKS5yZWZzLndpZHRoICsgdGhpcy5iYXJIYW5kbGVEcmFnTW92ZUFuZFNjcm9sbERpc3RhbmNlO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGVuZDogdGhpcy5nYW50dFVwcGVyLnZpZXcuZ2V0RGF0ZUJ5WFBvaW50KHRoaXMuaXRlbSgpLnJlZnMueCArIHdpZHRoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RvcFNjcm9sbGluZygpIHtcbiAgICAgICAgdGhpcy5zdG9wU2Nyb2xsVGltZXJzJC5uZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1N0YXJ0T3JFbmRJbnNpZGVWaWV3KHN0YXJ0OiBHYW50dERhdGUsIGVuZDogR2FudHREYXRlKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1TdGFydCA9IHN0YXJ0LmdldFVuaXhUaW1lKCk7XG4gICAgICAgIGNvbnN0IGl0ZW1FbmQgPSBlbmQuZ2V0VW5peFRpbWUoKTtcbiAgICAgICAgY29uc3Qgdmlld1N0YXJ0ID0gdGhpcy5nYW50dFVwcGVyLnZpZXcuc3RhcnQuZ2V0VW5peFRpbWUoKTtcbiAgICAgICAgY29uc3Qgdmlld0VuZCA9IHRoaXMuZ2FudHRVcHBlci52aWV3LmVuZC5nZXRVbml4VGltZSgpO1xuICAgICAgICBpZiAoaXRlbVN0YXJ0IDwgdmlld1N0YXJ0IHx8IGl0ZW1FbmQgPiB2aWV3RW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSXRlbURhdGUoc3RhcnQ6IEdhbnR0RGF0ZSwgZW5kOiBHYW50dERhdGUpIHtcbiAgICAgICAgdGhpcy5pdGVtKCkudXBkYXRlRGF0ZSh0aGlzLmdhbnR0VXBwZXIudmlldy5zdGFydE9mUHJlY2lzaW9uKHN0YXJ0KSwgdGhpcy5nYW50dFVwcGVyLnZpZXcuZW5kT2ZQcmVjaXNpb24oZW5kKSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBpdGVtOiBHYW50dEl0ZW1JbnRlcm5hbCwgZ2FudHRVcHBlcjogR2FudHRVcHBlcikge1xuICAgICAgICB0aGlzLmJhckVsZW1lbnQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZ2FudHRVcHBlciA9IGdhbnR0VXBwZXI7XG4gICAgICAgIHRoaXMuaXRlbS5zZXQoaXRlbSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYXJEcmFnUmVmKCkge1xuICAgICAgICBpZiAodGhpcy5iYXJEcmFnUmVmKSB7XG4gICAgICAgICAgICB0aGlzLmJhckRyYWdSZWYuZGlzYWJsZWQgPSB0aGlzLmRyYWdEaXNhYmxlZDtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFyRHJhZ1JlZiA9IHRoaXMuY3JlYXRlQmFyRHJhZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCYXJIYW5kbGVEcmFnUmVmcygpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFySGFuZGxlRHJhZ1JlZnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5iYXJIYW5kbGVEcmFnUmVmcy5mb3JFYWNoKChkcmFnUmVmKSA9PiB7XG4gICAgICAgICAgICAgICAgZHJhZ1JlZi5kaXNhYmxlZCA9IHRoaXMuZHJhZ0Rpc2FibGVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZHJhZ0Rpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmJhckhhbmRsZURyYWdSZWZzID0gdGhpcy5jcmVhdGVCYXJIYW5kbGVEcmFncygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVMaW5rRHJhZ1JlZnMoKSB7XG4gICAgICAgIGlmICh0aGlzLmxpbmtEcmFnUmVmcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmtEcmFnUmVmcy5mb3JFYWNoKChkcmFnUmVmKSA9PiB7XG4gICAgICAgICAgICAgICAgZHJhZ1JlZi5kaXNhYmxlZCA9IHRoaXMubGlua0RyYWdEaXNhYmxlZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmxpbmtEcmFnRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGlua0RyYWdSZWZzID0gdGhpcy5jcmVhdGVMaW5rSGFuZGxlRHJhZ3MoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZURyYWdzKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZU1vdXNlRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQmFyRHJhZ1JlZigpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJhckhhbmRsZURyYWdSZWZzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTGlua0RyYWdSZWZzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlSXRlbShpdGVtOiBHYW50dEl0ZW1JbnRlcm5hbCkge1xuICAgICAgICB0aGlzLml0ZW0uc2V0KGl0ZW0pO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmNsb3NlRHJhZ0JhY2tkcm9wKCk7XG4gICAgICAgIHRoaXMuYmFyRHJhZ1JlZj8uZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLmxpbmtEcmFnUmVmcz8uZm9yRWFjaCgoZHJhZ1JlZikgPT4gZHJhZ1JlZi5kaXNwb3NlKCkpO1xuICAgICAgICB0aGlzLmJhckhhbmRsZURyYWdSZWZzPy5mb3JFYWNoKChkcmFnUmVmKSA9PiBkcmFnUmVmLmRpc3Bvc2UoKSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgICAgIHRoaXMuc3RvcFNjcm9sbGluZygpO1xuICAgICAgICB0aGlzLnN0b3BTY3JvbGxUaW1lcnMkLmNvbXBsZXRlKCk7XG4gICAgfVxufVxuIl19