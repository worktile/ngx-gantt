import {
    Component,
    HostBinding,
    TemplateRef,
    QueryList,
    Input,
    OnInit,
    ViewChild,
    ElementRef,
    OnChanges,
    SimpleChanges,
    Inject,
    Output,
    EventEmitter
} from '@angular/core';
import { GanttItemInternal, GanttGroupInternal, GanttSelectedEvent } from '../../class';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';
// import { defaultColumnWidth, minColumnWidth } from '../../gantt.component';
import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttAbstractComponent, GANTT_ABSTRACT_TOKEN } from '../../gantt-abstract';
import { GanttUpper, GANTT_UPPER_TOKEN } from 'ngx-gantt';

export const defaultColumnWidth = 100;
export const minColumnWidth = 80;

interface DragFixedConfig {
    target: HTMLElement;
    originWidth: number;
    movedWidth: number;
    minWidth: number;
}
@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit, OnChanges {
    public columnList: QueryList<NgxGanttTableColumnComponent>;

    public dragStartLeft: number;

    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
        });
        this.columnList = columns;
    }

    @Input() groupTemplate: TemplateRef<any>;

    @Input() emptyTemplate: TemplateRef<any>;

    @Input() rowBeforeTemplate: TemplateRef<any>;

    @Input() rowAfterTemplate: TemplateRef<any>;

    @Output() itemClick = new EventEmitter<GanttSelectedEvent>();

    @ViewChild('dragLine', { static: true }) draglineElementRef: ElementRef<HTMLElement>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    @HostBinding('class.gantt-table-empty') ganttTableEmptyClass = false;

    constructor(
        @Inject(GANTT_ABSTRACT_TOKEN) public gantt: GanttAbstractComponent,
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private elementRef: ElementRef
    ) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.groups.currentValue?.length && !changes.items.currentValue?.length) {
            this.ganttTableEmptyClass = true;
        } else {
            this.ganttTableEmptyClass = false;
        }
    }

    private dragFixed(config: DragFixedConfig) {
        if (config.movedWidth < config.minWidth) {
            config.target.style.transform = `translate3d(${config.minWidth - config.originWidth}px, 0, 0)`;
        }
    }

    expandGroup(group: GanttGroupInternal) {
        this.gantt.expandGroup(group);
    }

    expandChildren(event: MouseEvent, item: GanttItemInternal) {
        event.stopPropagation();
        this.gantt.expandChildren(item);
    }

    dragStarted(event: CdkDragStart) {
        const target = event.source.element.nativeElement;
        this.dragStartLeft = target.getBoundingClientRect().left;
    }

    dragMoved(event: CdkDragMove, column?: NgxGanttTableColumnComponent) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;

        let originWidth: number;
        let movedWidth: number;
        let minWidth: number;
        if (column) {
            originWidth = parseInt(column.columnWidth, 10);
            movedWidth = originWidth + (left - this.dragStartLeft);
            minWidth = minColumnWidth;
        } else {
            originWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
            movedWidth = originWidth + (left - this.dragStartLeft);
            minWidth = minColumnWidth * this.columnList.length;
        }

        this.dragFixed({
            target,
            originWidth,
            movedWidth,
            minWidth
        });

        this.showAuxiliaryLine(event);
    }

    columnDragEnded(event: CdkDragEnd, column: NgxGanttTableColumnComponent) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const width = parseInt(column.columnWidth, 10) + (left - this.dragStartLeft);
        const columnWidth = Math.max(width || 0, minColumnWidth);
        column.columnWidth = coerceCssPixelValue(columnWidth);
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columnList });
        }

        this.hideAuxiliaryLine();
        event.source.reset();
    }

    tableDragEnded(event: CdkDragEnd) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const tableWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        const dragWidth = left - this.dragStartLeft;
        this.columnList.forEach((column) => {
            const lastColumnWidth = parseInt(column.columnWidth, 10);
            const distributeWidth = parseInt(String(dragWidth * (lastColumnWidth / tableWidth)), 10);
            const columnWidth = Math.max(lastColumnWidth + distributeWidth || 0, minColumnWidth);
            column.columnWidth = coerceCssPixelValue(columnWidth);
        });

        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columnList });
        }

        this.hideAuxiliaryLine();
        event.source.reset();
    }

    private showAuxiliaryLine(event: CdkDragMove) {
        const tableRect = this.elementRef.nativeElement.getBoundingClientRect();
        const targetRect = event.source.element.nativeElement.getBoundingClientRect();
        const distance = { x: targetRect.left - tableRect.left, y: targetRect.top - tableRect.top };
        this.draglineElementRef.nativeElement.style.left = `${distance.x}px`;
        this.draglineElementRef.nativeElement.style.display = 'block';
    }

    private hideAuxiliaryLine() {
        this.draglineElementRef.nativeElement.style.display = 'none';
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }
}
