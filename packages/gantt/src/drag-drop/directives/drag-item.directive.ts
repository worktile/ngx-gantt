import { coerceElement } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input } from '@angular/core';
import { fromEvent, map } from 'rxjs';

export interface DragMouseEvent<T> {
    dragItem: TreeDragItemDirective<T>;
    nativeEvent: MouseEvent;
}

@Directive({ selector: '[treeDragItem]' })
export class TreeDragItemDirective<T = unknown> {
    @Input()
    set treeDragItem(data: T) {
        this.treeDragItemData = data;
    }

    @Input() treeDragItemData: T;

    public handle: HTMLElement;

    constructor(public elementRef: ElementRef<HTMLElement>) {}

    withHandle(handle: ElementRef<HTMLElement>) {
        this.handle = coerceElement(handle);
    }

    mousedown() {
        return fromEvent(this.elementRef.nativeElement, 'mousedown').pipe(map(this.buildMouseEvent.bind(this)));
    }

    mousemove() {
        return fromEvent(this.elementRef.nativeElement, 'mouseover').pipe(map(this.buildMouseEvent.bind(this)));
    }

    private buildMouseEvent(event: MouseEvent): DragMouseEvent<T> {
        return {
            nativeEvent: event,
            dragItem: this
        };
    }
}
