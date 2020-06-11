import { Component, OnInit, HostBinding } from '@angular/core';
import { mockItems, mockGroups } from '../examples/mocks';
import { GanttViewType } from 'ngx-gantt';

@Component({
    selector: 'example-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class AppFlatExampleComponent implements OnInit {
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
