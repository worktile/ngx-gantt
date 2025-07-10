import { inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { passiveListenerOptions } from './utils/passive-listeners';

@Injectable()
export class GanttSyncScrollService {
    private ngZone = inject(NgZone);

    private scrollGroupsMap = new Map<string, { elements: HTMLElement[]; destroy$: Subject<void> }>();

    constructor() {}

    registerScrollEvent(groupName: string, element: HTMLElement, direction: 'x' | 'y') {
        const group = this.scrollGroupsMap.get(groupName) || { elements: [], destroy$: new Subject<void>() };
        const elements = [...group.elements, element];
        const destroy$ = group.destroy$;
        this.scrollGroupsMap.set(groupName, {
            elements,
            destroy$: destroy$
        });
        const scrollObservers = elements.map((el) => fromEvent(el, 'scroll', passiveListenerOptions));

        destroy$.next();
        destroy$.complete();

        this.ngZone.runOutsideAngular(() =>
            merge(...scrollObservers)
                .pipe(takeUntil(destroy$))
                .subscribe((event) => {
                    elements.forEach((el) => {
                        if (direction === 'x') {
                            el.scrollLeft = (event.currentTarget as HTMLElement).scrollLeft;
                        } else {
                            el.scrollTop = (event.currentTarget as HTMLElement).scrollTop;
                        }
                    });
                })
        );
    }
}
