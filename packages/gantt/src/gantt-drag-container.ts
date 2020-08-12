import { Injectable, EventEmitter } from '@angular/core';
import { GanttDragEvent, GanttLinkDragEvent } from './class/event';
import { GanttItemInternal } from './class/item';

export type LinkDragFrom = 'source' | 'target';

@Injectable()
export class GanttDragContainer {
    dragStarted = new EventEmitter<GanttDragEvent>();

    dragEnded = new EventEmitter<GanttDragEvent>();

    linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    linkDragEntered = new EventEmitter<GanttLinkDragEvent>();

    linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    linkDraggingId: string;

    private linkDragSource: GanttItemInternal;

    private linkDragTarget: GanttItemInternal;

    private linkDragFrom: LinkDragFrom;

    constructor() {}

    emitLinkDragStarted(from: LinkDragFrom, item: GanttItemInternal) {
        this.linkDraggingId = item.id;
        this.linkDragFrom = from;
        this.linkDragSource = this.linkDragFrom === 'source' ? item : null;
        this.linkDragTarget = this.linkDragFrom === 'target' ? item : null;
        this.linkDragStarted.emit({
            source: this.linkDragSource && this.linkDragSource.origin,
            target: this.linkDragTarget && this.linkDragTarget.origin
        });
    }

    emitLinkDragEntered(item: GanttItemInternal) {
        if (this.linkDragFrom === 'source') {
            this.linkDragTarget = item;
        } else {
            this.linkDragSource = item;
        }
        this.linkDragEntered.emit({
            source: this.linkDragSource.origin,
            target: this.linkDragTarget.origin
        });
    }

    emitLinkDragLeaved() {
        if (this.linkDragFrom === 'source') {
            this.linkDragTarget = null;
        } else {
            this.linkDragSource = null;
        }
    }

    emitLinkDragEnded() {
        this.linkDraggingId = null;
        if (this.linkDragSource && this.linkDragTarget) {
            this.linkDragSource.addLink(this.linkDragTarget.id);

            this.linkDragEnded.emit({
                source: this.linkDragSource.origin,
                target: this.linkDragTarget.origin
            });
        }
        this.linkDragSource = null;
        this.linkDragTarget = null;
    }
}
