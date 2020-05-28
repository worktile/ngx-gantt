import { Component, OnInit, HostBinding, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, NgZone, Inject } from '@angular/core';
import { GanttDatePoint } from '../class/date-point';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { GanttRef, GANTT_REF_TOKEN } from '../gantt-ref';
import { headerHeight } from '../gantt.styles';

@Component({
    selector: 'gantt-calendar-overlay',
    templateUrl: './calendar.component.html'
})
export class GanttCalendarComponent implements OnInit, OnChanges, OnDestroy {
    public height = 500;

    public headerHeight = headerHeight;

    public todayPoint: {
        x: number;
        angle: string;
        text: string;
    };

    get view() {
        return this.ganttRef.view;
    }

    private firstChange = true;

    private unsubscribe$ = new Subject();

    @HostBinding('class.gantt-calendar-overlay') className = true;

    constructor(@Inject(GANTT_REF_TOKEN) private ganttRef: GanttRef, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.cdr.detectChanges();
            this.firstChange = false;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {}

    trackBy(point: GanttDatePoint, index: number) {
        return point.text || index;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
