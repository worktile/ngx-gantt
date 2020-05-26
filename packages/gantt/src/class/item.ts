import { GanttView } from '../views/view';
import { GanttOptions, getCellHeight } from '../gantt.options';
import { GanttDate } from '../utils/date';
import { BehaviorSubject } from 'rxjs';

interface GroupPositions {
    x: number;
    y: number;
}

export interface GanttItemInfo {
    _id: string;
    start: number;
    end: number;
    group_id: string;
    dependencies?: string[];
    children?: GanttItemInfo[];
    [key: string]: any;
}

export class GanttItemInternal {
    _id: string;
    start: GanttDate;
    end: GanttDate;
    dependencies: string[];
    origin: GanttItemInfo;
    refs$ = new BehaviorSubject<{ width: number; x?: number; y?: number }>(null);
    get refs() {
        return this.refs$.getValue();
    }

    constructor(item: GanttItemInfo, private view: GanttView, private options: GanttOptions) {
        this.origin = item;
        this._id = this.origin._id;
        this.dependencies = this.origin.dependencies || [];
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

    public addDependency(dependencyId: string) {
        this.dependencies = [...this.dependencies, dependencyId];
        this.origin.dependencies = this.dependencies;
    }

    public deleteDependency(dependencyId: string) {
        this.dependencies = this.dependencies.filter((id) => id !== dependencyId);
        this.origin.dependencies = this.dependencies;
    }
}
