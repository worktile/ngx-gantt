import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, inject, input, NgZone, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { passiveListenerOptions } from '../utils/passive-listeners';

@Directive({
    selector: '[syncScroll]',
    standalone: true
})
export class GanttSyncScrollDirective implements OnInit {
    readonly syncScroll = input<{ x: string; y: string }>();

    private document = inject(DOCUMENT);

    private destroyRef$ = inject(DestroyRef);

    private element: HTMLElement;

    private elementRef = inject(ElementRef<HTMLElement>);

    private ngZone = inject(NgZone);

    constructor() {}

    ngOnInit() {
        this.element = this.elementRef.nativeElement;
        const { x, y } = this.syncScroll();
        if (x) {
            this.element.setAttribute('sync-scroll-x', x);
        }
        if (y) {
            this.element.setAttribute('sync-scroll-y', y);
        }
        this.ngZone.runOutsideAngular(() =>
            fromEvent(this.element, 'scroll', passiveListenerOptions)
                .pipe(takeUntilDestroyed(this.destroyRef$))
                .subscribe(() => this.onScroll())
        );
    }

    private onScroll() {
        const { x, y } = this.syncScroll();

        // 横向同步处理
        if (x) {
            const xElements = this.document.querySelectorAll(`[sync-scroll-x="${x}"]`);
            xElements.forEach((el) => {
                if (el !== this.element) {
                    el.scrollLeft = this.element.scrollLeft;
                }
            });
        }

        // 纵向同步处理
        if (y) {
            const yElements = this.document.querySelectorAll(`[sync-scroll-y="${y}"]`);
            yElements.forEach((el) => {
                if (el !== this.element) {
                    el.scrollTop = this.element.scrollTop;
                }
            });
        }
    }
}
