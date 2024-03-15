import { GanttBaselineItem, GanttBaselineItemInternal } from './../class/baseline';
import { GanttGroupInternal } from './../class/group';
import { GanttItemInternal } from './../class/item';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GanttBarClickEvent, GanttGroup, GanttItem, GanttSelectedEvent, GanttToolbarOptions } from '../class';
import { GanttViewType } from '../class/view-type';
import { GanttPrintService } from '../gantt-print.service';
import { NgxGanttComponent } from '../gantt.component';
import { NgxGanttModule } from '../gantt.module';
import { GanttDate } from '../utils/date';
import { getMockBaselineItems, getMockGroupItems, getMockGroups, getMockItems } from './mocks/data';
import { CommonModule } from '@angular/common';
import { NgxGanttBarComponent } from '../components/bar/bar.component';
import { GanttIconComponent } from '../components/icon/icon.component';
import { NgxGanttRootComponent } from '../root.component';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GANTT_GLOBAL_CONFIG } from '../gantt.config';
import { NgxGanttBaselineComponent } from '../components/baseline/baseline.component';
import { GanttTableBodyComponent } from '../components/table/body/gantt-table-body.component';
import { GanttLoaderComponent } from '../components/loader/loader.component';
import { GanttCalendarHeaderComponent } from '../components/calendar/header/calendar-header.component';

const mockItems = getMockItems();
const mockGroupItems = getMockGroupItems();
const mockGroups = getMockGroups();
const mockBaselineItems = getMockBaselineItems();

const config = {
    dateFormat: {
        week: 'w',
        month: 'MM',
        quarter: 'Q',
        year: 'yyyy',
        yearMonth: 'yyyy/MM',
        yearQuarter: 'yyyy/QQQ'
    },
    styleOptions: {
        headerHeight: 60,
        lineHeight: 60,
        barHeight: 30
    }
};

// Basic Component
@Component({
    selector: 'test-gantt-basic',
    template: ` <ngx-gantt
        #gantt
        [start]="start"
        [end]="end"
        [items]="items"
        [baselineItems]="baselineItems"
        [viewType]="viewType"
        [loading]="loading"
        [loadingDelay]="loadingDelay"
        [viewOptions]="viewOptions"
        [showToolbar]="showToolbar"
        [virtualScrollEnabled]="virtualScrollEnabled"
        [toolbarOptions]="toolbarOptions"
        (barClick)="barClick($event)"
    >
        <ngx-gantt-table>
            <ng-template #rowBeforeSlot>
                <div class="row-before"></div>
            </ng-template>
            <ng-template #rowAfterSlot>
                <div class="row-after"></div>
            </ng-template>
            <ngx-gantt-column
                name="标题"
                width="200px"
                [class.title-name]="true"
                [ngClass]="{ 'title-name-2': true }"
                [class]="'title-name-3'"
            >
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

    viewType = GanttViewType.month;

    items = mockItems;

    loading = false;

    loadingDelay = 0;

    baselineItems = mockBaselineItems;

    virtualScrollEnabled = true;

    viewOptions = {
        dateFormat: {
            yearMonth: 'yyyy-MM'
        }
    };

    showToolbar = true;

    toolbarOptions: GanttToolbarOptions = {
        viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
    };

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

    viewType = GanttViewType.month;

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

    viewType = GanttViewType.month;

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

// selectable Component
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
    </ngx-gantt>`
})
export class TestGanttSelectableComponent {
    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}

    selectable = true;

    multiple = true;

    items = mockItems;

    selectedChange(event: GanttSelectedEvent) {
        console.log(event);
    }
}

