import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    inject
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GANTT_ABSTRACT_TOKEN, GanttAbstractComponent } from '../../../gantt-abstract';
import { NgxGanttTableColumnComponent } from '../../../table/gantt-column.component';
import { setStyleWithVendorPrefix } from '../../../utils/set-style-with-vendor-prefix';
import { GanttSyncScrollXDirective } from '../../../directives/sync-scroll.directive';
export const defaultColumnWidth = 100;
export const minColumnWidth = 80;
interface DragFixedConfig {
    target: HTMLElement;
    originWidth: number;
    movedWidth: number;
    minWidth: number;
}
@Component({
    selector: 'gantt-table-header',
    templateUrl: './gantt-table-header.component.html',
    imports: [NgTemplateOutlet, CdkDrag, GanttSyncScrollXDirective]
})
export class GanttTableHeaderComponent implements OnInit, OnDestroy {
    private elementRef = inject(ElementRef);
    gantt = inject<GanttAbstractComponent>(GANTT_ABSTRACT_TOKEN);
    private cdr = inject(ChangeDetectorRef);

    public dragStartLeft: number;

    public tableWidth = 0;

    public customWidth: number;

    private unsubscribe$ = new Subject<void>();

    @Input() columns: QueryList<NgxGanttTableColumnComponent>;

    @ViewChild('resizeLine', { static: true }) resizeLineElementRef: ElementRef<HTMLElement>;

    @HostBinding('class') className = `gantt-table-header `;

    @HostBinding('style.height')
    get height() {
        return this.gantt.styles.headerHeight + 'px';
    }

    @HostBinding('style.line-height')
    get lineHeight() {
        return this.gantt.styles.headerHeight + 'px';
    }

    constructor() {}

    ngOnInit() {
        this.columnsChange();
        this.columns.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            if (!this.gantt?.table?.width && !this.customWidth) {
                this.columnsChange();
            }
        });
    }

    private columnsChange() {
        let tableWidth = 0;
        this.columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
            tableWidth += Number(column.columnWidth.replace('px', ''));
        });
        this.tableWidth = this.gantt?.table?.width ?? this.customWidth ?? this.getCalcWidth(tableWidth);
        this.gantt.cdr.detectChanges();
    }

    private dragFixed(config: DragFixedConfig) {
        if (config.movedWidth < config.minWidth) {
            setStyleWithVendorPrefix({
                element: config.target,
                style: 'transform',
                value: `translate3d(${config.minWidth - config.originWidth}px, 0, 0)`
            });
        }
    }

    onResizeStarted(event: CdkDragStart) {
        const target = event.source.element.nativeElement;
        this.dragStartLeft = target.getBoundingClientRect().left;
    }

    onResizeMoved(event: CdkDragMove, column?: NgxGanttTableColumnComponent) {
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
            minWidth = minColumnWidth * this.columns.length;
        }

        this.dragFixed({
            target,
            originWidth,
            movedWidth,
            minWidth
        });

        this.showAuxiliaryLine(event);
    }

    onResizeEnded(event: CdkDragEnd, column: NgxGanttTableColumnComponent) {
        const beforeWidth = parseInt(column.columnWidth, 10);
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const width = parseInt(column.columnWidth, 10) + (left - this.dragStartLeft);
        const columnWidth = Math.max(width || 0, minColumnWidth);
        column.columnWidth = coerceCssPixelValue(columnWidth);
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columns });
        }
        this.tableWidth = this.gantt?.table?.width ?? this.customWidth ?? this.getCalcWidth(this.tableWidth - beforeWidth + columnWidth);
        this.hideAuxiliaryLine();
        event.source.reset();
    }

    onOverallResizeEnded(event: CdkDragEnd) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const tableWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        const dragWidth = left - this.dragStartLeft;
        this.tableWidth = this.getCalcWidth(parseInt(tableWidth + dragWidth, 10));
        this.customWidth = this.tableWidth;
        if (this.gantt.table) {
            this.gantt.table.resizeChange.emit(this.tableWidth);
        }
        this.hideAuxiliaryLine();
        event.source.reset();
    }

    private showAuxiliaryLine(event: CdkDragMove) {
        const tableRect = this.elementRef.nativeElement.getBoundingClientRect();
        const targetRect = event.source.element.nativeElement.getBoundingClientRect();
        const distance = { x: targetRect.left - tableRect.left, y: targetRect.top - tableRect.top };
        this.resizeLineElementRef.nativeElement.style.left = `${distance.x}px`;
        this.resizeLineElementRef.nativeElement.style.display = 'block';
    }

    private hideAuxiliaryLine() {
        this.resizeLineElementRef.nativeElement.style.display = 'none';
    }

    private getCalcWidth(width: number): number {
        return this.gantt.table?.maxWidth && width > this.gantt.table?.maxWidth ? this.gantt.table?.maxWidth : width;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
