import { NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    output,
    viewChild,
    ViewChildren,
    QueryList,
    inject,
    NgZone,
    effect,
    linkedSignal,
    Signal,
    HostBinding,
    OnInit,
    afterNextRender
} from '@angular/core';
import { from, fromEvent, merge, Observable } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { GanttBarDrag } from './bar-drag';
import { hexToRgb } from '../../utils/helpers';
import { GanttDragContainer } from '../../gantt-drag-container';
import { barBackground } from '../../gantt.styles';
import { GanttBarClickEvent, GanttItemInternal } from '../../class';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttItemUpper } from '../../gantt-item-upper';

function linearGradient(sideOrCorner: string, color: string, stop: string) {
    return `linear-gradient(${sideOrCorner},${color} 0%,${stop} 40%)`;
}

@Component({
    selector: 'ngx-gantt-bar,gantt-bar',
    templateUrl: './bar.component.html',
    providers: [GanttBarDrag],
    imports: [NgTemplateOutlet]
})
export class NgxGanttBarComponent extends GanttItemUpper implements OnInit, AfterViewInit, OnDestroy {
    private dragContainer = inject(GanttDragContainer);

    private drag = inject(GanttBarDrag);

    private ngZone = inject(NgZone);

    override ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    readonly barClick = output<GanttBarClickEvent>();

    readonly contentElementRef = viewChild<ElementRef<HTMLDivElement>>('content');

    readonly previousItem: Signal<GanttItemInternal> = linkedSignal({
        source: () => this.item(),
        computation: (source, previous) => previous?.source
    });

    @HostBinding('class.gantt-bar') ganttItemClass = true;

    @ViewChildren('handle') handles: QueryList<ElementRef<HTMLElement>>;

    constructor() {
        super();
        afterNextRender(() => {
            this.ngZone.runOutsideAngular(() => {
                this.drag.initialize(this.elementRef, this.item(), this.ganttUpper);
            });
        });
        effect(() => {
            const item = this.item();
            const previousItem = this.previousItem();
            if (item && previousItem && item !== previousItem) {
                this.drag.updateItem(item);
                if (
                    item.refs?.width !== previousItem.refs?.width ||
                    item.color !== previousItem.color ||
                    item.start?.value !== previousItem.start?.value ||
                    item.end?.value !== previousItem.end?.value
                ) {
                    this.setContentBackground();
                }
            }
        });
    }

    ngOnInit() {
        this.dragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.pointerEvents = 'none';
        });
        this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.pointerEvents = '';
            this.setContentBackground();
        });
    }

    ngAfterViewInit() {
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
                                merge(...this.handles.map((handle) => fromEvent(handle.nativeElement, 'mousedown'))).subscribe(subscriber)
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
        this.barClick.emit({ event, item: this.item().origin });
    }

    private setContentBackground() {
        const item = this.item();
        let style: Partial<CSSStyleDeclaration> = { ...(item.barStyle || {}) };
        const contentElement = this.contentElementRef().nativeElement;
        const barElement = this.elementRef.nativeElement;

        if (item.refs?.width) {
            const color = item.color || barBackground;

            if (item.origin.start && item.origin.end) {
                style.background = color;
                style.borderRadius = '';
            }
            if (item.origin.start && !item.origin.end) {
                style.background = linearGradient('to left', hexToRgb(color, 0.55), hexToRgb(color, 1));

                const borderRadius = '4px 12.5px 12.5px 4px';
                style.borderRadius = borderRadius;
                barElement.style.borderRadius = borderRadius;
            }
            if (!item.origin.start && item.origin.end) {
                style.background = linearGradient('to right', hexToRgb(color, 0.55), hexToRgb(color, 1));

                const borderRadius = '12.5px 4px 4px 12.5px';
                style.borderRadius = borderRadius;
                barElement.style.borderRadius = borderRadius;
            }
            if (item.progress >= 0) {
                const contentProgressElement = contentElement.querySelector('.gantt-bar-content-progress') as HTMLDivElement;
                style.background = hexToRgb(color, 0.3);
                contentProgressElement.style.background = color;
            }
        }
        style = Object.assign({}, style, item.barStyle || {});

        for (const key in style) {
            if (style.hasOwnProperty(key)) {
                contentElement.style[key] = style[key];
            }
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