// customToolbar
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
    </ngx-gantt>`
})
export class TestGanttCustomToolbarComponent {
    items = mockItems;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    constructor() {}
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
    const calendarElement = fixture.debugElement.query(By.directive(GanttCalendarHeaderComponent));
    const primaryElements = calendarElement.queryAll(By.css('.primary-text'));
    const secondaryElements = calendarElement.queryAll(By.css('.secondary-text'));
    expect(primaryElements.length).toEqual(fixture.componentInstance.ganttComponent.view.primaryDatePoints.length);
    expect(secondaryElements.length).toEqual(fixture.componentInstance.ganttComponent.view.secondaryDatePoints.length);
    expect(primaryElements[0].nativeElement.textContent).toContain(expected.firstPrimaryDataPointText);
    expect(primaryElements[primaryElements.length - 1].nativeElement.textContent).toContain(expected.lastPrimaryDataPointText);
    expect(secondaryElements[0].nativeElement.textContent).toContain(expected.firstSecondaryDataPointText);
    expect(secondaryElements[secondaryElements.length - 1].nativeElement.textContent).toContain(expected.lastSecondaryDataPointText);
}

function assertItem(item: DebugElement, ganttItem: GanttItemInternal | GanttBaselineItemInternal) {
    const elem = item.nativeElement as HTMLElement;
    const top = elem.style.getPropertyValue('top');
    const bottom = elem.style.getPropertyValue('bottom');
    const left = elem.style.getPropertyValue('left');
    const width = elem.style.getPropertyValue('width');
    if (ganttItem instanceof GanttItemInternal) {
        expect(top).toEqual(ganttItem.refs.y + 'px');
    } else {
        expect(bottom).toEqual(2 + 'px');
    }

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

function assertBaselineItems<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedItems: GanttBaselineItem[]) {
    const ganttComponent = fixture.componentInstance.ganttComponent;
    const items = fixture.debugElement.queryAll(By.directive(NgxGanttBaselineComponent));
    expect(items.length).toEqual(expectedItems.length);
    items.forEach((item: DebugElement, index: number) => {
        expect(ganttComponent.baselineItems[index].id).toEqual(expectedItems[index].id);
        assertItem(item, ganttComponent.baselineItems[index]);
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

function assertConfigStyle(ganttComponent: NgxGanttComponent, ganttDebugElement: DebugElement) {
    const styleOptionsBindElement = {
        headerHeight: ['.gantt-calendar-header', '.gantt-table-header'],
        lineHeight: ['.gantt-item', '.gantt-table-item', '.gantt-group', '.gantt-table-group'],
        barHeight: ['.gantt-bar']
    };
    for (const key in styleOptionsBindElement) {
        if (Object.prototype.hasOwnProperty.call(styleOptionsBindElement, key)) {
            const bindElementsClass = styleOptionsBindElement[key];
            bindElementsClass.forEach((elementClass) => {
                const element = ganttDebugElement.query(By.css(elementClass));
                if (element) {
                    const height = element.nativeElement.style.getPropertyValue('height');
                    expect(height).toEqual(ganttComponent.config.styleOptions[key] + 'px');
                }
            });
        }
    }
}

describe('ngx-gantt', () => {
    describe('#basic', () => {
        let fixture: ComponentFixture<TestGanttBasicComponent>;
        let ganttComponentInstance: TestGanttBasicComponent;
        let ganttDebugElement: DebugElement;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttBasicComponent],
                providers: [
                    GanttPrintService,
                    {
                        provide: GANTT_GLOBAL_CONFIG,
                        useValue: config
                    }
                ]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttBasicComponent);
            fixture.detectChanges();
            await fixture.whenStable();
            ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
            ganttComponentInstance = fixture.componentInstance;
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should create ganttComponent', () => {
            expect(ganttComponentInstance).toBeTruthy();
        });

        it('should render month view', () => {
            assertGanttView(fixture, {
                firstPrimaryDataPointText: '2020/Q3',
                lastPrimaryDataPointText: '2021/Q4',
                firstSecondaryDataPointText: '07',
                lastSecondaryDataPointText: '12'
            });
        });

        it('should render items', () => {
            assertItems(fixture, mockItems);
        });

        it('should render baseline items', () => {
            assertBaselineItems(fixture, mockBaselineItems);
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
                firstPrimaryDataPointText: '2020-09',
                lastPrimaryDataPointText: '2021-12',
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

        it('should re render baseline items when change baseline items', () => {
            const newItems = mockBaselineItems.slice(0, 2);
            ganttComponentInstance.baselineItems = [...newItems];
            fixture.detectChanges();
            assertBaselineItems(fixture, newItems);
        });

        it('should has empty class when has no items', () => {
            ganttComponentInstance.items = [];
            fixture.detectChanges();
            const ganttTableElement = ganttDebugElement.query(By.css('.gantt-table-body'));
            expect(ganttTableElement.nativeElement.classList).toContain('gantt-table-empty');
        });

        it('should render table row before and after template', () => {
            fixture.detectChanges();
            const rowBeforeElements = ganttDebugElement.queryAll(By.css('.row-before'));
            const rowAfterElements = ganttDebugElement.queryAll(By.css('.row-before'));
            expect(rowBeforeElements.length).toEqual(ganttComponentInstance.items.length);
            expect(rowAfterElements.length).toEqual(ganttComponentInstance.items.length);
        });

        it('should re render when scroll load', () => {});

        it('should create toolbar and toolbar views', () => {
            const toolbarComponent = fixture.debugElement.query(By.css('.gantt-toolbar'));
            const views = toolbarComponent.queryAll(By.css('.toolbar-view'));
            expect(toolbarComponent).toBeTruthy();
            expect(views.length).toBe(3);
        });

        it('should hide toolbar when showToolbar is false', () => {
            ganttComponentInstance.showToolbar = false;
            fixture.detectChanges();
            const toolbarComponent = fixture.debugElement.query(By.css('.gantt-toolbar'));
            expect(toolbarComponent).toBeFalsy();
        });

        it('should hide toolbar when has no view types', () => {
            ganttComponentInstance.toolbarOptions = {
                viewTypes: []
            };
            fixture.detectChanges();
            const toolbarViews = fixture.debugElement.query(By.css('.toolbar-views'));
            expect(toolbarViews).toBeFalsy();
        });

        it('should show gantt loader when loading with true', fakeAsync(() => {
            ganttComponentInstance.loading = true;
            fixture.detectChanges();
            let loaderDom = fixture.debugElement.query(By.directive(GanttLoaderComponent));
            expect(loaderDom).toBeTruthy();
            ganttComponentInstance.loading = false;
            fixture.detectChanges();
            loaderDom = fixture.debugElement.query(By.directive(GanttLoaderComponent));
            tick(200);
            expect(loaderDom).toBeFalsy();
        }));

        it('should hide loader when loading time less than loadingDelay', fakeAsync(() => {
            ganttComponentInstance.loadingDelay = 2000;
            fixture.detectChanges();
            ganttComponentInstance.loading = true;
            fixture.detectChanges();
            let loaderDom = fixture.debugElement.query(By.directive(GanttLoaderComponent));
            expect(loaderDom).toBeFalsy();
            tick(1000);
            loaderDom = fixture.debugElement.query(By.directive(GanttLoaderComponent));
            expect(loaderDom).toBeFalsy();
            tick(2000);
            fixture.detectChanges();
            loaderDom = fixture.debugElement.query(By.directive(GanttLoaderComponent));
            expect(loaderDom).toBeTruthy();
            ganttComponentInstance.loading = false;
            fixture.detectChanges();
            loaderDom = fixture.debugElement.query(By.directive(GanttLoaderComponent));
            tick(200);
            expect(loaderDom).toBeFalsy();
        }));

        it('should column inherits the class when gantt-table-column sets class', fakeAsync(() => {
            const newItems = mockItems.slice(0, 1);
            ganttComponentInstance.items = [...newItems];
            fixture.detectChanges();
            const ganttTable: DebugElement = ganttDebugElement.query(By.directive(GanttTableBodyComponent));
            const ganttTableColumn = ganttTable.query(By.css('.gantt-table-column')).nativeElement;
            tick(200);
            expect(ganttTableColumn.classList).toContain('title-name');
            expect(ganttTableColumn.classList).toContain('title-name-2');
            expect(ganttTableColumn.classList).toContain('title-name-3');
        }));

        it('should viewport has correct class', () => {
            const viewportElement = ganttDebugElement.query(By.css('.gantt-virtual-scroll-viewport'));
            expect(viewportElement.nativeElement.classList).not.toContain('gantt-normal-viewport');
            ganttComponentInstance.virtualScrollEnabled = false;
            fixture.detectChanges();
            expect(viewportElement.nativeElement.classList).toContain('gantt-normal-viewport');
        });

        it('should gantt basic has correct config style', () => {
            assertConfigStyle(ganttComponentInstance.ganttComponent, ganttDebugElement);
        });
    });

    describe('#with groups', () => {
        let fixture: ComponentFixture<TestGanttWithGroupsComponent>;
        let ganttComponentInstance: TestGanttWithGroupsComponent;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttWithGroupsComponent],
                providers: [GanttPrintService]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttWithGroupsComponent);
            fixture.detectChanges();
            await fixture.whenStable();
            ganttComponentInstance = fixture.componentInstance;
            ganttComponent = ganttComponentInstance.ganttComponent;
            await fixture.whenStable();
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

        it('should gantt groups has correct config style', () => {
            assertConfigStyle(ganttComponent, fixture.debugElement);
        });
    });

    describe('#load children', () => {
        let fixture: ComponentFixture<TestGanttLoadChildrenComponent>;
        let ganttComponentInstance: TestGanttLoadChildrenComponent;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttLoadChildrenComponent],
                providers: [GanttPrintService]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttLoadChildrenComponent);
            fixture.detectChanges();
            await fixture.whenStable();
            ganttComponentInstance = fixture.componentInstance;
            ganttComponent = ganttComponentInstance.ganttComponent;
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should show expand icon and load children', () => {
            const ganttIcons = fixture.debugElement.queryAll(By.directive(GanttIconComponent));
            expect(ganttIcons.length).toEqual(1);
        });

        it('should load children', () => {
            const ganttIcon = fixture.debugElement.queryAll(By.directive(GanttIconComponent))[0];
            ganttIcon.nativeElement.click();
            expect(ganttComponent.items[0].expanded).toBe(true);
            ganttIcon.nativeElement.click();
            expect(ganttComponent.items[0].expanded).toBe(false);
        });

        it('should load async children', () => {
            ganttComponentInstance.async = true;
            fixture.detectChanges();
            const ganttIcons = fixture.debugElement.queryAll(By.directive(GanttIconComponent));
            expect(ganttIcons.length).toEqual(2);
            const ganttIcon = ganttIcons[1];
            ganttIcon.nativeElement.click();
            expect(ganttComponent.items[1].expanded).toBe(true);
            ganttIcon.nativeElement.click();
            expect(ganttComponent.items[1].expanded).toBe(false);
        });
    });

    // describe('#draggable', () => {});

    describe('#selectable', () => {
        let fixture: ComponentFixture<TestGanttSelectableComponent>;
        let ganttComponentInstance: TestGanttSelectableComponent;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttSelectableComponent],
                providers: [
                    GanttPrintService,
                    {
                        provide: GANTT_GLOBAL_CONFIG,
                        useValue: config
                    }
                ]
            }).compileComponents();
            fixture = TestBed.createComponent(TestGanttSelectableComponent);
            fixture.detectChanges();
            await fixture.whenStable();
            ganttComponentInstance = fixture.componentInstance;
            ganttComponent = ganttComponentInstance.ganttComponent;
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should init selectionModel when ngAfterViewInit', () => {
            const selectionModel = ganttComponent.selectionModel;
            expect(selectionModel.hasValue()).toEqual(false);
        });

        it('should invoke selectedChange when click item', () => {
            const selectedSpy = spyOn(ganttComponentInstance, 'selectedChange').and.callFake((event: GanttSelectedEvent) => {
                expect(event.event.type).toEqual('click');
                expect(event.selectedValue[0]).toEqual(mockItems[0]);
            });
            const itemNode = fixture.debugElement
                .query(By.directive(GanttTableBodyComponent))
                .query(By.css('.gantt-table-item')).nativeNode;
            itemNode.click();
            expect(selectedSpy).toHaveBeenCalledTimes(1);
        });

        it('should not invoke selectedChange when click item and selectable is false', () => {
            fixture.componentInstance.selectable = false;
            fixture.detectChanges();
            const selectedSpy = spyOn(ganttComponentInstance, 'selectedChange');
            const itemNode = fixture.debugElement
                .query(By.directive(GanttTableBodyComponent))
                .query(By.css('.gantt-table-item')).nativeNode;
            itemNode.click();
            expect(selectedSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('#custom-toolbar', () => {
        let fixture: ComponentFixture<TestGanttCustomToolbarComponent>;
        let ganttComponentInstance: TestGanttCustomToolbarComponent;
        let ganttDebugElement: DebugElement;
        let ganttComponent: NgxGanttComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                declarations: [TestGanttCustomToolbarComponent],
                providers: [
                    GanttPrintService,
                    {
                        provide: GANTT_GLOBAL_CONFIG,
                        useValue: config
                    }
                ]
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
});
