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
import { GanttDependencyDragEvent, GanttDependencyEvent } from '../class';

@Component({
    selector: 'gantt-table',
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
    @Input() dependable: boolean;

    @Output() dependencyDragStarted = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyDragEnded = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyClick = new EventEmitter<GanttDependencyEvent>();

    @HostBinding('class.gantt-table') className = true;

    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit() {
        super.onInit();
    }
}
