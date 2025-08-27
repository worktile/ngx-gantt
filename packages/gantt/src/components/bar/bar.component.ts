import { NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { from, fromEvent, merge, Observable } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { GanttBarClickEvent } from '../../class';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GanttItemUpper } from '../../gantt-item-upper';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { barBackground } from '../../gantt.styles';
import { isDateInSecondaryDatePoints } from '../../utils/date-points';
import { hexToRgb } from '../../utils/helpers';
import { GanttBarDrag } from './bar-drag';

function linearGradient(sideOrCorner: string, color: string, stop: string) {
    return `linear-gradient(${sideOrCorner},${color} 0%,${stop} 40%)`;
}

@Component({
    selector: 'ngx-gantt-bar,gantt-bar',
    templateUrl: './bar.component.html',
    providers: [GanttBarDrag],
    imports: [NgTemplateOutlet]
})
export class NgxGanttBarComponent extends GanttItemUpper implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @ViewChild('content') contentElementRef: ElementRef<HTMLDivElement>;

    @HostBinding('class.gantt-bar') ganttItemClass = true;

    @ViewChildren('handle') handles: QueryList<ElementRef<HTMLElement>>;

    constructor(
        private dragContainer: GanttDragContainer,
        private drag: GanttBarDrag,
        elementRef: ElementRef<HTMLDivElement>,
        @Inject(GANTT_UPPER_TOKEN) public override ganttUpper: GanttUpper,
        private ngZone: NgZone
    ) {
        super(elementRef, ganttUpper);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.dragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.pointerEvents = 'none';
        });
        this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.pointerEvents = '';
            this.setContentBackground();
        });
    }

    override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (!this.firstChange) {
            this.drag.updateItem(this.item);

            if (
                changes.item.currentValue.refs?.width !== changes.item.previousValue.refs?.width ||
                changes.item.currentValue.color !== changes.item.previousValue.color ||
                changes.item.currentValue.start?.value !== changes.item.previousValue.start?.value ||
                changes.item.currentValue.end?.value !== changes.item.previousValue.end?.value
            ) {
                this.setContentBackground();
            }
        }
    }

    ngAfterViewInit() {
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.drag.initialize(this.elementRef, this.item, this.ganttUpper);
            });
        });

        this.setContentBackground();

        this.handles.changes
            .pipe(
                startWith(this.handles),
                switchMap(
                    () =>
                        // Note: we need to explicitly subscribe outside of the Angular zone since `addEventListener`
                        // is called when the `fromEvent` is subscribed.
                        new Observable<Event>((subscriber) =>
                            this.ngZone.runOutsideAngular(() =>
                                merge(...this.handles.toArray().map((handle) => fromEvent(handle.nativeElement, 'mousedown'))).subscribe(
                                    subscriber
                                )
                            )
                        )
                ),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((event) => {
                event.stopPropagation();
            });
    }

    onBarClick(event: Event) {
        this.barClick.emit({ event, item: this.item.origin });
    }

    private setContentBackground() {
        const style: Partial<CSSStyleDeclaration> = this.item.barStyle || {};
        const contentElement = this.contentElementRef.nativeElement;

        if (this.item.refs?.width) {
            const color = this.item.color || barBackground;
            const barElement = this.elementRef.nativeElement;
            this.setBarStyle(style, barElement, color, contentElement);
        } else {
            this.setBarHidden(style, this.elementRef.nativeElement);
        }
        for (const key in style) {
            if (style.hasOwnProperty(key)) {
                contentElement.style[key] = style[key];
            }
        }
    }

    private isDateInPoints(date: Date | string | number): boolean {
        if (!this.ganttUpper?.view?.secondaryDatePoints) {
            return false;
        }
        return isDateInSecondaryDatePoints(date, this.ganttUpper.view.secondaryDatePoints, this.ganttUpper.viewType);
    }

    private setBarStyle(style: Partial<CSSStyleDeclaration>, barElement: HTMLElement, color: string, contentElement: HTMLDivElement) {
        const { start, end } = this.item.origin;
        const startInPoints = start ? this.isDateInPoints(start) : false;
        const endInPoints = end ? this.isDateInPoints(end) : false;

        if (start && end) {
            if (startInPoints && endInPoints) {
                style.background = color;
                style.borderRadius = '';
            } else if (startInPoints && !endInPoints) {
                this.setLinearToLeft(style, color, barElement);
            } else if (!startInPoints && endInPoints) {
                this.setLinearToRight(style, color, barElement);
            } else {
                this.setBarHidden(style, barElement);
            }
        } else if (start && !end) {
            if (startInPoints) {
                this.setLinearToLeft(style, color, barElement);
            } else {
                this.setBarHidden(style, barElement);
            }
        } else if (!start && end) {
            if (endInPoints) {
                this.setLinearToRight(style, color, barElement);
            } else {
                this.setBarHidden(style, barElement);
            }
        }

        if (this.item.progress >= 0) {
            const contentProgressElement = contentElement.querySelector('.gantt-bar-content-progress') as HTMLDivElement;
            style.background = hexToRgb(color, 0.3);
            contentProgressElement.style.background = color;
        }
    }

    setLinearToLeft(style: Partial<CSSStyleDeclaration>, color: string, barElement: HTMLElement) {
        style.background = linearGradient('to left', hexToRgb(color, 0.55), hexToRgb(color, 1));
        const borderRadius = '4px 12.5px 12.5px 4px';
        style.borderRadius = borderRadius;
        barElement.style.borderRadius = borderRadius;
    }

    setLinearToRight(style: Partial<CSSStyleDeclaration>, color: string, barElement: HTMLElement) {
        style.background = linearGradient('to right', hexToRgb(color, 0.55), hexToRgb(color, 1));
        const borderRadius = '12.5px 4px 4px 12.5px';
        style.borderRadius = borderRadius;
        barElement.style.borderRadius = borderRadius;
    }

    setBarHidden(style: Partial<CSSStyleDeclaration>, barElement: HTMLElement) {
        style.background = 'transparent';
        style.border = 'none';
        barElement.style.height = '0px';
        barElement.style.width = '0px';
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
