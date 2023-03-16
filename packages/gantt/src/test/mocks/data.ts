import { GanttDate } from './../../utils/date';

export function getMockItems() {
    return [
        {
            id: 'item-0101',
            title: 'VERSION 0101',
            start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
            color: '#FF0000',
            children: [
                {
                    id: 'item-child-0101',
                    title: 'VERSION Children 0101',
                    start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
                    color: '#FF0000',
                    linkable: false
                }
            ]
        },
        {
            id: 'item-0102',
            title: 'VERSION 0102',
            start: new GanttDate('2020-05-31 22:34:35').getUnixTime(),
            end: new GanttDate('2020-06-05 08:53:20').getUnixTime(),
            color: '#9ACD32',
            expandable: true
        },
        {
            id: 'item-0103',
            title: 'VERSION 0103',
            end: new GanttDate('2020-06-13 11:20:00').getUnixTime()
        },
        {
            id: 'item-0104',
            title: 'VERSION 0104',

            links: ['item-0301']
        },
        {
            id: 'item-0201',
            title: 'VERSION 0201'
        },
        {
            id: 'item-0202',
            title: 'VERSION 0202',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-25 01:06:40').getUnixTime(),
            links: ['item-0203'],
            color: 'rgb(52, 143, 228, 0.5)',
            barStyle: {
                border: '1px solid rgb(52, 143, 228)'
            }
        },
        {
            id: 'item-0203',
            title: 'VERSION 0203',
            start: new GanttDate('2020-05-23 20:07:55').getUnixTime(),
            end: new GanttDate('2020-06-10 00:00:00').getUnixTime(),
            links: ['item-0204']
        },
        {
            id: 'item-0204',
            title: 'VERSION 0204',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-18 02:26:40').getUnixTime(),
            links: ['item-0301', 'item-0402']
        },

        {
            id: 'item-0301',
            title: 'VERSION 0301',
            start: new GanttDate('2020-07-29 23:14:35').getUnixTime(),
            end: new GanttDate('2020-09-02 11:46:40').getUnixTime()
        },
        {
            id: 'item-0302',
            title: 'VERSION 0302',
            start: new GanttDate('2020-06-13 16:07:55').getUnixTime(),
            end: new GanttDate('2020-08-21 22:00:00').getUnixTime()
        },
        {
            id: 'item-0303',
            title: 'VERSION 0303',
            start: new GanttDate('2020-05-22 16:21:15').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime()
        },
        {
            id: 'item-0401',
            title: 'VERSION 0401',
            start: new GanttDate('2020-05-09 22:47:55').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime()
        },
        {
            id: 'item-0402',
            title: 'VERSION 0402',
            start: new GanttDate('2020-07-29 23:14:35').getUnixTime(),
            end: new GanttDate('2020-09-12 21:46:40').getUnixTime()
        },
        {
            id: 'item-0403',
            title: 'VERSION 0403',
            start: new GanttDate('2020-06-25 05:54:35').getUnixTime(),
            end: new GanttDate('2020-09-02 11:46:40').getUnixTime()
        },
        {
            id: 'item-0404',
            title: 'VERSION 0404',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-23 21:20:00').getUnixTime()
        },
        {
            id: 'item-0501',
            title: 'VERSION 0501',
            start: new GanttDate('2020-09-13 02:34:35').getUnixTime(),
            end: new GanttDate('2020-10-07 05:06:40').getUnixTime()
        },
        {
            id: 'item-0502',
            title: 'VERSION 0502',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime()
        },
        {
            id: 'item-0503',
            title: 'VERSION 0503',
            start: new GanttDate('2020-07-18 09:27:55').getUnixTime(),
            end: new GanttDate('2020-09-02 11:46:40').getUnixTime()
        }
    ];
}

export function getMockBaselineItems() {
    return [
        {
            id: 'item-0101',
            start: new GanttDate('2020-05-21 12:34:35').getUnixTime()
        },
        {
            id: 'item-0103',
            end: new GanttDate('2020-06-13 11:20:00').getUnixTime()
        },
        {
            id: 'item-0204',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-18 02:26:40').getUnixTime()
        },
        {
            id: 'item-0502',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime()
        }
    ];
}

