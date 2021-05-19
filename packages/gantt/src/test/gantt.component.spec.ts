import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NgxGanttModule } from 'ngx-gantt';
import { mockGroups, mockItems } from './mocks/data';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'test-gantt-basic',
    template: `
        <ngx-gantt #gantt start="1514736000" end="1609430400" [groups]="groups" [items]="items" [viewType]="'month'">
            <ngx-gantt-table>
                <ngx-gantt-column name="标题" width="120px">
                    <ng-template #cell let-item="item">
                        {{ item.title }}
                    </ng-template>
                </ngx-gantt-column>
            </ngx-gantt-table>
        </ngx-gantt>
    `
})
export class TestGanttBasicComponent {
    constructor() {}

    items = mockItems;

    groups = mockGroups;
}

describe('NgxGanttComponent', () => {
    let component: TestGanttBasicComponent;
    let fixture: ComponentFixture<TestGanttBasicComponent>;
    let defaultFixture: ComponentFixture<TestGanttBasicComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttBasicComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestGanttBasicComponent);
        component = fixture.componentInstance;
        defaultFixture = TestBed.createComponent(TestGanttBasicComponent);
        fixture.detectChanges();
    });

    it('should create ngx-gantt', () => {
        expect(component).toBeTruthy();
    });
});
