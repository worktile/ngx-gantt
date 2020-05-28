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
    QueryList
} from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../class';
import { GanttTableColumnComponent } from './column/column.component';

@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent {
    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input() columns: QueryList<GanttTableColumnComponent>;

    @Input() groupTemplate: TemplateRef<any>;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor() {}
}
