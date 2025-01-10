import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.zhHans,
    views: {
        [GanttViewType.hour]: {
            label: '小时',
            dateFormats: {
                primary: 'M月d日',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '天',
            dateFormats: {
                primary: 'yyyy年MM月',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '周',
            dateFormats: {
                primary: 'yyyy年',
                secondary: '第w周'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            dateFormats: {
                primary: `yyyy年'Q'Q`,
                secondary: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '季',
            dateFormats: {
                primary: 'yyyy年',
                secondary: `yyyy年'Q'Q`
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
