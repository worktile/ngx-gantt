import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.jaJp,
    views: {
        [GanttViewType.hour]: {
            label: '毎時',
            tickFormats: {
                period: 'M月d日',
                unit: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '日',
            tickFormats: {
                period: 'yyyy年M月d日',
                unit: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '週',
            tickFormats: {
                period: 'yyyy年',
                unit: '第w週'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            tickFormats: {
                period: `yyyy年M月`,
                unit: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '四半期',
            tickFormats: {
                period: 'yyyy年',
                unit: `yyyy年第Q四半期`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            tickFormats: {
                unit: 'yyyy年'
            }
        }
    }
};
