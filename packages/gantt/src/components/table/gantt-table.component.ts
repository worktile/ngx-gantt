import { Component, HostBinding, TemplateRef, QueryList, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../../class';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';
import { NgxGanttComponent } from '../../gantt.component';
import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

const DEFAULT_MIN_WIDTH = 100;
@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit {
    public columnList: QueryList<NgxGanttTableColumnComponent>;

    public dragStartLeft: number;

    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(DEFAULT_MIN_WIDTH);
            }
        });
        this.columnList = columns;
    }

    @Input() groupTemplate: TemplateRef<any>;

    @ViewChild('dragLine', { static: true }) draglineElementRef: ElementRef<HTMLElement>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor(public gantt: NgxGanttComponent, private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

    ngOnInit() {}

    expandGroup(group: GanttGroupInternal) {
        this.gantt.expandGroup(group);
    }

    expandChildren(item: GanttItemInternal) {
        this.gantt.expandChildren(item);
    }

    dragStarted(event: CdkDragStart) {
        const target = event.source.element.nativeElement;
        this.dragStartLeft = target.getBoundingClientRect().left;
    }

    dragEnded(event: CdkDragEnd, column: NgxGanttTableColumnComponent) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const width = parseInt(column.columnWidth, 10) + (left - this.dragStartLeft);
        const columnWidth = Math.max(width || 0, DEFAULT_MIN_WIDTH);
        column.columnWidth = coerceCssPixelValue(columnWidth);
        column.setWidth(columnWidth);
        this.hideAuxiliaryLine();
        event.source.reset();
    }

    dragMoved(event: CdkDragMove) {
        this.showAuxiliaryLine(event);
    }

    private showAuxiliaryLine(event: CdkDragMove) {
        const tableRect = this.elementRef.nativeElement.getBoundingClientRect();
        const targetRect = event.source.element.nativeElement.getBoundingClientRect();
        const distance = { x: targetRect.left - tableRect.left, y: targetRect.top - tableRect.top };
        this.draglineElementRef.nativeElement.style.left = `${distance.x}px`;
        this.draglineElementRef.nativeElement.style.top = `${distance.y}px`;
        this.draglineElementRef.nativeElement.style.display = 'block';
    }

    private hideAuxiliaryLine() {
        this.draglineElementRef.nativeElement.style.display = 'none';
    }
}
