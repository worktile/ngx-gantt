import { GanttDate } from '../../utils/date';
import { GanttGroup, GanttGroupInternal } from '../group';

const group: GanttGroup = {
    id: '00001',
    title: 'Project 1',
    class: 'test'
};

describe('GanttGroupInternal', () => {
    let ganttGroupInternal: GanttGroupInternal;

    beforeEach(() => {
        ganttGroupInternal = new GanttGroupInternal(group);
    });

    it(`should set expand`, () => {
        ganttGroupInternal.setExpand(true);
        expect(ganttGroupInternal.expanded).toBe(true);
    });
});
