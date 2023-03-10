import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { fromEvent, merge, Subject, switchMap, take, takeUntil } from 'rxjs';
import { deepCloneNode } from './clone-node';
import { extendStyles, toggleNativeDragInteractions } from './styling';

function getTransform(x: number, y: number): string {
    // Round the transforms since some browsers will
    // blur the elements for sub-pixel transforms.
    return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

function matchElementSize(target: HTMLElement, sourceRect: ClientRect): void {
    target.style.width = `${sourceRect.width}px`;
    target.style.height = `${sourceRect.height}px`;
    target.style.transform = getTransform(sourceRect.left, sourceRect.top);
}

export interface TreeDragDropOptions {
    draggable?: string;
    handle?: string;
    startPredicate?: () => boolean;
    enterPredicate?: () => boolean;
}

@Injectable({ providedIn: 'root' })
export class TreeDragDrop {
    public started = new Subject<void>();
    public moved = new Subject<void>();
    public entered = new Subject<void>();
    public dropped = new Subject<void>();
    private options: TreeDragDropOptions;

    private draggingElement: HTMLElement = null;
    private previewElement: HTMLElement = null;
    private placeholderElement: HTMLElement = null;

    private initialDragClientRect: DOMRect;

    private document: Document = document;
    // private ngZone: NgZone = Inject(NgZone);
    private rootElement = this.document;

    constructor(private ngZone: NgZone) {}

    initialize(options: TreeDragDropOptions) {
        this.options = options;
        const draggableElements = this.getDraggableElements();
        this.ngZone.runOutsideAngular(() => {
            merge(...draggableElements.map((element) => fromEvent(element, 'mousedown'))).subscribe((event: MouseEvent) => {
                this.pointerDown(event);
            });
        });
    }

    private pointerDown(mousedownEvent: MouseEvent) {
        this.draggingElement = mousedownEvent.currentTarget as HTMLElement;
        const targetHandle = this.getTargetHandle(mousedownEvent);
        if (!targetHandle || !targetHandle.contains(mousedownEvent.target as HTMLElement)) {
            return;
        }
        this.previewElement = this.createPreviewElement(mousedownEvent);
        this.document.body.appendChild(this.previewElement);
        this.document.body.style.userSelect = 'none';
        this.placeholderElement = this.createPlaceholderElement(mousedownEvent);
        this.draggingElement.style.display = 'none';
        // dragElement.parentElement.replaceChild(this.placeholderElement, dragElement);
        this.draggingElement.parentElement.insertBefore(this.placeholderElement, this.draggingElement);
        this.initialDragClientRect = this.placeholderElement.getBoundingClientRect();
        fromEvent(this.document, 'mousemove')
            .pipe(takeUntil(fromEvent(this.document, 'mouseup')))
            .subscribe((mouseoverEvent: MouseEvent) => {
                const { newX, newY } = this.getDragMovePositions(mousedownEvent, mouseoverEvent);
                this.previewElement.style.transform = getTransform(newX, newY);
            });

        fromEvent(this.document, 'mouseup')
            .pipe(take(1))
            .subscribe(() => {
                this.pointerUp();
                this.document.body.style.removeProperty('userSelect');
            });
    }

    private pointerUp() {
        this.previewElement?.remove();
        this.placeholderElement?.remove();
        this.draggingElement.style.removeProperty('display');
        this.document.body.style.removeProperty('userSelect');
    }

    private getDragMovePositions(mousedownEvent: MouseEvent, mouseoverEvent: MouseEvent) {
        const shiftX = mousedownEvent.clientX - this.initialDragClientRect.left;
        const shiftY = mousedownEvent.clientY - this.initialDragClientRect.top;
        let newX = mouseoverEvent.clientX - shiftX;
        let newY = mouseoverEvent.clientY - shiftY;
        let newBottom = newY + this.initialDragClientRect.height;
        if (newBottom > document.documentElement.clientHeight) {
            let docBottom = document.documentElement.getBoundingClientRect().bottom;
            let scrollY = Math.min(docBottom - newBottom, 10);
            if (scrollY < 0) {
                scrollY = 0;
            }
            window.scrollBy(0, scrollY);
            newY = Math.min(newY, document.documentElement.clientHeight - this.initialDragClientRect.height);
        }
        if (newY < 0) {
            let scrollY = Math.min(-newY, 10);
            if (scrollY < 0) scrollY = 0;
            window.scrollBy(0, -scrollY);
            newY = Math.max(newY, 0);
        }
        if (newX < 0) {
            newX = 0;
        }
        if (newX > document.documentElement.clientWidth - this.initialDragClientRect.width) {
            newX = document.documentElement.clientWidth - this.initialDragClientRect.width;
        }
        return { newX, newY };
    }

    private getDraggableElements() {
        const nodes = this.rootElement.querySelectorAll<HTMLElement>(this.options.draggable);
        return Array.from<HTMLElement>(nodes);
    }

    private getTargetHandle(event: Event): HTMLElement {
        if (this.options.handle) {
            return (event.currentTarget as HTMLElement).querySelector(this.options.handle);
        } else {
            return event.currentTarget as HTMLElement;
        }
    }

    private createPreviewElement(event: MouseEvent): HTMLElement {
        const source = event.currentTarget as HTMLElement;
        const preview = deepCloneNode(source);
        matchElementSize(preview, source.getBoundingClientRect());
        extendStyles(preview.style, {
            'pointer-events': 'none',
            margin: '0',
            position: 'fixed',
            top: '0',
            left: '0',
            'z-index': '1100'
        });
        toggleNativeDragInteractions(preview, false);
        preview.classList.add('drag-preview');
        return preview;
    }

    /** Creates an element that will be shown instead of the current element while dragging. */
    private createPlaceholderElement(event: MouseEvent): HTMLElement {
        const source = event.currentTarget as HTMLElement;
        const placeholder: HTMLElement = this.document.createElement('div');
        // matchElementSize(placeholder, source.getBoundingClientRect());
        placeholder.style.width = source.getBoundingClientRect().width + 'px';
        placeholder.style.height = source.getBoundingClientRect().height + 'px';
        placeholder.style.pointerEvents = 'none';
        placeholder.classList.add('drag-placeholder');
        // this.document.body.appendChild(placeholder);
        return placeholder;
    }

    private cleanupDragArtifacts() {}

    // private dragstart() {}

    // private dragover() {}

    // private dragend() {}

    // private createPreview() {}
}
