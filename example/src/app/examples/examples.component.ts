import { Component, OnInit, HostBinding } from '@angular/core';
import { mockItems, mockGroups } from './mocks';
import {
    GanttBarClickEvent,
    GanttViewType,
    GanttDragEvent,
    GanttLoadOnScrollEvent,
    GanttLineClickEvent,
    GanttLinkDragEvent
} from 'ngx-gantt';

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

    @HostBinding('class.gantt-demo') class = true;

    ngOnInit(): void {}

    barClick(event: GanttBarClickEvent) {
        console.log(event);
    }

    lineClick(event: GanttLineClickEvent) {
        console.log(event);
    }

    dragEnded(event: GanttDragEvent) {
        this.groups = [...this.groups];
        this.items = [...this.items];
    }

    linkDragEnded(event: GanttLinkDragEvent) {
        if (event.source.links && event.source.links.includes(event.target.id)) {
            return;
        }

        this.items.forEach((item) => {
            if (item.id === event.source.id) {
                item.links = [...(item.links || []), event.target.id];
            }
        });
        this.items = [...this.items];
    }

    loadOnScroll(event: GanttLoadOnScrollEvent) {}
}
