import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    HostBinding,
    AfterViewInit,
    ContentChild,
    TemplateRef,
    OnChanges,
    ChangeDetectionStrategy,
    SimpleChanges,
    OnDestroy,
    Output,
    EventEmitter,
} from '@angular/core';
import { GanttView } from './views/view';
import { GanttOptions } from './gantt.options';
import { GanttViewType } from './class/view-types.enum';
import { GanttItemInfo, GanttItemInternal } from './class/item';
import { GanttGroupInfo, GanttGroupInternal } from './class/group';
import { Subject } from 'rxjs';
import { GanttDragEvent, GanttLoadOnScrollEvent, GanttDependencyEvent, GanttDependencyDragEvent } from './class/event';
import { GANTT_REF_TOKEN, GanttRef } from './gantt-ref';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: GanttComponent,
        },
    ],
})
export class GanttComponent implements GanttRef, OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() items: GanttItemInfo[] = [];

    @Input() groups: GanttGroupInfo[] = [];

    @Input() viewType: GanttViewType = GanttViewType.month;

    @Input() showSide = true;

    @Input() sideTitle: string | TemplateRef<any>;

    @Input() start: number;

    @Input() end: number;

    @Input() draggable: boolean;

    @Input() dependable: boolean;

    @Input() options: GanttOptions;

    @Input() disabledLoadOnScroll: boolean;

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    @Output() dragStarted = new EventEmitter<GanttDragEvent>();

    @Output() dragEnded = new EventEmitter<GanttDragEvent>();

    @Output() dependencyDragStarted = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyDragEnded = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyClick = new EventEmitter<GanttDependencyEvent>();

    @ContentChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any>;

    @ContentChild('groupTemplate', { static: true }) groupTemplate: TemplateRef<any>;

    @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

    @HostBinding('class.ngx-gantt') ganttClass = true;

    public view: GanttView;

    public get element() {
        return this.elementRef.nativeElement;
    }

    private firstChange = true;

    private unsubscribe$ = new Subject();

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {}

    ngAfterViewInit() {}

    ngOnChanges(changes: SimpleChanges) {}

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item._id || index;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
