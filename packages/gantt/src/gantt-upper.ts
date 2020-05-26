import { Input, TemplateRef, Output, EventEmitter, ContentChild, HostBinding, ElementRef } from '@angular/core';
import { GanttItemInfo, GanttGroupInfo, GanttViewType, GanttLoadOnScrollEvent, GanttDragEvent } from './class';
import { GanttOptions } from './gantt.options';
import { GanttView } from './views/view';
import { createViewFactory } from './views/factory';
import { GanttDate } from './utils/date';
import { Subject } from 'rxjs';

export abstract class GanttUpper {
    @Input() items: GanttItemInfo[] = [];

    @Input() groups: GanttGroupInfo[] = [];

    @Input() viewType: GanttViewType = GanttViewType.month;

    @Input() showSide = true;

    @Input() sideTitle: string | TemplateRef<any>;

    @Input() start: number;

    @Input() end: number;

    @Input() draggable: boolean;

    @Input() options: GanttOptions;

    @Input() disabledLoadOnScroll: boolean;

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    @Output() dragStarted = new EventEmitter<GanttDragEvent>();

    @Output() dragEnded = new EventEmitter<GanttDragEvent>();

    @ContentChild('barTemplate', { static: true }) barTemplate: TemplateRef<any>;

    @ContentChild('groupTemplate', { static: true }) groupTemplate: TemplateRef<any>;

    public view: GanttView;

    public get element() {
        return this.elementRef.nativeElement;
    }

    public firstChange = true;

    private unsubscribe$ = new Subject();

    constructor(protected elementRef: ElementRef<HTMLElement>) {}

    onInit() {
        this.createView();
        this.firstChange = false;
    }

    onDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private createView() {
        const viewDate = this.getViewDate();
        this.view = createViewFactory(this.viewType, viewDate.start, viewDate.end, this.options);
    }

    private getViewDate() {
        let start = this.start;
        let end = this.end;
        this.items.forEach((item) => {
            start = start ? Math.min(start, item.start) : item.start;
            end = end ? Math.max(end, item.end) : item.end;
        });
        return {
            start: new GanttDate(start),
            end: new GanttDate(end),
        };
    }
}
