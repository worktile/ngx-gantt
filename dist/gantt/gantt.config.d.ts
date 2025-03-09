import { InjectionToken } from '@angular/core';
import { Locale } from 'date-fns';
import { GanttLinkOptions } from './class/link';
import { GanttI18nLocaleConfig, GanttI18nLocale } from './i18n/i18n';
import * as i0 from "@angular/core";
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
    /**
     * @deprecated dateOptions is deprecated, use i18n locale setting instead
     * http://gantt.ngnice.com/guides/configuration/i18n
     */
    locale?: Locale;
    timeZone?: string;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}
export interface GanttStyleOptions {
    headerHeight?: number;
    lineHeight?: number;
    barHeight?: number;
}
export interface GanttGlobalConfig {
    locale?: GanttI18nLocale | string;
    /** @deprecated dateFormat is deprecated, please configure through i18n. http://gantt.ngnice.com/guides/configuration/i18n */
    dateFormat?: GanttDateFormat;
    dateOptions?: GanttDateOptions;
    linkOptions?: GanttLinkOptions;
    styleOptions?: GanttStyleOptions;
}
export declare const defaultConfig: GanttGlobalConfig;
export declare const GANTT_GLOBAL_CONFIG: InjectionToken<GanttGlobalConfig>;
export declare class GanttConfigService {
    config: GanttGlobalConfig;
    private i18nLocales;
    constructor(globalConfig: GanttGlobalConfig);
    setLocale(locale: string): void;
    private getLocaleConfig;
    getViewsLocale(): GanttI18nLocaleConfig['views'];
    getDateLocale(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<GanttConfigService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GanttConfigService>;
}
