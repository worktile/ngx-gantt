import { GanttDate } from '../../utils/date';
import { GanttItem, GanttItemInternal } from '../item';
import { GanttViewType } from '../view-type';

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
        ganttItemInternal = new GanttItemInternal(ganttItem);
    });

    it(`should has correct children`, () => {
        expect(ganttItemInternal.children.length).toBe(1);
    });

    it(`should has correct end`, () => {
        expect(ganttItemInternal.end.getUnixTime()).toBe(new GanttDate('2020-06-20 23:59:59').getUnixTime());

        ganttItem.end = null;
        ganttItem.start = new GanttDate('2020-05-21 12:34:35').getUnixTime();
        ganttItemInternal = new GanttItemInternal(ganttItem);
        expect(ganttItemInternal.end.getUnixTime()).toBe(new GanttDate('2020-06-20 23:59:59').getUnixTime());

        ganttItemInternal = new GanttItemInternal(ganttItem, { viewType: GanttViewType.day });
        expect(ganttItemInternal.end.getUnixTime()).toBe(new GanttDate('2020-05-21 23:59:59').getUnixTime());
    });

    it(`should has correct start`, () => {
        ganttItem.start = null;
        ganttItem.end = new GanttDate('2020-05-21 12:34:35').getUnixTime();
        ganttItemInternal = new GanttItemInternal(ganttItem);
        expect(ganttItemInternal.start.getUnixTime()).toBe(new GanttDate('2020-04-21 00:00:00').getUnixTime());

        ganttItemInternal = new GanttItemInternal(ganttItem, { viewType: GanttViewType.day });
        expect(ganttItemInternal.start.getUnixTime()).toBe(new GanttDate('2020-05-21 00:00:00').getUnixTime());
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
        expect(ganttItemInternal.start.getUnixTime()).toBe(start.startOfDay().getUnixTime());
        expect(ganttItemInternal.end.getUnixTime()).toBe(end.endOfDay().getUnixTime());
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
        ganttItemInternal.addLink('0102');
        expect(ganttItemInternal.links).toContain('0102');
    });
});
