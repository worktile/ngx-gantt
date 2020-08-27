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
import { GanttItemInternal, GanttItem } from './../../class/item';
import { GanttLineClickEvent } from '../../class/event';
import { GanttDragContainer } from '../../gantt-drag-container';
import { recursiveItems } from '../../utils/helpers';
import { GanttDate } from '../../utils/date';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';

enum LinkColors {
    default = '#cacaca',
    blocked = '#FF7575',
    active = '#348FE4'
}

interface GanttLinkItem {
    id: string;
    before: { x: number; y: number };
    after: { x: number; y: number };
    start: GanttDate;
    end: GanttDate;
    origin: GanttItem;
    links: string[];
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

    private generatePath(source: GanttLinkItem, target: GanttLinkItem) {
        if (source.before && source.after && target.before && target.after) {
            const x1 = source.after.x;
            const y1 = source.after.y;

            const x4 = target.before.x;
            const y4 = target.before.y;

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
                source.links.forEach((linkId) => {
                    const target = this.linkItems.find((item) => item.id === linkId);
                    if (target && (target.origin.start || target.origin.end)) {
                        this.links.push({
                            path: this.generatePath(source, target),
                            source: source.origin,
                            target: target.origin,
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
