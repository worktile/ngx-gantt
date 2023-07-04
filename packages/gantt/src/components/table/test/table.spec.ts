import { fakeAsync, TestBed, ComponentFixture, async, flush, tick } from '@angular/core/testing';
import { Component, ViewChild, DebugElement } from '@angular/core';
import { NgxGanttModule } from 'ngx-gantt';
import { By } from '@angular/platform-browser';
import { getMockGroupItems, getMockGroups } from '../../../test/mocks/data';
import { dispatchMouseEvent } from '../../../utils/testing';
import { GanttMainComponent } from 'ngx-gantt/components/main/gantt-main.component';
import { GanttTableBodyComponent } from '../body/gantt-table-body.component';
import { GanttTableHeaderComponent } from '../header/gantt-table-header.component';
@Component({
    selector: 'test-gantt-table',
    template: `
        <ngx-gantt #gantt [items]="items" [groups]="groups" [selectable]="selectable" [multiple]="multiple">
            <ngx-gantt-table>
                <ngx-gantt-column name="开始时间" width="140px">
                    <ng-template #cell let-item="item">
                        {{ item.start * 1000 | date : 'yyyy-MM-dd' }}
                    </ng-template>
                </ngx-gantt-column>
                <ngx-gantt-column [width]="200" name="标题" [showExpandIcon]="showExpandIcon">
                    <ng-template #cell let-item="item">
                        {{ item.title }}
                    </ng-template>
                </ngx-gantt-column>
            </ngx-gantt-table>
        </ngx-gantt>
    `,
    providers: []
})
export class TestGanttTableBodyComponent {
    @ViewChild(GanttTableBodyComponent, { static: true }) GanttTableBodyComponent: GanttTableBodyComponent;

    @ViewChild(GanttMainComponent, { static: true }) ganttMainComponent: GanttMainComponent;

    items = getMockGroupItems();

    groups = getMockGroups();

    selectable = true;

    multiple = true;

    showExpandIcon = true;

    constructor() {}
}

describe('GanttTable', () => {
    let component: TestGanttTableBodyComponent;
    let fixture: ComponentFixture<TestGanttTableBodyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgxGanttModule],
            declarations: [TestGanttTableBodyComponent]
        }).compileComponents();
    }));

    beforeEach(async () => {
        fixture = TestBed.createComponent(TestGanttTableBodyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create gantt-table', () => {
        expect(component).toBeDefined();
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        expect(ganttTable).toBeTruthy();
        expect(ganttTable.nativeElement).toBeTruthy();
    });

    it('should expand groups', () => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        expect(ganttTable.query(By.css('.gantt-table-group-title')).nativeNode.classList.contains('expanded')).toBeTruthy();
        ganttTable.query(By.css('.gantt-table-group-title')).nativeNode.click();
        fixture.detectChanges();
        expect(ganttTable.query(By.css('.gantt-table-group-title')).nativeNode.classList.contains('expanded')).toBeFalsy();
    });

    it('should expand children', () => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const tableChildrenLength = ganttTable.query(By.css('.gantt-table-body-container')).children.length;
        ganttTable.nativeElement.querySelector('.gantt-table-item-with-group .gantt-expand-icon .expand-icon').click();
        fixture.detectChanges();
        expect(ganttTable.query(By.css('.gantt-table-body-container')).children.length).toEqual(tableChildrenLength);
    });

    it('should column drag', fakeAsync(() => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableHeaderComponent));
        const dragTrigger = ganttTable.nativeElement.querySelector('.column-resize-handle');
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
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableHeaderComponent));
        const dragTrigger = ganttTable.nativeElement.querySelector('.table-resize-handle');
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

    it('should active item when click item and selectable is true', fakeAsync(() => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const selectionModel = ganttTable.componentInstance.ganttUpper.selectionModel;
        const items = component.items;

        ganttTable.query(By.css('.gantt-table-item')).nativeNode.click();
        fixture.detectChanges();
        tick(200);
        expect(selectionModel.hasValue()).toBeTrue();
        expect(selectionModel.selected[0]).toEqual(items[0].id);
    }));

    it('should has active class when click item and selectable is true', fakeAsync(() => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const ganttMain: DebugElement = fixture.debugElement.query(By.directive(GanttMainComponent));
        const itemNode = ganttTable.query(By.css('.gantt-table-item')).nativeNode;
        const mainItemNode = ganttMain.query(By.css('.gantt-item')).nativeNode;
        itemNode.click();
        fixture.detectChanges();
        tick(200);
        expect(itemNode.classList).toContain('gantt-table-item-active');
        expect(mainItemNode.classList).toContain('gantt-main-item-active');
    }));

    it('should active two item when click two item and multiple is true', () => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const selectionModel = ganttTable.componentInstance.ganttUpper.selectionModel;
        const items = component.items;
        const itemNodes = ganttTable.queryAll(By.css('.gantt-table-item'));

        itemNodes[0].nativeNode.click();
        expect(selectionModel.selected.length).toEqual(1);
        itemNodes[1].nativeNode.click();
        expect(selectionModel.selected.length).toEqual(2);
        expect(selectionModel.selected.join(' ')).toEqual(
            items
                .slice(0, 2)
                .map((item) => item.id)
                .join(' ')
        );
        itemNodes[1].nativeNode.click();
        expect(selectionModel.selected.length).toEqual(1);
        expect(selectionModel.selected[0]).toEqual(items[0].id);
    });

    it('should active one item when multiple is false', () => {
        fixture.componentInstance.multiple = false;
        fixture.detectChanges();
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const selectionModel = ganttTable.componentInstance.ganttUpper.selectionModel;
        const items = component.items;
        const itemNodes = ganttTable.queryAll(By.css('.gantt-table-item'));
        itemNodes[0].nativeNode.click();
        expect(selectionModel.selected.length).toEqual(1);
        itemNodes[1].nativeNode.click();
        expect(selectionModel.selected.length).toEqual(1);
        expect(selectionModel.selected[0]).toEqual(items[1].id);
    });

    it('should toggle active one item when multiple is false and click same item', () => {
        fixture.componentInstance.multiple = false;
        fixture.detectChanges();
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const selectionModel = ganttTable.componentInstance.ganttUpper.selectionModel;
        const itemNode = ganttTable.query(By.css('.gantt-table-item')).nativeNode;
        itemNode.click();
        expect(selectionModel.selected.length).toEqual(1);
        itemNode.click();
        expect(selectionModel.selected.length).toEqual(0);
    });

    it('should fixed expand icon column', () => {
        const ganttTable: DebugElement = fixture.debugElement.query(By.directive(GanttTableBodyComponent));
        const column = ganttTable.queryAll(By.css('.gantt-table-item'))[0].queryAll(By.css('.gantt-table-column'))[1];
        expect(column.nativeElement.querySelector('.gantt-expand-icon').classList.contains('gantt-expand-icon')).toBeTrue();
    });
});
