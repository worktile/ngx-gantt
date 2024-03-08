import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject, animationFrameScheduler, fromEvent, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttViewType } from '../../class';
import { GanttItemInternal } from '../../class/item';
import { GanttLinkType } from '../../class/link';
import { GanttDomService } from '../../gantt-dom.service';
import { GanttDragContainer, InBarPosition } from '../../gantt-drag-container';
import { GanttUpper } from '../../gantt-upper';
import { GanttDate } from '../../utils/date';
import {
    AutoScrollHorizontalDirection,
    getAutoScrollSpeedRates,
    getHorizontalScrollDirection,
    isPointerNearClientRect
} from '../../utils/drag-scroll';
import { passiveListenerOptions } from '../../utils/passive-listeners';

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

function createSvgElement(qualifiedName: string, className: string) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
    element.classList.add(className);
    return element;
}

@Injectable()
export class GanttBarDrag implements OnDestroy {
    private ganttUpper: GanttUpper;

    private barElement: HTMLElement;

    private item: GanttItemInternal;

    private get dragDisabled() {
        return !this.item.draggable || !this.ganttUpper.draggable;
    }

    private get linkDragDisabled() {
        return !this.item.linkable || !this.ganttUpper.linkable;
    }

    private get barHandleDragMoveAndScrollDistance() {
        return this.barHandleDragMoveDistance + this.dragScrollDistance;
    }

    private get autoScrollStep() {
        return Math.pow(autoScrollBaseStep, this.autoScrollSpeedRates);
    }

    private linkDraggingLine: SVGElement;

    private barDragRef: DragRef;

    private dragRefs: DragRef[] = [];

    private destroy$ = new Subject<void>();

    /** Used to signal to the current auto-scroll sequence when to stop. */
    private stopScrollTimers$ = new Subject<void>();

    /** container element scrollLeft */
    private containerScrollLeft: number;

    /** move distance when drag bar */
    private barDragMoveDistance = 0;

    /** move distance when drag bar handle */
    private barHandleDragMoveDistance = 0;

    /** scrolling state when drag */
    private dragScrolling = false;

    /** dragScrollDistance */
    private dragScrollDistance = 0;

    /** Horizontal direction in which the list is currently scrolling. */
    private _horizontalScrollDirection = AutoScrollHorizontalDirection.NONE;

    /** Record bar days when bar handle drag move. */
    private barHandleDragMoveRecordDiffs: number;

    /** Speed ratio for auto scroll */
    private autoScrollSpeedRates = 1;

    constructor(
        private dragDrop: DragDrop,
        private dom: GanttDomService,
        private dragContainer: GanttDragContainer,
        private _ngZone: NgZone
    ) {}

    private createDragRef<T = any>(element: ElementRef<HTMLElement> | HTMLElement): DragRef<T> {
        const dragRef = this.dragDrop.createDrag(element);
        return dragRef;
    }

    private createDragScrollEvent(dragRef: DragRef) {
        return fromEvent(this.dom.mainContainer, 'scroll', passiveListenerOptions).pipe(takeUntil(dragRef.ended));
    }

