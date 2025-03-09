import { EventEmitter } from '@angular/core';
import { GanttDragEvent, GanttLinkDragEvent } from './class/event';
import { GanttItemInternal } from './class/item';
import { GanttUpper } from './gantt-upper';
import * as i0 from "@angular/core";
export declare enum InBarPosition {
    start = "start",
    finish = "finish"
}
export type LinkDragPosition = {
    element: HTMLElement;
    item: GanttItemInternal;
    pos?: InBarPosition;
};
export interface LinkDragPath {
    from?: LinkDragPosition;
    to?: LinkDragPosition;
}
export declare class GanttDragContainer {
    ganttUpper: GanttUpper;
    dragStarted: EventEmitter<GanttDragEvent<unknown>>;
    dragMoved: EventEmitter<GanttDragEvent<unknown>>;
    dragEnded: EventEmitter<GanttDragEvent<unknown>>;
    linkDragStarted: EventEmitter<GanttLinkDragEvent<unknown>>;
    linkDragEntered: EventEmitter<GanttLinkDragEvent<unknown>>;
    linkDragEnded: EventEmitter<GanttLinkDragEvent<unknown>>;
    linkDraggingId: string;
    linkDragPath: LinkDragPath;
    constructor(ganttUpper: GanttUpper);
    emitLinkDragStarted(from: LinkDragPosition): void;
    emitLinkDragEntered(to: LinkDragPosition): void;
    emitLinkDragLeaved(): void;
    emitLinkDragEnded(to?: LinkDragPosition): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttDragContainer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GanttDragContainer>;
}
