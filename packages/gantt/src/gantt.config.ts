import { inject, InjectionToken } from '@angular/core';
import { setDefaultOptions } from 'date-fns';
import { GanttLinkLineType, GanttLinkOptions, GanttLinkType } from './class/link';
import { Injectable } from '@angular/core';
import { GANTT_I18N_LOCALE_TOKEN, GanttI18nLocaleConfig, GanttI18nLocale } from './i18n/i18n';
import zhHans from './i18n/locales/zh-hans';
import zhHant from './i18n/locales/zh-hant';
import { setDefaultTimeZone } from './utils/date';

export interface GanttDateOptions {
    timeZone?: string;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface GanttStyleOptions {
    primaryColor?: string;
    headerHeight?: number;
    /** @deprecated use rowHeight instead */
    lineHeight?: number;
    rowHeight?: number;
    barHeight?: number;
    defaultTheme?: string;
    themes?: Record<
        string,
        {
            primary?: string;
            danger?: string;
            highlight?: string;
            background?: string;
            text?: {
                main?: string;
                muted?: string;
                light?: string;
                inverse?: string;
            };
            gray?: {
                100?: string;
                200?: string;
                300?: string;
                400?: string;
                500?: string;
                600?: string;
            };
        }
    >;
}

export interface GanttGlobalConfig {
    locale?: GanttI18nLocale | string;
    dateOptions?: GanttDateOptions;
    linkOptions?: GanttLinkOptions;
    styleOptions?: GanttStyleOptions;
}

export const defaultConfig: GanttGlobalConfig = {
    locale: GanttI18nLocale.zhHans,
    linkOptions: {
        dependencyTypes: [GanttLinkType.fs],
        showArrow: false,
        lineType: GanttLinkLineType.curve
    },
    styleOptions: {
        primaryColor: '#6698ff',
        headerHeight: 44,
        rowHeight: 44,
        barHeight: 22,
        defaultTheme: 'default',
        themes: {
            default: {
                primary: '#6698ff',
                danger: '#FF7575',
                highlight: '#ff9f73',
                background: '#ffffff',
                text: {
                    main: '#333333',
                    muted: '#888888',
                    light: '#aaaaaa',
                    inverse: '#ffffff'
                },
                gray: {
                    100: '#fafafa',
                    200: '#f5f5f5',
                    300: '#f3f3f3',
                    400: '#eeeeee',
                    500: '#dddddd',
                    600: '#cacaca'
                }
            }
        }
    },
    dateOptions: {
        weekStartsOn: 1
    }
};

export const GANTT_GLOBAL_CONFIG = new InjectionToken<GanttGlobalConfig>('GANTT_GLOBAL_CONFIG');

@Injectable({ providedIn: 'root' })
export class GanttConfigService {
    public config: GanttGlobalConfig;

    private i18nLocales: Record<GanttI18nLocale | string, GanttI18nLocaleConfig>;

    constructor() {
        const globalConfig = inject<GanttGlobalConfig>(GANTT_GLOBAL_CONFIG, { optional: true }) || {};

        const localeId = globalConfig.locale || defaultConfig.locale;

        this.config = {
            locale: localeId,
            styleOptions: this.mergeStyleOptions(globalConfig.styleOptions),
            linkOptions: Object.assign({}, defaultConfig.linkOptions, globalConfig.linkOptions),
            dateOptions: Object.assign({}, defaultConfig.dateOptions, globalConfig.dateOptions)
        };

        this.i18nLocales = (inject(GANTT_I18N_LOCALE_TOKEN, { optional: true }) || []).reduce(
            (result, localeConfig) => {
                result[localeConfig.id] = localeConfig; // 这里使用 `id` 作为 key
                return result;
            },
            {
                ['zh-cn']: zhHans as GanttI18nLocaleConfig,
                ['zh-tw']: zhHant as GanttI18nLocaleConfig
            } as Record<GanttI18nLocale | string, GanttI18nLocaleConfig>
        );

        if (this.config.dateOptions?.timeZone) {
            setDefaultTimeZone(this.config.dateOptions.timeZone);
        }

        setDefaultOptions({
            locale: this.getDateLocale(),
            weekStartsOn: this.config?.dateOptions?.weekStartsOn
        });
    }

    mergeStyleOptions(options: GanttStyleOptions): GanttStyleOptions {
        const baseThemes = this.config?.styleOptions?.themes || defaultConfig.styleOptions.themes;
        const customThemes = options?.themes;

        const mergedThemes: GanttStyleOptions['themes'] = Object.assign({}, baseThemes);

        if (customThemes) {
            Object.keys(customThemes).forEach((name) => {
                mergedThemes[name] = {
                    ...mergedThemes[name],
                    ...customThemes[name],
                    text: { ...mergedThemes[name]?.text, ...customThemes[name]?.text },
                    gray: { ...mergedThemes[name]?.gray, ...customThemes[name]?.gray }
                };
            });
        }

        const styleOptions: GanttStyleOptions = {
            ...defaultConfig.styleOptions,
            ...this.config?.styleOptions,
            ...options,
            themes: mergedThemes
        };

        if (!mergedThemes[styleOptions.defaultTheme]) {
            console.warn(`[ngx-gantt] theme ${styleOptions.defaultTheme} is not found, use default theme instead`);
            styleOptions.defaultTheme = 'default';
        }

        // 如果传了 primaryColor,则更新默认主题的 primary
        if (options?.primaryColor) {
            mergedThemes[styleOptions.defaultTheme].primary = options.primaryColor;
        }

        if (styleOptions.lineHeight && !styleOptions.rowHeight) {
            styleOptions.rowHeight = styleOptions.lineHeight;
            console.warn('[ngx-gantt] lineHeight is deprecated, use rowHeight instead');
        }

        return styleOptions;
    }

    setLocale(locale: string) {
        this.config.locale = locale;
    }

    private getLocaleConfig(): GanttI18nLocaleConfig {
        return (
            this.i18nLocales[this.config.locale] ?? this.i18nLocales[this.config.locale.toLowerCase()] ?? (zhHans as GanttI18nLocaleConfig)
        );
    }

    getViewsLocale(): GanttI18nLocaleConfig['views'] {
        return this.getLocaleConfig().views;
    }

    getDateLocale() {
        return this.getLocaleConfig().dateLocale;
    }
}
