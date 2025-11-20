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
            dateFormats: {
                primary: 'dd. MMM',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Täglich',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Wöchentlich',
            dateFormats: {
                primary: 'yyyy',
                secondary: `w. 'Woche'`
            }
        },
        [GanttViewType.month]: {
            label: 'Monatlich',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Vierteljährlich',
            dateFormats: {
                primary: 'yyyy',
                secondary: `Q. 'Quartal' yyyy`
            }
        },
        [GanttViewType.year]: {
            label: 'Jährlich',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};
