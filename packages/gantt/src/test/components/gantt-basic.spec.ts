import { Component, DebugElement, viewChild } from '@angular/core';
import { ComponentFixture, DeferBlockState, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GanttBarClickEvent, GanttToolbarOptions } from '../../class';
import { GanttViewType } from '../../class/view-type';
import { GanttPrintService } from '../../gantt-print.service';
import { NgxGanttComponent } from '../../gantt.component';
import { NgxGanttModule } from '../../gantt.module';
import { GanttDate } from '../../utils/date';
import { getMockBaselineItems, getMockItems } from './mocks/data';
import { CommonModule } from '@angular/common';
import { NgxGanttBarComponent } from '../../components/bar/bar.component';
import { NgxGanttRootComponent } from '../../root.component';
import { GANTT_GLOBAL_CONFIG } from '../../gantt.config';
import { GanttTableBodyComponent } from '../../components/table/body/gantt-table-body.component';
import { GanttLoaderComponent } from '../../components/loader/loader.component';
import { GANTT_I18N_LOCALE_TOKEN, GanttI18nLocale } from 'ngx-gantt';
import { assertBaselineItems, assertConfigStyle, assertGanttView, assertItems } from './assert-helper';

const mockItems = getMockItems();
const mockBaselineItems = getMockBaselineItems();

const localeConfig = {
    id: GanttI18nLocale.zhHans,
    views: {
        [GanttViewType.hour]: {
            label: '小时',
            tickFormats: {
                period: 'M月d日',
                unit: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '天',
            tickFormats: {
                period: 'yyyy-MM',
                unit: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '周',
            tickFormats: {
                period: 'yyyy',
                unit: 'w'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            tickFormats: {
                period: `yyyy/QQQ`,
                unit: 'MM'
            }
        },
        [GanttViewType.quarter]: {
            label: '季',
            tickFormats: {
                period: 'yyyy',
                unit: `yyyy/QQQ`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            tickFormats: {
                unit: 'yyyy'
            }
        }
    }
};

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
    </ngx-gantt>`,
    standalone: false
})
export class TestGanttBasicComponent {
    readonly ganttComponent = viewChild<NgxGanttComponent>('gantt');

    constructor() {}

    start = new GanttDate('2020-09-02 00:00:00').getUnixTime();

    end = new GanttDate('2021-12-01 00:00:00').getUnixTime();

    viewType = GanttViewType.month;

    items = mockItems;

    loading = false;

    loadingDelay = 0;

    baselineItems = mockBaselineItems;

    virtualScrollEnabled = true;

    viewOptions = {};

    showToolbar = true;

    toolbarOptions: GanttToolbarOptions = {
        viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
    };

    barClick(event: GanttBarClickEvent) {
        console.log(event);
    }
}

describe('gantt-basic-component', () => {
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
                    useValue: {
                        locale: GanttI18nLocale.zhHans,
                        dateOptions: {},
                        styleOptions: {
                            headerHeight: 60,
                            lineHeight: 60,
                            barHeight: 30
                        }
                    }
                },
                {
                    provide: GANTT_I18N_LOCALE_TOKEN,
                    useValue: localeConfig,
                    multi: true
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
        const blocks = await fixture.getDeferBlocks();
        for (const block of blocks) {
            await block.render(DeferBlockState.Complete);
        }
        fixture.detectChanges();
    });

    describe('#component-created', () => {
        it('should create ganttComponent', () => {
            expect(ganttComponentInstance).toBeTruthy();
        });
    });

    describe('#view-rendering', () => {
        it('should render month view', () => {
            assertGanttView(fixture, {
                firstPrimaryDataPointText: '2020/Q3',
                lastPrimaryDataPointText: '2021/Q4',
                firstSecondaryDataPointText: '07',
                lastSecondaryDataPointText: '12'
            });
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
    });

    describe('#items-rendering', () => {
        it('should render items', () => {
            assertItems(fixture, mockItems);
        });

        it('should re render items when change items', () => {
            const newItems = mockItems.slice(0, 5);
            ganttComponentInstance.items = [...newItems];
            fixture.detectChanges();
            assertItems(fixture, newItems);
        });

        it('should render baseline items', () => {
            assertBaselineItems(fixture, mockBaselineItems);
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
    });

    describe('#toolbar', () => {
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
    });

    describe('#loading', () => {
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
    });

    describe('#table-and-viewport', () => {
        it('should render table row before and after template', () => {
            fixture.detectChanges();
            const rowBeforeElements = ganttDebugElement.queryAll(By.css('.row-before'));
            const rowAfterElements = ganttDebugElement.queryAll(By.css('.row-before'));
            expect(rowBeforeElements.length).toEqual(ganttComponentInstance.items.length);
            expect(rowAfterElements.length).toEqual(ganttComponentInstance.items.length);
        });

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
    });

    describe('#event', () => {
        beforeEach;
        it('should bar click called', fakeAsync(() => {
            const barClickSpy = spyOn(ganttComponentInstance, 'barClick').and.callFake((event: GanttBarClickEvent) => {
                expect(event.event.type).toEqual('click');
                expect(event.item.title).toEqual(mockItems[0].title);
            });
            const bar = fixture.debugElement.query(By.directive(NgxGanttBarComponent)).query(By.css('.gantt-bar-content'));
            bar.nativeElement.click();
            expect(barClickSpy).toHaveBeenCalledTimes(1);
        }));
    });

    describe('#global-config', () => {
        it('should apply global style configuration correctly to the gantt component', () => {
            assertConfigStyle(ganttComponentInstance.ganttComponent(), ganttDebugElement);
        });
    });

    describe('#print', () => {
        it('should print service registered to gantt component', () => {
            expect(TestBed.inject(GanttPrintService)['root']).toEqual(
                ganttDebugElement.query(By.directive(NgxGanttRootComponent)).nativeElement
            );
        });
    });
});
