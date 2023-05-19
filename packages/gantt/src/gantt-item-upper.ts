import { Input, ElementRef, Inject, TemplateRef, Directive, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { GanttItemInternal, GanttItemType } from './class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { rangeHeight } from './gantt.styles';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';

@Directive()
export abstract class GanttItemUpper implements OnChanges, OnInit, OnDestroy {
    @Input() template: TemplateRef<any>;

    @Input() item: GanttItemInternal;

    public firstChange = true;

    public unsubscribe$ = new Subject<void>();

    public refsUnsubscribe$ = new Subject<void>();

    constructor(protected elementRef: ElementRef<HTMLElement>, @Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper) {}

    ngOnInit() {
        this.firstChange = false;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.firstChange) {
            this.itemChange(changes.item.currentValue);
        }
    }

    private itemChange(item: GanttItemInternal) {
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
        this.item = item;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.item.refs?.x + 'px';
        itemElement.style.top = this.item.refs?.y + 'px';
        itemElement.style.width = this.item.refs?.width + 'px';
        if (this.item.type === GanttItemType.bar) {
            itemElement.style.height = this.ganttUpper.styles.barHeight + 'px';
        } else if (this.item.type === GanttItemType.range) {
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
