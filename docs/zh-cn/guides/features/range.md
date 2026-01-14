---
title: Range 任务显示
path: 'range'
order: 321
---

Range（区间）是甘特图中用于展示特定类型任务项的组件，适用于需要以区间形式展示的时间段数据。

## Range 类型任务项

Range 类型的任务项通过设置 `type: 'range'` 来标识：

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '版本发布',
    start: 1627729997,
    end: 1627759997
    type: 'range' // 设置为 range 类型
  }
];
```

## Range 展示

### 自定义 Range 模板

使用 `#range` 模板自定义区间的内容：

```html
<ngx-gantt [items]="items">
  <ng-template #range let-item="item" let-refs="refs">
    <div class="custom-range">
      <span>{{ item.title }}</span>
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt>
```

### 模板上下文

`#range` 模板提供以下上下文：

- `item`：任务项数据（`GanttItem`）
- `refs`：区间的位置和尺寸信息
  - `refs.x`：X 坐标
  - `refs.y`：Y 坐标
  - `refs.width`：宽度
  - `refs.height`：高度

## Range 与 Bar 的区别

| 特性 | Bar                      | Range                        |
| ---- | ------------------------ | ---------------------------- |
| 用途 | 标准任务条，支持拖拽交互 | 区间展示，通常用于标记时间段 |
| 模板 | `#bar`                   | `#range`                     |
| 拖拽 | 支持整体拖拽和缩放       | 不支持拖拽                   |

## 使用场景

Range 类型适用于以下场景：

1. **版本发布区间**：标记版本发布的时间段
2. **里程碑区间**：展示重要的时间节点范围
3. **计划区间**：显示计划的时间范围

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-range',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ng-template #range let-item="item" let-refs="refs">
        <div class="range-item" [style.left.px]="refs.x" [style.width.px]="refs.width">
          {{ item.title }}
        </div>
      </ng-template>
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
export class GanttRangeComponent {
  viewType = GanttViewType.month;

  items: GanttItem[] = [
    {
      id: '1',
      title: '版本 V1.0',
      start: 1627729997,
      type: 'range'
    },
    {
      id: '2',
      title: '版本 V2.0',
      start: 1630421197,
      type: 'range'
    }
  ];
}
```

## 相关链接

- [Bar 显示与交互](guides/features/bar-interaction) - 了解 Bar 类型的任务条交互
- [数据模型](guides/core-concepts/data-model) - 了解 GanttItem 的结构和 type 字段
- [时间与时区](guides/core-concepts/date-timezone) - 理解时间字段的处理
