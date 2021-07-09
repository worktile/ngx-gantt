import { GanttGroupInternal } from './../class/group';
import { GanttItemInternal } from './../class/item';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GanttBarClickEvent, GanttGroup, GanttItem } from '../class';
import { GanttViewType } from '../class/view-type';
import { GanttPrintService } from '../gantt-print.service';
import { NgxGanttComponent } from '../gantt.component';
import { NgxGanttModule } from '../gantt.module';
import { GanttDate } from '../utils/date';
import { getMockGroupItems, getMockGroups, getMockItems } from './mocks/data';
import { CommonModule } from '@angular/common';
import { GanttCalendarComponent } from '../components/calendar/calendar.component';
import { NgxGanttBarComponent } from '../components/bar/bar.component';
import { GanttIconComponent } from '../components/icon/icon.component';
import { NgxGanttRootComponent } from '../root.component';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const mockItems = getMockItems();
const mockGroupItems = getMockGroupItems();
const mockGroups = getMockGroups();

// Basic Component
@Component({
    selector: 'test-gantt-basic',
    template: ` <ngx-gantt #gantt [start]="start" [end]="end" [items]="items" [viewType]="viewType" (barClick)="barClick($event)">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`
})
export class TestGanttBasicComponent {
    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}

    start = new GanttDate('2020-09-02 00:00:00').getUnixTime();

    end = new GanttDate('2021-12-01 00:00:00').getUnixTime();

    viewType = 'month';

    items = mockItems;

    barClick(event: GanttBarClickEvent) {
        console.log(event);
    }
}

// With Group Component
@Component({
    selector: 'test-gantt-with-groups',
    template: ` <button class="expand" (click)="gantt.expandAll()">全部展开</button>
        <button class="collapse" (click)="gantt.collapseAll()">全部收起</button>
        <ngx-gantt #gantt [groups]="groups" [items]="items" [viewType]="viewType" [disabledLoadOnScroll]="true">
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
        </ngx-gantt>`
})
export class TestGanttWithGroupsComponent {
    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}

    viewType = 'month';

    groups = mockGroups;

    items = mockGroupItems;
}

// load children
@Component({
    selector: 'test-gantt-load-children',
    template: ` <ngx-gantt #gantt [items]="items" [viewType]="viewType" [async]="async" [childrenResolve]="childrenResolve">
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`
})
export class TestGanttLoadChildrenComponent {
    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}

    viewType = 'month';

    items = mockItems;

    async = false;

    childrenResolve = this.getChildren.bind(this);

    getChildren() {
        return of([
            {
                id: new Date().getTime(),
                title: new Date().getTime(),
                start: Math.floor(new Date().getTime() / 1000),
                draggable: true,
                linkable: false
            }
        ]).pipe(delay(1000));
    }
}

interface TestGanttComponentBase {
    ganttComponent: NgxGanttComponent;
}

function assertGanttView<T extends TestGanttComponentBase>(
    fixture: ComponentFixture<T>,
    expected: {
        firstPrimaryDataPointText: string;
        lastPrimaryDataPointText: string;
        firstSecondaryDataPointText: string;
        lastSecondaryDataPointText: string;
    }
) {
    const calendarElement = fixture.debugElement.query(By.directive(GanttCalendarComponent));
    const primaryElements = calendarElement.queryAll(By.css('.primary-text'));
    const secondaryElements = calendarElement.queryAll(By.css('.secondary-text'));
    expect(primaryElements.length).toEqual(fixture.componentInstance.ganttComponent.view.primaryDatePoints.length);
    expect(secondaryElements.length).toEqual(fixture.componentInstance.ganttComponent.view.secondaryDatePoints.length);
    expect(primaryElements[0].nativeElement.textContent).toContain(expected.firstPrimaryDataPointText);
    expect(primaryElements[primaryElements.length - 1].nativeElement.textContent).toContain(expected.lastPrimaryDataPointText);
    expect(secondaryElements[0].nativeElement.textContent).toContain(expected.firstSecondaryDataPointText);
    expect(secondaryElements[secondaryElements.length - 1].nativeElement.textContent).toContain(expected.lastSecondaryDataPointText);
}

function assertItem(item: DebugElement, ganttItem: GanttItemInternal) {
    const elem = item.nativeElement as HTMLElement;
    const top = elem.style.getPropertyValue('top');
    const left = elem.style.getPropertyValue('left');
    const width = elem.style.getPropertyValue('width');
    expect(top).toEqual(ganttItem.refs.y + 'px');
    expect(left).toEqual(ganttItem.refs.x + 'px');
    expect(width).toEqual(ganttItem.refs.width + 'px');
}

