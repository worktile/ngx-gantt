import { Component, OnInit, HostBinding } from '@angular/core';
import { GanttViewType, GanttGroup, GanttItem } from 'ngx-gantt';
import { randomGroupsAndItems } from '../helper';
import { ThyContent, ThyLayout } from 'ngx-tethys/layout';
import { AppGanttFlatComponent } from './component/flat.component';

@Component({
    selector: 'app-gantt-advanced-example',
    templateUrl: './gantt-advanced.component.html',
    imports: [ThyLayout, ThyContent, AppGanttFlatComponent]
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
    }
}
