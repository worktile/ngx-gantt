import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GANTT_REF_TOKEN } from '../gantt-ref';

@Component({
    selector: 'ngx-gantt-flat',
    templateUrl: './gantt-flat.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_REF_TOKEN,
            useExisting: GanttFlatComponent,
        },
    ],
})
export class GanttFlatComponent implements OnInit {
    @Input() sideTitle: string;

    @Input() showSide = true;

    constructor() {}

    ngOnInit() {}
}
