import { GanttDate } from '../utils/date';

export class GanttDatePoint {
    constructor(
        public start: GanttDate,
        public text: string,
        public x: number,
        public y: number | string,
        public additions?: {
            isWeekend: boolean;
            isToday: boolean;
        },
        public style?: Partial<CSSStyleDeclaration>
    ) {}
}
