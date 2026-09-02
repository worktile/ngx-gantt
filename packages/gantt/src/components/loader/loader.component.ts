import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'gantt-loader',
    template: `
        <div class="gantt-loader-wrapper">
            <div class="gantt-loader-loading">
                <span class="gantt-loader-loading-spot"></span>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        class: 'gantt-loader gantt-loader-overlay'
    }
})
export class GanttLoaderComponent {}
