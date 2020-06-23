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
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GanttItem } from 'dist/gantt/class';

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
        linkable: true,
        async: true,
        childrenResolve: this.getChildren.bind(this)
    };

    @HostBinding('class.gantt-demo') class = true;

    ngOnInit(): void {}

    barClick(event: GanttBarClickEvent) {
        console.log(event);
    }

    lineClick(event: GanttLineClickEvent) {
        console.log(event);
    }

    dragEnded(event: GanttDragEvent) {}

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

    getChildren(item: GanttItem) {
        return of([
            {
                id: new Date().getTime(),
                title: new Date().getTime(),
                start: Math.floor(new Date().getTime() / 1000),
                draggable: true,
                linkable: false
            }
        ]).pipe(delay(1000));
    }
}
