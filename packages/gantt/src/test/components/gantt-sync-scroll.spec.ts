import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GanttSyncScrollXDirective, GanttSyncScrollYDirective } from '../../directives/sync-scroll.directive';
import { GanttSyncScrollService } from '../../gantt-sync-scroll.service';

@Component({
    template: `
        <div [syncScrollX]="'groupX'"></div>
        <div [syncScrollY]="'groupY'"></div>
    `,
    standalone: false
})
class TestComponent {}

describe('SyncScrollDirectives', () => {
    let fixture: ComponentFixture<TestComponent>;
    let service: GanttSyncScrollService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GanttSyncScrollService],
            declarations: [TestComponent],
            imports: [GanttSyncScrollXDirective, GanttSyncScrollYDirective]
        });

        fixture = TestBed.createComponent(TestComponent);
        service = TestBed.inject(GanttSyncScrollService);
        spyOn(service, 'registerScrollEvent').and.callThrough();
        spyOn(service, 'unregisterScrollEvent').and.callThrough();
        fixture.detectChanges();
    });

    it('should register directives with service', () => {
        expect(service.registerScrollEvent).toHaveBeenCalledWith('groupX', jasmine.any(HTMLElement), 'x');
        expect(service.registerScrollEvent).toHaveBeenCalledWith('groupY', jasmine.any(HTMLElement), 'y');
    });

    it('should unregister on destroy', () => {
        fixture.destroy();
        expect(service.unregisterScrollEvent).toHaveBeenCalledTimes(2);
    });
});
