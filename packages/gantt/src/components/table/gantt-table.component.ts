import {
    Component,
    HostBinding,
    TemplateRef,
    QueryList,
    Input,
    ViewChild,
    ElementRef,
    OnChanges,
    SimpleChanges,
    Inject,
    Output,
    EventEmitter,
    ViewChildren,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import {
    GanttItemInternal,
    GanttGroupInternal,
    GanttSelectedEvent,
    GanttTableDragEnterPredicateContext,
    GanttTableDragDroppedEvent,
    GanttTableDropPosition
} from '../../class';
import { NgxGanttTableColumnComponent } from '../../table/gantt-column.component';
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { GanttAbstractComponent, GANTT_ABSTRACT_TOKEN } from '../../gantt-abstract';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { DOCUMENT } from '@angular/common';
import { debounceTime, filter, startWith, Subject, takeUntil } from 'rxjs';

export const defaultColumnWidth = 100;

export const minColumnWidth = 80;

@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input()
    set columns(columns: QueryList<NgxGanttTableColumnComponent>) {
        this.hasExpandIcon = false;
        columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
            if (column.showExpandIcon) {
                this.hasExpandIcon = true;
            }
        });
        this.columnList = columns;
    }

    @Input() groupTemplate: TemplateRef<any>;

    @Input() emptyTemplate: TemplateRef<any>;

    @Input() rowBeforeTemplate: TemplateRef<any>;

    @Input() rowAfterTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-table-draggable')
    @Input()
    draggable = false;

    @Input() dropEnterPredicate?: (context: GanttTableDragEnterPredicateContext) => boolean;

    @Output() dragDropped = new EventEmitter<GanttTableDragDroppedEvent>();

    @Output() itemClick = new EventEmitter<GanttSelectedEvent>();

    @ViewChild('resizeLine', { static: true }) resizeLineElementRef: ElementRef<HTMLElement>;

    @ViewChildren(CdkDrag<string>) cdkDrags: QueryList<CdkDrag<GanttItemInternal>>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    @HostBinding('class.gantt-table-empty') ganttTableEmptyClass = false;

    @HostBinding('class.gantt-table-dragging') ganttTableDragging = false;

    public columnList: QueryList<NgxGanttTableColumnComponent>;

    public dragStartLeft: number;

    public hasExpandIcon = false;

    private itemDragRefMap = new Map<HTMLElement, CdkDrag<GanttItemInternal>>();

    private itemDragMoved = new Subject<CdkDragMove>();

    private itemDropTarget: {
        position?: GanttTableDropPosition;
        id?: string;
    };

    private destroy$ = new Subject<void>();

    constructor(
        @Inject(GANTT_ABSTRACT_TOKEN) public gantt: GanttAbstractComponent,
        @Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper,
        private elementRef: ElementRef,
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngAfterViewInit(): void {
        // cdkDrag 变化时，缓存一个根据 Element 查找 DragRef 的 Map，方便在后续 Drag Move 时查找
        this.cdkDrags.changes
            .pipe(startWith(this.cdkDrags), takeUntil(this.destroy$))
            .subscribe((drags: QueryList<CdkDrag<GanttItemInternal>>) => {
                this.itemDragRefMap.clear();
                drags.forEach((drag) => {
                    if (drag.data) {
                        this.itemDragRefMap.set(drag.element.nativeElement, drag);
                    }
                });
            });

        this.itemDragMoved
            .pipe(
                debounceTime(30),
                filter((event: CdkDragMove) => event.source._dragRef.isDragging()),
                takeUntil(this.destroy$)
            )
            .subscribe((event) => {
                this.onItemDragMoved(event);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.groups.currentValue?.length && !changes.items.currentValue?.length) {
            this.ganttTableEmptyClass = true;
        } else {
            this.ganttTableEmptyClass = false;
        }
    }

    expandGroup(group: GanttGroupInternal) {
        this.gantt.expandGroup(group);
    }

    expandChildren(event: MouseEvent, item: GanttItemInternal) {
        event.stopPropagation();
        this.gantt.expandChildren(item);
    }

    onResizeStarted(event: CdkDragStart) {
        const target = event.source.element.nativeElement;
        this.dragStartLeft = target.getBoundingClientRect().left;
    }

    onResizeMoved(event: CdkDragMove, column?: NgxGanttTableColumnComponent) {
        // const target = event.source.element.nativeElement;
        // const left = target.getBoundingClientRect().left;
        // let originWidth: number;
        // let movedWidth: number;
        // let minWidth: number;
        // if (column) {
        //     originWidth = parseInt(column.columnWidth, 10);
        //     movedWidth = originWidth + (left - this.dragStartLeft);
        //     minWidth = minColumnWidth;
        // } else {
        //     originWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        //     movedWidth = originWidth + (left - this.dragStartLeft);
        //     minWidth = minColumnWidth * this.columnList.length;
        // }
        this.showResizePreviewLine(event);
    }

    onResizeEnded(event: CdkDragEnd, column: NgxGanttTableColumnComponent) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const width = parseInt(column.columnWidth, 10) + (left - this.dragStartLeft);
        const columnWidth = Math.max(width || 0, minColumnWidth);
        column.columnWidth = coerceCssPixelValue(columnWidth);
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columnList });
        }

        this.hideResizePreviewLine();
        event.source.reset();
    }

    onOverallResizeEnded(event: CdkDragEnd) {
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

        this.hideResizePreviewLine();
        event.source.reset();
    }

    onItemDragStarted(event: CdkDragStart<GanttItemInternal>) {
        this.ganttTableDragging = true;
    }

    emitItemDragMoved(event: CdkDragMove) {
        this.itemDragMoved.next(event);
    }

    onItemDragMoved(event: CdkDragMove<GanttItemInternal>) {
        let currentPointElement = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y) as HTMLElement;
        if (!currentPointElement) {
            this.cleanupDragArtifacts();
            return;
        }
        let targetElement = currentPointElement.classList.contains('gantt-table-item')
            ? currentPointElement
            : (currentPointElement.closest('.gantt-table-item') as HTMLElement);
        if (!targetElement) {
            this.cleanupDragArtifacts();
            return;
        }
        this.itemDropTarget = {
            id: this.itemDragRefMap.get(targetElement)?.data.id,
            position: this.getTargetPosition(targetElement, event)
        };

        if (this.dropEnterPredicate) {
            const targetDragRef = this.itemDragRefMap.get(targetElement);
            if (
                this.dropEnterPredicate({
                    source: event.source.data.origin,
                    sourceParentId: event.source.dropContainer.id,
                    target: targetDragRef.data.origin,
                    targetParentId: targetDragRef.dropContainer.id,
                    dropPosition: this.itemDropTarget.position
                })
            ) {
                this.showDropPositionPlaceholder(targetElement);
            } else {
                this.itemDropTarget = null;
            }
        } else {
            this.showDropPositionPlaceholder(targetElement);
        }
    }

    onItemDragEnded(event: CdkDragEnd<GanttItemInternal>) {
        this.ganttTableDragging = false;
    }

    onListDropped(event: CdkDragDrop<GanttItemInternal[], GanttItemInternal[], GanttItemInternal>) {
        if (!this.itemDropTarget) {
            return;
        }
        const targetDragRef = this.cdkDrags.find((item) => item.data?.id === this.itemDropTarget.id);
        const sourceItem = event.item.data;
        const sourceItemContainer = event.previousContainer.data;
        const targetItem = targetDragRef?.data;
        const targetItemContainer = targetDragRef.dropContainer.data;

        sourceItemContainer.splice(sourceItemContainer.indexOf(sourceItem), 1);

        switch (this.itemDropTarget.position) {
            case 'before':
            case 'after':
                const targetIndex = targetItemContainer.findIndex((item: GanttItemInternal) => item === targetItem);
                if (this.itemDropTarget.position == 'before') {
                    targetItemContainer.splice(targetIndex, 0, sourceItem);
                } else {
                    targetItemContainer.splice(targetIndex + 1, 0, sourceItem);
                }
                break;
            case 'inside':
                targetItem.children.push(sourceItem);
                break;
        }

        this.dragDropped.emit({
            source: sourceItem.origin,
            sourceParentId: event.previousContainer.id,
            target: targetItem.origin,
            targetParentId: event.container.id,
            dropPosition: this.itemDropTarget.position
        });

        this.cleanupDragArtifacts(true);
    }

    private getTargetPosition(target: HTMLElement, event: CdkDragMove) {
        const targetRect = target.getBoundingClientRect();
        const beforeOrAfterGap = targetRect.height * 0.3;
        if (event.pointerPosition.y - targetRect.top < beforeOrAfterGap) {
            return 'before';
        } else if (event.pointerPosition.y >= targetRect.bottom - beforeOrAfterGap) {
            return 'after';
        } else {
            return 'inside';
        }
    }

    private showDropPositionPlaceholder(targetElement: HTMLElement) {
        this.cleanupDragArtifacts();
        if (this.itemDropTarget && targetElement) {
            targetElement.classList.add(`drop-position-${this.itemDropTarget.position}`);
        }
    }

    private cleanupDragArtifacts(dropped = false) {
        if (dropped) {
            this.itemDropTarget = null;
        }
        this.document.querySelectorAll('.drop-position-before').forEach((element) => element.classList.remove('drop-position-before'));
        this.document.querySelectorAll('.drop-position-after').forEach((element) => element.classList.remove('drop-position-after'));
        this.document.querySelectorAll('.drop-position-inside').forEach((element) => element.classList.remove('drop-position-inside'));
    }

    private showResizePreviewLine(event: CdkDragMove) {
        const tableRect = this.elementRef.nativeElement.getBoundingClientRect();
        this.resizeLineElementRef.nativeElement.style.left = `${(event.event as any).clientX - tableRect.left}px`;
        this.resizeLineElementRef.nativeElement.style.display = 'block';
    }

    private hideResizePreviewLine() {
        this.resizeLineElementRef.nativeElement.style.display = 'none';
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
