import { Component, HostBinding, OnDestroy, ElementRef, inject, afterNextRender } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isNumber } from '../../../utils/helpers';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../../gantt-upper';
import { GanttViewType } from './../../../class/view-type';
import { todayBorderRadius } from '../../../gantt.styles';
import { outputToObservable } from '@angular/core/rxjs-interop';
const mainHeight = 5000;

@Component({
    selector: 'gantt-calendar-grid',
    templateUrl: './calendar-grid.component.html'
})
export class GanttCalendarGridComponent implements OnDestroy {
    ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    get view() {
        return this.ganttUpper.view;
    }
    private unsubscribe$ = new Subject<void>();

    mainHeight = mainHeight;

    todayBorderRadius = todayBorderRadius;

    viewTypes = GanttViewType;

    @HostBinding('class') className = `gantt-calendar gantt-calendar-grid`;

    constructor() {
        afterNextRender(() => {
            merge(outputToObservable(this.ganttUpper.viewChange), this.ganttUpper.view.start$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                    this.setTodayPoint();
                });
        });
    }

    setTodayPoint() {
        const x = this.view.getNowX();
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

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
