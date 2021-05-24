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
    }
];

export const mockGroups = [
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
