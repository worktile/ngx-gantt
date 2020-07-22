import { Component, OnInit, Input, TemplateRef, HostBinding, ElementRef, OnChanges, OnDestroy, Inject } from '@angular/core';
import { GanttItemInternal } from '../../class/item';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { rangeHeight } from '../../gantt.styles';

@Component({
    selector: 'gantt-range',
    templateUrl: './range.component.html'
})
export class NgxGanttRangeComponent implements OnInit, OnChanges, OnDestroy {
    @Input() item: GanttItemInternal;

    @HostBinding('class.gantt-range') ganttRangeClass = true;

    private firstChange = true;

    private unsubscribe$ = new Subject();

    constructor(private elementRef: ElementRef<HTMLDivElement>, @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    ngOnInit() {
        this.firstChange = false;
        this.item.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }

    ngOnChanges(): void {
        if (!this.firstChange) {
            this.setPositions();
        }
    }

    private setPositions() {
        const rangeElement = this.elementRef.nativeElement;
        rangeElement.style.left = this.item.refs.x + 'px';
        rangeElement.style.top = this.item.refs.y + 'px';
        rangeElement.style.width = this.item.refs.width + 'px';
        rangeElement.style.height = rangeHeight + 'px';
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
