import { CommonModule } from '@angular/common';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxGanttComponent } from '../../gantt.component';
import { NgxGanttModule } from '../../gantt.module';
import { getMockItems } from './mocks/data';

const mockItems = getMockItems();

@Component({
    selector: 'test-gantt-custom-toolbar',
    template: ` <ngx-gantt #gantt [items]="items">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>

        <ng-template #toolbar>
            <span class="custom-toolbar"></span>
        </ng-template>
    </ngx-gantt>`,
    standalone: false
})
export class TestGanttCustomToolbarComponent {
    items = mockItems;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}
}

describe('#custom-toolbar', () => {
    let fixture: ComponentFixture<TestGanttCustomToolbarComponent>;
    let ganttComponentInstance: TestGanttCustomToolbarComponent;
    let ganttDebugElement: DebugElement;
    let ganttComponent: NgxGanttComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttCustomToolbarComponent],
            providers: []
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttCustomToolbarComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
        ganttComponentInstance = fixture.componentInstance;
        ganttComponent = ganttComponentInstance.ganttComponent;
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create custom toolbar', () => {
        const toolbarComponent = fixture.debugElement.query(By.css('.gantt-toolbar'));
        const views = toolbarComponent.query(By.css('.toolbar-views'));
        const customToolbar = toolbarComponent.query(By.css('.custom-toolbar'));
        expect(toolbarComponent).toBeTruthy();
        expect(customToolbar).toBeTruthy();
        expect(views).toBeFalsy;
    });
});
