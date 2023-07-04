import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GanttDragEvent, GanttLinkDragEvent } from '../../../class';
import { NgxGanttComponent } from '../../../gantt.component';
import { NgxGanttModule } from '../../../gantt.module';
import { NgxGanttRootComponent } from '../../../root.component';
import { GanttDate } from '../../../utils/date';
import { dispatchMouseEvent } from '../../../utils/testing';
import { NgxGanttBarComponent } from '../bar.component';

const activeClass = 'gantt-bar-active';

const mockBarItems = [
    {
        id: 'item-0101',
        title: 'VERSION 0101',
        start: new GanttDate('2020-03-31 22:34:35').getUnixTime(),
        end: new GanttDate('2020-06-05 08:53:20').getUnixTime(),
        color: '#FF0000'
    },
    {
        id: 'item-0203',
        title: 'VERSION 0203',
        start: new GanttDate('2020-04-23 20:07:55').getUnixTime(),
        end: new GanttDate('2020-06-23 00:00:00').getUnixTime(),
        links: ['item-0204']
    },
    {
        id: 'item-0204',
        title: 'VERSION 0204',
        start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
        end: new GanttDate('2020-06-18 02:26:40').getUnixTime(),
        links: ['item-0101']
    }
];

@Component({
    selector: 'test-gantt-bar',
    template: ` <ngx-gantt
        #gantt
        [items]="items"
        [viewType]="viewType"
        [draggable]="draggable"
        [linkable]="linkable"
        (dragEnded)="dragEnded($event)"
        (dragStarted)="dragStarted($event)"
        (linkDragEnded)="linkDragEnded($event)"
        (linkDragStarted)="linkDragStarted($event)"
    >
        <ngx-gantt-table>
            <ngx-gantt-column name="标题" width="200px">
                <ng-template #cell let-item="item">
                    {{ item.title }}
                </ng-template>
            </ngx-gantt-column>
        </ngx-gantt-table>
    </ngx-gantt>`
})
export class TestGanttBarComponent {
    constructor() {}

    viewType = 'month';

    items = mockBarItems;

    draggable = true;

    linkable = true;

    dragEnded(event: GanttDragEvent) {
        console.log(event);
    }

    dragStarted(event: GanttDragEvent) {
        console.log(event);
    }

    linkDragEnded(event: GanttLinkDragEvent) {
        console.log(event);
    }

    linkDragStarted(event: GanttLinkDragEvent) {
        console.log(event);
    }
}

function dragEvent(fixture: ComponentFixture<TestGanttBarComponent>, dragElement: HTMLElement, barElement?: HTMLElement) {
    const dragMaskElement = fixture.debugElement.query(By.css('.gantt-drag-mask')).nativeElement;
    const dragBackdropElement = fixture.debugElement.query(By.css('.gantt-drag-backdrop')).nativeElement;
    const dragStartSpy = spyOn(fixture.componentInstance, 'dragStarted');
    const dragEndSpy = spyOn(fixture.componentInstance, 'dragEnded');
    barElement = barElement || dragElement;

    dispatchMouseEvent(dragElement, 'mousedown');
    fixture.detectChanges();

    dispatchMouseEvent(document, 'mousemove', 50);
    fixture.detectChanges();
    expect(dragStartSpy).toHaveBeenCalledTimes(1);
    expect(barElement.style.getPropertyValue('pointer-events')).toEqual('none');
    expect(barElement.classList).toContain('gantt-bar-draggable-drag');

    dispatchMouseEvent(document, 'mousemove', 200);
    fixture.detectChanges();
    expect(dragMaskElement.style.getPropertyValue('display')).toEqual('block');
    expect(dragBackdropElement.style.getPropertyValue('display')).toEqual('block');

    dispatchMouseEvent(document, 'mouseup', 200);
    tick(100);
    fixture.detectChanges();
    expect(barElement.style.getPropertyValue('pointer-events')).toEqual('');
    expect(barElement.classList).not.toContain('gantt-bar-draggable-drag');
    expect(dragMaskElement.style.getPropertyValue('display')).toEqual('none');
    expect(dragBackdropElement.style.getPropertyValue('display')).toEqual('none');
    expect(dragEndSpy).toHaveBeenCalledTimes(1);
}

