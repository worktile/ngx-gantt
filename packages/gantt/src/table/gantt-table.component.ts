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
    HostBinding
} from '@angular/core';
import { GanttUpper } from '../gantt-upper';
import { GanttRef, GANTT_REF_TOKEN } from '../gantt-ref';
import { GanttLinkDragEvent, GanttDependencyEvent, GanttItemInternal } from '../class';
import { GanttDomService } from '../gantt-dom.service';
import { GanttDragContainer } from '../gantt-drag-container';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: GanttTableComponent
        },
        GanttDomService,
        GanttDragContainer
    ]
})
export class GanttTableComponent extends GanttUpper implements GanttRef, OnInit, OnChanges, OnDestroy {
    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

    @Output() linkClick = new EventEmitter<GanttDependencyEvent>();

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        dom: GanttDomService,
        dragContainer: GanttDragContainer
    ) {
        super(elementRef, cdr, ngZone, dom, dragContainer);
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

    private computeItemRef(item: GanttItemInternal) {
        item.updateRefs({
            width: this.view.getDateRangeWidth(item.start, item.end),
            x: this.view.getXPointByDate(item.start),
            y: (this.styles.lineHeight - this.styles.barHeight) / 2
        });
    }

    ngOnDestroy() {
        super.onDestroy();
    }
}
