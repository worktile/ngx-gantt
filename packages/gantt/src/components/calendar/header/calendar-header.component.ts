import { Component, OnInit, HostBinding, Inject, NgZone, ElementRef } from '@angular/core';
import { GanttDatePoint } from '../../../class/date-point';
import { todayHeight, todayWidth } from '../../../gantt.styles';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../../gantt-upper';
import { GanttViewType } from '../../../class';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { GanttDate } from '../../../utils/date';
import { isNumber } from '../../../utils/helpers';
import { NgFor, NgStyle } from '@angular/common';

@Component({
    selector: 'gantt-calendar-header',
    templateUrl: './calendar-header.component.html',
    standalone: true,
    imports: [NgFor, NgStyle]
})
export class GanttCalendarHeaderComponent implements OnInit {
    get view() {
        return this.ganttUpper.view;
    }

    private unsubscribe$ = new Subject();

    viewTypes = GanttViewType;

    @HostBinding('class') className = `gantt-calendar gantt-calendar-header`;

    @HostBinding('style.height')
    get height() {
        return this.ganttUpper.styles.headerHeight + 'px';
    }

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private ngZone: NgZone,
        private elementRef: ElementRef<HTMLElement>
    ) {}

    ngOnInit() {
        // 头部日期定位
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            merge(this.ganttUpper.viewChange, this.ganttUpper.view.start$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                    if (this.ganttUpper.viewType === GanttViewType.day) this.setTodayPoint();
                });
        });
    }

    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const today = new GanttDate().getDate();
        const todayEle = this.elementRef.nativeElement.getElementsByClassName('gantt-calendar-today-overlay')[0] as HTMLElement;
        const rect = this.elementRef.nativeElement.getElementsByClassName('today-rect')[0] as HTMLElement;

        if (isNumber(x)) {
            if (rect) {
                rect.style.left = `${x - todayWidth / 2}px`;
                rect.style.top = `${this.ganttUpper.styles.headerHeight - todayHeight}px`;
                rect.innerHTML = today.toString();
            }
        } else {
            todayEle.style.display = 'none';
        }
    }

    trackBy(point: GanttDatePoint, index: number) {
        return point.text || index;
    }
}
