import { GanttItem, GanttItemInternal } from '../class/item';
export interface Dictionary<T = unknown> {
    [key: string]: T;
}
export declare function isNumber(value: any): value is number;
export declare function isString(value: any): value is string;
export declare function isUndefined(value: any): boolean;
export declare function hexToRgb(color: string, opacity?: number): string;
export declare function uniqBy<T = unknown>(array: T[], key: keyof T): any[];
export declare function flatten<T = unknown>(array: T[]): any;
export declare function recursiveItems(items: GanttItemInternal[]): any[];
export declare function getFlatItems(items: GanttItem[]): any[];
export declare function keyBy<T>(array: T[], key: T extends object ? keyof T : never): {
    [key: string]: T;
};
