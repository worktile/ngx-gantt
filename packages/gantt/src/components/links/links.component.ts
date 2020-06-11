import { Component, OnInit, Input, Output, EventEmitter, HostBinding, Inject, ChangeDetectorRef, ElementRef } from '@angular/core';
import { GanttGroupInternal } from '../../class/group';
import { GanttItemInternal, GanttItem } from './../../class/item';
import { GanttLinkEvent } from '../../class/event';
import { GANTT_REF_TOKEN, GanttRef } from '../../gantt-ref';
import { GanttDragContainer } from '../../gantt-drag-container';
import { merge } from 'rxjs';
import { headerHeight, defaultStyles } from '../../gantt.styles';

enum LinkColors {
    default = '#cacaca',
    blocked = '#FF7575',
    active = '#348FE4'
}

interface LinkInternal {
    path: string;
    source: GanttItem;
    target: GanttItem;
    color: LinkColors;
}

@Component({
    selector: 'gantt-links-overlay',
    templateUrl: './links.component.html'
})
export class GanttLinksComponent implements OnInit {
    @Input() groups: GanttGroupInternal[] = [];

    @Input() items: GanttItemInternal[] = [];

    @Output() linkClick = new EventEmitter<GanttLinkEvent>();

    public links: LinkInternal[] = [];

    private bezierWeight = -0.5;

    private firstChange = true;

    @HostBinding('class.gantt-links-overlay') ganttLinksOverlay = true;

    constructor(
        @Inject(GANTT_REF_TOKEN) public gantt: GanttRef,
        private cdr: ChangeDetectorRef,
        private elementRef: ElementRef,
        private ganttDragContainer: GanttDragContainer
    ) {}

    ngOnInit() {
        this.buildLinks();
        this.firstChange = false;
        this.ganttDragContainer.dragStarted.subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'hidden';
        });

        merge(this.ganttDragContainer.dragEnded, this.ganttDragContainer.linkDragEnded, this.gantt.view.start$).subscribe((event) => {
            this.elementRef.nativeElement.style.visibility = 'visible';
            this.buildLinks();
            this.cdr.detectChanges();
        });
    }

    ngOnChanges() {
        if (!this.firstChange) {
            this.buildLinks();
        }
    }

    private computeItemPosition() {
        const lineHeight = this.gantt.styles.lineHeight;
        const barHeight = this.gantt.styles.barHeight;
        this.links = [];
        if (this.groups.length > 0) {
            let itemNum = 0;
            let groupNum = 0;
            this.groups.forEach((group) => {
                groupNum++;
                if (group.expand) {
                    group.items.forEach((item, itemIndex) => {
                        const y = headerHeight + (groupNum + itemNum + itemIndex) * lineHeight + item.refs.y + barHeight / 2;
                        item.before = {
                            x: item.refs.x,
                            y
                        };
                        item.after = {
                            x: item.refs.x + item.refs.width,
                            y
                        };
                    });
                    itemNum += group.items.length;
                }
            });
        } else {
            this.items.forEach((item, itemIndex) => {
                const y = headerHeight + itemIndex * lineHeight + item.refs.y + barHeight / 2;
                item.before = {
                    x: item.refs.x,
                    y
                };
                item.after = {
                    x: item.refs.x + item.refs.width,
                    y
                };
            });
        }
    }

    private generatePath(source: GanttItemInternal, target: GanttItemInternal) {
        if (source.before && source.after && target.before && target.after) {
            const x1 = source.after.x;
            const y1 = source.after.y;

            const x4 = target.before.x;
            const y4 = target.before.y;

            const dx = Math.abs(x4 - x1) * this.bezierWeight;
            const x2 = x1 - dx;
            const x3 = x4 + dx;

            if (y1 === y4) {
                if (source.origin.end < target.origin.start) {
                    return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
                } else {
                    const dx2 = Math.abs(x4 - x1) * 0.1;
                    return `M ${x1} ${y1} C ${x1} ${y1 + dx2} ${x4} ${y1 + dx2} ${x4} ${y4}`;
                }
            } else {
                return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
            }
        }
    }

    buildLinks() {
        this.computeItemPosition();
        this.links = [];
        this.items.forEach((source) => {
            source.links.forEach((linkId) => {
                const target = this.items.find((item) => item.id === linkId);
                this.links.push({
                    path: this.generatePath(source, target),
                    source: source.origin,
                    target: target.origin,
                    color: source.origin.end > target.origin.start ? LinkColors.blocked : LinkColors.default
                });
            });
        });
    }

    trackBy(index: number) {
        return index;
    }

    onLinkClick(event: MouseEvent, link: LinkInternal) {
        this.linkClick.emit({
            event,
            source: link.source,
            target: link.target
        });
    }

    mouseEnterPath(link: LinkInternal) {
        if (link.color === LinkColors.default) {
            link.color = LinkColors.active;
        }
    }

    mouseLeavePath(link: LinkInternal) {
        if (link.color === LinkColors.active) {
            link.color = LinkColors.default;
        }
    }
}
