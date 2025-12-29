import { CommonModule } from '@angular/common';
import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GanttSelectedEvent } from '../../class';
import { GanttTableBodyComponent } from '../../components/table/body/gantt-table-body.component';
import { NgxGanttComponent } from '../../gantt.component';
import { NgxGanttModule } from '../../gantt.module';
import { getMockItems } from './mocks/data';

const mockItems = getMockItems();

@Component({
    selector: 'test-gantt-selectable',
    template: ` <ngx-gantt #gantt [items]="items" [selectable]="selectable" [multiple]="multiple" (selectedChange)="selectedChange($event)">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`,
    standalone: false
})
export class TestGanttSelectableComponent {
    readonly ganttComponent = viewChild<NgxGanttComponent>('gantt');

    constructor() {}

    selectable = true;

    multiple = true;

    items = mockItems;

    selectedChange(event: GanttSelectedEvent) {
        console.log(event);
    }
}

describe('#selectable', () => {
    let fixture: ComponentFixture<TestGanttSelectableComponent>;
    let ganttComponentInstance: TestGanttSelectableComponent;
    let ganttComponent: NgxGanttComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttSelectableComponent],
            providers: []
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttSelectableComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        ganttComponentInstance = fixture.componentInstance;
        ganttComponent = ganttComponentInstance.ganttComponent();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should init selectionModel when ngAfterViewInit', () => {
        const { selectionModel } = ganttComponent;
        expect(selectionModel.hasValue()).toEqual(false);
    });

    it('should invoke selectedChange when click item', () => {
        const selectedSpy = spyOn(ganttComponentInstance, 'selectedChange').and.callFake((event: GanttSelectedEvent) => {
            expect(event.event.type).toEqual('click');
            expect(event.selectedValue[0]).toEqual(mockItems[0]);
        });
        const itemNode = fixture.debugElement.query(By.directive(GanttTableBodyComponent)).query(By.css('.gantt-table-item')).nativeNode;
        itemNode.click();
        expect(selectedSpy).toHaveBeenCalledTimes(1);
    });

    it('should not invoke selectedChange when click item and selectable is false', () => {
        fixture.componentInstance.selectable = false;
        fixture.detectChanges();
        const selectedSpy = spyOn(ganttComponentInstance, 'selectedChange');
        const itemNode = fixture.debugElement.query(By.directive(GanttTableBodyComponent)).query(By.css('.gantt-table-item')).nativeNode;
        itemNode.click();
        expect(selectedSpy).toHaveBeenCalledTimes(0);
    });
});
