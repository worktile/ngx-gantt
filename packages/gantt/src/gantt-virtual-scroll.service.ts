import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, takeUntil } from 'rxjs/operators';
import { GanttGroupInternal, GanttItemInternal } from './class';
import { recursiveItems } from './utils/helpers';

@Injectable()
export class GanttVirtualScrollService {
    private ngUnsubscribe$ = new Subject();

    flatData$ = new BehaviorSubject<(GanttGroupInternal | GanttItemInternal)[]>([]);

    tempData$ = new BehaviorSubject<(GanttGroupInternal | GanttItemInternal)[]>([]);

    range$ = new BehaviorSubject<{ start: number; end: number }>(null);

    get range() {
        return this.range$.getValue();
    }

    get flatData() {
        return this.flatData$.getValue();
    }

    get tempData() {
        return this.tempData$.getValue();
    }

    get change() {
        return combineLatest([this.flatData$, this.tempData$]);
    }

    constructor() {}

    initialize() {
        this.range$.pipe(distinctUntilChanged(), skip(1), takeUntil(this.ngUnsubscribe$)).subscribe((range) => {
            const tempData = this.flatData.slice(this.range?.start, this.range?.end);
            this.tempData$.next([...tempData]);
        });
    }

    setRange(range: { start: number; end: number }) {
        this.range$.next(range);
    }

    buildVirtualFlatData(groups: GanttGroupInternal[], items: GanttItemInternal[]) {
        const virtualData = [];
        if (groups.length) {
            groups.forEach((group) => {
                virtualData.push(group);
                if (group.expanded) {
                    const groupsItems = recursiveItems(group.items, 0);
                    virtualData.push(...groupsItems);
                }
            });
        }

        if (items.length) {
            virtualData.push(...recursiveItems(items, 0));
        }
        this.flatData$.next([...virtualData]);
        if (this.range) {
            this.tempData$.next(this.flatData.slice(this.range?.start, this.range?.end));
        }
    }

    destroy() {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
