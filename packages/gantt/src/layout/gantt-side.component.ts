import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'gantt-side',
    template: '<ng-content></ng-content>',
})
export class GanttSideComponent {
    @HostBinding('class.gantt-side') className = true;

    constructor() {}
}
