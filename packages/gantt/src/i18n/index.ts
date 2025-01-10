import { default as zhHansLocale } from './locales/zh-hans';
import { default as zhHantLocale } from './locales/zh-hant';
import { default as enUsLocale } from './locales/en-us';
import { default as jaJpLocale } from './locales/ja-jp';
import { default as deDeLocale } from './locales/de-de';
import { default as ruRuLocale } from './locales/ru-ru';
import { GANTT_I18N_LOCALE_TOKEN } from './i18n';
import { Provider } from '@angular/core';

export * from './i18n';

export { zhHansLocale, zhHantLocale, enUsLocale, jaJpLocale, deDeLocale, ruRuLocale };

export const i18nLocaleProvides: Provider[] = [
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: zhHansLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: zhHantLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: enUsLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: jaJpLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: deDeLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: ruRuLocale, multi: true }
];
