import { TestBed } from '@angular/core/testing';
import { GanttSyncScrollService } from '../../gantt-sync-scroll.service';
import { NgZone } from '@angular/core';
import { Subject } from 'rxjs';

describe('GanttSyncScrollService', () => {
    let service: GanttSyncScrollService;
    let ngZone: NgZone;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GanttSyncScrollService]
        });
        service = TestBed.inject(GanttSyncScrollService);
        ngZone = TestBed.inject(NgZone);
    });

    it('should register scroll groups', () => {
        const element = document.createElement('div');
        service.registerScrollEvent('group1', element, 'x');
        expect(service['scrollGroupsMap'].has('group1')).toBeTrue();
    });

    it('should cleanup on unregister', () => {
        const element = document.createElement('div');
        const destroySpy = spyOn(Subject.prototype, 'next');

        service.registerScrollEvent('group3', element, 'x');
        service.unregisterScrollEvent('group3', element);

        expect(destroySpy).toHaveBeenCalled();
        expect(service['scrollGroupsMap'].has('group3')).toBeFalse();
    });
});
