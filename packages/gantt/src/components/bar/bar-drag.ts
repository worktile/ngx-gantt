import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { DragRef, DragDrop } from '@angular/cdk/drag-drop';
import { GanttDomService } from '../../gantt-dom.service';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GanttItemInternal } from '../../class/item';
import { GanttDate, differenceInCalendarDays } from '../../utils/date';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttUpper } from '../../gantt-upper';

const dragMinWidth = 10;
const activeClass = 'gantt-bar-active';
const linkDropClass = 'gantt-bar-link-drop';

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

    private destroy$ = new Subject();

    constructor(private dragDrop: DragDrop, private dom: GanttDomService, private dragContainer: GanttDragContainer) {}

    private createMouseEvents() {
        fromEvent(this.barElement, 'mouseenter')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.dragContainer.linkDraggingId && this.dragContainer.linkDraggingId !== this.item.id) {
                    if (this.item.linkable) {
                        this.barElement.classList.add(linkDropClass);
                        this.dragContainer.emitLinkDragEntered(this.item);
                    }
                } else {
                    this.barElement.classList.add(activeClass);
                }
            });

        fromEvent(this.barElement, 'mouseleave')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (!this.dragContainer.linkDraggingId) {
                    this.barElement.classList.remove(activeClass);
                } else {
                    this.dragContainer.emitLinkDragLeaved();
                }
                this.barElement.classList.remove(linkDropClass);
            });
    }

    private createBarDrag() {
        const dragRef = this.dragDrop.createDrag(this.barElement);
        dragRef.lockAxis = 'x';
        dragRef.started.subscribe(() => {
            this.setDraggingStyles();
            this.dragContainer.dragStarted.emit({ item: this.item.origin });
        });
        dragRef.moved.subscribe((event) => {
            const x = this.item.refs.x + event.distance.x;
            const days = differenceInCalendarDays(this.item.end.value, this.item.start.value);
            const start = this.ganttUpper.view.getDateByXPoint(x);
            const end = start.addDays(days);
            this.openDragBackdrop(this.barElement, this.ganttUpper.view.getDateByXPoint(x), end);
        });
        dragRef.ended.subscribe((event) => {
            const days = differenceInCalendarDays(this.item.end.value, this.item.start.value);
            const start = this.ganttUpper.view.getDateByXPoint(this.item.refs.x + event.distance.x);
            const end = start.addDays(days);
            this.item.updateDate(start, end);
            this.clearDraggingStyles();
            this.closeDragBackdrop();
            event.source.reset();
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
            const dragRef = this.dragDrop.createDrag(handle);
            dragRef.lockAxis = 'x';
            dragRef.withBoundaryElement(this.dom.root as HTMLElement);

            dragRef.started.subscribe(() => {
                this.setDraggingStyles();
                this.dragContainer.dragStarted.emit({ item: this.item.origin });
            });

            dragRef.moved.subscribe((event) => {
                if (isBefore) {
                    const x = this.item.refs.x + event.distance.x;
                    const width = this.item.refs.width + event.distance.x * -1;
                    if (width > dragMinWidth) {
                        this.barElement.style.width = width + 'px';
                        this.barElement.style.left = x + 'px';
                        this.openDragBackdrop(
                            this.barElement,
                            this.ganttUpper.view.getDateByXPoint(x),
                            this.ganttUpper.view.getDateByXPoint(x + width)
                        );
                    }
                } else {
                    const width = this.item.refs.width + event.distance.x;
                    if (width > dragMinWidth) {
                        this.barElement.style.width = width + 'px';
                        this.openDragBackdrop(
                            this.barElement,
                            this.ganttUpper.view.getDateByXPoint(this.item.refs.x),
                            this.ganttUpper.view.getDateByXPoint(this.item.refs.x + width)
                        );
                    }
                }
                event.source.reset();
            });

            dragRef.ended.subscribe((event) => {
                if (isBefore) {
                    const width = this.item.refs.width + event.distance.x * -1;
                    if (width > dragMinWidth) {
                        this.item.updateDate(this.ganttUpper.view.getDateByXPoint(this.item.refs.x + event.distance.x), this.item.end);
                    } else {
                        this.item.updateDate(this.item.end.startOfDay(), this.item.end);
                    }
                } else {
                    const width = this.item.refs.width + event.distance.x;
                    if (width > dragMinWidth) {
                        this.item.updateDate(
                            this.item.start,
                            this.ganttUpper.view.getDateByXPoint(this.item.refs.x + this.item.refs.width + event.distance.x)
                        );
                    } else {
                        this.item.updateDate(this.item.start, this.item.start.endOfDay());
                    }
                }
                this.clearDraggingStyles();
                this.closeDragBackdrop();
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
            const isBefore = index === 0;
            const dragRef = this.dragDrop.createDrag(handle);
            dragRef.withBoundaryElement(this.dom.root as HTMLElement);
            dragRef.beforeStarted.subscribe(() => {
                handle.style.pointerEvents = 'none';
                if (this.barDragRef) {
                    this.barDragRef.disabled = true;
                }
                this.createLinkDraggingLine();
                this.dragContainer.emitLinkDragStarted(isBefore ? 'target' : 'source', this.item);
            });

            dragRef.moved.subscribe(() => {
                const positions = this.calcLinkLinePositions(handle, isBefore);
                this.linkDraggingLine.setAttribute('x1', positions.x1.toString());
                this.linkDraggingLine.setAttribute('y1', positions.y1.toString());
                this.linkDraggingLine.setAttribute('x2', positions.x2.toString());
                this.linkDraggingLine.setAttribute('y2', positions.y2.toString());
            });

            dragRef.ended.subscribe((event) => {
                event.source.reset();
                handle.style.pointerEvents = '';
                if (this.barDragRef) {
                    this.barDragRef.disabled = false;
                }
                this.barElement.classList.remove(activeClass);
                this.destroyLinkDraggingLine();
                this.dragContainer.emitLinkDragEnded();
            });

            dragRefs.push(dragRef);
        });
        return dragRefs;
    }

    private openDragBackdrop(dragElement: HTMLElement, start: GanttDate, end: GanttDate) {
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask') as HTMLElement;
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop') as HTMLElement;
        const rootRect = this.dom.root.getBoundingClientRect();
        const dragRect = dragElement.getBoundingClientRect();
        const left = dragRect.left - rootRect.left - this.dom.side.clientWidth;
        const width = dragRect.right - dragRect.left;
        dragMaskElement.style.left = left + 'px';
        dragMaskElement.style.width = width + 'px';
        dragMaskElement.querySelector('.start').innerHTML = start.format('MM-dd');
        dragMaskElement.querySelector('.end').innerHTML = end.format('MM-dd');
        dragMaskElement.style.display = 'block';
        dragBackdropElement.style.display = 'block';
    }

    private closeDragBackdrop() {
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask') as HTMLElement;
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop') as HTMLElement;
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

    createDrags(elementRef: ElementRef, item: GanttItemInternal, ganttUpper: GanttUpper) {
        this.item = item;
        this.barElement = elementRef.nativeElement;
        this.ganttUpper = ganttUpper;

        if (!item.draggable || (this.dragDisabled && this.linkDragDisabled)) {
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

    ngOnDestroy() {
        this.closeDragBackdrop();
        this.dragRefs.forEach((dragRef) => dragRef.dispose());
        this.destroy$.next();
        this.destroy$.complete();
    }
}
