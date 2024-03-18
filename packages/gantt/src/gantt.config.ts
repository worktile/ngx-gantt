import { InjectionToken } from '@angular/core';
import { Locale } from 'date-fns';
import { GanttLinkLineType, GanttLinkOptions, GanttLinkType } from './class/link';

export interface GanttDateFormat {
    hour?: string;
    day?: string;
    week?: string;
    month?: string;
    quarter?: string;
    year?: string;
    yearMonth?: string;
    yearQuarter?: string;
}

export interface GanttDateOptions {
    locale?: Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface GanttStyleOptions {
    headerHeight?: number;
    lineHeight?: number;
    barHeight?: number;
}

export interface GanttGlobalConfig {
    dateFormat?: GanttDateFormat;
    dateOptions?: GanttDateOptions;
    linkOptions?: GanttLinkOptions;
    styleOptions?: GanttStyleOptions;
}

export const defaultConfig: GanttGlobalConfig = {
    dateFormat: {
        hour: 'HH:mm',
        day: 'M月d日',
        week: '第w周',
        month: 'M月',
        quarter: 'QQQ',
        year: 'yyyy年',
        yearMonth: 'yyyy年MM月',
        yearQuarter: 'yyyy年QQQ'
    },
    linkOptions: {
        dependencyTypes: [GanttLinkType.fs],
        showArrow: false,
        lineType: GanttLinkLineType.curve
    },
    styleOptions: {
        headerHeight: 44,
        lineHeight: 44,
        barHeight: 22
    }
};

export const GANTT_GLOBAL_CONFIG = new InjectionToken<GanttGlobalConfig>('GANTT_GLOBAL_CONFIG');
