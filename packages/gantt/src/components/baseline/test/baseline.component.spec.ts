import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxGanttModule } from '../../../gantt.module';
import { GanttDate } from '../../../utils/date';
import { NgxGanttBaselineComponent } from '../baseline.component';
const mockBarItems = [
    {
        id: 'item-0101',
        title: 'VERSION 0101',
        start: new GanttDate('2020-05-31 22:34:35').getUnixTime(),
        end: new GanttDate('2020-06-05 08:53:20').getUnixTime(),
        progress: 0.5
    }
];

const mockBaselineItems = [
    {
        id: 'item-0101',
        start: new GanttDate('2020-05-31 22:34:35').getUnixTime(),
        end: new GanttDate('2020-06-05 08:53:20').getUnixTime()
    }
];

@Component({
    selector: 'test-gantt-baseline',
    template: ` <ngx-gantt #gantt [items]="items" [baselineItems]="baselineItems" [viewType]="viewType">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`
})
export class TestGanttBaselineComponent {
    constructor() {}

    viewType = 'month';

    items = mockBarItems;

    baselineItems = mockBaselineItems;
}

describe('ngx-gantt-baseline', () => {
    let fixture: ComponentFixture<TestGanttBaselineComponent>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttBaselineComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttBaselineComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should render baseline item', () => {
        const baselineItems = fixture.debugElement.queryAll(By.directive(NgxGanttBaselineComponent));
        expect(baselineItems.length).toEqual(mockBaselineItems.length);
    });
});

@Component({
    selector: 'test-gantt-baseline-template',
    template: ` <ngx-gantt #gantt [items]="items" [baselineItems]="baselineItems" [viewType]="viewType">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
        <ng-template #baseline>
            <div class="baseline-container"></div>
        </ng-template>
    </ngx-gantt>`
})
export class TestGanttBaselineTemplateComponent {
    constructor() {}

    viewType = 'month';

    items = mockBarItems;

    baselineItems = mockBaselineItems;
}

describe('ngx-gantt-baseline-template', () => {
    let fixture: ComponentFixture<TestGanttBaselineComponent>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttBaselineComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttBaselineComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should render baseline item by template', () => {
        const baselineItems = fixture.debugElement.queryAll(By.directive(NgxGanttBaselineComponent));
        expect(baselineItems.length).toEqual(mockBaselineItems.length);
        const baselineContainer = fixture.debugElement.queryAll(By.css('.baseline-container'));
        expect(baselineContainer).toBeTruthy();
    });
});
