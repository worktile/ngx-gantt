import { GanttView } from '../views/view';
import { GanttOptions, getCellHeight } from '../gantt.options';
import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';

interface GroupPositions {
    x: number;
    y: number;
}

export interface GanttItem<T = unknown> {
    id: string;
    start?: number;
    end?: number;
    group_id?: string;
    links: string[];
    color?: string;
    draggable?: boolean;
    linkable?: boolean;
    children?: GanttItem[];
    origin?: T;
}

export class GanttItemInternal {
    id: string;
    start: GanttDate;
    end: GanttDate;
    links: string[];
    origin: GanttItem;
    refs$ = new BehaviorSubject<{ width: number; x?: number; y?: number }>(null);
    get refs() {
        return this.refs$.getValue();
    }

    constructor(item: GanttItem, private view: GanttView, private options: GanttOptions) {
        this.origin = item;
        this.id = this.origin.id;
        this.links = this.origin.links || [];
        this.start = new GanttDate(item.start);
        this.end = new GanttDate(item.end);
    }

    private computeX(groupX: number) {
        return groupX + this.view.getXPointByDate(this.start);
    }

    private computeY(groupY: number, indexOfGroupItems: number) {
        return (
            groupY +
            indexOfGroupItems * getCellHeight(this.options) +
            this.options.barPadding +
            this.options.groupPadding
        );
    }

    private computeWidth() {
        return this.view.getDateRangeWidth(this.start, this.end);
    }

    public computeRefs(groupPositions: GroupPositions, indexOfGroupItems?: number) {
        this.refs$.next({
            width: this.computeWidth(),
            x: this.computeX(groupPositions.x),
            y: this.computeY(groupPositions.y, indexOfGroupItems),
        });
    }

    public updateDate(start: GanttDate, end: GanttDate) {
        this.start = start.startOfDay();
        this.end = end.endOfDay();
        this.origin.start = this.start.getUnixTime();
        this.origin.end = this.end.getUnixTime();
    }
}
