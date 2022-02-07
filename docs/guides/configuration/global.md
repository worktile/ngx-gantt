---
category: config
title: 全局配置
subtitle:
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
        }
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
  dateFormat?: GanttDateFormat;
}
```

| Name       | Type              | Description |
| ---------- | ----------------- | ----------- |
| dateFormat | `GanttDateFormat` | 日期格式    |
