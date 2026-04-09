import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.zhHant,
    views: {
        [GanttViewType.hour]: {
            label: '小時',
            tickFormats: {
                period: 'M月d日',
                unit: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '天',
            tickFormats: {
                period: 'yyyy年MM月',
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
                period: `yyyy年'Q'Q`,
                unit: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '季',
            tickFormats: {
                period: 'yyyy年',
                unit: `yyyy年'Q'Q`
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
