export enum GanttViewType {
    day = 'day',
    quarter = 'quarter',
    month = 'month',
    year = 'year'
}

export const ganttViews = [
    {
        type: GanttViewType.day,
        name: '日'
    },
    {
        type: GanttViewType.month,
        name: '月'
    },
    {
        type: GanttViewType.quarter,
        name: '季'
    }
];
