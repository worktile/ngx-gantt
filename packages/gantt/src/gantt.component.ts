import {
    Component,
    Input,
    HostBinding,
    TemplateRef,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { GanttOptions } from './gantt.options';
import { GanttViewType } from './class/view-type';
import { GanttItemInfo } from './class/item';
import { GanttGroupInfo } from './class/group';
import { GanttDragEvent, GanttLoadOnScrollEvent, GanttDependencyEvent, GanttDependencyDragEvent } from './class/event';

export type GanttMode = 'table' | 'flat';

@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttComponent {
    @Input() items: GanttItemInfo[] = [];

    @Input() groups: GanttGroupInfo[] = [];

    @Input() viewType: GanttViewType = GanttViewType.month;

    @Input() mode: GanttMode = 'table';

    @Input() showSide = true;

    @Input() sideTitle: string | TemplateRef<any>;

    @Input() start: number;

    @Input() end: number;

    @Input() draggable: boolean;

    @Input() dependable: boolean;

    // @Input() linkable: boolean;
    // item:{
    //   links:[]
    // }


    @Input() options: GanttOptions;

    @Input() disabledLoadOnScroll: boolean;

    @Output() loadOnScroll = new EventEmitter<GanttLoadOnScrollEvent>();

    @Output() dragStarted = new EventEmitter<GanttDragEvent>();

    @Output() dragEnded = new EventEmitter<GanttDragEvent>();

    @Output() dependencyDragStarted = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyDragEnded = new EventEmitter<GanttDependencyDragEvent>();

    @Output() dependencyClick = new EventEmitter<GanttDependencyEvent>();

    @HostBinding('class.gantt') ganttClass = true;

    constructor() {}
}
