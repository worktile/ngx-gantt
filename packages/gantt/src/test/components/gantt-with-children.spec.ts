import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GanttViewType } from '../../class/view-type';
import { GanttIconComponent } from '../../components/icon/icon.component';
import { NgxGanttComponent } from '../../gantt.component';
import { NgxGanttModule } from '../../gantt.module';
import { getMockItems } from './mocks/data';

const mockItems = getMockItems();

@Component({
    selector: 'test-gantt-with-children',
    template: ` <ngx-gantt #gantt [items]="items" [viewType]="viewType" [async]="async" [childrenResolve]="childrenResolve">
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

describe('#load children', () => {
    let fixture: ComponentFixture<TestGanttLoadChildrenComponent>;
    let ganttComponentInstance: TestGanttLoadChildrenComponent;
    let ganttComponent: NgxGanttComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttLoadChildrenComponent],
            providers: []
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
