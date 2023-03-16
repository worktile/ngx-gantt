import { GanttItem, GanttItemInternal } from '../class/item';

export interface Dictionary<T = unknown> {
    [key: string]: T;
}

export function isNumber(value: any) {
    return typeof value === 'number';
}

export function isString(value: any) {
    return typeof value === 'string';
}

export function isUndefined(value: any) {
    return value === undefined;
}

export function hexToRgb(color: string, opacity = 1) {
    if (/^#/g.test(color)) {
        return `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${opacity})`;
    } else {
        return color;
    }
}

export function uniqBy<T = unknown>(array: T[], key: keyof T) {
    const valuesMap: Dictionary<T> = {};
    const result = [];
    (array || []).forEach((value) => {
        const _key = value[key as string];
        if (!valuesMap[_key]) {
            valuesMap[_key] = value;
            result.push(value);
        }
    });
    return result;
}

export function flatten<T = unknown>(array: T[]) {
    return array.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}

// export function recursiveItems(items: GanttItemInternal[]) {
//     const result = [];
//     (items || []).forEach((item) => {
//         result.push(item);
//         if (item.expanded && item.children) {
//             result.push(...recursiveItems(item.children));
//         }
//     });
//     return result;
// }

export function recursiveItems(items: GanttItemInternal[]) {
    const result = [];
    (items || []).forEach((item) => {
        result.push(item);
        if (item.expanded && item.children) {
            result.push(...recursiveItems(item.children));
        }
    });
    return result;
}

export function getFlatItems(items: GanttItem[]) {
    const result = [];
    (items || []).forEach((item) => {
        result.push(item);
        if (item.children) {
            result.push(...getFlatItems(item.children));
        }
    });
    return result;
}

export function keyBy<T>(array: T[], key: T extends object ? keyof T : never): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    array.forEach((item) => {
        const keyValue = item[key];
        (result as any)[keyValue] = item;
    });
    return result;
}
