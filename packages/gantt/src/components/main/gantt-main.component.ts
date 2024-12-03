import { Component, HostBinding, Inject, Input, TemplateRef, Output, EventEmitter, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal, GanttBarClickEvent, GanttLineClickEvent } from '../../class';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { IsGanttRangeItemPipe, IsGanttBarItemPipe, IsGanttCustomItemPipe } from '../../gantt.pipe';
import { NgxGanttBaselineComponent } from '../baseline/baseline.component';
import { NgxGanttBarComponent } from '../bar/bar.component';
import { NgxGanttRangeComponent } from '../range/range.component';
import { NgFor, NgIf, NgClass, NgTemplateOutlet } from '@angular/common';
import { GanttLinksComponent } from '../links/links.component';
import { GanttDomService } from '../../gantt-dom.service';
import { GanttQuickTimeFocusItemComponent } from '../quick-time-focus/quick-time-focus.component';

@Component({
    selector: 'gantt-main',
    templateUrl: './gantt-main.component.html',
    standalone: true,
    imports: [
        GanttLinksComponent,
        NgFor,
        NgIf,
        NgClass,
        NgTemplateOutlet,
        NgxGanttRangeComponent,
        NgxGanttBarComponent,
        NgxGanttBaselineComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe,
        GanttQuickTimeFocusItemComponent
    ]
})
export class GanttMainComponent {
    @Input() viewportItems: (GanttGroupInternal | GanttItemInternal)[];

    @Input() flatItems: (GanttGroupInternal | GanttItemInternal)[];

    @Input() groupHeaderTemplate: TemplateRef<any>;

    @Input() itemTemplate: TemplateRef<any>;

    @Input() barTemplate: TemplateRef<any>;

    @Input() rangeTemplate: TemplateRef<any>;

    @Input() baselineTemplate: TemplateRef<any>;

    @Input() quickTimeFocus: boolean;

    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper, public dom: GanttDomService) {}

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }
}
