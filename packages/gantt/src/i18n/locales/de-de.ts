import { de } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.deDe,
    dateLocale: de as DateFnsLocale,
    views: {
        [GanttViewType.hour]: {
            label: 'Stündlich',
            tickFormats: {
                period: 'dd. MMM',
                unit: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Täglich',
            tickFormats: {
                period: 'MMM yyyy',
                unit: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Wöchentlich',
            tickFormats: {
                period: 'yyyy',
                unit: `w. 'Woche'`
            }
        },
        [GanttViewType.month]: {
            label: 'Monatlich',
            tickFormats: {
                period: 'MMM yyyy',
                unit: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Vierteljährlich',
            tickFormats: {
                period: 'yyyy',
                unit: `Q. 'Quartal' yyyy`
            }
        },
        [GanttViewType.year]: {
            label: 'Jährlich',
            tickFormats: {
                unit: 'yyyy'
            }
        }
    }
};
