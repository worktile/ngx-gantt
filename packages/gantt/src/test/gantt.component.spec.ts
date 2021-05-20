import { GanttViewDay } from './../views/day';
import { GanttViewMonth } from './../views/month';
import { Component, NgModule, SimpleChange } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
import { GanttViewOptions } from '../views/view';
import { mockGroups, mockItems } from './mocks/data';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'test-gantt-basic',
    template: `<ngx-gantt
        #gantt
        [start]="start"
        [end]="end"
        [groups]="groups"
        [items]="items"
        [viewType]="options.viewType"
        [draggable]="options.draggable"
        [linkable]="options.linkable"
        [async]="options.async"
        [childrenResolve]="options.childrenResolve"
        (barClick)="barClick($event)"
        (lineClick)="lineClick($event)"
        (dragEnded)="dragEnded($event)"
        (linkDragEnded)="linkDragEnded($event)"
        (loadOnScroll)="loadOnScroll($event)"
    >
        <ngx-gantt-table (columnChanges)="columnChanges($event)">
            <ngx-gantt-column name="标题" width="120px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
            <ngx-gantt-column width="180px">
                <ng-template #header> <span style="font-weight: bold">开始时间</span> </ng-template>
                <ng-template #cell let-item="item">
                    {{ item.start }}
                </ng-template>
            </ngx-gantt-column>
            <ngx-gantt-column name="截止时间">
                <ng-template #cell let-item="item">
                    {{ item.end * 1000 }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`,
    providers: [GanttPrintService]
})
export class TestGanttBasicComponent {
    constructor(private printService: GanttPrintService) {}

    start = new GanttDate('2020-09-02 11:46:40').getUnixTime();

    end = new GanttDate('2021-01-01 00:00:00').getUnixTime();

    items = mockItems;

    groups = mockGroups;

    options = {
        viewType: GanttViewType.month,
        draggable: true,
        linkable: true,
        async: false,
        childrenResolve: this.getChildren.bind(this)
    };

    viewOptions: GanttViewOptions = {
        start: new GanttDate(new Date('2020-3-1')),
        end: new GanttDate(new Date('2020-6-30'))
    };

    barClick(event: GanttBarClickEvent) {
        console.log(event);
    }

    lineClick(event: GanttLineClickEvent) {
        console.log(event);
    }

    dragEnded(event: GanttDragEvent) {
        this.items = [...this.items];
        this.groups = [...this.groups];
    }

    linkDragEnded(event: GanttLinkDragEvent) {
        if (event.source.links && event.source.links.includes(event.target.id)) {
            return;
        }
        this.items.forEach((item) => {
            if (item.id === event.source.id) {
                item.links = [...(item.links || []), event.target.id];
            }
        });
        this.items = [...this.items];
    }

    loadOnScroll(event: GanttLoadOnScrollEvent) {}

    getChildren(item: GanttItem) {
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

    print(name: string) {
        this.printService.print(name);
    }

    columnChanges(event: GanttTableEvent) {
        console.log(event);
    }
}

describe('NgxGantt', () => {
    let fixture: ComponentFixture<TestGanttBasicComponent>;
    let testComponent: TestGanttBasicComponent;
    let ganttComponent;
    let ganttComponentInstance;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttBasicComponent]
        });

        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestGanttBasicComponent);
        testComponent = fixture.debugElement.componentInstance;
        ganttComponent = fixture.debugElement.query(By.directive(NgxGanttComponent));
        ganttComponentInstance = ganttComponent.componentInstance;
    });

    it('should create ganttComponent', () => {
        expect(ganttComponent).toBeTruthy();
    });

    it('should init ganttComponent', () => {
        fixture.detectChanges();
        expect(ganttComponentInstance.groups.length).toBe(mockGroups.length);
        expect(ganttComponentInstance.view).toEqual(jasmine.any(GanttViewMonth));
    });

    it('should change viewType', () => {
        testComponent.options.viewType = GanttViewType.day;
        fixture.detectChanges();
        ganttComponentInstance.ngOnChanges({
            viewType: new SimpleChange(GanttViewType.month, GanttViewType.day, false)
        });
        expect(ganttComponentInstance.view).toEqual(jasmine.any(GanttViewDay));
    });

    it('should has items when has no group', () => {
        testComponent.groups = [];
        fixture.detectChanges();
        ganttComponentInstance.ngOnChanges({
            originGroups: new SimpleChange(mockGroups, [], false)
        });
        expect(ganttComponentInstance.items.length).toBe(mockItems.length);
    });

    it('should has correct view when has no start or end', () => {
        testComponent.start = null;
        testComponent.end = null;
        fixture.detectChanges();
        expect(ganttComponentInstance.view.start.getUnixTime()).toBe(new GanttDate('2020-04-01 00:00:00').getUnixTime());
        expect(ganttComponentInstance.view.end.getUnixTime()).toBe(new GanttDate('2021-12-31 23:59:59').getUnixTime());
    });

    it('should expand group ', () => {
        fixture.detectChanges();
        const group = ganttComponentInstance.groups[0];
        ganttComponentInstance.expandGroup(group);
        expect(group.expanded).toBe(false);
        ganttComponentInstance.expandGroup(group);
        expect(group.expanded).toBe(true);
    });

    it('should expand children ', fakeAsync(() => {
        testComponent.options.async = true;
        fixture.detectChanges();
        const itemWithChildren = ganttComponentInstance.groups[0].items[0];
        const itemWithoutChildren = ganttComponentInstance.groups[0].items[1];
        ganttComponentInstance.expandChildren(itemWithChildren);
        ganttComponentInstance.expandChildren(itemWithoutChildren);
        tick(2000);
        fixture.detectChanges();
        expect(itemWithChildren.expanded).toBe(true);
        expect(itemWithoutChildren.expanded).toBe(true);
        expect(itemWithoutChildren.children.length).toBe(1);

        ganttComponentInstance.expandChildren(itemWithChildren);
        expect(itemWithChildren.expanded).toBe(false);
    }));

    it('should expand or collapse all ', () => {
        fixture.detectChanges();
        ganttComponentInstance.expandAll();
        ganttComponentInstance.groups.forEach((group) => {
            expect(group.expanded).toBe(true);
        });

        ganttComponentInstance.collapseAll();
        ganttComponentInstance.groups.forEach((group) => {
            expect(group.expanded).toBe(false);
        });
    });
});
