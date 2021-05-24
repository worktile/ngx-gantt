import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxGanttComponent } from '../../../gantt.component';
import { NgxGanttModule } from '../../../gantt.module';
import { NgxGanttRangeComponent } from '../range.component';

const mockRangeItems = [
    {
        id: 'item-0101',
        title: 'VERSION 0101',
        start: 1590035675,
        color: '#FF0000',
        type: 'range',
        progress: 0.5,
        children: [
            {
                id: 'item-child-0101',
                title: 'VERSION Children 0101',
                start: 1590035675,
                color: '#FF0000',
                linkable: false,
                barStyle: { border: `1px solid #FF0000` }
            }
        ]
    },
    {
        id: 'item-0102',
        title: 'VERSION 0102',
        start: 1590935675,
        end: 1591318400,
        color: '#9ACD32',
        type: 'range',
        expandable: true
    }
];

@Component({
    selector: 'test-gantt-range',
    template: ` <ngx-gantt #gantt [items]="items" [viewType]="viewType" (barClick)="barClick($event)">
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

describe('#basic', () => {
    let fixture: ComponentFixture<TestGanttRangeComponent>;
    let ganttComponentInstance: TestGanttRangeComponent;
    let ganttDebugElement: DebugElement;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttRangeComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttRangeComponent);
        fixture.detectChanges();
        ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
        ganttComponentInstance = fixture.componentInstance;
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
