import { Injectable, ElementRef, OnDestroy, SkipSelf, NgZone } from '@angular/core';
import { DragRef, DragDrop } from '@angular/cdk/drag-drop';
import { GanttDomService } from '../../gantt-dom.service';
import { GanttDragContainer, InBarPosition } from '../../gantt-drag-container';
import { GanttItemInternal } from '../../class/item';
import { GanttDate, differenceInCalendarDays, differenceInDays } from '../../utils/date';
import { animationFrameScheduler, fromEvent, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttUpper } from '../../gantt-upper';
import { GanttLinkType } from '../../class/link';
import { NgxGanttRootComponent } from '../../root.component';
import { passiveListenerOptions } from '../../utils/passive-listeners';
import { AutoScrollHorizontalDirection, getHorizontalScrollDirection, isPointerNearClientRect } from '../../utils/drag-scroll';

/**
 * Proximity, as a ratio to width/height, at which a
 * dragged item will affect the drop container.
 */
const DROP_PROXIMITY_THRESHOLD = 0.05;

const dragMinWidth = 10;
const autoScrollStep = 5;
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

    constructor(
        private dragDrop: DragDrop,
        private dom: GanttDomService,
        private dragContainer: GanttDragContainer,
        private _ngZone: NgZone,
        @SkipSelf() private root: NgxGanttRootComponent
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
            // this.containerScrollLeft = this.dom.mainContainer.scrollLeft;
            // this.createDragScrollEvent(dragRef).subscribe(() => {
            //     if (dragRef.isDragging()) {
            //         const dragScrollDistance = this.dom.mainContainer.scrollLeft - this.containerScrollLeft;
            //         this.dragScrollDistance = dragScrollDistance;
            //         this.barDragMove();
            //     }
            // });
            this.dragContainer.dragStarted.emit({ item: this.item.origin });
        });

        dragRef.moved.subscribe((event) => {
            // this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
            this.barDragMoveDistance = event.distance.x;
            if (!this.dragScrolling) {
                this.barDragMove();
            }
        });

        dragRef.ended.subscribe((event) => {
            this.clearDraggingStyles();
            this.closeDragBackdrop();
            event.source.reset();
            // this.stopScrolling();
            // this.dragScrolling = false;
            // this.dragScrollDistance = 0;
            this.barDragMoveDistance = 0;
            this.item.updateRefs({
                width: this.ganttUpper.view.getDateRangeWidth(this.item.start.startOfDay(), this.item.end.endOfDay()),
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
                // this.containerScrollLeft = this.dom.mainContainer.scrollLeft;
                // this.createDragScrollEvent(dragRef).subscribe(() => {
                //     if (dragRef.isDragging()) {
                //         const dragScrollDistance = this.dom.mainContainer.scrollLeft - this.containerScrollLeft;
                //         this.dragScrollDistance = dragScrollDistance;
                //         this.barHandleDragMove(isBefore);
                //     }
                // });
                this.dragContainer.dragStarted.emit({ item: this.item.origin });
            });

            dragRef.moved.subscribe((event) => {
                // this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
                this.barHandleDragMoveDistance = event.distance.x;
                if (!this.dragScrolling) {
                    this.barHandleDragMove(isBefore);
                }
            });

            dragRef.ended.subscribe((event) => {
                this.clearDraggingStyles();
                this.closeDragBackdrop();
                event.source.reset();
                // this.stopScrolling();
                // this.dragScrolling = false;
                // this.dragScrollDistance = 0;
                this.barHandleDragMoveDistance = 0;
                this.item.updateRefs({
                    width: this.ganttUpper.view.getDateRangeWidth(this.item.start.startOfDay(), this.item.end.endOfDay()),
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
        // const dragBackdropElement = this.root.backdrop.nativeElement;
        // const dragMaskElement = dragBackdropElement.querySelector('.gantt-drag-mask') as HTMLElement;
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop') as HTMLElement;
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask') as HTMLElement;
        const rootRect = this.dom.root.getBoundingClientRect();
        const dragRect = dragElement.getBoundingClientRect();
        const left = dragRect.left - rootRect.left - (this.dom.side.clientWidth + 1);
        const width = dragRect.right - dragRect.left;
        // Note: updating styles will cause re-layout so we have to place them consistently one by one.
        dragMaskElement.style.left = left + 'px';
        dragMaskElement.style.width = width + 'px';
        dragMaskElement.style.display = 'block';
        dragBackdropElement.style.display = 'block';
        // This will invalidate the layout, but we won't need re-layout, because we set styles previously.
        dragMaskElement.querySelector('.start').innerHTML = start.format('MM-dd');
        dragMaskElement.querySelector('.end').innerHTML = end.format('MM-dd');
    }

    private closeDragBackdrop() {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop') as HTMLElement;
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask') as HTMLElement;
        dragMaskElement.style.display = 'none';
        dragBackdropElement.style.display = 'none';
    }

    private setDraggingStyles() {
        this.barElement.style.pointerEvents = 'none';
        this.barElement.classList.add('gantt-bar-draggable-drag');
    }

    private clearDraggingStyles() {
        this.barElement.style.pointerEvents = '';
        this.barElement.classList.remove('gantt-bar-draggable-drag');
    }

    private barDragMove() {
        const currentX = this.item.refs.x + this.barDragMoveDistance + this.dragScrollDistance;
        const currentDate = this.ganttUpper.view.getDateByXPoint(currentX);
        const currentStartX = this.ganttUpper.view.getXPointByDate(currentDate);
        const dayWidth = this.ganttUpper.view.getDayOccupancyWidth(currentDate);
        const diffDays = differenceInCalendarDays(this.item.end.value, this.item.start.value);

        let start = currentDate;
        let end = currentDate.addDays(diffDays);

        if (currentX > currentStartX + dayWidth / 2) {
            start = start.addDays(1);
            end = end.addDays(1);
        }

        if (this.dragScrolling) {
            this.barElement.style.left = currentX - this.barDragMoveDistance + 'px';
        }

        this.openDragBackdrop(
            this.barElement,
            this.ganttUpper.view.getDateByXPoint(currentX),
            this.ganttUpper.view.getDateByXPoint(currentX + this.item.refs.width)
        );
        if (!this.isStartOrEndInsideView(start, end)) {
            return;
        }

        this.item.updateDate(start, end);
        this.dragContainer.dragMoved.emit({ item: this.item.origin });
    }

    private barHandleDragMove(isBefore?: boolean) {
        const distance = this.barHandleDragMoveDistance + this.dragScrollDistance;
        if (isBefore) {
            const x = this.item.refs.x + distance;
            const width = this.item.refs.width + distance * -1;
            const start = this.ganttUpper.view.getDateByXPoint(x);
            const days = differenceInDays(this.item.end.value, start.value);

            if (!this.isStartOrEndInsideView(start, this.item.end)) {
                return;
            }

            if (width > dragMinWidth && days > 0) {
                this.barElement.style.width = width + 'px';
                this.barElement.style.left = x + 'px';
                this.openDragBackdrop(this.barElement, start, this.item.end);
                this.item.updateDate(start, this.item.end);
            } else {
                this.openDragBackdrop(this.barElement, this.item.end.startOfDay(), this.item.end);
                this.item.updateDate(this.item.end.startOfDay(), this.item.end);
            }
        } else {
            const width = this.item.refs.width + distance;
            const end = this.ganttUpper.view.getDateByXPoint(this.item.refs.x + width);
            const days = differenceInDays(end.value, this.item.start.value);
            if (!this.isStartOrEndInsideView(this.item.start, end)) {
                return;
            }
            if (width > dragMinWidth && days > 0) {
                this.barElement.style.width = width + 'px';
                this.openDragBackdrop(this.barElement, this.item.start, end);

                this.item.updateDate(this.item.start, end);
            } else {
                this.openDragBackdrop(this.barElement, this.item.start, this.item.start.endOfDay());
                this.item.updateDate(this.item.start, this.item.start.endOfDay());
            }
        }
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

    // private startScrollInterval = () => {
    //     this.stopScrolling();
    //     interval(0, animationFrameScheduler)
    //         .pipe(takeUntil(this.stopScrollTimers$))
    //         .subscribe(() => {
    //             const node = this.dom.mainContainer;
    //             const scrollStep = autoScrollStep;
    //             if (this._horizontalScrollDirection === AutoScrollHorizontalDirection.LEFT) {
    //                 node.scrollBy(-scrollStep, 0);
    //             } else if (this._horizontalScrollDirection === AutoScrollHorizontalDirection.RIGHT) {
    //                 node.scrollBy(scrollStep, 0);
    //             }
    //         });
    // };

    // private startScrollingIfNecessary(pointerX: number, pointerY: number) {
    //     const clientRect = this.dom.mainContainer.getBoundingClientRect();
    //     if (isPointerNearClientRect(clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY)) {
    //         const horizontalScrollDirection = getHorizontalScrollDirection(clientRect, pointerX);
    //         if (horizontalScrollDirection) {
    //             this._horizontalScrollDirection = horizontalScrollDirection;
    //             this.dragScrolling = true;
    //             this._ngZone.runOutsideAngular(this.startScrollInterval);
    //         } else {
    //             this.dragScrolling = false;
    //             this.stopScrolling();
    //         }
    //     }
    // }

    // private stopScrolling() {
    //     this.stopScrollTimers$.next();
    // }

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
        // this.stopScrolling();
        this.stopScrollTimers$.complete();
    }
}