    private createMouseEvents() {
        const dropClass =
            this.ganttUpper.config.linkOptions?.dependencyTypes?.length === 1 &&
            this.ganttUpper.config.linkOptions?.dependencyTypes[0] === GanttLinkType.fs
                ? singleDropActiveClass
                : dropActiveClass;

        fromEvent(this.barElement, 'mouseenter', passiveListenerOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.dragContainer.linkDraggingId && this.dragContainer.linkDraggingId !== this.item.id) {
                    if (this.item.linkable) {
                        this.barElement.classList.add(dropClass);
                        this.dragContainer.emitLinkDragEntered({
                            item: this.item,
                            element: this.barElement
                        });
                    }
                } else {
                    this.barElement.classList.add(activeClass);
                }
            });

        fromEvent(this.barElement, 'mouseleave', passiveListenerOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (!this.dragContainer.linkDraggingId) {
                    this.barElement.classList.remove(activeClass);
                } else {
                    this.dragContainer.emitLinkDragLeaved();
                }
                this.barElement.classList.remove(dropClass);
            });
    }

    private createBarDrag() {
        const dragRef = this.createDragRef(this.barElement);
        dragRef.lockAxis = 'x';
        dragRef.withBoundaryElement(this.dom.mainItems as HTMLElement);
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
            this.dragContainer.dragStarted.emit({ item: this.item.origin });
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
            this.item.updateRefs({
                width: this.ganttUpper.view.getDateRangeWidth(this.item.start, this.item.end),
                x: this.ganttUpper.view.getXPointByDate(this.item.start),
                y: (this.ganttUpper.styles.lineHeight - this.ganttUpper.styles.barHeight) / 2 - 1
            });
            this.dragContainer.dragEnded.emit({ item: this.item.origin });
        });
        this.barDragRef = dragRef;

        return dragRef;
    }

    private createBarHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll<HTMLElement>('.drag-handles .handle');
        handles.forEach((handle, index) => {
            const isBefore = index === 0;
            const dragRef = this.createDragRef(handle);
            dragRef.lockAxis = 'x';
            dragRef.withBoundaryElement(this.dom.mainItems as HTMLElement);
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
                        } else {
                            this.barAfterHandleDragMove();
                        }
                    }
                });
                this.dragContainer.dragStarted.emit({ item: this.item.origin });
            });

            dragRef.moved.subscribe((event) => {
                if (this.barHandleDragMoveRecordDiffs && this.barHandleDragMoveRecordDiffs > 0) {
                    this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
                }
                this.barHandleDragMoveDistance = event.distance.x;
                if (!this.dragScrolling) {
                    if (isBefore) {
                        this.barBeforeHandleDragMove();
                    } else {
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
                this.item.updateRefs({
                    width: this.ganttUpper.view.getDateRangeWidth(this.item.start, this.item.end),
                    x: this.ganttUpper.view.getXPointByDate(this.item.start),
                    y: (this.ganttUpper.styles.lineHeight - this.ganttUpper.styles.barHeight) / 2 - 1
                });
                this.dragContainer.dragEnded.emit({ item: this.item.origin });
            });
            dragRefs.push(dragRef);
        });
        return dragRefs;
    }

    private createLinkHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll<HTMLElement>('.link-handles .handle');
        handles.forEach((handle, index) => {
            const isBegin = index === 0;
            const dragRef = this.dragDrop.createDrag(handle);
            dragRef.withBoundaryElement(this.dom.root as HTMLElement);
            dragRef.beforeStarted.subscribe(() => {
                handle.style.pointerEvents = 'none';
                if (this.barDragRef) {
                    this.barDragRef.disabled = true;
                }
                this.createLinkDraggingLine();
                this.dragContainer.emitLinkDragStarted({
                    element: this.barElement,
                    item: this.item,
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
                    const placePointX =
                        event.source.getRootElement().getBoundingClientRect().x -
                        this.dragContainer.linkDragPath.to.element.getBoundingClientRect().x;

                    this.dragContainer.emitLinkDragEnded({
                        ...this.dragContainer.linkDragPath.to,
                        pos:
                            placePointX < this.dragContainer.linkDragPath.to.item.refs.width / 2
                                ? InBarPosition.start
                                : InBarPosition.finish
                    });
                } else {
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

    private openDragBackdrop(dragElement: HTMLElement, start: GanttDate, end: GanttDate) {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop') as HTMLElement;
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask') as HTMLElement;
        const rootRect = this.dom.root.getBoundingClientRect();
        const dragRect = dragElement.getBoundingClientRect();
        let left = dragRect.left - rootRect.left - (this.dom.side.clientWidth + 1);
        if (this.dragScrolling) {
            if (this._horizontalScrollDirection === AutoScrollHorizontalDirection.LEFT) {
                left += this.autoScrollStep;
            } else if (this._horizontalScrollDirection === AutoScrollHorizontalDirection.RIGHT) {
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

    private closeDragBackdrop() {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop') as HTMLElement;
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask') as HTMLElement;
        dragMaskElement.style.display = 'none';
        dragBackdropElement.style.display = 'none';
    }

    private setDraggingStyles() {
        this.barElement.classList.add('gantt-bar-draggable-drag');
    }

    private clearDraggingStyles() {
        this.barElement.classList.remove('gantt-bar-draggable-drag');
    }

    private barDragMove() {
        const currentX = this.item.refs.x + this.barDragMoveDistance + this.dragScrollDistance;
        const currentDate = this.ganttUpper.view.getDateByXPoint(currentX);
        const currentStartX = this.ganttUpper.view.getXPointByDate(currentDate);

        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(this.item.end, this.item.start);

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

        this.openDragBackdrop(
            this.barElement,
            this.ganttUpper.view.getDateByXPoint(currentX),
            this.ganttUpper.view.getDateByXPoint(currentX + this.item.refs.width)
        );

        if (!this.isStartOrEndInsideView(start, end)) {
            return;
        }
        this.updateItemDate(start, end);
        this.dragContainer.dragMoved.emit({ item: this.item.origin });
    }

    private barBeforeHandleDragMove() {
        const { x, start, minRangeWidthWidth } = this.startOfBarHandle();
        const width = this.item.refs.width + this.barHandleDragMoveAndScrollDistance * -1;
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(this.item.end, start);

        if (width > dragMinWidth && diffs > 0) {
            this.barElement.style.width = width + 'px';
            this.barElement.style.left = x + 'px';
            this.openDragBackdrop(this.barElement, start, this.item.end);

            if (!this.isStartOrEndInsideView(start, this.item.end)) {
                return;
            }

            this.updateItemDate(start, this.item.end);
        } else {
            if (this.barHandleDragMoveRecordDiffs > 0 && diffs <= 0) {
                this.barElement.style.width = minRangeWidthWidth + 'px';
                const x = this.ganttUpper.view.getXPointByDate(this.item.end);
                this.barElement.style.left = x + 'px';
            }
            this.openDragBackdrop(this.barElement, this.item.end, this.item.end);
            this.updateItemDate(this.item.end, this.item.end);
        }
        this.barHandleDragMoveRecordDiffs = diffs;

        this.dragContainer.dragMoved.emit({ item: this.item.origin });
    }

    private barAfterHandleDragMove() {
        const { width, end } = this.endOfBarHandle();
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(end, this.item.start);

        if (width > dragMinWidth && diffs > 0) {
            this.barElement.style.width = width + 'px';
            this.openDragBackdrop(this.barElement, this.item.start, end);
            if (!this.isStartOrEndInsideView(this.item.start, end)) {
                return;
            }
            this.updateItemDate(this.item.start, end);
        } else {
            if (this.barHandleDragMoveRecordDiffs > 0 && diffs <= 0) {
                const minRangeWidth = this.ganttUpper.view.getMinRangeWidthByPrecisionUnit(this.item.start);
                this.barElement.style.width = minRangeWidth + 'px';
            }
            this.openDragBackdrop(this.barElement, this.item.start, this.item.start);
            this.updateItemDate(this.item.start, this.item.start);
        }
        this.barHandleDragMoveRecordDiffs = diffs;
        this.dragContainer.dragMoved.emit({ item: this.item.origin });
    }

    private calcLinkLinePositions(target: HTMLElement, isBefore: boolean) {
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

    private createLinkDraggingLine() {
        if (!this.linkDraggingLine) {
            const svgElement = createSvgElement('svg', 'gantt-link-drag-container');
            const linElement = createSvgElement('line', 'link-dragging-line');
            linElement.style.pointerEvents = 'none';
            svgElement.appendChild(linElement);
            this.dom.root.appendChild(svgElement);
            this.linkDraggingLine = linElement;
        }
    }

    private destroyLinkDraggingLine() {
        if (this.linkDraggingLine) {
            this.linkDraggingLine.parentElement.remove();
            this.linkDraggingLine = null;
        }
    }

    private startScrollInterval = () => {
        this.stopScrolling();
        interval(0, animationFrameScheduler)
            .pipe(takeUntil(this.stopScrollTimers$))
            .subscribe(() => {
                const node = this.dom.mainContainer;
                const scrollStep = this.autoScrollStep;
                if (this._horizontalScrollDirection === AutoScrollHorizontalDirection.LEFT) {
                    node.scrollBy(-scrollStep, 0);
                } else if (this._horizontalScrollDirection === AutoScrollHorizontalDirection.RIGHT) {
                    node.scrollBy(scrollStep, 0);
                }
            });
    };

    private startScrollingIfNecessary(pointerX: number, pointerY: number) {
        const clientRect = this.dom.mainContainer.getBoundingClientRect();
        const scrollLeft = this.dom.mainContainer.scrollLeft;
        if (isPointerNearClientRect(clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY)) {
            const horizontalScrollDirection = getHorizontalScrollDirection(clientRect, pointerX);

            if (
                (horizontalScrollDirection === AutoScrollHorizontalDirection.LEFT && scrollLeft > 0) ||
                (horizontalScrollDirection === AutoScrollHorizontalDirection.RIGHT &&
                    scrollLeft < this.ganttUpper.view.width - clientRect.width)
            ) {
                this._horizontalScrollDirection = horizontalScrollDirection;
                this.autoScrollSpeedRates = getAutoScrollSpeedRates(clientRect, pointerX, horizontalScrollDirection);
                this.dragScrolling = true;
                this._ngZone.runOutsideAngular(this.startScrollInterval);
            } else {
                this.dragScrolling = false;
                this.stopScrolling();
            }
        }
    }

    // Conditions to stop auto-scroll: when the start is greater than the end and the bar appears in the view
    private isStartGreaterThanEndWhenBarHandleDragMove(isBefore: boolean) {
        let isStartGreaterThanEnd: boolean;
        let isBarAppearsInView: boolean;

        const scrollLeft = this.dom.mainContainer.scrollLeft;
        const clientWidth = this.dom.mainContainer.clientWidth;
        const xThreshold = clientWidth * DROP_PROXIMITY_THRESHOLD;

        if (isBefore) {
            const { start, minRangeWidthWidth } = this.startOfBarHandle();
            const xPointerByEndDate = this.ganttUpper.view.getXPointByDate(this.item.end);

            isStartGreaterThanEnd = start.value > this.item.end.value;
            isBarAppearsInView = xPointerByEndDate + minRangeWidthWidth + xThreshold <= scrollLeft + clientWidth;
        } else {
            const { end } = this.endOfBarHandle();
            const xPointerByStartDate = this.ganttUpper.view.getXPointByDate(this.item.start);

            isStartGreaterThanEnd = end.value < this.item.start.value;
            isBarAppearsInView = scrollLeft + xThreshold <= xPointerByStartDate;
        }

        return isStartGreaterThanEnd && isBarAppearsInView ? true : false;
    }

    // Some data information about dragging start until it is equal to or greater than end
    private startOfBarHandle() {
        const x = this.item.refs.x + this.barHandleDragMoveAndScrollDistance;
        return {
            x,
            start: this.ganttUpper.view.getDateByXPoint(x),
            minRangeWidthWidth: this.ganttUpper.view.getMinRangeWidthByPrecisionUnit(this.item.end)
        };
    }

    // Some data information about dragging end of bar handle
    private endOfBarHandle() {
        const width = this.item.refs.width + this.barHandleDragMoveAndScrollDistance;

        return {
            width,
            end: this.ganttUpper.view.getDateByXPoint(this.item.refs.x + width)
        };
    }

    private stopScrolling() {
        this.stopScrollTimers$.next();
    }

    private isStartOrEndInsideView(start: GanttDate, end: GanttDate) {
        const itemStart = start.getUnixTime();
        const itemEnd = end.getUnixTime();
        const viewStart = this.ganttUpper.view.start.getUnixTime();
        const viewEnd = this.ganttUpper.view.end.getUnixTime();
        if (itemStart < viewStart || itemEnd > viewEnd) {
            return false;
        } else {
            return true;
        }
    }

    private updateItemDate(start: GanttDate, end: GanttDate) {
        this.item.updateDate(this.ganttUpper.view.startOfPrecision(start), this.ganttUpper.view.endOfPrecision(end));
    }

    createDrags(elementRef: ElementRef, item: GanttItemInternal, ganttUpper: GanttUpper) {
        this.item = item;
        this.barElement = elementRef.nativeElement;

        this.ganttUpper = ganttUpper;
        if (this.dragDisabled && this.linkDragDisabled) {
            return;
        } else {
            this.createMouseEvents();
            if (!this.dragDisabled) {
                const dragRef = this.createBarDrag();
                const dragHandlesRefs = this.createBarHandleDrags();
                this.dragRefs.push(dragRef, ...dragHandlesRefs);
            }
            if (!this.linkDragDisabled) {
                const linkDragRefs = this.createLinkHandleDrags();
                this.dragRefs.push(...linkDragRefs);
            }
        }
    }

    updateItem(item: GanttItemInternal) {
        this.item = item;
    }

    ngOnDestroy() {
        this.closeDragBackdrop();
        this.dragRefs.forEach((dragRef) => dragRef.dispose());
        this.destroy$.next();
        this.destroy$.complete();
        this.stopScrolling();
        this.stopScrollTimers$.complete();
    }
}
