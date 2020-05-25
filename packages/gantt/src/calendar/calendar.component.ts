import {
    Component,
    OnInit,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    OnDestroy,
    NgZone,
    Inject,
} from '@angular/core';
import { GanttGroupInternal } from '../class/group';
import { GanttDatePoint } from '../class/date-point';
import { isNumber } from 'ngx-tethys/util/helpers';
import { TinyDate } from '../date';
import { GanttDomService } from '../gantt-dom.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GanttRef, GANTT_REF_TOKEN } from '../gantt-ref';

@Component({
    selector: 'gantt-calendar-overlay',
    templateUrl: './calendar.component.html',
})
export class GanttCalendarComponent implements OnInit, OnChanges, OnDestroy {
    @Input() groups: GanttGroupInternal[];

    get view() {
        return this.ganttRef.view;
    }

    public height: number;

    public todayPoint: {
        x: number;
        angle: string;
        text: string;
    };

    private firstChange = true;

    private unsubscribe$ = new Subject();

    @HostBinding('class.gantt-calendar-overlay') className = true;

    constructor(
        @Inject(GANTT_REF_TOKEN) private ganttRef: GanttRef,
        private ganttDomService: GanttDomService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.updateHeight();
            this.cdr.detectChanges();
            this.firstChange = false;
        });

        this.ganttDomService.getResize$().subscribe(() => {
            this.updateHeight();
            this.cdr.detectChanges();
        });

        this.view.start$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeTodayPoint();
            this.cdr.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.firstChange) {
            if (changes.groups && this.groups) {
                this.updateHeight();
            }
        }
    }

    computeTodayPoint() {
        const x = this.view.getTodayXPoint();
        if (isNumber(x)) {
            this.todayPoint = {
                x,
                angle: [`${x - 6},0`, `${x + 5},0`, `${x},5`].join(' '),
                text: new TinyDate().format('MM月d日'),
            };
        }
    }

    private updateHeight() {
        this.computeHeight();
        this.computeTodayPoint();
    }

    private computeHeight() {
        const clientHeight = this.ganttDomService.itemsContentElement.clientHeight;
        const height = this.groups.reduce<number>((pre, cur) => pre + cur.refs.height, 0);
        this.height = Math.max(clientHeight, height);
    }

    trackBy(point: GanttDatePoint, index: number) {
        return point.text || index;
    }

    groupTrackBy(group: GanttGroupInternal, index: number) {
        return group._id || index;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
