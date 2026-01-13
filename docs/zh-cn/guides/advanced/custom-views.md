---
title: 自定义视图
path: 'custom-views'
order: 510
---

# 自定义视图

当内置的 6 种视图类型无法满足需求时，可以通过继承 `GanttView` 抽象类创建自定义视图。

## 前置阅读

在深入学习自定义视图之前，建议先了解：

- [视图体系](../core/views.md) - 理解视图的工作原理和坐标映射

## 适用场景

**适用场景：**

- 需要特殊的时间粒度（如双周视图、双月视图）
- 需要自定义时间刻度显示格式
- 需要特殊的时间范围计算逻辑
- 需要隐藏周末或特定日期

**非适用场景：**

- 只需要调整视图样式（使用 CSS 即可）
- 只需要调整时间格式（使用 `viewOptions.tickFormats` 即可）

## 继承 GanttView 抽象类

### 基础结构

```typescript
import {
  GanttView,
  GanttViewOptions,
  GanttViewType,
  GanttViewDate,
  GanttDate,
  GanttViewTick,
  PERIOD_TICK_TOP,
  UNIT_TICK_TOP
} from '@worktile/gantt';

export class GanttViewCustom extends GanttView {
  override viewType = GanttViewType.day; // 或自定义字符串

  constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    super(start, end, options);
  }

  // 必须实现的方法
  rangeStartOf(date: GanttDate): GanttDate {
    // 返回范围的起始日期
  }

  rangeEndOf(date: GanttDate): GanttDate {
    // 返回范围的结束日期
  }

  getPeriodWidth(): number {
    // 返回一个周期的宽度
  }

  getDayWidth(date: GanttDate): number {
    // 返回一天的宽度
  }

  getPeriodTicks(): GanttViewTick[] {
    // 返回周期刻度数组
  }

  getUnitTicks(): GanttViewTick[] {
    // 返回单位刻度数组
  }
}
```

### 必须实现的方法

#### 1. rangeStartOf / rangeEndOf

定义时间范围的起始和结束逻辑：

```typescript
rangeStartOf(date: GanttDate): GanttDate {
  return date.startOfWeek({ weekStartsOn: 1 });  // 周视图：返回周的开始
}

rangeEndOf(date: GanttDate): GanttDate {
  return date.endOfWeek({ weekStartsOn: 1 });    // 周视图：返回周的结束
}
```

#### 2. getPeriodWidth / getDayWidth

定义宽度计算逻辑：

```typescript
getPeriodWidth(): number {
  // 一个周期的宽度（如一周的宽度）
  return this.getUnitWidth() * 7;
}

getDayWidth(date: GanttDate): number {
  // 一天的宽度
  if (!this.options.showWeekend && date.isWeekend()) {
    return 0;  // 隐藏周末
  }
  return this.unitWidth;
}
```

#### 3. getPeriodTicks / getUnitTicks

定义刻度显示逻辑：

```typescript
getPeriodTicks(): GanttViewTick[] {
  const ticks: GanttViewTick[] = [];
  // 生成周期刻度
  // ...
  return ticks;
}

getUnitTicks(): GanttViewTick[] {
  const ticks: GanttViewTick[] = [];
  // 生成单位刻度
  // ...
  return ticks;
}
```

## 完整示例

### 自定义周视图（隐藏周末）

