import { Component, OnInit, HostBinding } from '@angular/core';
import { mockItems, mockGroups } from './mocks';
import { GanttViewType, GanttPrintService } from 'ngx-gantt';

@Component({
    selector: 'app-gantt-flat-example',
    templateUrl: './flat.component.html',
    providers: [GanttPrintService]
})
export class AppGanttFlatExampleComponent implements OnInit {
    constructor(
        private printService: GanttPrintService
    ) {}

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

    print(name: string) {
        this.printService.print(name);
    }
}
