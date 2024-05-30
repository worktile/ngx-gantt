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
        dateFormat: {
          ...
        },
        linkOptions: {
          ...
        },
        styleOptions: {
          ...
        },
      }
    },
    ...
  ]
  ...
})
export class AppModule {

}

```

`GANTT_GLOBAL_CONFIG` 格式如下：

```javascript
export interface GanttGlobalConfig {
  // dateFormat 可用于设置视图的国际化，format 格式与 date-fns format 规则一致
  dateFormat?: {
    week?: string, // 第w周
    month?: string, // M月
    quarter?: string, // QQQ
    year?: string, // yyyy年
    yearMonth?: string, // yyyy年MM月
    yearQuarter?: string // yyyy年QQQ
  };
  dateOptions: {
    locale?: Locale, // 时区  import { fr } from 'date-fns/locale';
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
}
```

| Name         | Type               | Description                  |
| ------------ | ------------------ | ---------------------------- |
| dateFormat   | `GanttDateFormat`  | 日期格式                     |
| dateOptions  | `GanttDateOptions` | 日期配置，可用于配置全局时区 |
| linkOptions  | `GanttLinkOptions` | 关联关系配置                 |
| styleOptions | `GanttStyles`      | 样式配置                     |
