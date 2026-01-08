import { Component, OnInit, HostBinding, ChangeDetectorRef, ElementRef, OnDestroy, inject, input, output, effect } from '@angular/core';
import { EMPTY, merge, Subject } from 'rxjs';
import { takeUntil, skip, debounceTime, switchMap, take } from 'rxjs/operators';
import { GanttGroupInternal } from '../../class/group';
import { GanttItemInternal } from './../../class/item';
import { GanttLineClickEvent } from '../../class/event';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttLinkItem, LinkInternal, LinkColors, GanttLinkType } from '../../class/link';
import { GanttLinkLine } from './lines/line';
import { createLineGenerator } from './lines/factory';
import { outputToObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'gantt-links-overlay',
    templateUrl: './links.component.html',
    imports: []
})
export class GanttLinksComponent implements OnInit, OnDestroy {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    private cdr = inject(ChangeDetectorRef);

    private elementRef = inject(ElementRef);

    private ganttDragContainer = inject(GanttDragContainer);

    readonly flatItems = input<(GanttGroupInternal | GanttItemInternal)[]>([]);

    readonly lineClick = output<GanttLineClickEvent>();

    public links: LinkInternal[] = [];

    public ganttLinkTypes = GanttLinkType;

    public showArrow = false;

    private linkItems: GanttLinkItem[] = [];

    private linkLine: GanttLinkLine;

    private unsubscribe$ = new Subject<void>();

    @HostBinding('class.gantt-links-overlay') ganttLinksOverlay = true;

    constructor() {
        effect(() => {
            this.buildLinks();
        });
    }

    ngOnInit() {
        const linkOptions = this.ganttUpper.linkOptions();
        this.linkLine = createLineGenerator(linkOptions.lineType, this.ganttUpper);

        this.showArrow = linkOptions.showArrow;

        this.ganttDragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'hidden';
        });

        merge(
            outputToObservable(this.ganttUpper.viewChange),
            outputToObservable(this.ganttUpper.expandChange),
            this.ganttUpper.view.start$,
            outputToObservable(this.ganttUpper.dragEnded),
            this.ganttUpper.linkDragEnded ? outputToObservable(this.ganttUpper.linkDragEnded) : EMPTY,
            outputToObservable(this.ganttUpper.table()?.dragDropped) || EMPTY
        )
            .pipe(skip(1), debounceTime(0), takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.elementRef.nativeElement.style.visibility = 'visible';
                this.buildLinks();
                this.cdr.detectChanges();
            });
    }

    private computeItemPosition() {
        const lineHeight = this.ganttUpper.styles().lineHeight;
        const barHeight = this.ganttUpper.styles().barHeight;
        this.linkItems = [];

        this.flatItems().forEach((item, itemIndex) => {
            if (!item.hasOwnProperty('items')) {
                const ganttItem = item as GanttItemInternal;
                if (ganttItem.refs && ganttItem.refs.width > 0) {
                    const y = itemIndex * lineHeight + ganttItem.refs.y + barHeight / 2;
                    this.linkItems.push({
                        ...ganttItem,
                        before: {
                            x: ganttItem.refs.x,
                            y
                        },
                        after: {
                            x: ganttItem.refs.x + ganttItem.refs.width,
                            y
                        }
                    });
                }
            }
        });
    }

    buildLinks() {
        this.computeItemPosition();
        this.links = [];
        this.linkItems.forEach((source) => {
            if (source.origin.start || source.origin.end) {
                source.links.forEach((link) => {
                    const target = this.linkItems.find((item) => item.id === link.link);
                    if (target && (target.origin.start || target.origin.end)) {
                        let defaultColor: string = LinkColors.default;
                        let activeColor: string = LinkColors.active;

                        if (link.type === GanttLinkType.ff && source.end.getTime() > target.end.getTime()) {
                            defaultColor = LinkColors.blocked;
                            activeColor = LinkColors.blocked;
                        } else if (link.type === GanttLinkType.fs && source.end.getTime() > target.start.getTime()) {
                            defaultColor = LinkColors.blocked;
                            activeColor = LinkColors.blocked;
                        } else if (link.type === GanttLinkType.sf && source.start.getTime() > target.end.getTime()) {
                            defaultColor = LinkColors.blocked;
                            activeColor = LinkColors.blocked;
                        } else if (link.type === GanttLinkType.ss && source.start.getTime() > target.start.getTime()) {
                            defaultColor = LinkColors.blocked;
                            activeColor = LinkColors.blocked;
                        }

                        if (link.color) {
                            if (typeof link.color === 'string') {
                                defaultColor = link.color;
                                activeColor = link.color;
                            } else {
                                defaultColor = link.color.default;
                                activeColor = link.color.active;
                            }
                        }

                        this.links.push({
                            path: this.linkLine.generatePath(source, target, link.type),
                            source: source.origin,
                            target: target.origin,
                            type: link.type,
                            color: defaultColor,
                            defaultColor,
                            activeColor
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

    mouseEnterPath(link: LinkInternal, index: number) {
        link.color = link.activeColor || link.defaultColor;
        if (index < this.links.length - 1) {
            this.links.splice(index, 1);
            this.links.push(link);
        }
    }

    mouseLeavePath(link: LinkInternal) {
        link.color = link.defaultColor;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
