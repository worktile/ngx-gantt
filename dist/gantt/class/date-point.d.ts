import { GanttDate } from '../utils/date';
export declare class GanttDatePoint {
    start: GanttDate;
    text: string;
    x: number;
    y: number | string;
    additions?: {
        isWeekend: boolean;
        isToday: boolean;
    };
    style?: Partial<CSSStyleDeclaration>;
    constructor(start: GanttDate, text: string, x: number, y: number | string, additions?: {
        isWeekend: boolean;
        isToday: boolean;
    }, style?: Partial<CSSStyleDeclaration>);
}
