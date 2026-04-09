import { TestBed } from '@angular/core/testing';
import { defaultConfig, GanttConfigService, GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '../../gantt.config';
import { GANTT_I18N_LOCALE_TOKEN, GanttI18nLocale, zhHansLocale, zhHantLocale } from '../../i18n';
import { GanttViewType } from '../../class';
import { NgxGanttModule } from '../../gantt.module';
import { CommonModule } from '@angular/common';
import { getDefaultTimeZone, setDefaultTimeZone } from '../../utils/date';
import { zhCN } from 'date-fns/locale';

describe('#GanttConfigService', () => {
    let service: GanttConfigService;

    afterAll(() => {
        setDefaultTimeZone(null);
    });

    describe('#basic configuration', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                providers: [
                    GanttConfigService,
                    {
                        provide: GANTT_GLOBAL_CONFIG,
                        useValue: {}
                    }
                ]
            });
            service = TestBed.inject(GanttConfigService);
        });

        it('should initialize with default configuration', () => {
            expect(service.config.locale).toBe(defaultConfig.locale);
            expect(service.config.styleOptions).toEqual(defaultConfig.styleOptions);
            expect(service.config.linkOptions).toEqual(defaultConfig.linkOptions);
            expect(service.config.dateOptions).toEqual(defaultConfig.dateOptions);
        });
    });

    describe('#custom configuration', () => {
        const customConfig: GanttGlobalConfig = {
            locale: GanttI18nLocale.enUs,
            styleOptions: {
                headerHeight: 50
            },
            dateOptions: {
                timeZone: 'UTC',
                weekStartsOn: 1
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                providers: [
                    GanttConfigService,
                    {
                        provide: GANTT_GLOBAL_CONFIG,
                        useValue: customConfig
                    }
                ]
            });
            service = TestBed.inject(GanttConfigService);
        });

        it('should merge custom configuration correctly', () => {
            expect(service.config.locale).toBe(GanttI18nLocale.enUs);
            expect(service.config.styleOptions.headerHeight).toBe(50);
            expect(service.config.dateOptions.weekStartsOn).toBe(1);
            expect(service.config.dateOptions.timeZone).toBe('UTC');
        });

        it('should set default time zone correctly', () => {
            expect(getDefaultTimeZone()).toBe('UTC');
        });
    });

    describe('#custom locale', () => {
        const localeConfig = {
            id: GanttI18nLocale.zhHans,
            views: {
                ...zhHansLocale.views,
                [GanttViewType.day]: {
                    label: 'Day',
                    tickFormats: {
                        period: 'yyyy MM',
                        unit: 'd天'
                    }
                }
            }
        };

        const newLocaleConfig = {
            id: 'customLocale',
            dateLocale: zhCN,
            views: {
                ...zhHansLocale.views,
                [GanttViewType.day]: {
                    label: 'Custom',
                    tickFormats: {
                        period: 'yyyy MM',
                        unit: 'd'
                    }
                }
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, NgxGanttModule],
                providers: [
                    GanttConfigService,
                    {
                        provide: GANTT_GLOBAL_CONFIG,
                        useValue: {
                            locale: GanttI18nLocale.zhHans
                        }
                    },
                    {
                        provide: GANTT_I18N_LOCALE_TOKEN,
                        useValue: localeConfig,
                        multi: true
                    },
                    {
                        provide: GANTT_I18N_LOCALE_TOKEN,
                        useValue: newLocaleConfig,
                        multi: true
                    }
                ]
            });
            service = TestBed.inject(GanttConfigService);
        });

        it('should override built in locale correctly', () => {
            expect(service.getViewsLocale().day.label).toBe(localeConfig.views.day.label);
            expect(service.getViewsLocale().day.tickFormats.period).toBe(localeConfig.views.day.tickFormats.period);
            expect(service.getViewsLocale().day.tickFormats.unit).toBe(localeConfig.views.day.tickFormats.unit);
        });

        it('should get new local config correctly', () => {
            service.setLocale('customLocale');
            expect(service.getViewsLocale().day.label).toBe(newLocaleConfig.views.day.label);
        });

        it('should get date local correctly', () => {
            service.setLocale('customLocale');
            expect(service.getDateLocale()).toBe(newLocaleConfig.dateLocale);
        });
    });
});
