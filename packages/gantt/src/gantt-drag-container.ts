import { Injectable, EventEmitter } from '@angular/core';
import { GanttDragEvent, GanttLinkDragEvent } from './class/event';
import { GanttItemInternal } from './class/item';
import { GanttDomService } from './gantt-dom.service';

export type LinkDragFrom = 'source' | 'dependent';

@Injectable()
export class GanttDragContainer {
    dragStarted = new EventEmitter<GanttDragEvent>();

    dragEnded = new EventEmitter<GanttDragEvent>();

    linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    linkDragEntered = new EventEmitter<GanttLinkDragEvent>();

    linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    linkDraggingId: string;

    private linkDragSource: GanttItemInternal;

    private linkDragDependent: GanttItemInternal;

    private linkDragFrom: LinkDragFrom;

    constructor() {}

    emitLinkDragStarted(from: LinkDragFrom, item: GanttItemInternal) {
        this.linkDraggingId = item.id;
        this.linkDragFrom = from;
        this.linkDragSource = this.linkDragFrom === 'source' ? item : null;
        this.linkDragDependent = this.linkDragFrom === 'dependent' ? item : null;
        this.linkDragStarted.emit({
            source: this.linkDragSource && this.linkDragSource.origin,
            dependent: this.linkDragDependent && this.linkDragDependent.origin
        });
    }

    emitLinkDragEntered(item: GanttItemInternal) {
        if (this.linkDragFrom === 'source') {
            this.linkDragDependent = item;
        } else {
            this.linkDragSource = item;
        }
        this.linkDragEntered.emit({
            source: this.linkDragSource.origin,
            dependent: this.linkDragDependent.origin
        });
    }

    emitLinkDragLeaved() {
        if (this.linkDragFrom === 'source') {
            this.linkDragDependent = null;
        } else {
            this.linkDragSource = null;
        }
    }

    emitLinkDragEnded() {
        this.linkDraggingId = null;
        if (this.linkDragSource && this.linkDragDependent) {
            // this.linkDragSource.addLink(this.linkDragDependent._id);
            this.linkDragEnded.emit({
                source: this.linkDragSource.origin,
                dependent: this.linkDragDependent.origin
            });
        }
        this.linkDragSource = null;
        this.linkDragDependent = null;
    }
}
