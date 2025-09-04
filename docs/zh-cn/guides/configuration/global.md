---
category: config
title: 全局配置
subtitle: Global Config
---

`ngx-gantt` 提供了可注入的全局配置 `GANTT_GLOBAL_CONFIG` ，使用者可以在 `Module` 或 `Component` 注入自定义的符合格式的配置来修改全局配置。

```javascript
import { GANTT_GLOBAL_CONFIG } from 'ngx-gantt';

@NgModule({
  ...
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        locale: 'zh-hans',
        dateFormat: {
           timeZone: 'Asia/Shanghai',
           weekStartsOn: 1
        }
        ...
      }
    },
    ...
  ]
  ...
})
export class AppModule {

}

```

`GANTT_GLOBAL_CONFIG` 参数说明：

```javascript
export interface GanttGlobalConfig {
  locale: GanttI18nLocale; // 默认 locale 可选语言：zh-hans, zh-hant ,en-us, de-de, ja-jp, ru-ru
  dateOptions: {
    timeZone: string, // 设置自定义时区，默认为系统默认时区
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 设置 week 起始值，默认为 1
  };
  linkOptions: {
    dependencyTypes?: GanttLinkType[], // fs | ff | ss | sf
    showArrow?: boolean, // 连接线是否显示箭头
    lineType?: GanttLinkLineType // 连接线类型（曲线或直线）
  };
  styleOptions?: {
    headerHeight?: number, // 自定义 header 高度
    lineHeight?: number, // 自定义行高
    barHeight?: number // 自定义 Bar 的高度
  };

  /** @deprecated dateFormat 已废弃, 请通过国际化配置来设置日期格式. https://worktile.github.io/ngx-gantt/guides/configuration/i18n */
  dateFormat?: {
    week?: string, // week w
    month?: string, // month M
    quarter?: string, // QQQ
    year?: string, // year yyyy
    yearMonth?: string, // yyyy年MM月
    yearQuarter?: string // yyyy年QQQ
  };
}
```

| Name                     | Type                                                     | Description  |
| ------------------------ | -------------------------------------------------------- | ------------ |
| locale                   | `zh-hans`, `zh-hant` ,`en-us`, `de-de`, `ja-jp`, `ru-ru` | 默认语言配置 |
| dateOptions              | `GanttDateOptions`                                       | 日期配置     |
| linkOptions              | `GanttLinkOptions`                                       | 关联关系配置 |
| styleOptions             | `GanttStyles`                                            | 样式配置     |
| dateFormat `@deprecated` | `GanttDateFormat`                                        | 日期格式     |
