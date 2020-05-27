import {
    Input,
    TemplateRef,
    Output,
    EventEmitter,
    ContentChild,
    ElementRef,
    HostBinding,
    ContentChildren,
    QueryList,
} from '@angular/core';
import {
    GanttItem,
    GanttGroup,
    GanttViewType,
    GanttLoadOnScrollEvent,
    GanttDragEvent,
    GanttGroupInternal,
    GanttItemInternal,
} from './class';
import { GanttView, GanttViewOptions } from './views/view';
import { createViewFactory } from './views/factory';
import { GanttDate } from './utils/date';
import { Subject, fromEvent } from 'rxjs';
import { GanttTableColumnComponent } from './table/column/column.component';

const defaultStyles = {
    lineHeight: 50,
    barHeight: 25,
};

type GanttStyles = typeof defaultStyles;

export abstract class GanttUpper {
    @Input('items') originItems: GanttItem[] = [];

    @Input('groups') originGroups: GanttGroup[] = [];

    @Input() viewType: GanttViewType = GanttViewType.month;

    @Input() start: number;

    @Input() end: number;

    @Input() draggable: boolean;

    @Input() styles: GanttStyles;

    @Input() viewOptions: GanttViewOptions;

    @Input() disabledLoadOnScroll: boolean;

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    @Output() dragStarted = new EventEmitter<GanttDragEvent>();

    @Output() dragEnded = new EventEmitter<GanttDragEvent>();

    @ContentChild('bar', { static: true }) barTemplate: TemplateRef<any>;

    @ContentChild('group', { static: true }) groupTemplate: TemplateRef<any>;

    @ContentChildren(GanttTableColumnComponent) columns: QueryList<GanttTableColumnComponent>;

    public view: GanttView;

    public items: GanttItemInternal[] = [];

    public groups: GanttGroupInternal[] = [];

    private groupsMap: { [key: string]: GanttGroupInternal };

    public get element() {
        return this.elementRef.nativeElement;
    }

    public firstChange = true;

    private unsubscribe$ = new Subject();

    @HostBinding('class.gantt') ganttClass = true;

    constructor(protected elementRef: ElementRef<HTMLElement>) {}

    onInit() {
        this.styles = Object.assign({}, defaultStyles, this.styles);
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.firstChange = false;
        // sync scroll

        const viewer = this.element.querySelector('.gantt-viewer-container');
        fromEvent(viewer, 'scroll').subscribe(() => {
            this.element.querySelector('.gantt-calendar-overlay').scrollLeft = viewer.scrollLeft;
        });
    }

    onDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }

    private createView() {
        const viewDate = this.getViewDate();
        this.view = createViewFactory(this.viewType, viewDate.start, viewDate.end, this.styles);
    }

    private setupGroups() {
        this.groupsMap = {};
        this.groups = [];
        this.originGroups.forEach((origin) => {
            const group = new GanttGroupInternal(origin);
            this.groupsMap[group.id] = group;
            this.groups.push(group);
        });
    }

    private setupItems() {
        this.items = [];
        if (this.groups.length > 0) {
            this.originItems.forEach((origin) => {
                const group = this.groupsMap[origin.group_id];
                group.items.push(new GanttItemInternal(origin));
            });
        } else {
            this.originItems.forEach((origin) => {
                this.items.push(new GanttItemInternal(origin));
            });
        }
    }

    private getViewDate() {
        let start = this.start;
        let end = this.end;
        this.originItems.forEach((item) => {
            start = start ? Math.min(start, item.start) : item.start;
            end = end ? Math.max(end, item.end) : item.end;
        });
        return {
            start: new GanttDate(start),
            end: new GanttDate(end),
        };
    }
}
