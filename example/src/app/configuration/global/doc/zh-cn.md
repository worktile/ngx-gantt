---
category: config
title: 全局配置
subtitle:
---

`ngx-gantt` 提供了可注入的全局配置 `GANTT_GLOBAL_CONFIG` ，其中包含 `dateFormat` 字段，用于统一配置甘特图日历中日期的格式，默认配置如下：

```
defaultConfig = {
    dateFormat: {
        week: '第w周',
        month: 'M月',
        quarter: 'QQQ',
        year: 'yyyy年',
        yearQuarter: 'yyyy年QQQ',
        yearMonth: 'yyyy年MM月'
    }
};
```

`ngx-gantt` 在处理视图时会根据这些配置基于 [date-fns](https://date-fns.org/v2.28.0/docs/format) 的 `format` 方法得出日历中的日期格式。

使用者修改配置方式如下：

```
import { GANTT_GLOBAL_CONFIG } from 'ngx-gantt';

@Component({
    selector: 'app-gantt-example',
    templateUrl: './gantt.component.html',
    providers: [
        {
            provide: GANTT_GLOBAL_CONFIG,
            useValue: {
                dateFormat: {
                    yearQuarter: `QQQ 'of' yyyy`,
                    month: 'LLLL',
                    yearMonth: `LLLL yyyy'(week' w ')'`
                }
            }
        }
    ]
})

```

除此之外，还可以通过 `viewOptions` 参数单独配置， `viewOptions` 具体定义如下：

```
export interface GanttViewOptions {
    start?: GanttDate;
    end?: GanttDate;
    min?: GanttDate;
    max?: GanttDate;
    cellWidth?: number;
    addAmount?: number;
    addUnit?: GanttDateUtil;
    dateFormat?: GanttDateFormat;
}
```

使用者只需在 `viewOptions` 参数中传入 `dateFormat` 字段即可。

更多格式请参考 [date-fns](https://date-fns.org/v2.28.0/docs/format) 官方文档。
