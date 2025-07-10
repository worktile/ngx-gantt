import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { GanttSyncScrollService } from '../gantt-sync-scroll.service';
@Directive({
    selector: '[syncScrollX]',
    standalone: true
})
export class GanttSyncScrollXDirective implements OnInit {
    readonly syncScrollX = input<string>();

    private elementRef = inject(ElementRef<HTMLElement>);

    private syncScrollService = inject(GanttSyncScrollService);

    constructor() {}

    ngOnInit() {
        this.syncScrollService.registerScrollEvent(this.syncScrollX(), this.elementRef.nativeElement, 'x');
    }
}

@Directive({
    selector: '[syncScrollY]',
    standalone: true
})
export class GanttSyncScrollYDirective implements OnInit {
    readonly syncScrollY = input<string>();

    private syncScrollService = inject(GanttSyncScrollService);

    private elementRef = inject(ElementRef<HTMLElement>);

    constructor() {}

    ngOnInit() {
        this.syncScrollService.registerScrollEvent(this.syncScrollY(), this.elementRef.nativeElement, 'y');
    }
}
