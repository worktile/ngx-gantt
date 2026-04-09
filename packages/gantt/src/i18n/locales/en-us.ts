import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.enUs,
    views: {
        [GanttViewType.hour]: {
            label: 'Hourly',
            tickFormats: {
                period: 'MMM d',
                unit: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Daily',
            tickFormats: {
                period: 'MMM yyyy',
                unit: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Weekly',
            tickFormats: {
                period: 'yyyy',
                unit: 'wo'
            }
        },
        [GanttViewType.month]: {
            label: 'Monthly',
            tickFormats: {
                period: "yyyy 'Q'Q",
                unit: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Quarterly',
            tickFormats: {
                period: 'yyyy',
                unit: "yyyy 'Q'Q"
            }
        },
        [GanttViewType.year]: {
            label: 'Yearly',
            tickFormats: {
                unit: 'yyyy'
            }
        }
    }
};
