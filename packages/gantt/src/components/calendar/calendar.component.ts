import {
    Component,
    OnInit,
    HostBinding,
    OnChanges,
    SimpleChanges,
    OnDestroy,
    NgZone,
    Inject,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { GanttDatePoint } from '../../class/date-point';
import { Subject, merge } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { headerHeight, todayHeight, todayWidth, todayBorderRadius } from '../../gantt.styles';
import { isNumber } from '../../utils/helpers';
import { GanttDate } from '../../utils/date';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttViewType } from './../../class/view-type';

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

    todayHeight = todayHeight;

    todayWidth = todayWidth;

    todayBorderRadius = todayBorderRadius;

    viewTypes = GanttViewType;

    @HostBinding('class.gantt-calendar-overlay') className = true;

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private ngZone: NgZone,
        private elementRef: ElementRef<HTMLElement>
    ) {}

    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const today = new GanttDate().getDate();
        const todayEle = this.elementRef.nativeElement.getElementsByClassName('gantt-calendar-today-overlay')[0] as HTMLElement;
        const rect = this.elementRef.nativeElement.getElementsByClassName('today-rect')[0] as HTMLElement;
        const line = this.elementRef.nativeElement.getElementsByClassName('today-line')[0] as HTMLElement;

        if (isNumber(x)) {
            if (rect) {
                rect.style.left = `${x - todayWidth / 2}px`;
                rect.style.top = `${headerHeight - todayHeight}px`;
                rect.innerHTML = today.toString();
            }
            if (line) {
                line.style.left = `${x}px`;
                line.style.top = `${headerHeight}px`;
                line.style.bottom = `${-mainHeight}px`;
            }
        } else {
            todayEle.style.display = 'none';
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
