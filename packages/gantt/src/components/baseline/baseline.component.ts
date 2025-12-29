import { Component, ElementRef, HostBinding, OnInit, TemplateRef, inject, input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttBaselineItemInternal } from '../../class/baseline';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'ngx-gantt-baseline,gantt-baseline',
    templateUrl: './baseline.component.html',
    imports: [NgTemplateOutlet]
})
export class NgxGanttBaselineComponent implements OnInit {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    readonly baselineItem = input<GanttBaselineItemInternal>(undefined);

    readonly template = input<TemplateRef<any>>(undefined);

    public unsubscribe$ = new Subject<void>();

    @HostBinding('class.gantt-baseline') ganttBaselineClass = true;

    constructor() {}

    ngOnInit() {
        this.baselineItem()
            .refs$.pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.setPositions();
            });
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.baselineItem().refs.x + 'px';
        itemElement.style.bottom = '2px';
        itemElement.style.width = this.baselineItem().refs.width + 'px';
    }
}
