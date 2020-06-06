import { Component, OnInit, HostBinding, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, NgZone, Inject } from '@angular/core';
import { GanttDatePoint } from '../../class/date-point';
import { Subject } from 'rxjs';
import { take, takeUntil, delay } from 'rxjs/operators';
import { GanttRef, GANTT_REF_TOKEN } from '../../gantt-ref';
import { headerHeight } from '../../gantt.styles';
import { isNumber } from '../../utils/helpers';
import { GanttDate } from '../../utils/date';
import { GanttDomService } from '../../gantt-dom.service';

@Component({
    selector: 'gantt-calendar-overlay',
    templateUrl: './calendar.component.html'
})
export class GanttCalendarComponent implements OnInit, OnChanges, OnDestroy {
    public height = 500;

    public headerHeight = headerHeight;

    public todayPoint: {
        x: number;
        y: number;
        angle: string;
        text: string;
    };

    get view() {
        return this.ganttRef.view;
    }

    private firstChange = true;

    private unsubscribe$ = new Subject();

    @HostBinding('class.gantt-calendar-overlay') className = true;

    constructor(
        @Inject(GANTT_REF_TOKEN) private ganttRef: GanttRef,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private dom: GanttDomService
    ) {}

    computeTodayPoint() {
        const x = this.view.getTodayXPoint();
        if (isNumber(x)) {
            this.todayPoint = {
                x,
                y: this.dom.root.clientHeight,
                angle: [`${x - 6},${headerHeight}`, `${x + 5},${headerHeight}`, `${x},${headerHeight + 5}`].join(' '),
                text: new GanttDate().format('MM月d日')
            };
        }
    }

    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.ganttRef.view.start$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.computeTodayPoint();
                this.cdr.detectChanges();
            });
        });

        this.firstChange = false;

        this.dom
            .getResize()
            .pipe(delay(10), takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.todayPoint.y = this.dom.root.clientHeight;
                this.cdr.detectChanges();
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
