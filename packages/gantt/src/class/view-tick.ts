import { GanttDate } from '../utils/date';

interface GanttViewTickSchema {
    date: GanttDate;

    rect: {
        x: number;
        width: number;
        background?: string;
    };
    label: {
        text: string;
        y: number | string;
        x?: number;
        style?: {
            color?: string;
            fontSize?: number | string;
            fontWeight?: string | number;
        };
    };
    metadata?: {
        isWeekend?: boolean;
        isToday?: boolean;
        [key: string]: any;
    };
}

export class GanttViewTick {
    constructor(private schema: GanttViewTickSchema) {
        if (!schema.label.x) {
            schema.label.x = schema.rect.x + schema.rect.width / 2;
        }
    }

    get date(): GanttDate {
        return this.schema.date;
    }

    get rect(): GanttViewTickSchema['rect'] {
        return this.schema.rect;
    }

    get label(): GanttViewTickSchema['label'] {
        return this.schema.label;
    }

    get metadata(): GanttViewTickSchema['metadata'] {
        return this.schema.metadata;
    }
}
