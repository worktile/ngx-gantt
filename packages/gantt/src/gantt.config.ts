import { InjectionToken } from '@angular/core';

export const defaultConfig = {
    dateFormat: {
        year: 'yyyy年',
        quarter: 'QQQ',
        yearQuarter: 'yyyy年QQQ',
        month: 'M月',
        yearMonth: 'yyyy年MM月',
        week: '第w周'
    }
};

export type GanttConfig = typeof defaultConfig;

export const GANTT_CONFIG_TOKEN = new InjectionToken<GanttConfig>('STYX_GANTT_CONFIG');
