import {
    Input,
    TemplateRef,
    Output,
    EventEmitter,
    ContentChild,
    ElementRef,
    HostBinding,
    ChangeDetectorRef,
    NgZone,
    SimpleChanges
} from '@angular/core';
import {
    GanttItem,
    GanttGroup,
    GanttViewType,
    GanttLoadOnScrollEvent,
    GanttDragEvent,
    GanttGroupInternal,
    GanttItemInternal
} from './class';
import { GanttView, GanttViewOptions } from './views/view';
import { createViewFactory } from './views/factory';
import { GanttDate } from './utils/date';
import { GanttStyles, defaultStyles } from './gantt.styles';
import { GanttDomService, ScrollDirection } from './gantt-dom.service';
import { takeUntil, take } from 'rxjs/operators';
import { GanttDragContainer } from './gantt-drag-container';
import { Subject } from 'rxjs';

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

    abstract computeRefs(): void;

    constructor(
        protected elementRef: ElementRef<HTMLElement>,
        protected cdr: ChangeDetectorRef,
        protected ngZone: NgZone,
        protected dom: GanttDomService,
        protected dragContainer: GanttDragContainer
    ) {}

    onInit() {
        this.styles = Object.assign({}, defaultStyles, this.styles);
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.firstChange = false;

        this.onStable().subscribe(() => {
            this.dom.initialize(this.elementRef);
            this.setupViewScroll();
        });

        this.view.start$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeRefs();
        });

        this.dragContainer.dragStarted.subscribe((event) => {
            this.dragStarted.emit(event);
        });
        this.dragContainer.dragEnded.subscribe((event) => {
            this.dragEnded.emit(event);
            this.computeRefs();
        });
    }

    onChanges(changes: SimpleChanges) {
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.createView();
                this.computeRefs();
                this.onStable().subscribe(() => {
                    this.scrollToToday();
                });
            }
            if (changes.items && changes.groups) {
                this.setupGroups();
                this.setupItems();
                this.computeRefs();
            }
        }
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
        this.view = createViewFactory(this.viewType, viewDate.start, viewDate.end, this.viewOptions);
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
            end: new GanttDate(end)
        };
    }

    private setupViewScroll() {
        if (this.disabledLoadOnScroll) {
            return;
        }
        this.dom
            .getViewerScroll()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                if (event.direction === ScrollDirection.LEFT) {
                    const dates = this.view.addStartDate();
                    if (dates) {
                        event.target.scrollLeft += this.view.getDateRangeWidth(dates.start, dates.end);
                        this.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() });
                        this.cdr.detectChanges();
                    }
                }
                if (event.direction === ScrollDirection.RIGHT) {
                    const dates = this.view.addEndDate();
                    if (dates) {
                        this.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() });
                        this.cdr.detectChanges();
                    }
                }
            });
    }

    private onStable() {
        return this.ngZone.onStable.pipe(take(1));
    }

    private scrollToToday() {}
}
