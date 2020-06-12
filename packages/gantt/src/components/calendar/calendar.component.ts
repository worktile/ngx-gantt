import {
    Component,
    OnInit,
    HostBinding,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    OnDestroy,
    NgZone,
    Inject,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { GanttDatePoint } from '../../class/date-point';
import { Subject } from 'rxjs';
import { take, takeUntil, delay, auditTime } from 'rxjs/operators';
import { GanttRef, GANTT_REF_TOKEN } from '../../gantt-ref';
import { headerHeight } from '../../gantt.styles';
import { isNumber } from '../../utils/helpers';
import { GanttDate } from '../../utils/date';
import { GanttDomService } from '../../gantt-dom.service';

@Component({
    selector: 'gantt-calendar-overlay',
    templateUrl: './calendar.component.html'
})
export class GanttCalendarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    get view() {
        return this.ganttRef.view;
    }

    private unsubscribe$ = new Subject();

    headerHeight = headerHeight;

    @HostBinding('class.gantt-calendar-overlay') className = true;

    constructor(
        @Inject(GANTT_REF_TOKEN) private ganttRef: GanttRef,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private dom: GanttDomService,
        private elementRef: ElementRef<HTMLElement>
    ) {}

    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const angle = this.elementRef.nativeElement.getElementsByClassName('today-line-angle')[0];
        const line = this.elementRef.nativeElement.getElementsByClassName('today-line')[0];
        if (angle && line && isNumber(x)) {
            angle.setAttribute('points', [`${x - 6},${headerHeight}`, `${x + 5},${headerHeight}`, `${x},${headerHeight + 5}`].join(' '));
            line.setAttribute('x1', x.toString());
            line.setAttribute('x2', x.toString());
            line.setAttribute('y1', headerHeight.toString());
            line.setAttribute('y2', this.dom.root.clientHeight.toString());
        }
    }

    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.ganttRef.view.start$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.setTodayPoint();
            });
        });

        this.dom
            .getResize()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.setTodayPoint();
            });
    }

    ngAfterViewInit() {}

    ngOnChanges(changes: SimpleChanges): void {}

    trackBy(point: GanttDatePoint, index: number) {
        return point.text || index;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
