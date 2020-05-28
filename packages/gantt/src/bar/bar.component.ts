import {
    Component,
    OnInit,
    Input,
    TemplateRef,
    HostBinding,
    ElementRef,
    OnChanges,
    SimpleChanges,
    OnDestroy,
    Inject,
    NgZone
} from '@angular/core';
import { GanttItemInternal } from '../class/item';
import { GanttRef, GANTT_REF_TOKEN } from '../gantt-ref';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GanttBarDrag } from './bar-drag';

@Component({
    selector: 'gantt-bar',
    templateUrl: './bar.component.html',
    providers: [GanttBarDrag]
})
export class GanttBarComponent implements OnInit, OnChanges, OnDestroy {
    @Input() item: GanttItemInternal;

    @Input() template: TemplateRef<any>;

    @HostBinding('class.gantt-bar') ganttItemClass = true;

    private firstChange = true;

    private unsubscribe$ = new Subject();

    constructor(
        private elementRef: ElementRef<HTMLDivElement>,
        private ngZone: NgZone,
        private drag: GanttBarDrag,
        @Inject(GANTT_REF_TOKEN) public ganttRef: GanttRef
    ) {}

    ngOnInit() {
        this.firstChange = false;

        this.item.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.updatePositions();
        });

        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.drag.createDrags(this.elementRef, this.item, this.ganttRef);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.firstChange) {
            this.updatePositions();
        }
    }

    private updatePositions() {
        const element = this.elementRef.nativeElement;
        element.style.left = this.item.refs.x + 'px';
        element.style.top = this.item.refs.y + 'px';
        element.style.width = this.item.refs.width + 'px';
        element.style.height = this.ganttRef.styles.barHeight + 'px';
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
