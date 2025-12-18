import { Component, HostBinding, OnInit } from '@angular/core';
import { addDays, getUnixTime } from 'date-fns';
import { GanttItem, GanttViewType } from 'ngx-gantt';

@Component({
    selector: 'app-gantt-children-row-example',
    templateUrl: './gantt-children-row.component.html',
    standalone: false
})
export class AppGanttChildrenRowExampleComponent implements OnInit {
    @HostBinding('class.gantt-example-component') class = true;

    GanttViewType = GanttViewType;

    viewType: GanttViewType = GanttViewType.month;

    rowMode: 'single' | 'tasks' = 'tasks';

    items: GanttItem[] = [];

    constructor() {}

    ngOnInit(): void {
        this.items = this.buildItems();
    }

    toggleRowMode() {
        this.rowMode = this.rowMode === 'tasks' ? 'single' : 'tasks';
    }

    private buildItems(): GanttItem[] {
        const today = new Date();

        const makeTask = (id: string, title: string, offsetStart: number, duration: number, extra: Partial<GanttItem> = {}): GanttItem => ({
            id,
            title,
            start: getUnixTime(addDays(today, offsetStart)),
            end: getUnixTime(addDays(today, offsetStart + duration)),
            ...extra
        });

        return [
            {
                id: 'frontend',
                title: 'Frontend',
                expandable: true,
                expanded: true,
                children: [
                    {
                        id: 'frontend-design',
                        title: 'Design Phase',
                        tasks: [makeTask('fe-design-1', 'UI Design', -14, 8), makeTask('fe-design-2', 'UX Review', -6, 4)]
                    },
                    {
                        id: 'frontend-dev',
                        title: 'Development',
                        tasks: [makeTask('fe-dev-1', 'Components', -4, 12), makeTask('fe-dev-2', 'Integration', 8, 8)]
                    }
                ],
                tasks: [
                    makeTask('fe-design', 'Design', -14, 10),
                    makeTask('fe-build', 'Build', -4, 18),
                    makeTask('fe-qa', 'QA & fixes', 10, 8)
                ]
            },
            {
                id: 'backend',
                title: 'Backend',
                expandable: true,
                expanded: true,
                tasks: [
                    makeTask('be-design', 'Design', -12, 8),
                    makeTask('be-build', 'Build', -2, 16),
                    makeTask('be-observability', 'Observability', 8, 10)
                ]
            },
            {
                id: 'mobile',
                title: 'Mobile',
                expandable: true,
                expanded: true,
                tasks: [
                    makeTask('mobile-prototype', 'Prototype', -6, 6),
                    makeTask('mobile-build', 'Build', 2, 14),
                    makeTask('mobile-release', 'Release', 20, 6)
                ]
            }
        ];
    }
}
