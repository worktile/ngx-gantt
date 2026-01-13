---
title: 视图
path: 'views'
order: 220
---

视图是甘特图组件最核心的部分，组件内置了 6 种视图支持，开发者可根据自己场景来决定使用哪种视图，并通过 viewOptions 来个性化配置，若内置视图无法满足你的场景，也可以通过自定义视图来实现。

## 使用视图

ngx-gantt 组件支持通过 `viewType` 和 `viewOptions` 自定义视图配置：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [viewOptions]="viewOptions">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  viewType: GanttViewType = GanttViewType.day;
  viewOptions: GanttViewOptions = {
    // 视图配置选项
  };
}
```

## 视图类型

ngx-gantt 提供 6 种内置视图类型，适用于不同的时间粒度需求：

```typescript
enum GanttViewType {
  hour = 'hour', // 小时视图
  day = 'day', // 日视图
  week = 'week', // 周视图
  month = 'month', // 月视图
  quarter = 'quarter', // 季度视图
  year = 'year' // 年视图
}
```

### 视图展示说明

时间轴刻度分为两层显示：

- **周期刻度（period）**：顶部显示，用于分组标识，如"2021年07月"
- **单位刻度（unit）**：底部显示，用于具体时间点，如"31日"

| 视图类型  | 周期刻度（一级展示）   | 单位刻度（二级展示） | 拖拽精度 |
| --------- | ---------------------- | -------------------- | -------- |
| `hour`    | 按天分组（M月d日）     | 小时:分钟（HH:mm）   | `minute` |
| `day`     | 按月分组（yyyy年MM月） | 日期（d）            | `day`    |
| `week`    | 按年分组（yyyy年）     | 周序号（第w周）      | `day`    |
| `month`   | 按季度分组（yyyy年Q）  | 月份（M月）          | `day`    |
| `quarter` | 按年分组（yyyy年）     | 季度（yyyy年Q）      | `day`    |
| `year`    | -                      | 年份（yyyy年）       | `day`    |

## ViewOptions 配置

`GanttViewOptions` 提供了丰富的视图配置选项：

```typescript
interface GanttViewOptions {
  start?: GanttDate; // 自定义开始时间
  end?: GanttDate; // 自定义结束时间
  minBoundary?: GanttDate; // 最小边界（默认：当前年份-1）
  maxBoundary?: GanttDate; // 最大边界（默认：当前年份+1）
  unitWidth?: number; // 单个时间单位的宽度（像素）
  loadDuration?: {
    // 滚动加载的时间跨度
    amount: number;
    unit: GanttDateUtil;
  };
  tickFormats?: {
    // 时间刻度格式化
    period: string; // 周期刻度格式
    unit: string; // 单位刻度格式
  };
  dragTooltipFormat?: string; // 拖拽提示框格式
  holiday?: {
    // 节假日配置（目前仅日视图支持）
    isHoliday: (date: GanttDate) => boolean;
    hideHoliday: boolean;
  };
  [key: string]: any; // 自定义选项
}
```

## 时间刻度格式化（tickFormats）

通过 `tickFormats` 自定义时间刻度的显示格式，使用 `date-fns` 的格式字符串进行设置，支持 `period`（周期刻度）和 `unit`（单位刻度）：

```typescript
const viewOptions: GanttViewOptions = {
  tickFormats: {
    period: 'yyyy年MM月', // 周期刻度（如：2021年07月）
    unit: 'dd日' // 单位刻度（如：31日）
  }
};
```

## 拖拽提示框格式（dragTooltipFormat）

通过 `dragTooltipFormat` 自定义拖拽时显示的日期格式：

```typescript
const viewOptions: GanttViewOptions = {
  dragTooltipFormat: 'MM-dd HH:mm' // 默认 'MM-dd'
};
```

## 滚动加载配置（loadDuration）

组件开启横向滚动加载时，不同的视图每次滚动增加的时间不同，可通过 loadDuration 进行配置

```typescript
const viewOptions: GanttViewOptions = {
  loadDuration: {
    amount: 1,
    unit: 'month' // 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
  }
};
```

当用户滚动到边界时，自动扩展时间范围。例如：

- `amount: 3, unit: 'month'` - 每次加载 3 个月
- `amount: 1, unit: 'week'` - 每次加载 1 周

## 节假日配置（holiday）

配置节假日显示和隐藏，**目前仅日视图支持**：

```typescript
const viewOptions: GanttViewOptions = {
  holiday: {
    isHoliday: (date: GanttDate) => {
      // 判断是否为节假日
      return date.isWeekend() || isHoliday(date.value);
    },
    hideHoliday: false // 是否隐藏节假日列
  }
};
```

- `isHoliday`：函数，接收 `GanttDate` 对象，返回 `boolean` 表示是否为节假日
- `hideHoliday`：是否隐藏节假日列，`true` 时节假日列不显示但仍占用空间

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttViewOptions, GanttDate } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-view',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [viewOptions]="viewOptions">
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
export class GanttViewComponent {
  viewType = GanttViewType.day;

  viewOptions: GanttViewOptions = {
    // 自定义时间范围
    start: new GanttDate('2021-01-01'),
    end: new GanttDate('2021-12-31'),
    minBoundary: new GanttDate('2020-01-01'),
    maxBoundary: new GanttDate('2022-12-31'),

    // 单位宽度
    unitWidth: 35,

    // 时间刻度格式化
    tickFormats: {
      period: 'yyyy年MM月',
      unit: 'dd日'
    },

    // 拖拽提示框格式
    dragTooltipFormat: 'MM-dd HH:mm',

    // 滚动加载配置
    loadDuration: {
      amount: 3,
      unit: 'month'
    },

    // 节假日配置（仅日视图支持）
    holiday: {
      isHoliday: (date: GanttDate) => {
        return date.isWeekend();
      },
      hideHoliday: false
    }
  };

  items: GanttItem[] = [
    {
      id: '1',
      title: '任务 1',
      start: 1627729997,
      end: 1628421197
    }
  ];
}
```

## 常见问题

### Q: 如何选择合适的视图类型？

**A:** 根据任务的时间跨度选择：

- 短期任务（< 1 周）：`hour` 或 `day`
- 中期任务（1 周 - 3 个月）：`day` 或 `week`
- 长期任务（3 个月 - 1 年）：`week` 或 `month`
- 超长期任务（> 1 年）：`month`、`quarter` 或 `year`

### Q: unitWidth 设置多少合适？

**A:** 取决于视图类型和显示需求：

- `day` 视图：30-50px
- `week` 视图：50-100px
- `month` 视图：100-200px
- 值越大，显示越宽松，但性能开销也越大

### Q: 如何实现自定义视图？

**A:** 参考 [自定义视图](../advanced/custom-views.md)，继承 `GanttView` 抽象类并实现必要方法。

## 相关链接

- [自定义视图](../advanced/custom-views.md) - 学习如何创建自定义视图类型
- [工具栏](../features/toolbar.md) - 了解视图切换的 UI 实现
- [时间与时区](./date-timezone.md) - 理解时间处理的基础
