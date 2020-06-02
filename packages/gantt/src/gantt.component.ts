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
    HostBinding,
    ContentChild,
    TemplateRef,
    ContentChildren,
    QueryList,
    AfterViewInit
} from '@angular/core';
import { GanttUpper } from './gantt-upper';
import { GanttRef, GANTT_REF_TOKEN } from './gantt-ref';
import { GanttLinkDragEvent, GanttLinkEvent, GanttItemInternal } from './class';
import { GanttDomService } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { GanttTableColumnComponent } from './table/column/column.component';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: GanttComponent
        },
        GanttDomService,
        GanttDragContainer
    ]
})
export class GanttComponent extends GanttUpper implements GanttRef, OnInit, AfterViewInit, OnChanges, OnDestroy {
    // public listOfColumns: QueryList<GanttTableColumnComponent>;

    private ngUnsubscribe$ = new Subject();

    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkClick = new EventEmitter<GanttLinkEvent>();

    @ContentChild('group', { static: true }) groupTemplate: TemplateRef<any>;

    @ContentChildren(GanttTableColumnComponent) columns: QueryList<GanttTableColumnComponent>;

    // @ContentChildren(GanttTableColumnComponent)
    // set columns(columns: QueryList<GanttTableColumnComponent>) {
    //     if (columns) {
    //         this.listOfColumns = columns;
    //     }
    // }

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
            y: (this.styles.lineHeight - this.styles.barHeight) / 2
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
            this.cdr.markForCheck();
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
