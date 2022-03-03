import { GanttLinkPathType, GanttLinkOptions, GanttLinkType } from './class/link';
import { InjectionToken } from '@angular/core';

export interface GanttDateFormat {
    week?: string;
    month?: string;
    quarter?: string;
    year?: string;
    yearMonth?: string;
    yearQuarter?: string;
}

export interface GanttGlobalConfig {
    dateFormat?: GanttDateFormat;
    linkOptions?: GanttLinkOptions;
}

export const defaultConfig = {
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
        linkPathType: GanttLinkPathType.curve
    }
};

export const GANTT_GLOBAL_CONFIG = new InjectionToken<GanttGlobalConfig>('GANTT_GLOBAL_CONFIG');
