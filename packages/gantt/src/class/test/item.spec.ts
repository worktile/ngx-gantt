import { GanttLinkType } from 'ngx-gantt';
import { GanttDate } from '../../utils/date';
import { GanttItem, GanttItemInternal } from '../item';

class FakeView {
    getDateByXPoint() {
        return new GanttDate();
    }

    getXPointByDate() {
        return 0;
    }
}

describe('GanttItemInternal', () => {
    let ganttItemInternal: GanttItemInternal;
    let ganttItem: GanttItem;

    beforeEach(() => {
        ganttItem = {
            id: 'item-0101',
            title: 'VERSION 0101',
            start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
            group_id: '00001',
            color: '#FF0000',
            children: [
                {
                    id: 'item-child-0101',
                    title: 'VERSION Children 0101',
                    start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
                    group_id: '00001',
                    color: '#FF0000',
                    linkable: false
                }
            ]
        };
        ganttItemInternal = new GanttItemInternal(ganttItem, 0, new FakeView() as any);
    });

    it(`should has correct children`, () => {
        expect(ganttItemInternal.children.length).toBe(1);
    });

    it(`should fill date when start or end date is nil`, () => {
        const view = new FakeView();
        const date = new GanttDate('2020-06-01 00:00:00');
        spyOn(view, 'getDateByXPoint').and.returnValue(date);

        let ganttItemInternal = new GanttItemInternal(
            {
                ...ganttItem,
                start: null,
                end: new GanttDate('2020-06-19 00:00:00').getUnixTime()
            },
            0,
            view as any
        );

        expect(ganttItemInternal.start.getUnixTime()).toBe(date.getUnixTime());

        ganttItemInternal = new GanttItemInternal(
            {
                ...ganttItem,
                start: new GanttDate('2020-05-19 00:00:00').getUnixTime(),
                end: null
            },
            0,
            view as any
        );
        expect(ganttItemInternal.end.getUnixTime()).toBe(date.getUnixTime());
    });

    it(`should update refs`, () => {
        const refs = { width: 200, x: 200, y: 200 };
        ganttItemInternal.updateRefs(refs);
        expect(ganttItemInternal.refs.width).toBe(refs.width);
    });

    it(`should update date`, () => {
        const start = new GanttDate('2020-04-21 12:34:35');
        const end = new GanttDate('2020-09-21 12:34:35');
        ganttItemInternal.updateDate(start, end);
        expect(ganttItemInternal.start.getUnixTime()).toBe(start.getUnixTime());
        expect(ganttItemInternal.end.getUnixTime()).toBe(end.getUnixTime());
    });

    it(`should add children`, () => {
        const items = [
            {
                id: 'item-child-0102',
                title: 'VERSION Children 0102',
                start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
                group_id: '00001',
                color: '#FF0000',
                linkable: false
            },
            {
                id: 'item-child-0103',
                title: 'VERSION Children 0103',
                start: new GanttDate('2020-06-21 12:34:35').getUnixTime(),
                group_id: '00001',
                color: '#FF0000',
                linkable: false
            }
        ];
        ganttItemInternal.addChildren(items);
        expect(ganttItemInternal.children.length).toBe(2);
    });

    it(`should set expand`, () => {
        ganttItemInternal.setExpand(true);
        expect(ganttItemInternal.expanded).toBe(true);
    });

    it(`should add link`, () => {
        ganttItemInternal.addLink({
            link: '0102',
            type: GanttLinkType.fs
        });
        // expect(ganttItemInternal.links).toContain('0102');
    });
});
