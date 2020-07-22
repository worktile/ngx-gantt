export const mockItems = [
    {
        id: 'item-0101',
        title: 'VERSION 0101',
        start: 1590035675,
        group_id: '00001',
        color: '#FF0000',
        type: 'range',
        progress: 0.5,
        children: [
            {
                id: 'item-child-0101',
                title: 'VERSION Children 0101',
                start: 1590035675,
                group_id: '00001',
                color: '#FF0000',
                linkable: false,
                progress: 0.5,
                barStyle: { border: `1px solid #FF0000` }
            }
        ]
    },
    {
        id: 'item-0102',
        title: 'VERSION 0102',
        start: 1590935675,
        end: 1591318400,
        color: '#9ACD32',
        group_id: '00001',
        expandable: true
    },
    {
        id: 'item-0103',
        title: 'VERSION 0103',
        end: 1592018400,
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
        start: 1591035675,
        end: 1593018400,
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
        start: 1590235675,
        end: 1591718400,
        group_id: '00002',
        links: ['item-0204'],
        progress: 0.6,
        barStyle: { border: `1px solid rgb(52, 143, 228)` }
    },
    {
        id: 'item-0204',
        title: 'VERSION 0204',
        start: 1591035675,
        end: 1592418400,
        group_id: '00002',
        links: ['item-0301', 'item-0402']
    },

    {
        id: 'item-0301',
        title: 'VERSION 0301',
        start: 1596035675,
        end: 1599018400,
        group_id: '00003'
    },
    {
        id: 'item-0302',
        title: 'VERSION 0302',
        start: 1592035675,
        end: 1598018400,
        group_id: '00003'
    },
    {
        id: 'item-0303',
        title: 'VERSION 0303',
        start: 1590135675,
        end: 1594018400,
        group_id: '00003'
    },
    {
        id: 'item-0401',
        title: 'VERSION 0401',
        start: 1589035675,
        end: 1594018400,
        group_id: '00004'
    },
    {
        id: 'item-0402',
        title: 'VERSION 0402',
        start: 1596035675,
        end: 1599918400,
        group_id: '00004'
    },
    {
        id: 'item-0403',
        title: 'VERSION 0403',
        start: 1593035675,
        end: 1599018400,
        group_id: '00004'
    },
    {
        id: 'item-0404',
        title: 'VERSION 0404',
        start: 1591035675,
        end: 1592918400,
        group_id: '00004'
    },
    {
        id: 'item-0501',
        title: 'VERSION 0501',
        start: 1599935675,
        end: 1602018400,
        group_id: '00005'
    },
    {
        id: 'item-0502',
        title: 'VERSION 0502',
        start: 1591035675,
        end: 1594018400,
        group_id: '00005'
    },
    {
        id: 'item-0503',
        title: 'VERSION 0503',
        start: 1595035675,
        end: 1599018400,
        group_id: '00005'
    }
];