```typescript
import {
  GanttView,
  GanttViewOptions,
  GanttViewType,
  GanttViewDate,
  GanttDate,
  GanttViewTick,
  PERIOD_TICK_TOP,
  UNIT_TICK_TOP,
  eachDayOfInterval
} from '@worktile/gantt';

const defaultViewOptions: GanttViewOptions = {
  unitWidth: 50,
  start: new GanttDate().startOfMonth().startOfWeek({ weekStartsOn: 1 }),
  end: new GanttDate().endOfMonth().endOfWeek({ weekStartsOn: 1 }),
  loadDuration: {
    amount: 1,
    unit: 'month'
  }
};

export class GanttViewCustomWeek extends GanttView {
  override viewType = 'custom-week';

  constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    super(start, end, Object.assign({}, defaultViewOptions, options));
  }

  rangeStartOf(date: GanttDate): GanttDate {
    return date.startOfWeek({ weekStartsOn: 1 });
  }

  rangeEndOf(date: GanttDate): GanttDate {
    return date.endOfWeek({ weekStartsOn: 1 });
  }

  getPeriodWidth(): number {
    // 一周的宽度（5个工作日）
    return this.getUnitWidth() * 5;
  }

  getDayWidth(date: GanttDate): number {
    // 周末宽度为 0
    if (date.isWeekend()) {
      return 0;
    }
    return this.unitWidth;
  }

  getPeriodTicks(): GanttViewTick[] {
    const days = eachDayOfInterval({
      start: this.start.value,
      end: this.end.value
    });
    const ticks: GanttViewTick[] = [];
    const periodWidth = this.getPeriodWidth();

    let workdayIndex = 0;
    for (let i = 0; i < days.length; i++) {
      const date = new GanttDate(days[i]);
      if (date.isWeekend()) {
        continue; // 跳过周末
      }

      const rectX = workdayIndex * this.unitWidth;
      const tick = new GanttViewTick({
        date: date,
        rect: {
          x: rectX,
          width: this.unitWidth
        },
        label: {
          text: `第${Math.floor(workdayIndex / 5) + 1}周`,
          y: PERIOD_TICK_TOP,
          x: rectX + periodWidth / 2
        }
      });
      ticks.push(tick);
      workdayIndex++;
    }

    return ticks;
  }

  getUnitTicks(): GanttViewTick[] {
    const days = eachDayOfInterval({
      start: this.start.value,
      end: this.end.value
    });
    const ticks: GanttViewTick[] = [];
    const unitWidth = this.getUnitWidth();

    let workdayIndex = 0;
    for (let i = 0; i < days.length; i++) {
      const date = new GanttDate(days[i]);
      if (date.isWeekend()) {
        continue; // 跳过周末
      }

      const rectX = workdayIndex * unitWidth;
      const tick = new GanttViewTick({
        date: date,
        rect: {
          x: rectX,
          width: unitWidth
        },
        label: {
          text: date.format('MM/dd'),
          y: UNIT_TICK_TOP,
          x: rectX + unitWidth / 2
        }
      });
      ticks.push(tick);
      workdayIndex++;
    }

    return ticks;
  }
}
```

## 注册自定义视图

使用 `registerView` 函数注册自定义视图：

```typescript
import { registerView } from '@worktile/gantt';
import { GanttViewCustomWeek } from './custom-week-view';

// 在应用启动时注册
registerView('custom-week', GanttViewCustomWeek);
```

### 使用自定义视图

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="'custom-week'">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [];
}
```

## 最小示例

```typescript
// custom-view.ts
import {
  GanttView,
  GanttViewOptions,
  GanttViewType,
  GanttViewDate,
  GanttDate,
  GanttViewTick,
  PERIOD_TICK_TOP,
  UNIT_TICK_TOP
} from '@worktile/gantt';

export class GanttViewCustom extends GanttView {
  override viewType = 'custom';

  constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    super(start, end, options);
  }

  rangeStartOf(date: GanttDate): GanttDate {
    return date.startOfMonth();
  }

  rangeEndOf(date: GanttDate): GanttDate {
    return date.endOfMonth();
  }

  getPeriodWidth(): number {
    return this.getUnitWidth() * 30;
  }

  getDayWidth(date: GanttDate): number {
    return this.unitWidth;
  }

  getPeriodTicks(): GanttViewTick[] {
    // 实现周期刻度
    return [];
  }

  getUnitTicks(): GanttViewTick[] {
    // 实现单位刻度
    return [];
  }
}

// app.component.ts
import { Component, OnInit } from '@angular/core';
import { registerView } from '@worktile/gantt';
import { GanttViewCustom } from './custom-view';

registerView('custom', GanttViewCustom);

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="'custom'">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class AppComponent implements OnInit {
  items: GanttItem[] = [];
}
```

## 常见问题

### Q: 自定义视图不显示？

**A:** 检查：

1. 是否调用了 `registerView` 注册视图
2. `viewType` 是否与注册时的类型一致
3. 所有必须的方法是否都已实现

### Q: 如何调试自定义视图？

**A:**

1. 在 `getPeriodTicks` 和 `getUnitTicks` 中添加 `console.log`
2. 检查返回的 `GanttViewTick` 数组是否正确
3. 检查 `rect` 和 `label` 的坐标是否正确

### Q: 可以覆盖内置视图吗？

**A:** 可以，使用相同的 `GanttViewType` 值：

```typescript
registerView(GanttViewType.day, GanttViewCustom);
```

## 相关链接

- [视图体系](../core/views.md) - 了解视图工作原理
- [example 示例](https://github.com/worktile/ngx-gantt/tree/master/example/src/app/gantt-custom-view) - 查看完整示例
