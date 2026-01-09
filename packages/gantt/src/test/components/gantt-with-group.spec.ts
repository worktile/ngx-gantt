import { CommonModule } from '@angular/common';
import { Component, provideZoneChangeDetection, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GanttGroupInternal } from '../../class';
import { GanttViewType } from '../../class/view-type';
import { NgxGanttBarComponent } from '../../components/bar/bar.component';
import { NgxGanttComponent } from '../../gantt.component';
import { NgxGanttModule } from '../../gantt.module';
import { assertConfigStyle, assertGroups } from './assert-helper';
import { getMockGroupItems, getMockGroups, getMockItems } from './mocks/data';

const mockItems = getMockItems();
const mockGroups = getMockGroups();
const mockGroupItems = getMockGroupItems();

@Component({
    selector: 'test-gantt-with-groups',
    template: ` <button class="expand" (click)="gantt.expandAll()">全部展开</button>
        <button class="collapse" (click)="gantt.collapseAll()">全部收起</button>
        <ngx-gantt #gantt [groups]="groups" [items]="items" [viewType]="viewType">
            <ng-template #groupHeader let-group="group">
                <div class="test-gantt-with-groups-group-header"></div>
            </ng-template>
            <ng-template #group let-group="group">
                <div class="test-gantt-with-groups-group"></div>
            </ng-template>
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
export class TestGanttWithGroupsComponent {
    readonly ganttComponent = viewChild<NgxGanttComponent>('gantt');

    constructor() {}

    viewType = GanttViewType.month;

    groups = mockGroups;

    items = mockGroupItems;
}

describe('gantt-with-groups-component', () => {
    let fixture: ComponentFixture<TestGanttWithGroupsComponent>;
    let ganttComponentInstance: TestGanttWithGroupsComponent;
    let ganttComponent: NgxGanttComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttWithGroupsComponent],
            providers: [provideZoneChangeDetection()]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttWithGroupsComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        ganttComponentInstance = fixture.componentInstance;
        ganttComponent = ganttComponentInstance.ganttComponent();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    describe('#groups rendering', () => {
        it('should render groups', () => {
            const groups = fixture.debugElement.queryAll(By.css('.gantt-group'));
            expect(groups.length).toEqual(mockGroups.length);
        });

        it('should render group items', () => {
            assertGroups(fixture, mockGroups);
        });

        it('should re render groups when change groups', () => {
            const newGroups = mockItems.slice(0, 2);
            ganttComponentInstance.groups = [...newGroups];
            fixture.detectChanges();
            assertGroups(fixture, newGroups);
        });

        it('should render custom group template', () => {
            const groups = fixture.debugElement.queryAll(By.css('.test-gantt-with-groups-group'));
            const groupHeaders = fixture.debugElement.queryAll(By.css('.test-gantt-with-groups-group-header'));
            expect(groups.length).toEqual(mockGroups.length);
            expect(groupHeaders.length).toEqual(mockGroups.length);
        });
    });

    describe('#group-expanded-and-collapsed', () => {
        it('should group can be expanded', () => {
            const groupTitle = fixture.debugElement.query(By.css('.gantt-table-group-title'));
            groupTitle.nativeElement.click();
            expect(ganttComponent.groups[0].expanded).toBe(false);
            groupTitle.nativeElement.click();
            expect(ganttComponent.groups[0].expanded).toBe(true);
        });

        it('should expand all groups ', () => {
            const groupExpandAll = fixture.debugElement.query(By.css('.expand'));
            groupExpandAll.nativeElement.click();
            ganttComponent.groups.forEach((group: GanttGroupInternal) => {
                expect(group.expanded).toBe(true);
            });
        });

        it('should collapse all groups ', () => {
            const groupCollapseAll = fixture.debugElement.query(By.css('.collapse'));
            groupCollapseAll.nativeElement.click();
            const afterCollapseItems = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
            ganttComponent.groups.forEach((group: GanttGroupInternal) => {
                expect(group.expanded).toBe(false);
            });
            expect(afterCollapseItems.length).toEqual(0);
        });
    });

    describe('#global-config', () => {
        it('should apply global style configuration correctly to the gantt component', () => {
            assertConfigStyle(ganttComponent, fixture.debugElement);
        });
    });
});
