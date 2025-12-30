import { ru } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.ruRu,
    dateLocale: ru as DateFnsLocale,
    views: {
        [GanttViewType.hour]: {
            label: 'Ежечасно',
            tickFormats: {
                period: 'd MMM',
                unit: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Ежедневно',
            tickFormats: {
                period: 'MMMM yyyy',
                unit: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Еженедельно',
            tickFormats: {
                period: 'yyyy',
                unit: 'Неделя w'
            }
        },
        [GanttViewType.month]: {
            label: 'Ежемесячно',
            tickFormats: {
                period: 'MMMM yyyy',
                unit: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Ежеквартально',
            tickFormats: {
                period: 'yyyy',
                unit: 'Квартал Q yyyy'
            }
        },
        [GanttViewType.year]: {
            label: 'Ежегодно',
            tickFormats: {
                unit: 'yyyy'
            }
        }
    }
};
