import { Component, HostBinding, Inject, Input, input, InputSignal } from '@angular/core';
import { GanttItemInternal } from '../../class/item';
import { GANTT_UPPER_TOKEN, GanttUpper } from '../../gantt-upper';
import { GanttIconComponent } from '../icon/icon.component';

@Component({
    selector: 'gantt-quick-time-focus',
    templateUrl: './quick-time-focus.component.html',
    standalone: true,
    imports: [GanttIconComponent]
})
export class GanttQuickTimeFocusItemComponent {
    @HostBinding('class.gantt-quick-time-focus-item') class = true;

    @HostBinding('style.height')
    get height() {
        return this.ganttUpper.styles.lineHeight + 'px';
    }

    mainViewport: InputSignal<{ clientWidth?: number; leftBoundary?: number; rightBoundary?: number }> = input();

    @Input() item: GanttItemInternal;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    quickTime(item: GanttItemInternal, type: 'left' | 'right') {
        const date = type === 'left' ? item.start || item.end : item.end || item.start;
        this.ganttUpper.scrollToDate(date);
    }
}
