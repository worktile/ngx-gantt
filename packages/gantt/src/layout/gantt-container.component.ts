import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'gantt-container',
    template: '<ng-content></ng-content>',
})
export class GanttContainerComponent {
    @HostBinding('class.gantt-container') className = true;

    constructor() {}
}
