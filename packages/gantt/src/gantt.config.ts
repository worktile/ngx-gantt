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
    barBackgroundColor?: string;
    headerHeight?: number;
    /** @deprecated use rowHeight instead */
    lineHeight?: number;
    rowHeight?: number;
    barHeight?: number;
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
        lineType: GanttLinkLineType.curve,
        colors: {
            default: '#cacaca',
            blocked: '#FF7575',
            active: '#6698ff'
        }
    },
    styleOptions: {
        primaryColor: '#6698ff',
        headerHeight: 44,
        rowHeight: 44,
        barHeight: 22
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
        const styleOptions = Object.assign({}, defaultConfig.styleOptions, this.config?.styleOptions, options);
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
