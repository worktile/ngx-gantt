import { GanttDate } from '../../utils/date';

export const today = new GanttDate('2020-02-01 00:00:00');

export const date = {
    start: {
        date: new GanttDate('2020-01-01 00:00:00'),
        isCustom: true
    },
    end: {
        date: new GanttDate('2020-12-31 00:00:00'),
        isCustom: true
    }
};
