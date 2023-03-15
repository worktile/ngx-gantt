import { Subject, takeUntil } from 'rxjs';
import {
    Component,
    HostBinding,
    TemplateRef,
    QueryList,
    Input,
    OnInit,
    Inject,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import { GanttItemInternal, GanttGroupInternal, GanttSelectedEvent } from '../../../class';
import { NgxGanttTableColumnComponent } from '../../../table/gantt-column.component';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttAbstractComponent, GANTT_ABSTRACT_TOKEN } from '../../../gantt-abstract';
import { defaultColumnWidth } from '../header/gantt-table-header.component';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../../gantt-upper';
@Component({
    selector: 'gantt-table-body',
    templateUrl: './gantt-table-body.component.html'
})
export class GanttTableBodyComponent implements OnInit, OnDestroy {
    public hasGroup: boolean;

    public flatData: (GanttGroupInternal | GanttItemInternal)[];

    public hasShowExpandIcon = false;

    private unsubscribe$ = new Subject<void>();

    @Input() set tempData(data: (GanttGroupInternal | GanttItemInternal)[]) {
        const firstData = data[0];
        if (firstData && firstData.hasOwnProperty('items')) {
            this.hasGroup = true;
        }
        this.ganttTableEmptyClass = data?.length ? false : true;
        this.flatData = data;
    }

    @Input() columns: QueryList<NgxGanttTableColumnComponent>;

    @Input() groupTemplate: TemplateRef<any>;

    @Input() emptyTemplate: TemplateRef<any>;

    @Input() rowBeforeTemplate: TemplateRef<any>;

    @Input() rowAfterTemplate: TemplateRef<any>;

    @Output() itemClick = new EventEmitter<GanttSelectedEvent>();

    @HostBinding('class.gantt-table-body') ganttTableClass = true;

    @HostBinding('class.gantt-table-empty') ganttTableEmptyClass = false;

    constructor(
        @Inject(GANTT_ABSTRACT_TOKEN) public gantt: GanttAbstractComponent,
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.columnsChange();
        this.columns.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.columnsChange();
            this.cdr.detectChanges();
        });
    }

    private columnsChange() {
        this.hasShowExpandIcon = false;
        this.columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
            if (column.showExpandIcon) {
                this.hasShowExpandIcon = true;
            }
        });
    }

    expandGroup(group: GanttGroupInternal) {
        this.gantt.expandGroup(group);
    }

    expandChildren(event: MouseEvent, item: GanttItemInternal) {
        event.stopPropagation();
        this.gantt.expandChildren(item);
    }

    trackBy(item: GanttGroupInternal | GanttItemInternal, index: number) {
        return item.id || index;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
