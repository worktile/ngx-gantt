---
title: 时间说明
subtitle: Date
order: 25
---

## 时间格式

`ngx-gantt` 统一使用 10 位的 UnixTime 格式，使用方需要确保传入的日期值为 UnixTime

## GanttDate

`ngx-gantt` 提供 `GanttDate` 类来处理时间，示例如下：

```javascript
 import { GanttDate } from 'ngx-gantt';

 new GanttDate(new Date('2022-01-01 12:00:00')).getUnixTime(); //
 new GanttDate(1617275597).addDays(1);
 new GanttDate(1617275597).addHours(24).getDay();
 new GanttDate(1617275597).format("yyyy年MM月");
...

```

更多请参考 [GanttDate](https://github.com/worktile/ngx-gantt/blob/master/packages/gantt/src/utils/date.ts)

## 设置时区

通过[全局配置](/guides/configuration/global) 设置时区，配置方式如下：

```javascript
import { GANTT_GLOBAL_CONFIG } from 'ngx-gantt';
import { fr } from 'date-fns/locale';

@NgModule({
  ...
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateOptions: {
             locale: fr
             weekStartsOn: 1
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
