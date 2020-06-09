import { Component, OnInit, Input, Output, EventEmitter, HostBinding, Inject, ChangeDetectorRef, ElementRef } from '@angular/core';
import { GanttGroupInternal } from '../../class/group';
import { GanttItemInternal, GanttItem } from './../../class/item';
import { GanttLinkEvent } from '../../class/event';
import { GANTT_REF_TOKEN, GanttRef } from '../../gantt-ref';
import { GanttDragContainer } from '../../gantt-drag-container';
import { merge } from 'rxjs';

enum LinkColors {
    default = '#cacaca',
    blocked = '#FF7575',
    active = '#348FE4'
}

interface LinkInternal {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
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

        merge(this.ganttDragContainer.dragEnded, this.ganttDragContainer.linkDragEnded).subscribe((event) => {
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

    private getItems() {
        let items: GanttItemInternal[] = [];
        if (this.groups && this.groups.length) {
            this.groups.forEach((group) => {
                items = [...items, ...group.items];
            });
        }
        return items || this.items;
    }

    private generatePath(source: GanttItemInternal, target: GanttItemInternal) {
        const x1 = source.refs.x + source.refs.width;
        const y1 = source.refs.y + this.gantt.styles.barHeight / 2;

        const x4 = target.refs.x;
        const y4 = target.refs.y + this.gantt.styles.barHeight / 2;

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

    private generateLinkLine(source: GanttItemInternal, target: GanttItemInternal) {
        const path = this.generatePath(source, target);
        console.log(source, target);
        return {
            startPoint: {
                x: source.refs.x + source.refs.width,
                y: source.refs.y + this.gantt.styles.barHeight / 2
            },
            endPoint: {
                x: target.refs.x,
                y: target.refs.y + this.gantt.styles.barHeight / 2
            },
            path,
            source: source.origin,
            target: target.origin,
            color: source.origin.end > target.origin.start ? LinkColors.blocked : LinkColors.default
        };
    }

    buildLinks() {
        this.links = [];
        const items = this.getItems();
        this.groups.forEach((group) => {
            group.items.forEach((item) => {
                item.links.forEach((linkId) => {
                    const target = items.find((_item) => _item.id === linkId);
                    const link = this.generateLinkLine(item, target);
                    this.links.push(link);
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
