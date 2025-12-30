import { ElementRef, TemplateRef, Directive, OnDestroy, inject, input, effect } from '@angular/core';
import { GanttItemInternal, GanttItemType } from './class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { rangeHeight } from './gantt.styles';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';

@Directive()
export abstract class GanttItemUpper implements OnDestroy {
    protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    protected ganttUpper = inject<GanttUpper>(GANTT_UPPER_TOKEN);

    readonly template = input<TemplateRef<any>>();

    readonly item = input<GanttItemInternal>();

    public firstChange = true;

    public unsubscribe$ = new Subject<void>();

    public refsUnsubscribe$ = new Subject<void>();

    constructor() {
        effect(() => {
            this.itemChange();
        });
    }

    private itemChange() {
        if (this.firstChange) {
            this.firstChange = false;
            this.item()
                .refs$.pipe(takeUntil(this.refsUnsubscribe$))
                .subscribe(() => {
                    this.setPositions();
                });
        } else {
            this.refsUnsubscribe$.next();
            this.refsUnsubscribe$.complete();
            this.refsUnsubscribe$ = new Subject<void>();
            this.item()
                .refs$.pipe(takeUntil(this.refsUnsubscribe$))
                .subscribe(() => {
                    this.setPositions();
                });
        }
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        const item = this.item();
        itemElement.style.left = item.refs?.x + 'px';
        itemElement.style.top = item.refs?.y + 'px';
        itemElement.style.width = item.refs?.width + 'px';
        if (item.type === GanttItemType.bar) {
            itemElement.style.height = this.ganttUpper.styles().barHeight + 'px';
        } else if (item.type === GanttItemType.range) {
            itemElement.style.height = rangeHeight + 'px';
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
    }
}
