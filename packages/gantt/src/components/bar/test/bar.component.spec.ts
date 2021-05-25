import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxGanttComponent } from '../../../gantt.component';
import { NgxGanttModule } from '../../../gantt.module';
import { GanttDate } from '../../../utils/date';

const mockBarItems = [
    {
        id: 'item-0101',
        title: 'VERSION 0101',
        start: new GanttDate('2020-05-31 22:34:35').getUnixTime(),
        end: new GanttDate('2020-06-05 08:53:20').getUnixTime(),
        progress: 0.5
    }
];

@Component({
    selector: 'test-gantt-bar',
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
export class TestGanttBarComponent {
    constructor() {}

    viewType = 'month';

    items = mockBarItems;
}

describe('ngx-gantt-bar', () => {
    let fixture: ComponentFixture<TestGanttBarComponent>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttBarComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttBarComponent);
        fixture.detectChanges();
    });

    it('should has bar progress', () => {
        const barProgress = fixture.debugElement.queryAll(By.css('.gantt-bar-content-progress'));
        expect(barProgress.length).toEqual(1);
    });
});
