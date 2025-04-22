import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    input,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild
} from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { coerceBooleanProperty } from 'ngx-tethys/util';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { GANTT_ABSTRACT_TOKEN, GanttAbstractComponent } from '../../../gantt-abstract';
import { NgxGanttTableColumnComponent } from '../../../table/gantt-column.component';
import { setStyleWithVendorPrefix } from '../../../utils/set-style-with-vendor-prefix';
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
    imports: [NgTemplateOutlet, CdkDrag, NgClass]
})
export class GanttTableHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    public dragStartLeft: number;

    public tableWidth = 0;

    private unsubscribe$ = new Subject<void>();

    @Input() columns: QueryList<NgxGanttTableColumnComponent>;

    @Input() fixedTableWidth;

    needFillColumn = input(false, { transform: coerceBooleanProperty });

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

    @ViewChild('headerContainer', { read: ElementRef }) headerContainer: ElementRef<HTMLElement>;

    constructor(
        private elementRef: ElementRef,
        @Inject(GANTT_ABSTRACT_TOKEN) public gantt: GanttAbstractComponent,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.columnsChange();
        this.columns.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.columnsChange();
            this.gantt.cdr.detectChanges();
        });
    }

    ngAfterViewInit() {
        this.syncTableScroll();
    }

    private syncTableScroll() {
        if (this.headerContainer) {
            this.ngZone.runOutsideAngular(() => {
                fromEvent(this.headerContainer.nativeElement, 'scroll')
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((event: Event) => {
                        const target = event.target as HTMLElement;
                        if (this.gantt['mainContainer']) {
                            this.gantt['mainContainer'].nativeElement['scrollLeft'] = target.scrollLeft;
                        }
                    });
            });
        }
    }

    private columnsChange() {
        let tableWidth = 0;
        this.columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
            tableWidth += Number(column.columnWidth.replace('px', ''));
        });
        this.tableWidth = tableWidth;
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

        this.tableWidth = this.tableWidth - beforeWidth + columnWidth;
        this.hideAuxiliaryLine();
        event.source.reset();
        if (this.fixedTableWidth) {
            const tableBody = (this.gantt as SafeAny)?.tableBody;
            tableBody?.resizeObserver.observe(tableBody.element);
        }
    }

    onOverallResizeEnded(event: CdkDragEnd) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const tableWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        const dragWidth = left - this.dragStartLeft;
        let tempWidth = 0;
        this.columns.forEach((column) => {
            const lastColumnWidth = parseInt(column.columnWidth, 10);
            const distributeWidth = parseInt(String(dragWidth * (lastColumnWidth / tableWidth)), 10);
            const columnWidth = Math.max(lastColumnWidth + distributeWidth || 0, minColumnWidth);
            column.columnWidth = coerceCssPixelValue(columnWidth);
            tempWidth += columnWidth;
        });
        this.tableWidth = tempWidth;
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columns });
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

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
