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
import { GanttLinkPath } from './paths/path';
import { generatePathFactory } from './paths/factory';

@Component({
    selector: 'gantt-links-overlay',
    templateUrl: './links.component.html'
})
export class GanttLinksComponent implements OnInit, OnChanges, OnDestroy {
    @Input() groups: GanttGroupInternal[] = [];

    @Input() items: GanttItemInternal[] = [];

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    public links: LinkInternal[] = [];

    public ganttLinkTypes = GanttLinkType;

    public showArrow = false;

    private linkItems: GanttLinkItem[] = [];

    private firstChange = true;

    private linkPath: GanttLinkPath;

    private unsubscribe$ = new Subject();

    @HostBinding('class.gantt-links-overlay') ganttLinksOverlay = true;

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private cdr: ChangeDetectorRef,
        private elementRef: ElementRef,
        private ganttDragContainer: GanttDragContainer
    ) {}

    ngOnInit() {
        this.linkPath = generatePathFactory(this.ganttUpper.linkOptions.linkPathType, this.ganttUpper);

        this.showArrow = this.ganttUpper.linkOptions.showArrow;
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

    buildLinks() {
        this.computeItemPosition();
        this.links = [];
        this.linkItems.forEach((source) => {
            if (source.origin.start || source.origin.end) {
                source.links.forEach((link) => {
                    const target = this.linkItems.find((item) => item.id === link.link);
                    if (target && (target.origin.start || target.origin.end)) {
                        let color = LinkColors.default;
                        if (link.type === GanttLinkType.fs && source.end.getTime() > target.start.getTime()) {
                            color = LinkColors.blocked;
                        }
                        this.links.push({
                            path: this.linkPath.generatePath(source, target, link.type),
                            source: source.origin,
                            target: target.origin,
                            type: link.type,
                            color: link.color || color
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
