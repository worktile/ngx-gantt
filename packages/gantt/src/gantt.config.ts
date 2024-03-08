import { InjectionToken } from '@angular/core';
import { Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import { GanttLinkLineType, GanttLinkOptions, GanttLinkType } from './class/link';

export interface GanttDateFormat {
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

export interface GanttGlobalConfig {
    dateFormat?: GanttDateFormat;
    dateOptions?: GanttDateOptions;
    linkOptions?: GanttLinkOptions;
}

export const defaultConfig: GanttGlobalConfig = {
    dateOptions: {
        locale: fr
    },
    dateFormat: {
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
    }
};

export const GANTT_GLOBAL_CONFIG = new InjectionToken<GanttGlobalConfig>('GANTT_GLOBAL_CONFIG');
