import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.jaJp,
    views: {
        [GanttViewType.hour]: {
            label: '毎時',
            dateFormats: {
                primary: 'M月d日',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '日',
            dateFormats: {
                primary: 'yyyy年M月d日',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '週',
            dateFormats: {
                primary: 'yyyy年',
                secondary: '第w週'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            dateFormats: {
                primary: `yyyy年M月`,
                secondary: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '四半期',
            dateFormats: {
                primary: 'yyyy年',
                secondary: `yyyy年第Q四半期`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            dateFormats: {
                secondary: 'yyyy年'
            }
        }
    }
};
