---
title: 时间与时区
path: 'date-timezone'
order: 230
---

ngx-gantt 基于 `date-fns` 和 `@date-fns/tz` 处理时间，提供了 `GanttDate` 类统一处理时间，支持时区配置和多种时间格式输入。

## 时间输入格式

`GanttItem` 的 `start` 和 `end` 字段支持以下格式：

```typescript
// 1. Unix 时间戳（10位秒或13位毫秒）
const items1: GanttItem[] = [
  {
    id: '1',
    title: '任务',
    start: 1627729997, // 10 位 Unix 时间戳（秒）
    end: 1627729997000 // 13 位 Unix 时间戳（毫秒）
  }
];

// 2. Date 对象
const items2: GanttItem[] = [
  {
    id: '2',
    title: '任务',
    start: new Date(1627729997 * 1000),
    end: new Date(1628421197 * 1000)
  }
];
```

## GanttDate 时间操作

`GanttDate` 是基于 `date-fns` 和 `@date-fns/tz` 封装的时间工具类，提供了丰富的时间操作方法，使用者可选择性使用，它不是必须的。

### 创建 GanttDate

```typescript
import { GanttDate } from '@worktile/gantt';

// 当前时间
const now = new GanttDate();

// 从 Unix 时间戳（秒，10位）创建
const date1 = new GanttDate(1627729997);

// 从 Unix 时间戳（毫秒，13位）创建
const date2 = new GanttDate(1627729997000);

// 从 Date 对象创建
const date3 = new GanttDate(new Date(1627729997 * 1000));

// 从字符串创建
const date4 = new GanttDate('2021-07-31');
```

### 时间操作方法

```typescript
const date = new GanttDate(1627729997);

// 加减时间
date.addDays(7); // 加 7 天
date.addMonths(1); // 加 1 个月
date.addYears(1); // 加 1 年
date.add(1, 'week'); // 加 1 周（通用方法）

// 获取时间边界
date.startOfDay(); // 当天开始
date.endOfDay(); // 当天结束
date.startOfWeek(); // 周开始
date.endOfWeek(); // 周结束
date.startOfMonth(); // 月初
date.endOfMonth(); // 月末
date.startOfQuarter(); // 季度开始
date.endOfQuarter(); // 季度结束
date.startOfYear(); // 年初
date.endOfYear(); // 年末

// 格式化（使用 date-fns 格式字符串）
date.format('yyyy-MM-dd'); // '2021-07-31'
date.format('yyyy-MM-dd HH:mm:ss'); // '2021-07-31 12:00:00'

// 获取 Unix 时间戳（秒）
const timestamp = date.getUnixTime(); // 1627729997

// 判断
date.isToday(); // 是否为今天
date.isWeekend(); // 是否为周末
```

## 时区配置

通过 `GANTT_GLOBAL_CONFIG` 配置全局时区和周起始日：

```typescript
import { Component } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';

@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateOptions: {
          timeZone: 'Asia/Shanghai', // 时区
          weekStartsOn: 1 // 周起始日：0=周日, 1=周一
        }
      } as GanttGlobalConfig
    }
  ]
})
export class AppComponent {}
```

### 时区说明

- `timeZone`：使用 IANA 时区标识符（如 `'Asia/Shanghai'`、`'America/New_York'`）
- 所有时间计算和显示都会基于配置的时区
- 如果不配置，使用系统默认时区

### 周起始日

- `weekStartsOn`：0-6，分别代表周日到周六
- 默认值为 `1`（周一）
- 影响周视图的显示和计算
