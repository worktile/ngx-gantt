import { Component } from '@angular/core';

@Component({
    selector: 'gantt-loader',
    template: `
        <div class="gantt-loader-wrapper">
            <div class="gantt-loader-loading">
                <span class="gantt-loader-loading-spot"></span>
            </div>
        </div>
    `,
    host: {
        class: 'gantt-loader gantt-loader-overlay'
    },
    standalone: true
})
export class GanttLoaderComponent {}
