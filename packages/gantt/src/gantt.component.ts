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
    AfterViewInit,
    ViewChild
} from '@angular/core';
import { startWith, takeUntil, take, finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GanttUpper } from './gantt-upper';
import { GanttRef, GANTT_REF_TOKEN } from './gantt-ref';
import { GanttLinkDragEvent, GanttLineClickEvent, GanttItemInternal, GanttBarClickEvent, GanttItem, GanttGroupInternal } from './class';
import { GanttDomService } from './gantt-dom.service';
import { GanttDragContainer } from './gantt-drag-container';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { sideWidth } from './gantt.styles';
import { getColumnWidthConfig } from './utils/column-compute';
import { recursiveItems } from './utils/helpers';

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

    public expandChange = new Subject<void>();

    @Input() maxLevel = 2;

    @Input() async: boolean;

    @Input() asyncChildrenResolve: (GanttItem) => Observable<GanttItem[]>;

    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

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

    private computeItemsRefs(...items: GanttItemInternal[]) {
        items.forEach((item) => {
            item.updateRefs({
                width: item.start && item.end ? this.view.getDateRangeWidth(item.start.startOfDay(), item.end.endOfDay()) : 0,
                x: item.start ? this.view.getXPointByDate(item.start) : 0,
                y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
            });
        });
    }

    ngOnInit() {
        super.onInit();

        this.dragContainer.linkDragStarted.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
            this.linkDragStarted.emit(event);
        });
        this.dragContainer.linkDragEnded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
            this.linkDragEnded.emit(event);
        });
    }

    ngAfterViewInit() {
        this.columns.changes.pipe(startWith(true), takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.computeColumnWidth();
            this.cdr.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.onChanges(changes);
    }

    computeRefs() {
        this.groups.forEach((group) => {
            const groupItems = recursiveItems(group.items);
            this.computeItemsRefs(...groupItems);
        });
        const items = recursiveItems(this.items);
        this.computeItemsRefs(...items);
    }

    expandGroup(group: GanttGroupInternal) {
        group.expand = !group.expand;
        this.expandChange.next();
        this.cdr.detectChanges();
    }

    expandChildren(item: GanttItemInternal) {
        if (!item.expand) {
            item.expand = true;
            this.expandItemIds.push(item.id);
            if (this.async && this.asyncChildrenResolve && item.children.length === 0) {
                item.loading = true;
                this.asyncChildrenResolve(item.origin)
                    .pipe(
                        take(1),
                        finalize(() => {
                            item.loading = false;
                            this.expandChange.next();
                            this.cdr.detectChanges();
                        })
                    )
                    .subscribe((items) => {
                        item.addChildren(items);
                        this.computeItemsRefs(...item.children);
                    });
            } else {
                this.computeItemsRefs(...item.children);
                this.expandChange.next();
            }
        } else {
            item.expand = false;
            this.expandItemIds = this.expandItemIds.filter((id) => id !== item.id);
            this.expandChange.next();
        }
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
