import { AfterViewInit, Component, ElementRef, HostBinding, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GanttBaselineItemInternal } from '../../class/baseline';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';

@Component({
    selector: 'ngx-gantt-baseline,gantt-baseline',
    templateUrl: './baseline.component.html'
})
export class NgxGanttBaselineComponent implements OnInit, AfterViewInit {
    @Input() baselineItem: GanttBaselineItemInternal;

    public unsubscribe$ = new Subject<void>();

    @ViewChild('content') contentElementRef: ElementRef<HTMLDivElement>;

    @HostBinding('class.gantt-baseline') ganttBaselineClass = true;

    constructor(private elementRef: ElementRef<HTMLElement>, @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    ngOnInit() {
        this.baselineItem.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }

    ngAfterViewInit() {
        this.setContentBackground();
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.baselineItem.refs.x + 'px';
        // itemElement.style.top = `${this.baselineItem.refs.y + this.ganttUpper.styles.barHeight + 1}px`;
        itemElement.style.bottom = '2px';
        itemElement.style.width = this.baselineItem.refs.width + 'px';
    }

    private setContentBackground() {
        const contentElement = this.contentElementRef.nativeElement;
        contentElement.style.backgroundColor = this.ganttUpper.styles.baselineColor;
    }
}
