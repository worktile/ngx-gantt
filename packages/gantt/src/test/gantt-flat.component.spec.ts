import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { GANTT_UPPER_TOKEN, NgxGanttModule } from 'ngx-gantt';
import { CommonModule } from '@angular/common';
import { mockGroups, mockItems } from './mocks/data';

@Component({
    selector: 'test-gantt-flat-basic',
    template: `
        <ngx-gantt-flat #gantt [start]="1514736000" [end]="1609430400" [items]="items" [groups]="groups" [viewType]="'month'" [draggable]="true">
            <ng-template #group let-group="group">
                {{ group.title }}
            </ng-template>
        </ngx-gantt-flat>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: TestGanttFlatBasicComponent
        }
    ]
})
export class TestGanttFlatBasicComponent {
    items = mockItems;

    groups = mockGroups;

    @HostBinding('class.gantt-demo') class = true;
}

describe('NgxGanttFlatComponent', () => {
    let component: TestGanttFlatBasicComponent;
    let fixture: ComponentFixture<TestGanttFlatBasicComponent>;
    let defaultFixture: ComponentFixture<TestGanttFlatBasicComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttFlatBasicComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestGanttFlatBasicComponent);
        component = fixture.componentInstance;
        defaultFixture = TestBed.createComponent(TestGanttFlatBasicComponent);
        fixture.detectChanges();
    });

    it('should create ngx-gantt-flat', () => {
        expect(component).toBeTruthy();
    });
});
