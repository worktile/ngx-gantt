import { GanttDate } from '../utils/date';

export class GanttViewTick {
    public leftX?: number;
    public rightX?: number;

    constructor(
        public start: GanttDate,
        public text: string,
        public x: number,
        public y: number | string,
        public additions?: {
            isWeekend: boolean;
            isToday: boolean;
        },
        public style?: Partial<CSSStyleDeclaration>,
        // set fill color
        public fill?: string
    ) {}
}
