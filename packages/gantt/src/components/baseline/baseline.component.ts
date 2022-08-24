import { Component, ElementRef, HostBinding, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttBaselineItemInternal } from '../../class/baseline';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';

@Component({
    selector: 'ngx-gantt-baseline,gantt-baseline',
    templateUrl: './baseline.component.html'
})
export class NgxGanttBaselineComponent implements OnInit {
    @Input() baselineItem: GanttBaselineItemInternal;

    public unsubscribe$ = new Subject<void>();

    @HostBinding('class.gantt-baseline') ganttBaselineClass = true;

    constructor(private elementRef: ElementRef<HTMLElement>, @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    ngOnInit() {
        this.baselineItem.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.baselineItem.refs.x + 'px';
        itemElement.style.bottom = '2px';
        itemElement.style.width = this.baselineItem.refs.width + 'px';
    }
}
