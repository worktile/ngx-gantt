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
import { Subject, merge } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { headerHeight } from '../../gantt.styles';
import { isNumber } from '../../utils/helpers';
import { GanttDate } from '../../utils/date';
import { GanttDomService } from '../../gantt-dom.service';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';

const mainHeight = 5000;

@Component({
    selector: 'gantt-calendar-overlay',
    templateUrl: './calendar.component.html'
})
export class GanttCalendarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    get view() {
        return this.ganttUpper.view;
    }

    private unsubscribe$ = new Subject();

    headerHeight = headerHeight;

    mainHeight = mainHeight;

    @HostBinding('class.gantt-calendar-overlay') className = true;

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
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
            angle.setAttribute('points', [`${x - 6},${headerHeight}`, `${x + 6},${headerHeight}`, `${x},${headerHeight + 5}`].join(' '));
            line.setAttribute('x1', x.toString());
            line.setAttribute('x2', x.toString());
            line.setAttribute('y1', headerHeight.toString());
            line.setAttribute('y2', mainHeight.toString());
        }
    }

    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            merge(this.ganttUpper.viewChange, this.ganttUpper.view.start$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                    this.setTodayPoint();
                });
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
