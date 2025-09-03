import { parse } from 'date-fns';
import { GanttDate } from 'ngx-gantt';
import { TinyDate } from 'ngx-tethys/util';

const holidays = [
    {
        date: '20250801',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250814',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250815',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250813',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250822',
        name: '',
        type: 1,
        source: 1
    },
    {
        date: '20250821',
        name: '',
        type: 1,
        source: 1
    }
];

const defaultWorkdays = [1, 2, 3, 4, 5];

const holidaysKeyMap = holidays.reduce((map, item) => {
    const tinyDate = new TinyDate(parse(item.date, 'yyyyMMdd', new Date())).format('yyyyMMdd');
    map[tinyDate] = item;
    return map;
}, {});

export function isHoliday(date: GanttDate) {
    let isHoliday = false;
    const formattedDate = date.format('yyyyMMdd');
    const specialDate = holidaysKeyMap[formattedDate];
    if (specialDate) {
        if ((specialDate as any).type === 1) {
            isHoliday = true;
        }
    } else {
        const dayOfWeek = date.getDay();
        const isDefaultWorkdays = defaultWorkdays.includes(dayOfWeek);
        isHoliday = !isDefaultWorkdays;
    }
    return isHoliday;
}
