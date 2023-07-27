import { addDays, getUnixTime } from 'date-fns';
import { GanttGroup, GanttItem } from 'ngx-gantt';

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function randomItems(length: number, parent?: GanttItem, group?: string) {
    const items = [];
    for (let i = 0; i < length; i++) {
        const start = addDays(new Date(), random(-200, 200));
        const end = addDays(start, random(0, 100));
        items.push({
            id: `${parent?.id || group || ''}${Math.floor(Math.random() * 100000000)}`,
            title: `${parent?.title || 'Task'}-${i}`,
            start: getUnixTime(start),
            end: getUnixTime(end),
            group_id: group,
            expandable: true
        });
    }
    return items;
}

export function randomGroupsAndItems(length: number) {
    const groups: GanttGroup[] = [];
    let items: GanttItem[] = [];
    for (let i = 0; i < length; i++) {
        groups.push({
            id: `00000${i}`,
            title: `Group-${i}`
        });
        items = [...items, ...randomItems(6, undefined, groups[i].id)];
    }
    return {
        groups,
        items
    };
}