export function getMockGroupItems() {
    return [
        {
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
                    group_id: 'item-0101',
                    color: '#FF0000',
                    linkable: false,
                    children: [
                        {
                            id: 'item-child-010101',
                            title: 'VERSION Children 010101',
                            start: new GanttDate('2020-05-21 12:34:35').getUnixTime(),
                            group_id: 'item-child-0101',
                            color: '#FF0000',
                            linkable: false
                        }
                    ]
                }
            ]
        },
        {
            id: 'item-0102',
            title: 'VERSION 0102',
            start: new GanttDate('2020-05-31 22:34:35').getUnixTime(),
            end: new GanttDate('2020-06-05 08:53:20').getUnixTime(),
            color: '#9ACD32',
            group_id: '00001',
            expandable: true
        },
        {
            id: 'item-0103',
            title: 'VERSION 0103',
            end: new GanttDate('2020-06-13 11:20:00').getUnixTime(),
            group_id: '00001'
        },
        {
            id: 'item-0104',
            title: 'VERSION 0104',
            group_id: '00001',
            links: ['item-0301']
        },
        {
            id: 'item-0201',
            title: 'VERSION 0201',
            group_id: '00002'
        },
        {
            id: 'item-0202',
            title: 'VERSION 0202',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-25 01:06:40').getUnixTime(),
            group_id: '00002',
            links: ['item-0203'],
            color: 'rgb(52, 143, 228, 0.5)',
            barStyle: {
                border: '1px solid rgb(52, 143, 228)'
            }
        },
        {
            id: 'item-0203',
            title: 'VERSION 0203',
            start: new GanttDate('2020-05-23 20:07:55').getUnixTime(),
            end: new GanttDate('2020-06-10 00:00:00').getUnixTime(),
            group_id: '00002',
            links: ['item-0204']
        },
        {
            id: 'item-0204',
            title: 'VERSION 0204',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-18 02:26:40').getUnixTime(),
            group_id: '00002',
            links: ['item-0301', 'item-0402']
        },

        {
            id: 'item-0301',
            title: 'VERSION 0301',
            start: new GanttDate('2020-07-29 23:14:35').getUnixTime(),
            end: new GanttDate('2020-09-02 11:46:40').getUnixTime(),
            group_id: '00003'
        },
        {
            id: 'item-0302',
            title: 'VERSION 0302',
            start: new GanttDate('2020-06-13 16:07:55').getUnixTime(),
            end: new GanttDate('2020-08-21 22:00:00').getUnixTime(),
            group_id: '00003'
        },
        {
            id: 'item-0303',
            title: 'VERSION 0303',
            start: new GanttDate('2020-05-22 16:21:15').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime(),
            group_id: '00003'
        },
        {
            id: 'item-0401',
            title: 'VERSION 0401',
            start: new GanttDate('2020-05-09 22:47:55').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime(),
            group_id: '00004'
        },
        {
            id: 'item-0402',
            title: 'VERSION 0402',
            start: new GanttDate('2020-07-29 23:14:35').getUnixTime(),
            end: new GanttDate('2020-09-12 21:46:40').getUnixTime(),
            group_id: '00004'
        },
        {
            id: 'item-0403',
            title: 'VERSION 0403',
            start: new GanttDate('2020-06-25 05:54:35').getUnixTime(),
            end: new GanttDate('2020-09-02 11:46:40').getUnixTime(),
            group_id: '00004'
        },
        {
            id: 'item-0404',
            title: 'VERSION 0404',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-06-23 21:20:00').getUnixTime(),
            group_id: '00004'
        },
        {
            id: 'item-0501',
            title: 'VERSION 0501',
            start: new GanttDate('2020-09-13 02:34:35').getUnixTime(),
            end: new GanttDate('2020-10-07 05:06:40').getUnixTime(),
            group_id: '00005'
        },
        {
            id: 'item-0502',
            title: 'VERSION 0502',
            start: new GanttDate('2020-06-02 02:21:15').getUnixTime(),
            end: new GanttDate('2020-07-06 14:53:20').getUnixTime(),
            group_id: '00005'
        },
        {
            id: 'item-0503',
            title: 'VERSION 0503',
            start: new GanttDate('2020-07-18 09:27:55').getUnixTime(),
            end: new GanttDate('2020-09-02 11:46:40').getUnixTime(),
            group_id: '00005'
        }
    ];
}

export function getMockGroups() {
    return [
        {
            id: '00001',
            title: 'Project 1',
            class: 'test'
        },
        {
            id: '00002',
            title: 'Project 2'
        },
        {
            id: '00003',
            title: 'Project 3'
        },
        {
            id: '00004',
            title: 'Project 4'
        },
        {
            id: '00005',
            title: 'Project 5'
        }
    ];
}
