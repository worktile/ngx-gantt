import { inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { passiveListenerOptions } from './utils/passive-listeners';

@Injectable()
export class GanttSyncScrollService {
    private ngZone = inject(NgZone);

    private scrollGroupsMap = new Map<string, { elements: HTMLElement[]; direction: 'x' | 'y'; destroy$: Subject<void> }>();

    constructor() {}

    registerScrollEvent(groupName: string, element: HTMLElement, direction: 'x' | 'y') {
        const group = this.scrollGroupsMap.get(groupName) || { elements: [], destroy$: new Subject<void>(), direction };
        group.elements.push(element);
        this.scrollGroupsMap.set(groupName, group);
        this.monitorScrollChange(group);
    }

    unregisterScrollEvent(groupName: string, element: HTMLElement) {
        const group = this.scrollGroupsMap.get(groupName);
        if (group) {
            group.elements = group.elements.filter((el) => el !== element);
            if (!group.elements.length) {
                this.scrollGroupsMap.delete(groupName);
            } else {
                this.scrollGroupsMap.set(groupName, group);
            }
            this.monitorScrollChange(group);
        }
    }

    private monitorScrollChange(group: { elements: HTMLElement[]; destroy$: Subject<void>; direction: 'x' | 'y' }) {
        const { elements, destroy$, direction } = group;
        destroy$.next();
        destroy$.complete();
        if (elements.length) {
            const scrollObservers = elements.map((el) => fromEvent(el, 'scroll', passiveListenerOptions));
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
}
