import { ru } from 'date-fns/locale';
import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.ruRu,
    dateLocale: ru,
    views: {
        [GanttViewType.hour]: {
            label: 'Ежечасно',
            dateFormats: {
                primary: 'd MMM',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Ежедневно',
            dateFormats: {
                primary: 'MMMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Еженедельно',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'Неделя w'
            }
        },
        [GanttViewType.month]: {
            label: 'Ежемесячно',
            dateFormats: {
                primary: 'MMMM yyyy',
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Ежеквартально',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'Квартал Q yyyy'
            }
        },
        [GanttViewType.year]: {
            label: 'Ежегодно',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};