function linkDragEvent(fixture: ComponentFixture<TestGanttBarComponent>, dragElement: HTMLElement) {
    const root = fixture.debugElement.query(By.directive(NgxGanttRootComponent));

    dispatchMouseEvent(dragElement, 'mousedown');
    fixture.detectChanges();

    dispatchMouseEvent(document, 'mousemove', 10, 10);
    fixture.detectChanges();

    const ganttLinkDragContainer = root.nativeElement.querySelector('.gantt-link-drag-container');
    const linkDraggingLine = root.nativeElement.querySelector('.link-dragging-line');
    expect(ganttLinkDragContainer).toBeTruthy();
    expect(linkDraggingLine).toBeTruthy();

    dispatchMouseEvent(document, 'mousemove', 200, -30);
    fixture.detectChanges();

    dispatchMouseEvent(document, 'mouseup', 200, -30);
    fixture.detectChanges();
}

describe('bar-drag', () => {
    let fixture: ComponentFixture<TestGanttBarComponent>;
    let ganttComponentInstance: TestGanttBarComponent;
    let ganttDebugElement: DebugElement;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NgxGanttModule],
            declarations: [TestGanttBarComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(TestGanttBarComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        ganttDebugElement = fixture.debugElement.query(By.directive(NgxGanttComponent));
        ganttComponentInstance = fixture.componentInstance;
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should active when mouse enter bar', () => {
        const barElement = fixture.debugElement.query(By.directive(NgxGanttBarComponent)).nativeElement;
        dispatchMouseEvent(barElement, 'mouseenter');
        expect(barElement.classList).toContain(activeClass);
        dispatchMouseEvent(barElement, 'mouseleave');
        expect(barElement.classList).not.toContain(activeClass);
    });

    it('should bar drag', fakeAsync(() => {
        const bar = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent))[0];
        dragEvent(fixture, bar.nativeElement);
        tick(200);
        expect(bar.componentInstance.item.start.getUnixTime()).toEqual(new GanttDate('2020-04-21 00:00:00').getUnixTime());
        expect(bar.componentInstance.item.end.getUnixTime()).toEqual(new GanttDate('2020-06-26 23:59:59').getUnixTime());
    }));

    it('should first bar handle drag', fakeAsync(() => {
        const bar = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent))[1];
        const firstHandleElement = bar.queryAll(By.css('.drag-handles .handle'))[0].nativeElement;
        dragEvent(fixture, firstHandleElement, bar.nativeElement);
        tick(200);
        expect(bar.componentInstance.item.start.getUnixTime()).toEqual(new GanttDate('2020-05-14 00:00:00').getUnixTime());
    }));

    it('should last bar handles drag', fakeAsync(() => {
        const bar = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent))[1];
        const lastHandleElement = bar.queryAll(By.css('.drag-handles .handle'))[1].nativeElement;
        dragEvent(fixture, lastHandleElement, bar.nativeElement);
        tick(200);
        expect(bar.componentInstance.item.end.getUnixTime()).toEqual(new GanttDate('2020-07-15 23:59:59').getUnixTime());
    }));

    it('should first bar link handle drag', () => {
        const bar = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent))[2];
        const firstHandleElement = bar.queryAll(By.css('.link-handles .handle'))[0].nativeElement;
        linkDragEvent(fixture, firstHandleElement);
    });

    it('should last bar link handles drag', () => {
        const bar = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent))[2];
        const lastHandleElement = bar.queryAll(By.css('.link-handles .handle'))[1].nativeElement;
        linkDragEvent(fixture, lastHandleElement);
    });

    it('should not run change detection when the `mousedown` is dispatched on the handle', () => {
        const appRef = TestBed.inject(ApplicationRef);
        spyOn(appRef, 'tick');
        const bar = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent))[0];
        const firstHandleElement = bar.queryAll(By.css('.drag-handles .handle'))[0].nativeElement;
        const event = new Event('mousedown');
        spyOn(event, 'stopPropagation').and.callThrough();
        firstHandleElement.dispatchEvent(event);
        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });
});