function assertItems<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedItems: GanttItem[]) {
    const ganttComponent = fixture.componentInstance.ganttComponent;
    const items = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
    expect(items.length).toEqual(expectedItems.length);
    items.forEach((item: DebugElement, index: number) => {
        expect(ganttComponent.items[index].id).toEqual(expectedItems[index].id);
        assertItem(item, ganttComponent.items[index]);
    });
}

function assertGroups<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedGroups: GanttGroup[]) {
    const ganttComponent = fixture.componentInstance.ganttComponent;
    const groups = fixture.debugElement.queryAll(By.css('.gantt-group'));
    groups.forEach((group: DebugElement, groupIndex: number) => {
        expect(ganttComponent.groups[groupIndex].id).toEqual(expectedGroups[groupIndex].id);
        const items = group.queryAll(By.directive(NgxGanttBarComponent));
        items.forEach((item: DebugElement, itemIndex: number) => {
            assertItem(item, ganttComponent.groups[groupIndex].items[itemIndex]);
        });
    });
}

describe('ngx-gantt', () => {
    describe('#basic', () => {
        let fixture: ComponentFixture<TestGanttBasicComponent>;
        let ganttComponentInstance: TestGanttBasicComponent;
        let ganttDebugElement: DebugElement;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttBasicComponent],
                providers: [GanttPrintService]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttBasicComponent);
            fixture.detectChanges();
            ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
            ganttComponentInstance = fixture.componentInstance;
            ganttComponent = ganttComponentInstance.ganttComponent;
            fixture.detectChanges();
        });

        it('should create ganttComponent', () => {
            expect(ganttComponentInstance).toBeTruthy();
        });

        it('should render month view', () => {
            assertGanttView(fixture, {
                firstPrimaryDataPointText: '2020年Q3',
                lastPrimaryDataPointText: '2021年Q4',
                firstSecondaryDataPointText: '7月',
                lastSecondaryDataPointText: '12月'
            });
        });

        it('should render items', () => {
            assertItems(fixture, mockItems);
        });

        it('should bar click', fakeAsync(() => {
            const barClickSpy = spyOn(ganttComponentInstance, 'barClick').and.callFake((event: GanttBarClickEvent) => {
                expect(event.event.type).toEqual('click');
                expect(event.item.title).toEqual(mockItems[0].title);
            });
            const bar = fixture.debugElement.query(By.directive(NgxGanttBarComponent)).query(By.css('.gantt-bar-content'));
            bar.nativeElement.click();
            expect(barClickSpy).toHaveBeenCalledTimes(1);
        }));

        it('should register print service', () => {
            expect(TestBed.inject(GanttPrintService)['root']).toEqual(
                ganttDebugElement.query(By.directive(NgxGanttRootComponent)).nativeElement
            );
        });

        it('should re render view when change view type', () => {
            ganttComponentInstance.viewType = GanttViewType.day;
            fixture.detectChanges();
            assertGanttView(fixture, {
                firstPrimaryDataPointText: '2020年09月',
                lastPrimaryDataPointText: '2021年12月',
                firstSecondaryDataPointText: '31',
                lastSecondaryDataPointText: '5'
            });
        });

        it('should re render items when change items', () => {
            const newItems = mockItems.slice(0, 5);
            ganttComponentInstance.items = [...newItems];
            fixture.detectChanges();
            assertItems(fixture, newItems);
        });

        it('should has empty class when has no items', () => {
            ganttComponentInstance.items = [];
            fixture.detectChanges();
            const ganttTableElement = ganttDebugElement.query(By.css('.gantt-table'));
            expect(ganttTableElement.nativeElement.classList).toContain('gantt-table-empty');
        });

        it('should re render when scroll load', () => {});
    });

    describe('#with groups', () => {
        let fixture: ComponentFixture<TestGanttWithGroupsComponent>;
        let ganttComponentInstance: TestGanttWithGroupsComponent;
        let ganttDebugElement: DebugElement;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttWithGroupsComponent],
                providers: [GanttPrintService]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttWithGroupsComponent);
            fixture.detectChanges();
            ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
            ganttComponentInstance = fixture.componentInstance;
            ganttComponent = ganttComponentInstance.ganttComponent;
            fixture.detectChanges();
        });

        it('should render groups', () => {
            const groups = fixture.debugElement.queryAll(By.css('.gantt-group'));
            expect(groups.length).toEqual(mockGroups.length);
        });

        it('should render group items', () => {
            assertGroups(fixture, mockGroups);
        });

        it('should render custom group template', () => {
            const groups = fixture.debugElement.queryAll(By.css('.test-gantt-with-groups-group'));
            const groupHeaders = fixture.debugElement.queryAll(By.css('.test-gantt-with-groups-group-header'));
            expect(groups.length).toEqual(mockGroups.length);
            expect(groupHeaders.length).toEqual(mockGroups.length);
        });

        it('should re render groups when change groups', () => {
            const newGroups = mockItems.slice(0, 2);
            ganttComponentInstance.groups = [...newGroups];
            fixture.detectChanges();
            assertGroups(fixture, newGroups);
        });

        it('should group can be expanded', () => {
            const groupTitle = fixture.debugElement.query(By.css('.gantt-table-group-title'));
            groupTitle.nativeElement.click();
            const afterCollapseItems = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
            expect(ganttComponent.groups[0].expanded).toBe(false);
            expect(afterCollapseItems.length).toEqual(mockGroupItems.length - ganttComponent.groups[0].items.length);

            groupTitle.nativeElement.click();
            const afterExpandItems = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
            expect(ganttComponent.groups[0].expanded).toBe(true);
            expect(afterExpandItems.length).toEqual(mockGroupItems.length);
        });

        it('should expand all groups ', () => {
            const groupExpandAll = fixture.debugElement.query(By.css('.expand'));
            groupExpandAll.nativeElement.click();
            const afterExpandItems = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
            ganttComponent.groups.forEach((group: GanttGroupInternal) => {
                expect(group.expanded).toBe(true);
            });
            expect(afterExpandItems.length).toEqual(mockGroupItems.length);
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

    describe('#load children', () => {
        let fixture: ComponentFixture<TestGanttLoadChildrenComponent>;
        let ganttComponentInstance: TestGanttLoadChildrenComponent;
        let ganttDebugElement: DebugElement;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttLoadChildrenComponent],
                providers: [GanttPrintService]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttLoadChildrenComponent);
            fixture.detectChanges();
            ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
            ganttComponentInstance = fixture.componentInstance;
            ganttComponent = ganttComponentInstance.ganttComponent;
            fixture.detectChanges();
        });

        it('should show expand icon and load children', () => {
            const ganttIcons = fixture.debugElement.queryAll(By.directive(GanttIconComponent));
            expect(ganttIcons.length).toEqual(2);
        });

        it('should load children', () => {
            const ganttIcon = fixture.debugElement.queryAll(By.directive(GanttIconComponent))[0];
            ganttIcon.nativeElement.click();
            fixture.detectChanges();
            const afterExpandItems = fixture.debugElement.queryAll(By.css('.gantt-table-item'));
            expect(ganttComponent.items[0].expanded).toBe(true);
            expect(afterExpandItems.length).toEqual(mockItems.length + ganttComponent.items[0].children.length);

            ganttIcon.nativeElement.click();
            fixture.detectChanges();
            const afterCollapseItems = fixture.debugElement.queryAll(By.css('.gantt-table-item'));
            expect(ganttComponent.items[0].expanded).toBe(false);
            expect(afterCollapseItems.length).toEqual(mockItems.length);
        });

        it('should load async children', fakeAsync(() => {
            ganttComponentInstance.async = true;
            fixture.detectChanges();
            const ganttIcon = fixture.debugElement.queryAll(By.directive(GanttIconComponent))[1];
            ganttIcon.nativeElement.click();
            tick(2000);
            fixture.detectChanges();
            const afterExpandItems = fixture.debugElement.queryAll(By.css('.gantt-table-item'));
            expect(ganttComponent.items[1].expanded).toBe(true);
            expect(afterExpandItems.length).toEqual(mockItems.length + 1);

            ganttIcon.nativeElement.click();
            tick(2000);
            fixture.detectChanges();
            const afterCollapseItems = fixture.debugElement.queryAll(By.css('.gantt-table-item'));
            expect(ganttComponent.items[1].expanded).toBe(false);
            expect(afterCollapseItems.length).toEqual(mockItems.length);
        }));
    });

    describe('#draggable', () => {});
});
