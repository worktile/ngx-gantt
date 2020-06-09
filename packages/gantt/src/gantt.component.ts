import {
    Component,
    OnInit,
    ElementRef,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output,
    ChangeDetectorRef,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ContentChild,
    TemplateRef,
    ContentChildren,
    QueryList,
    AfterViewInit
} from '@angular/core';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GanttUpper } from './gantt-upper';
import { GanttRef, GANTT_REF_TOKEN } from './gantt-ref';
import { GanttLinkDragEvent, GanttLinkEvent, GanttItemInternal, GanttBarClickEvent } from './class';
import { GanttDomService } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { sideWidth } from './gantt.styles';
import { getColumnWidthConfig } from './utils/column-compute';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: NgxGanttComponent
        },
        GanttDomService,
        GanttDragContainer
    ]
})
export class NgxGanttComponent extends GanttUpper implements GanttRef, OnInit, AfterViewInit, OnChanges, OnDestroy {
    private ngUnsubscribe$ = new Subject();

    public sideTableWidth = sideWidth;

    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkClick = new EventEmitter<GanttLinkEvent>();

    @ContentChild('group', { static: true }) groupTemplate: TemplateRef<any>;

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        dom: GanttDomService,
        dragContainer: GanttDragContainer
    ) {
        super(elementRef, cdr, ngZone, dom, dragContainer);
    }

    private computeItemRef(item: GanttItemInternal) {
        item.updateRefs({
            width: item.start && item.end ? this.view.getDateRangeWidth(item.start.startOfDay(), item.end.endOfDay()) : 0,
            x: item.start ? this.view.getXPointByDate(item.start) : 0,
            y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
        });
    }

    private computeColumnWidth() {
        const count = this.columns.length;
        const widthConfig = getColumnWidthConfig(count);
        this.sideTableWidth = widthConfig.width;
        this.columns.forEach((column, index) => {
            if (index === 0) {
                column.width = widthConfig.primaryWidth;
            } else {
                column.width = widthConfig.secondaryWidth;
            }
        });
    }

    ngOnInit() {
        super.onInit();

        this.dragContainer.linkDragStarted.subscribe((event) => {
            this.linkDragStarted.emit(event);
        });
        this.dragContainer.linkDragEnded.subscribe((event) => {
            this.linkDragEnded.emit(event);
        });
    }

    ngAfterViewInit() {
        this.columns.changes.pipe(startWith(true), takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.computeColumnWidth();
            this.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.onChanges(changes);
    }

    computeRefs() {
        this.groups.forEach((group) => {
            group.items.forEach((item) => {
                this.computeItemRef(item);
            });
        });
        this.items.forEach((item) => {
            this.computeItemRef(item);
        });
    }

    detectChanges() {
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
