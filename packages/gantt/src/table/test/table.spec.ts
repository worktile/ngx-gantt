import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxGanttModule } from 'ngx-gantt';
import { GanttTableBodyComponent } from '../../components/table/body/gantt-table-body.component';
import { getMockGroupItems, getMockGroups } from '../../test/mocks/data';

@Component({
    selector: 'test-gantt-table',
    template: `
        <ngx-gantt #gantt [items]="items" [groups]="groups">
            <ngx-gantt-table>
                <ngx-gantt-column [width]="200" name="标题">
                    <ng-template #cell let-item="item">
                        {{ item.title }}
                    </ng-template>
                </ngx-gantt-column>
            </ngx-gantt-table>
        </ngx-gantt>
    `,
    providers: []
})
export class TestGanttTableComponent {
    @ViewChild(GanttTableBodyComponent, { static: true }) ganttTableComponent: GanttTableBodyComponent;

    items = getMockGroupItems();

    groups = getMockGroups();

    constructor() {}
}

describe('NgxGanttTableComponent', () => {
    let component: TestGanttTableComponent;
    let fixture: ComponentFixture<TestGanttTableComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgxGanttModule],
            declarations: [TestGanttTableComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestGanttTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ngx-gantt-table', () => {
        expect(component).toBeDefined();
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        expect(ganttTable).toBeTruthy();
        expect(ganttTable.nativeElement).toBeTruthy();
    });
});
