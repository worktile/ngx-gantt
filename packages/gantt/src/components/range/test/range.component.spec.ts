import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxGanttComponent } from '../../../gantt.component';
import { NgxGanttModule } from '../../../gantt.module';
import { GanttDate } from '../../../utils/date';
import { NgxGanttRangeComponent } from '../range.component';

const mockRangeItems = [
    {
        id: 'item-0101',
        title: 'VERSION 0101',
        start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
        type: 'range',
        progress: 0.5,
        color: '#FF0000',
        children: [
            {
                id: 'item-child-0101',
                title: 'VERSION Children 0101',
                start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
                color: '#FF0000',
                linkable: false,
                type: 'range'
            }
        ]
    },
    {
        id: 'item-0102',
        title: 'VERSION 0102',
        start: new GanttDate('2020-05-31 22:34:35').getUnixTime(),
        end: new GanttDate('2020-06-05 08:53:20').getUnixTime(),
        color: '#9ACD32',
        expandable: true,
        type: 'range'
    }
];

@Component({
    selector: 'test-gantt-range',
    template: ` <ngx-gantt #gantt [items]="items" [viewType]="viewType">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`
})
export class TestGanttRangeComponent {
    constructor() {}

    viewType = 'month';

    items = mockRangeItems;
}

describe('ngx-gantt-range', () => {
    let fixture: ComponentFixture<TestGanttRangeComponent>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttRangeComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttRangeComponent);
        fixture.detectChanges();
    });

    it('should render range item', () => {
        const rangeItems = fixture.debugElement.queryAll(By.directive(NgxGanttRangeComponent));
        expect(rangeItems.length).toEqual(mockRangeItems.length);
    });

    it('should has range progress', () => {
        const rangeProgress = fixture.debugElement.queryAll(By.css('.gantt-range-main-progress'));
        expect(rangeProgress.length).toEqual(1);
    });
});
