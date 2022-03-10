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
    AfterViewInit,
    ContentChild,
    TemplateRef,
    forwardRef,
    Inject
} from '@angular/core';
import { startWith, takeUntil, take, finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttLinkDragEvent, GanttLineClickEvent, GanttItemInternal, GanttItem, GanttSelectedEvent } from './class';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { sideWidth } from './gantt.styles';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { defaultColumnWidth } from './components/table/gantt-table.component';
import { defaultConfig, GanttGlobalConfig, GANTT_GLOBAL_CONFIG } from './gantt.config';
import { GanttLinkOptions } from './class/link';
@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: NgxGanttComponent
        },
        {
            provide: GANTT_ABSTRACT_TOKEN,
            useExisting: forwardRef(() => NgxGanttComponent)
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

    @Output() selectedChange = new EventEmitter<GanttSelectedEvent>();

    @ContentChild(NgxGanttTableComponent) table: NgxGanttTableComponent;

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    @ContentChild('tableEmpty', { static: true }) tableEmptyTemplate: TemplateRef<any>;

    private ngUnsubscribe$ = new Subject();

    public sideTableWidth = sideWidth;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        @Inject(GANTT_GLOBAL_CONFIG) config: GanttGlobalConfig
    ) {
        super(elementRef, cdr, ngZone, config);
    }

    ngOnInit() {
        super.onInit();
        this.linkOptions = Object.assign({}, defaultConfig.linkOptions, this.config?.linkOptions, this.linkOptions);
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
            this.columns.forEach((column) => {
                if (!column.columnWidth) {
                    column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
                }
            });
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

    selectItem(selectEvent: GanttSelectedEvent) {
        if (!this.selectable) {
            return;
        }
        const { event, selectedValue } = selectEvent;
        this.selectionModel.toggle((selectedValue as GanttItem).id);

        const selectedIds = this.selectionModel.selected;
        if (this.multiple) {
            const _selectedValue = this.getGanttItems(selectedIds).map((item) => item.origin);
            this.selectedChange.emit({ event, selectedValue: _selectedValue });
        } else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, selectedValue: _selectedValue });
        }
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
