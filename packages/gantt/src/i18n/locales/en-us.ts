import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.enUs,
    views: {
        [GanttViewType.hour]: {
            label: 'Hourly',
            dateFormats: {
                primary: 'MMM d',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Daily',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Weekly',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'wo'
            }
        },
        [GanttViewType.month]: {
            label: 'Monthly',
            dateFormats: {
                primary: "yyyy 'Q'Q",
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Quarterly',
            dateFormats: {
                primary: 'yyyy',
                secondary: "yyyy 'Q'Q"
            }
        },
        [GanttViewType.year]: {
            label: 'Yearly',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};
