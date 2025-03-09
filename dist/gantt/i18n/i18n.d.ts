import { InjectionToken } from '@angular/core';
import { Locale as DateFnsLocale } from 'date-fns';
import { GanttViewType } from '../class';
export declare enum GanttI18nLocale {
    zhHans = "zh-hans",
    zhHant = "zh-hant",
    enUs = "en-us",
    deDe = "de-de",
    jaJp = "ja-jp",
    ruRu = "ru-ru"
}
export type GanttI18nLocaleConfig = {
    id: GanttI18nLocale | string;
    dateLocale?: DateFnsLocale;
    views: Record<GanttViewType, {
        label: string;
        dateFormats: {
            primary?: string;
            secondary?: string;
        };
    }>;
};
export declare const GANTT_I18N_LOCALE_TOKEN: InjectionToken<GanttI18nLocaleConfig[]>;
