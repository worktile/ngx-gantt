import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';
import { GanttSyncScrollService } from '../gantt-sync-scroll.service';
@Directive({
    selector: '[syncScrollX]'
})
export class GanttSyncScrollXDirective implements OnInit, OnDestroy {
    readonly syncScrollX = input<string>();

    private elementRef = inject(ElementRef<HTMLElement>);

    private syncScrollService = inject(GanttSyncScrollService);

    constructor() {}

    ngOnInit() {
        this.syncScrollService.registerScrollEvent(this.syncScrollX(), this.elementRef.nativeElement, 'x');
    }

    ngOnDestroy() {
        this.syncScrollService.unregisterScrollEvent(this.syncScrollX(), this.elementRef.nativeElement);
    }
}

@Directive({
    selector: '[syncScrollY]'
})
export class GanttSyncScrollYDirective implements OnInit, OnDestroy {
    readonly syncScrollY = input<string>();

    private syncScrollService = inject(GanttSyncScrollService);

    private elementRef = inject(ElementRef<HTMLElement>);

    constructor() {}

    ngOnInit() {
        this.syncScrollService.registerScrollEvent(this.syncScrollY(), this.elementRef.nativeElement, 'y');
    }

    ngOnDestroy() {
        this.syncScrollService.unregisterScrollEvent(this.syncScrollY(), this.elementRef.nativeElement);
    }
}
