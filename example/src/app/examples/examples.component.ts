import { Component, OnInit } from '@angular/core';
import { mockItems, mockGroups } from './mocks';
import { GanttBarClickEvent, GanttViewType } from '../../../../packages/gantt/src/class';
import { GanttDragEvent } from 'dist/gantt/class';

@Component({
    selector: 'app-examples-gantt',
    templateUrl: './examples.component.html',
    styleUrls: ['./examples.component.scss']
})
export class AppExamplesComponent implements OnInit {
    constructor() {}

    items = mockItems;

    groups = mockGroups;

    options = {
        viewType: GanttViewType.month,
        draggable: true,
        linkable: true
    };

    ngOnInit(): void {}

    barClick(event: GanttBarClickEvent) {
        console.log(event);
    }

    dragEnded(event: GanttDragEvent) {
        this.groups = [...this.groups];
        this.items = [...this.items];
    }
}
