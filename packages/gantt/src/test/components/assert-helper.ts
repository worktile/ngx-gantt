import { DebugElement, Signal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    GanttBaselineItem,
    GanttBaselineItemInternal,
    GanttCalendarHeaderComponent,
    GanttGroup,
    GanttItem,
    GanttItemInternal,
    NgxGanttBarComponent,
    NgxGanttBaselineComponent,
    NgxGanttComponent
} from 'ngx-gantt';

interface TestGanttComponentBase {
    ganttComponent: Signal<NgxGanttComponent>;
}

export function assertGanttView<T extends TestGanttComponentBase>(
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
    expect(primaryElements.length).toEqual(fixture.componentInstance.ganttComponent().view.primaryDatePoints.length);
    expect(secondaryElements.length).toEqual(fixture.componentInstance.ganttComponent().view.secondaryDatePoints.length);
    expect(primaryElements[0].nativeElement.textContent).toContain(expected.firstPrimaryDataPointText);
    expect(primaryElements[primaryElements.length - 1].nativeElement.textContent).toContain(expected.lastPrimaryDataPointText);
    expect(secondaryElements[0].nativeElement.textContent).toContain(expected.firstSecondaryDataPointText);
    expect(secondaryElements[secondaryElements.length - 1].nativeElement.textContent).toContain(expected.lastSecondaryDataPointText);
}

export function assertItem(item: DebugElement, ganttItem: GanttItemInternal | GanttBaselineItemInternal) {
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

export function assertItems<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedItems: GanttItem[]) {
    const { ganttComponent } = fixture.componentInstance;
    const items = fixture.debugElement.queryAll(By.directive(NgxGanttBarComponent));
    expect(items.length).toEqual(expectedItems.length);
    items.forEach((item: DebugElement, index: number) => {
        expect(ganttComponent().items[index].id).toEqual(expectedItems[index].id);
        assertItem(item, ganttComponent().items[index]);
    });
}

export function assertBaselineItems<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedItems: GanttBaselineItem[]) {
    const { ganttComponent } = fixture.componentInstance;
    const items = fixture.debugElement.queryAll(By.directive(NgxGanttBaselineComponent));
    expect(items.length).toEqual(expectedItems.length);
    items.forEach((item: DebugElement, index: number) => {
        expect(ganttComponent().baselineItems[index].id).toEqual(expectedItems[index].id);
        assertItem(item, ganttComponent().baselineItems[index]);
    });
}

export function assertGroups<T extends TestGanttComponentBase>(fixture: ComponentFixture<T>, expectedGroups: GanttGroup[]) {
    const { ganttComponent } = fixture.componentInstance;
    const groups = fixture.debugElement.queryAll(By.css('.gantt-group'));
    groups.forEach((group: DebugElement, groupIndex: number) => {
        expect(ganttComponent().groups[groupIndex].id).toEqual(expectedGroups[groupIndex].id);
        const items = group.queryAll(By.directive(NgxGanttBarComponent));
        items.forEach((item: DebugElement, itemIndex: number) => {
            assertItem(item, ganttComponent().groups[groupIndex].items[itemIndex]);
        });
    });
}

export function assertConfigStyle(ganttComponent: NgxGanttComponent, ganttDebugElement: DebugElement) {
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
                    expect(height).toEqual(ganttComponent.configService.config.styleOptions[key] + 'px');
                }
            });
        }
    }
}
