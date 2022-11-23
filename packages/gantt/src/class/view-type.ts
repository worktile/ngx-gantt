export enum GanttViewType {
    day = 'day',
    quarter = 'quarter',
    month = 'month',
    year = 'year',
    week = 'week'
}

export const ganttViews = [
    {
        name: '日',
        value: GanttViewType.day
    },
    {
        name: '周',
        value: GanttViewType.week
    },
    {
        name: '月',
        value: GanttViewType.month
    },
    {
        name: '季',
        value: GanttViewType.quarter
    },
    {
        name: '年',
        value: GanttViewType.year
    }
];
