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
    ContentChildren,
    QueryList,
    AfterViewInit
} from '@angular/core';
import { startWith, takeUntil, take, finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttLinkDragEvent, GanttLineClickEvent, GanttItemInternal, GanttItem } from './class';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { sideWidth } from './gantt.styles';
import { getColumnWidthConfig } from './utils/column-compute';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: NgxGanttComponent
        }
    ]
})
export class NgxGanttComponent extends GanttUpper implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() maxLevel = 2;

    @Input() async: boolean;

    @Input() childrenResolve: (GanttItem) => Observable<GanttItem[]>;

    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    private ngUnsubscribe$ = new Subject();

    public sideTableWidth = sideWidth;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone) {
        super(elementRef, cdr, ngZone);
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

        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.dragContainer.linkDragStarted.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragStarted.emit(event);
            });
            this.dragContainer.linkDragEnded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: GanttLinkDragEvent) => {
                this.linkDragEnded.emit(event);
            });
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

    expandChildren(item: GanttItemInternal) {
        if (!item.expanded) {
            item.setExpand(true);
            if (this.async && this.childrenResolve && item.children.length === 0) {
                item.loading = true;
                this.childrenResolve(item.origin)
                    .pipe(
                        take(1),
                        finalize(() => {
                            item.loading = false;
                            this.expandChange.emit();
                            this.cdr.detectChanges();
                        })
                    )
                    .subscribe((items) => {
                        item.addChildren(items);
                        this.computeItemsRefs(...item.children);
                    });
            } else {
                this.computeItemsRefs(...item.children);
                this.expandChange.emit();
            }
        } else {
            item.setExpand(false);
            this.expandChange.emit();
        }
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
