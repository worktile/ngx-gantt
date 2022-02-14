import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    Inject,
    ChangeDetectorRef,
    ElementRef,
    OnDestroy,
    OnChanges
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';
import { GanttGroupInternal } from '../../class/group';
import { GanttItemInternal } from './../../class/item';
import { GanttLineClickEvent } from '../../class/event';
import { GanttDragContainer } from '../../gantt-drag-container';
import { recursiveItems } from '../../utils/helpers';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttLinkItem, LinkInternal, LinkColors, GanttLinkType } from '../../class/link';

@Component({
    selector: 'gantt-links-overlay',
    templateUrl: './links.component.html'
})
export class GanttLinksComponent implements OnInit, OnChanges, OnDestroy {
    @Input() groups: GanttGroupInternal[] = [];

    @Input() items: GanttItemInternal[] = [];

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    public links: LinkInternal[] = [];

    private linkItems: GanttLinkItem[] = [];

    private bezierWeight = -0.5;

    private firstChange = true;

    private unsubscribe$ = new Subject();

    @HostBinding('class.gantt-links-overlay') ganttLinksOverlay = true;

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private cdr: ChangeDetectorRef,
        private elementRef: ElementRef,
        private ganttDragContainer: GanttDragContainer
    ) {}

    ngOnInit() {
        this.buildLinks();
        this.firstChange = false;

        this.ganttDragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'hidden';
        });

        merge(
            this.ganttUpper.viewChange,
            this.ganttUpper.expandChange,
            this.ganttUpper.view.start$,
            this.ganttUpper.dragEnded,
            this.ganttUpper.linkDragEnded
        )
            .pipe(takeUntil(this.unsubscribe$), skip(1))
            .subscribe(() => {
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
        const lineHeight = this.ganttUpper.styles.lineHeight;
        const barHeight = this.ganttUpper.styles.barHeight;
        this.linkItems = [];
        if (this.groups.length > 0) {
            let itemNum = 0;
            let groupNum = 0;
            this.groups.forEach((group) => {
                groupNum++;
                if (group.expanded) {
                    const items = recursiveItems(group.items);
                    items.forEach((item, itemIndex) => {
                        const y = (groupNum + itemNum + itemIndex) * lineHeight + item.refs.y + barHeight / 2;
                        this.linkItems.push({
                            ...item,
                            before: {
                                x: item.refs.x,
                                y
                            },
                            after: {
                                x: item.refs.x + item.refs.width,
                                y
                            }
                        });
                    });
                    itemNum += items.length;
                }
            });
        } else {
            const items = recursiveItems(this.items);
            items.forEach((item, itemIndex) => {
                const y = itemIndex * lineHeight + item.refs.y + barHeight / 2;
                this.linkItems.push({
                    ...item,
                    before: {
                        x: item.refs.x,
                        y
                    },
                    after: {
                        x: item.refs.x + item.refs.width,
                        y
                    }
                });
            });
        }
    }

    private generatePath(source: GanttLinkItem, target: GanttLinkItem, type: GanttLinkType) {
        if (source.before && source.after && target.before && target.after) {
            let x1 = source.after.x;
            let y1 = source.after.y;
            let x4 = target.before.x;
            let y4 = target.before.y;
            let isMirror: number;
            const control = Math.abs(y4 - y1) / 2;

            switch (type) {
                case GanttLinkType.ss:
                    x1 = source.before.x;
                    y1 = source.before.y;
                    x4 = target.before.x;
                    y4 = target.before.y;
                    isMirror = y4 > y1 ? 0 : 1;

                    if (x4 > x1) {
                        return `M ${x1} ${y1}
                            A ${control} ${control} 0 1 ${isMirror} ${x1} ${y4}
                            L ${x1} ${y4} ${x4} ${y4}`;
                    } else {
                        return `M ${x1} ${y1}
                        L ${x1} ${y1} ${x4} ${y1}
                        A ${control} ${control} 0 1 ${isMirror} ${x4} ${y4}`;
                    }

                case GanttLinkType.ff:
                    x1 = source.after.x;
                    y1 = source.after.y;
                    x4 = target.after.x;
                    y4 = target.after.y;
                    isMirror = y4 > y1 ? 1 : 0;
                    if (x4 > x1) {
                        return `M ${x1} ${y1}
                        L ${x1} ${y1} ${x4} ${y1}
                        A ${control} ${control} 0 1 ${isMirror} ${x4} ${y4}`;
                    } else {
                        return `M ${x1} ${y1}
                            A ${control} ${control} 0 1 ${isMirror} ${x1} ${y4}
                            L ${x1} ${y4} ${x4} ${y4}`;
                    }

                case GanttLinkType.sf:
                    x1 = target.after.x;
                    y1 = target.after.y;
                    x4 = source.before.x;
                    y4 = source.before.y;
            }

            const dx = Math.abs(x4 - x1) * this.bezierWeight;

            const x2 = x1 - dx;
            const x3 = x4 + dx;
            const centerX = (x1 + x4) / 2;
            const centerY = (y1 + y4) / 2;

            let controlX = this.ganttUpper.styles.lineHeight / 2;
            const controlY = this.ganttUpper.styles.lineHeight / 2;

            if (x1 >= x4) {
                if (y4 > y1) {
                    if (Math.abs(y4 - y1) <= this.ganttUpper.styles.lineHeight) {
                        return `M ${x1} ${y1}
                        C ${x1 + controlX} ${y1} ${x1 + controlX} ${y1 + controlX} ${x1} ${y1 + controlY}
                        L ${x1} ${y1 + controlY} ${centerX} ${centerY}

                        M ${x4} ${y4}
                        C ${x4 - controlX} ${y4} ${x4 - controlX} ${y4 - controlX} ${x4} ${y4 - controlY}
                        L ${x4} ${y4 - controlY} ${centerX} ${centerY}`;
                    } else {
                        controlX = this.ganttUpper.styles.lineHeight;
                        return `M ${x1} ${y1}
                        C ${x1 + controlX} ${y1} ${x1 + controlX} ${y1 + controlX} ${centerX} ${centerY}


                        M ${x4} ${y4}
                        C ${x4 - controlX} ${y4} ${x4 - controlX} ${y4 - controlX} ${centerX} ${centerY}`;
                    }
                } else {
                    if (Math.abs(y4 - y1) <= this.ganttUpper.styles.lineHeight) {
                        return `M ${x1} ${y1}
                        C ${x1 + controlX} ${y1} ${x1 + controlX} ${y1 - controlX} ${x1} ${y1 - controlY}
                        L ${x1} ${y1 - controlY} ${centerX} ${centerY}

                        M ${x4} ${y4}
                        C ${x4 - controlX} ${y4} ${x4 - controlX} ${y4 + controlX} ${x4} ${y4 + controlY}
                        L ${x4} ${y4 + controlY} ${centerX} ${centerY}
                        `;
                    } else {
                        controlX = this.ganttUpper.styles.lineHeight;
                        return `M ${x1} ${y1}
                        C ${x1 + controlX} ${y1} ${x1 + controlX} ${y1 - controlX} ${centerX} ${centerY}

                        M ${x4} ${y4}
                        C ${x4 - controlX} ${y4} ${x4 - controlX} ${y4 + controlX} ${centerX} ${centerY}`;
                    }
                }
            }

            return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
        }
    }

    buildLinks() {
        this.computeItemPosition();
        this.links = [];
        this.linkItems.forEach((source) => {
            if (source.origin.start || source.origin.end) {
                source.links.forEach((link) => {
                    const target = this.linkItems.find((item) => item.id === link.link);
                    if (target && (target.origin.start || target.origin.end)) {
                        this.links.push({
                            path: this.generatePath(source, target, link.type),
                            source: source.origin,
                            target: target.origin,
                            type: link.type,
                            color: source.end.getTime() > target.start.getTime() ? LinkColors.blocked : LinkColors.default
                        });
                    }
                });
            }
        });
    }

    trackBy(index: number) {
        return index;
    }

    onLineClick(event: MouseEvent, link: LinkInternal) {
        this.lineClick.emit({
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

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
