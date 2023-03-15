import { Component } from '@angular/core';

@Component({
    selector: 'ngx-gantt-loader, gantt-loader',
    template: `
        <div class="gantt-loader-wrapper">
            <div class="loading-ellipsis">
                <span class="spot"></span>
            </div>
        </div>
    `,
    host: {
        class: 'gantt-loader'
    }
})
export class NgxGanttLoaderComponent {}
