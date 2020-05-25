import * as moment from 'moment';
import { GanttGroupInfo } from './class/group';
import { GanttItemInfo } from './class/item';

export const mockGroups: GanttGroupInfo[] = [
    {
        _id: '00001',
        title: 'Project 1'
    },
    {
        _id: '00002',
        title: 'Project 2'
    },
    {
        _id: '00003',
        title: 'Project 3'
    },
    {
        _id: '00004',
        title: 'Project 4'
    },
    {
        _id: '00005',
        title: 'Project 5'
    }
];

export const mockItems: GanttItemInfo[] = [
    {
        _id: 'item-0101',
        title: 'VERSION 0101',
        start: moment('2019-1-20').unix(),
        end: moment('2019-2-20').unix(),
        group_id: '00001'
    },
    {
        _id: 'item-0102',
        title: 'VERSION 0102',
        start: moment('2019-2-1').unix(),
        end: moment('2019-3-20').unix(),
        group_id: '00001'
    },
    {
        _id: 'item-0103',
        title: 'VERSION 0103',
        start: moment('2019-3-30').unix(),
        end: moment('2019-4-10').unix(),
        group_id: '00001'
    },
    {
        _id: 'item-0201',
        title: 'VERSION 0201',
        start: moment('2019-1-20').unix(),
        end: moment('2019-2-20').unix(),
        group_id: '00002'
    },
    {
        _id: 'item-0202',
        title: 'VERSION 0202',
        start: moment('2019-3-20').unix(),
        end: moment('2019-6-20').unix(),
        group_id: '00002'
    },
    {
        _id: 'item-0203',
        title: 'VERSION 0203',
        start: moment('2019-9-20').unix(),
        end: moment('2019-9-25').unix(),
        group_id: '00002'
    },
    {
        _id: 'item-0204',
        title: 'VERSION 0204',
        start: moment('2019-12-4').unix(),
        end: moment('2020-1-1').unix(),
        group_id: '00002'
    },

    {
        _id: 'item-0301',
        title: 'VERSION 0301',
        start: moment('2019-1-20').unix(),
        end: moment('2019-2-20').unix(),
        group_id: '00003'
    },
    {
        _id: 'item-0302',
        title: 'VERSION 0302',
        start: moment('2019-2-1').unix(),
        end: moment('2019-3-20').unix(),
        group_id: '00003'
    },
    {
        _id: 'item-0303',
        title: 'VERSION 0303',
        start: moment('2019-3-30').unix(),
        end: moment('2019-4-10').unix(),
        group_id: '00003'
    },
    {
        _id: 'item-0401',
        title: 'VERSION 0401',
        start: moment('2019-1-20').unix(),
        end: moment('2019-2-20').unix(),
        group_id: '00004'
    },
    {
        _id: 'item-0402',
        title: 'VERSION 0402',
        start: moment('2019-3-20').unix(),
        end: moment('2019-6-20').unix(),
        group_id: '00004'
    },
    {
        _id: 'item-0403',
        title: 'VERSION 0403',
        start: moment('2019-9-20').unix(),
        end: moment('2019-9-25').unix(),
        group_id: '00004'
    },
    {
        _id: 'item-0404',
        title: 'VERSION 0404',
        start: moment('2019-12-4').unix(),
        end: moment('2020-4-5').unix(),
        group_id: '00004'
    },
    {
        _id: 'item-0501',
        title: 'VERSION 0501',
        start: moment('2019-2-1').unix(),
        end: moment('2019-3-20').unix(),
        group_id: '00005'
    },
    {
        _id: 'item-0502',
        title: 'VERSION 0502',
        start: moment('2019-3-30').unix(),
        end: moment('2019-4-10').unix(),
        group_id: '00005'
    },
    {
        _id: 'item-0503',
        title: 'VERSION 0503',
        start: moment('2019-1-20').unix(),
        end: moment('2019-2-20').unix(),
        group_id: '00005'
    }
];
