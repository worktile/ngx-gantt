import { InjectionToken } from '@angular/core';

export const defaultConfig = {
    dateFormat: {
        week: '第w周',
        month: 'M月',
        quarter: 'QQQ',
        year: 'yyyy年',
        yearQuarter: 'yyyy年QQQ',
        yearMonth: 'yyyy年MM月'
    }
};

export type GanttConfig = typeof defaultConfig;

export const GANTT_GLOBAL_CONFIG = new InjectionToken<GanttConfig>('GANTT_GLOBAL_CONFIG');
