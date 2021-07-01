import { fakeAsync, TestBed, ComponentFixture, async, inject, flush } from '@angular/core/testing';
import { Component, ViewChild, DebugElement } from '@angular/core';
import { NgxGanttModule } from 'ngx-gantt';
import { By } from '@angular/platform-browser';
import { GanttTableComponent } from '../gantt-table.component';
import { getMockGroupItems, getMockGroups} from '../../../test/mocks/data';
import { dispatchMouseEvent } from '../../../utils/testing';
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
    @ViewChild(GanttTableComponent, { static: true }) ganttTableComponent: GanttTableComponent;

    items = getMockGroupItems();

    groups = getMockGroups();

    constructor() {}
}

describe('GanttTable', () => {
    let component: TestGanttTableComponent;
    let fixture: ComponentFixture<TestGanttTableComponent>;

    beforeEach(async(() => {
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

    it('should create gantt-table', () => {
        expect(component).toBeDefined();
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableComponent));
        expect(ganttTable).toBeTruthy();
        expect(ganttTable.nativeElement).toBeTruthy();
    });

    it('should expand groups', () => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableComponent));
        expect(ganttTable.query(By.css('.gantt-table-group-title')).nativeNode.classList.contains('expanded')).toBeTruthy();
        ganttTable.query(By.css('.gantt-table-group-title')).nativeNode.click();
        fixture.detectChanges();
        expect(ganttTable.query(By.css('.gantt-table-group-title')).nativeNode.classList.contains('expanded')).toBeFalsy();
    });

    it('should expand children', () => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableComponent));
        const tableChildrenLength = ganttTable.query(By.css('.gantt-table-body')).children.length;
        ganttTable.nativeElement.querySelector('.gantt-table-item-with-group .gantt-expand-icon .expand-icon').click();
        fixture.detectChanges();
        expect(ganttTable.query(By.css('.gantt-table-body')).children.length).toEqual(tableChildrenLength + 1);
    });

    it('should column drag', fakeAsync(() => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableComponent));
        const dragTrigger = ganttTable.nativeElement.querySelector('.gantt-table-header .gantt-table-column .gantt-table-drag-trigger');
        fixture.detectChanges();
        flush();

        const dragTriggerRight = dragTrigger.getBoundingClientRect().right;

        dispatchMouseEvent(dragTrigger, 'mousedown');
        fixture.detectChanges();
        flush();

        dispatchMouseEvent(document, 'mousemove', 200);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        dispatchMouseEvent(document, 'mousemove', 250);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        dispatchMouseEvent(document, 'mouseup');
        fixture.detectChanges();
        flush();

        expect(dragTrigger.getBoundingClientRect().right).not.toBe(dragTriggerRight);
    }));

    it('should table drag', fakeAsync(() => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableComponent));
        const dragTrigger = ganttTable.nativeElement.children[2];
        fixture.detectChanges();

        const dragTriggerRight = dragTrigger.getBoundingClientRect().right;

        dispatchMouseEvent(dragTrigger, 'mousedown');
        fixture.detectChanges();
        flush();

        dispatchMouseEvent(document, 'mousemove', 250, 150);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        dispatchMouseEvent(document, 'mousemove', 50, 50);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        dispatchMouseEvent(document, 'mouseup');
        fixture.detectChanges();
        flush();

        expect(dragTrigger.getBoundingClientRect().left).not.toBe(dragTriggerRight);
    }));
});
