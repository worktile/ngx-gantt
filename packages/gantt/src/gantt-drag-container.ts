import { Injectable, EventEmitter, Inject } from '@angular/core';
import { GanttLinkType } from './class';
import { GanttDragEvent, GanttLinkDragEvent } from './class/event';
import { GanttItemInternal } from './class/item';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';

function getDependencyType(path: LinkDragPath, dependencyTypes: GanttLinkType[]): GanttLinkType {
    if (dependencyTypes.includes(GanttLinkType.ss) && path.from.pos === InBarPosition.start && path.to.pos === InBarPosition.start) {
        return GanttLinkType.ss;
    }
    if (dependencyTypes.includes(GanttLinkType.ff) && path.from.pos === InBarPosition.finish && path.to.pos === InBarPosition.finish) {
        return GanttLinkType.ff;
    }
    if (dependencyTypes.includes(GanttLinkType.sf) && path.from.pos === InBarPosition.start && path.to.pos === InBarPosition.finish) {
        return GanttLinkType.sf;
    }
    return GanttLinkType.fs;
}

export enum InBarPosition {
    start = 'start',
    finish = 'finish'
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

@Injectable()
export class GanttDragContainer {
    dragStarted = new EventEmitter<GanttDragEvent>();

    dragMoved = new EventEmitter<GanttDragEvent>();

    dragEnded = new EventEmitter<GanttDragEvent>();

    linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    linkDragEntered = new EventEmitter<GanttLinkDragEvent>();

    linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    linkDraggingId: string;

    linkDragPath: LinkDragPath = { from: null, to: null };

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    emitLinkDragStarted(from: LinkDragPosition) {
        this.linkDraggingId = from.item.id;
        this.linkDragPath.from = from;
        this.linkDragStarted.emit({
            source: from.item.origin,
            target: null
        });
    }

    emitLinkDragEntered(to: LinkDragPosition) {
        this.linkDragPath.to = to;
        this.linkDragEntered.emit({
            source: this.linkDragPath.from.item.origin,
            target: to.item.origin
        });
    }

    emitLinkDragLeaved() {
        this.linkDragPath.to = null;
    }

    emitLinkDragEnded(to?: LinkDragPosition) {
        if (to) {
            this.linkDragPath.to = to;
            const dependencyType = getDependencyType(this.linkDragPath, this.ganttUpper.linkOptions?.dependencyTypes);
            this.linkDragPath.from.item.addLink({
                link: this.linkDragPath.to.item.id,
                type: dependencyType
            });
            this.linkDragEnded.emit({
                source: this.linkDragPath.from.item.origin,
                target: this.linkDragPath.to.item.origin,
                type: dependencyType
            });
        }

        this.linkDraggingId = null;
        this.linkDragPath = { from: null, to: null };
    }
}
