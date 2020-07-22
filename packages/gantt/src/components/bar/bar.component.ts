import {
    Component,
    OnInit,
    Input,
    TemplateRef,
    HostBinding,
    ElementRef,
    OnChanges,
    SimpleChanges,
    OnDestroy,
    Inject,
    NgZone,
    ViewChild,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import { GanttItemInternal } from '../../class/item';
import { takeUntil, take, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GanttBarDrag } from './bar-drag';
import { hexToRgb } from '../../utils/helpers';
import { GanttDragContainer } from '../../gantt-drag-container';
import { barBackground } from '../../gantt.styles';
import { GanttBarClickEvent } from '../../class';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';

function linearGradient(sideOrCorner: string, color: string, stop: string) {
    return `linear-gradient(${sideOrCorner},${color} 0%,${stop} 40%)`;
}

@Component({
    selector: 'ngx-gantt-bar,gantt-bar',
    templateUrl: './bar.component.html',
    providers: [GanttBarDrag]
})
export class NgxGanttBarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() item: GanttItemInternal;

    @Input() template: TemplateRef<any>;

    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @ViewChild('content', { static: false }) contentElementRef: ElementRef<HTMLDivElement>;

    @HostBinding('class.gantt-bar') ganttItemClass = true;

    private firstChange = true;

    color = 'red';

    private unsubscribe$ = new Subject();

    constructor(
        private elementRef: ElementRef<HTMLDivElement>,
        private ngZone: NgZone,
        private dragContainer: GanttDragContainer,
        private drag: GanttBarDrag,
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper
    ) {}

    ngOnInit() {
        this.firstChange = false;

        this.item.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
        this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setContentBackground();
        });
    }

    ngAfterViewInit() {
        this.drag.createDrags(this.elementRef, this.item, this.ganttUpper);
        this.setContentBackground();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.firstChange) {
            this.setPositions();
        }
    }

    onBarClick(event: Event) {
        this.barClick.emit({ event, item: this.item.origin });
    }

    private setPositions() {
        const barElement = this.elementRef.nativeElement;
        barElement.style.left = this.item.refs.x + 'px';
        barElement.style.top = this.item.refs.y + 'px';
        barElement.style.width = this.item.refs.width + 'px';
        barElement.style.height = this.ganttUpper.styles.barHeight + 'px';
    }

    private setContentBackground() {
        const contentElement = this.contentElementRef.nativeElement;
        const color = this.item.color || barBackground;
        const style: Partial<CSSStyleDeclaration> = this.item.barStyle || {};
        if (this.item.origin.start && this.item.origin.end) {
            style.background = color;
            style.borderRadius = '';
        }
        if (this.item.origin.start && !this.item.origin.end) {
            style.background = linearGradient('to left', hexToRgb(color, 0.55), hexToRgb(color, 1));
            style.borderRadius = '4px 12.5px 12.5px 4px';
        }
        if (!this.item.origin.start && this.item.origin.end) {
            style.background = linearGradient('to right', hexToRgb(color, 0.55), hexToRgb(color, 1));
            style.borderRadius = '12.5px 4px 4px 12.5px';
        }
        if (this.item.progress >= 0) {
            const contentProgressElement = contentElement.querySelector('.gantt-bar-content-progress') as HTMLDivElement;
            style.background = hexToRgb(color, 0.3);
            style.borderRadius = '';
            contentProgressElement.style.background = color;
        }

        for (const key in style) {
            if (style.hasOwnProperty(key)) {
                contentElement.style[key] = style[key];
            }
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
