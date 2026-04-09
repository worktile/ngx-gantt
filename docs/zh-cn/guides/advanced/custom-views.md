---
title: 自定义视图
path: 'custom-views'
order: 510
---

当内置的 6 种视图类型无法满足需求时，可以通过继承 `GanttView` 抽象类创建自定义视图。

## 什么时候需要自定义视图？

**适用场景：**

- 需要特殊的时间粒度（如双周视图、双月视图）
- 需要特殊的时间范围计算逻辑

**非适用场景：**

- 只需要调整视图样式（使用 CSS 即可）
- 只需要调整时间格式（使用 `viewOptions.tickFormats` 即可）

## 实现自定义视图

以下示例实现了一个双周视图（以2周为一个周期，每周为一个单位）：

```typescript
import {
  GanttView,
  GanttViewOptions,
  PERIOD_TICK_TOP,
  UNIT_TICK_TOP,
  GanttViewDate,
  GanttDate,
  eachWeekOfInterval,
  GanttViewTick
} from '@worktile/gantt';

// 默认视图选项
const defaultViewOptions: GanttViewOptions = {
  unitWidth: 200, // 单位宽度（像素），这里单位是周
  start: new GanttDate().startOfYear().startOfWeek({ weekStartsOn: 1 }), // 视图开始时间
  end: new GanttDate().endOfYear().endOfWeek({ weekStartsOn: 1 }), // 视图结束时间
  loadDuration: {
    amount: 3,
    unit: 'month' // 加载时长：3个月
  }
};

export class GanttViewBiweekly extends GanttView {
  // 显示今日指示器
  override showNowIndicator = true;

  // 视图类型（自定义字符串）
  override viewType = 'biweekly';

  constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    // 合并默认选项和传入的选项
    super(start, end, Object.assign({}, defaultViewOptions, options));
  }

  /**
   * 返回指定日期所在范围的起始日期
   * 双周视图：返回包含该日期的双周周期的开始（每2周为一个周期）
   */
  rangeStartOf(date: GanttDate) {
    const weekStart = date.startOfWeek({ weekStartsOn: 1 }); // 先找到周的开始
    const weekNumber = weekStart.getWeek({ weekStartsOn: 1 }); // 获取周序号
    // 如果是奇数周，往前推一周；如果是偶数周，就是当前周
    const offset = (weekNumber - 1) % 2; // 0或1
    return weekStart.addWeeks(-offset); // 返回到双周的开始
  }

  /**
   * 返回指定日期所在范围的结束日期
   * 双周视图：返回包含该日期的双周周期的结束
   */
  rangeEndOf(date: GanttDate) {
    const rangeStart = this.rangeStartOf(date);
    return rangeStart.addWeeks(2).addDays(-1); // 双周周期的结束（2周后的前一天）
  }

  /**
   * 返回一个周期的宽度（像素）
   * 双周视图：一个周期是2周，宽度为2个单位宽度
   */
  getPeriodWidth() {
    return this.getUnitWidth() * 2; // 2周 = 2个单位宽度
  }

  /**
   * 返回指定日期的宽度（像素）
   * 双周视图：一天的宽度是单位宽度除以7（一周7天）
   */
  getDayWidth(date: GanttDate): number {
    return this.unitWidth / 7; // 单位是周，一周7天
  }

  /**
   * 返回周期刻度数组
   * 周期刻度显示在视图的上方，用于标识双周周期
   */
  getPeriodTicks(): GanttViewTick[] {
    // 获取视图范围内的所有周
    const weeks = eachWeekOfInterval(
      {
        start: this.start.value,
        end: this.end.addSeconds(1).value
      },
      { weekStartsOn: 1 }
    );

    const ticks: GanttViewTick[] = [];
    const periodWidth = this.getPeriodWidth();

    // 每2周生成一个周期刻度
    for (let i = 0; i < weeks.length; i += 2) {
      const weekStart = new GanttDate(weeks[i]);
      const rectX = (i / 2) * periodWidth;

      // 创建周期刻度对象
      const tick = new GanttViewTick({
        date: weekStart,
        rect: {
          x: rectX, // X 坐标
          width: periodWidth // 宽度（2周）
        },
        label: {
          text: `${weekStart.format('MM/dd')} - ${weekStart.addWeeks(2).addDays(-1).format('MM/dd')}`, // 显示双周范围
          y: PERIOD_TICK_TOP, // Y 坐标（周期刻度位置）
          x: rectX + periodWidth / 2 // 标签居中
        }
      });
      ticks.push(tick);
    }

    return ticks;
  }

  /**
   * 返回单位刻度数组
   * 单位刻度显示在视图的下方，用于标识每周
   */
  getUnitTicks(): GanttViewTick[] {
    // 获取视图范围内的所有周
    const weeks = eachWeekOfInterval(
      {
        start: this.start.value,
        end: this.end.addSeconds(1).value
      },
      { weekStartsOn: 1 }
    );

    const ticks: GanttViewTick[] = [];
    const unitWidth = this.getUnitWidth();

    // 遍历所有周，生成单位刻度
    for (let i = 0; i < weeks.length; i++) {
      const weekStart = new GanttDate(weeks[i]);
      const rectX = i * unitWidth;

      // 创建单位刻度对象
      const tick = new GanttViewTick({
        date: weekStart,
        rect: {
          x: rectX, // X 坐标
          width: unitWidth // 宽度（1周）
        },
        label: {
          text: `第${weekStart.getWeek({ weekStartsOn: 1 })}周`, // 显示周序号
          y: UNIT_TICK_TOP, // Y 坐标（单位刻度位置）
          x: rectX + unitWidth / 2 // 标签居中
        }
      });
      ticks.push(tick);
    }

    return ticks;
  }
}
```

## 注册和使用自定义视图

### 注册自定义视图

使用 `registerView` 函数注册自定义视图，建议在应用启动时注册：

```typescript
import { registerView } from '@worktile/gantt';
import { GanttViewCustom } from './custom-day-view';

// 在应用启动时注册（如 main.ts 或 app.component.ts）
registerView('biweekly', GanttViewBiweekly);
```

### 使用自定义视图

注册后，在组件中通过 `viewType` 属性使用自定义视图：

```typescript
import { Component } from '@angular/core';
import { GanttItem } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="'biweekly'">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];
}
```

### 覆盖内置视图

如果需要覆盖内置视图，使用相同的 `GanttViewType` 值：

```typescript
import { registerView, GanttViewType } from '@worktile/gantt';
import { GanttViewBiweekly } from './biweekly-view';

// 覆盖内置的周视图
registerView(GanttViewType.week, GanttViewBiweekly);
```

## 常见问题

### Q: 自定义视图不显示？

**A:** 检查：

1. 是否调用了 `registerView` 注册视图
2. 检查注册的 `viewType` 与使用的 viewType 是否一致
3. 所有必须的方法是否都已实现
