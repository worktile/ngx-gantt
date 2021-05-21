import { Component, DebugElement, SimpleChange, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
    GanttBarClickEvent,
    GanttDragEvent,
    GanttGroupInternal,
    GanttItem,
    GanttLineClickEvent,
    GanttLinkDragEvent,
    GanttLoadOnScrollEvent,
    GanttTableEvent
} from '../class';
import { GanttViewType } from '../class/view-type';
import { GanttPrintService } from '../gantt-print.service';
import { NgxGanttComponent } from '../gantt.component';
import { NgxGanttModule } from '../gantt.module';
import { GanttDate } from '../utils/date';
import { mockGroupItems, mockGroups } from './mocks/data';
import { CommonModule } from '@angular/common';
import { GanttCalendarComponent } from '../components/calendar/calendar.component';
import { mockItems } from '../test/mocks/data';
import { NgxGanttBarComponent } from '../components/bar/bar.component';
import { NgxGanttRootComponent } from '../root.component';
import { GanttViewMonth } from '../views/month';
import { GanttViewDay } from '../views/day';

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
    template: ` <ngx-gantt #gantt [groups]="groups" [items]="items" [viewType]="viewType" [disabledLoadOnScroll]="true">
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

function assertItems<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedItems: GanttItem[]) {
    const ganttComponent = fixture.componentInstance.ganttComponent;
    const items = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
    expect(items.length).toEqual(expectedItems.length);
    items.forEach((item: DebugElement, index: number) => {
        expect(mockItems[index].id).toEqual(expectedItems[index].id);
        const elem = item.nativeElement as HTMLElement;
        const top = elem.style.getPropertyValue('top');
        const left = elem.style.getPropertyValue('left');
        const width = elem.style.getPropertyValue('width');
        expect(top).toEqual(ganttComponent.items[index].refs.y + 'px');
        expect(left).toEqual(ganttComponent.items[index].refs.x + 'px');
        expect(width).toEqual(ganttComponent.items[index].refs.width + 'px');
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

        it('should render groups', () => {});

        it('should render group items', () => {});

        it('should render custom group template', () => {
            // group template
            // group header template
        });

        it('should re render groups when change groups', () => {});

        it('should group can be expanded', () => {});

        it('should expand all groups ', () => {});

        it('should collapse all groups ', () => {});
    });

    describe('#load children', () => {
        it('should show expand icon', () => {});

        it('should load children', () => {});

        it('should load async children', () => {});
    });

    describe('#draggable', () => {});
});

// describe('NgxGantt', () => {
//     let fixture: ComponentFixture<TestGanttBasicComponent>;
//     let testComponent: TestGanttBasicComponent;
//     let ganttComponent;
//     let ganttComponentInstance;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [CommonModule, NgxGanttModule],
//             declarations: [TestGanttBasicComponent]
//         });

//         TestBed.compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(TestGanttBasicComponent);
//         testComponent = fixture.debugElement.componentInstance;
//         ganttComponent = fixture.debugElement.query(By.directive(NgxGanttComponent));
//         ganttComponentInstance = ganttComponent.componentInstance;
//     });

//     it('should create ganttComponent', () => {
//         expect(ganttComponent).toBeTruthy();
//     });

//     it('should init ganttComponent', () => {
//         fixture.detectChanges();
//         expect(ganttComponentInstance.groups.length).toBe(mockGroups.length);
//         expect(ganttComponentInstance.view).toEqual(jasmine.any(GanttViewMonth));
//     });

//     it('should change viewType', () => {
//         testComponent.options.viewType = GanttViewType.day;
//         fixture.detectChanges();
//         ganttComponentInstance.ngOnChanges({
//             viewType: new SimpleChange(GanttViewType.month, GanttViewType.day, false)
//         });
//         expect(ganttComponentInstance.view).toEqual(jasmine.any(GanttViewDay));
//     });

//     it('should has items when has no group', () => {
//         testComponent.groups = [];
//         fixture.detectChanges();
//         ganttComponentInstance.ngOnChanges({
//             originGroups: new SimpleChange(mockGroups, [], false)
//         });
//         expect(ganttComponentInstance.items.length).toBe(mockItems.length);
//     });

//     it('should has correct view when has no start or end', () => {
//         testComponent.start = null;
//         testComponent.end = null;
//         fixture.detectChanges();
//         expect(ganttComponentInstance.view.start.getUnixTime()).toBe(new GanttDate('2020-04-01 00:00:00').getUnixTime());
//         expect(ganttComponentInstance.view.end.getUnixTime()).toBe(new GanttDate('2021-12-31 23:59:59').getUnixTime());
//     });

//     it('should expand group ', () => {
//         fixture.detectChanges();
//         const group = ganttComponentInstance.groups[0];
//         ganttComponentInstance.expandGroup(group);
//         expect(group.expanded).toBe(false);
//         ganttComponentInstance.expandGroup(group);
//         expect(group.expanded).toBe(true);
//     });

//     it('should expand children ', fakeAsync(() => {
//         testComponent.options.async = true;
//         fixture.detectChanges();
//         const itemWithChildren = ganttComponentInstance.groups[0].items[0];
//         const itemWithoutChildren = ganttComponentInstance.groups[0].items[1];
//         ganttComponentInstance.expandChildren(itemWithChildren);
//         ganttComponentInstance.expandChildren(itemWithoutChildren);
//         tick(2000);
//         fixture.detectChanges();
//         expect(itemWithChildren.expanded).toBe(true);
//         expect(itemWithoutChildren.expanded).toBe(true);
//         expect(itemWithoutChildren.children.length).toBe(1);

//         ganttComponentInstance.expandChildren(itemWithChildren);
//         expect(itemWithChildren.expanded).toBe(false);
//     }));

//     it('should expand or collapse all ', () => {
//         fixture.detectChanges();
//         ganttComponentInstance.expandAll();
//         ganttComponentInstance.groups.forEach((group) => {
//             expect(group.expanded).toBe(true);
//         });

//         ganttComponentInstance.collapseAll();
//         ganttComponentInstance.groups.forEach((group) => {
//             expect(group.expanded).toBe(false);
//         });
//     });
// });
