import { Component, OnInit, HostBinding, OnChanges, SimpleChanges, OnDestroy, NgZone, Inject, ElementRef } from '@angular/core';
import { GanttDatePoint } from '../../../class/date-point';
import { Subject, merge } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { isNumber } from '../../../utils/helpers';

import { GANTT_UPPER_TOKEN, GanttUpper } from '../../../gantt-upper';
import { GanttViewType } from './../../../class/view-type';
import { todayBorderRadius } from '../../../gantt.styles';
import { NgIf, NgFor } from '@angular/common';

const mainHeight = 5000;

@Component({
    selector: 'gantt-calendar-grid',
    templateUrl: './calendar-grid.component.html',
    standalone: true,
    imports: [NgIf, NgFor]
})
export class GanttCalendarGridComponent implements OnInit, OnDestroy {
    get view() {
        return this.ganttUpper.view;
    }
    private unsubscribe$ = new Subject<void>();

    mainHeight = mainHeight;

    todayBorderRadius = todayBorderRadius;

    viewTypes = GanttViewType;

    @HostBinding('class') className = `gantt-calendar gantt-calendar-grid`;

    constructor(
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private ngZone: NgZone,
        private elementRef: ElementRef<HTMLElement>
    ) {}

    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const todayEle = this.elementRef.nativeElement.getElementsByClassName('gantt-calendar-today-overlay')[0] as HTMLElement;
        const line = this.elementRef.nativeElement.getElementsByClassName('today-line')[0] as HTMLElement;

        if (isNumber(x)) {
            if (line) {
                line.style.left = `${x}px`;
                line.style.top = `0px`;
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

    trackBy(point: GanttDatePoint, index: number) {
        return point.text || index;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
