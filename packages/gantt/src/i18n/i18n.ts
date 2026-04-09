import { InjectionToken } from '@angular/core';
import type { Locale as DateFnsLocale } from 'date-fns';
import { GanttViewType } from '../class';

export enum GanttI18nLocale {
    zhHans = 'zh-hans',
    zhHant = 'zh-hant',
    enUs = 'en-us',
    deDe = 'de-de',
    jaJp = 'ja-jp',
    ruRu = 'ru-ru'
}

export type GanttI18nLocaleConfig = {
    id: GanttI18nLocale | string;
    dateLocale?: DateFnsLocale;
    views: Record<
        GanttViewType,
        {
            label: string;
            tickFormats: {
                period?: string;
                unit?: string;
            };
        }
    >;
};

export const GANTT_I18N_LOCALE_TOKEN = new InjectionToken<GanttI18nLocaleConfig[]>('gantt-i18n-locale');
