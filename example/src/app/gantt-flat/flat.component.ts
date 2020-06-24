import { Component, OnInit, HostBinding } from '@angular/core';
import { mockItems, mockGroups } from '../gantt/mocks';
import { GanttViewType } from 'ngx-gantt';

@Component({
    selector: 'app-gantt-flat-example',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class AppGanttFlatExampleComponent implements OnInit {
    constructor() {}

    items = mockItems;

    groups = mockGroups;

    options = {
        viewType: GanttViewType.month,
        draggable: true,
        mergeIntervalDays: 3,
        styles: {
            lineHeight: 50
        }
    };

    @HostBinding('class.gantt-demo') class = true;

    ngOnInit(): void {}
}
