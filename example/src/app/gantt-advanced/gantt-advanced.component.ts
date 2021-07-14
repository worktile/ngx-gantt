import { Component, OnInit, HostBinding } from '@angular/core';
import { GanttViewType, GanttGroup, GanttItem } from 'ngx-gantt';
import { randomGroupsAndItems } from '../helper';

@Component({
    selector: 'app-gantt-advanced-example',
    templateUrl: './gantt-advanced.component.html'
})
export class AppGanttAdvancedExampleComponent implements OnInit {
    constructor() {}

    items: GanttItem[] = [];

    groups: GanttGroup[] = [];

    options = {
        viewType: GanttViewType.month,
        draggable: true,
        mergeIntervalDays: 3,
        styles: {
            lineHeight: 50
        }
    };

    @HostBinding('class.gantt-example-component') class = true;

    ngOnInit(): void {
        const { groups, items } = randomGroupsAndItems(10);
        this.groups = groups;
        this.items = items;

        console.log(this.groups, this.items);
    }
}
