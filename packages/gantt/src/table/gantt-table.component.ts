import {
    Component,
    OnInit,
    ElementRef,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output,
    HostBinding,
} from '@angular/core';
import { GanttUpper } from '../gantt-upper';
import { GanttRef, GANTT_REF_TOKEN } from '../gantt-ref';
import { GanttDependencyDragEvent, GanttDependencyEvent, GanttItemInternal } from '../class';
@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: GanttTableComponent,
        },
    ],
})
export class GanttTableComponent extends GanttUpper implements GanttRef, OnInit {
    @Input() linkable: boolean;

    @Output() linkDragStarted = new EventEmitter<GanttDependencyDragEvent>();

    @Output() linkDragEnded = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyClick = new EventEmitter<GanttDependencyEvent>();

    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit() {
        super.onInit();
        this.computeRefs();
    }

    private computeRefs() {
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
        const width = this.view.getDateRangeWidth(item.start, item.end);
        const x = this.view.getXPointByDate(item.start);
        const y = (this.styles.lineHeight - this.styles.barHeight) / 2;
        item.updateRefs({ width, x, y });
    }
}
