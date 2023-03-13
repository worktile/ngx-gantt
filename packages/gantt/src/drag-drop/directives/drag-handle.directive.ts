import { Directive, ElementRef, HostBinding } from '@angular/core';
import { TreeDragItemDirective } from './drag-item.directive';

@Directive({ selector: '[treeDragItemHandle]' })
export class TreeDragItemHandleDirective {
    @HostBinding('class.tree-drag-item-handle') hasHandleClass = true;

    constructor(private elementRef: ElementRef<HTMLElement>, private dragItem: TreeDragItemDirective) {
        this.dragItem.withHandle(this.elementRef);
    }
}
