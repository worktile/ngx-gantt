---
title: 基线
path: 'baseline'
order: 350
---

# 基准线

基准线（Baseline）用于对比计划时间和实际时间，帮助项目管理者跟踪项目进度偏差。

## 前置阅读

在深入学习基准线之前，建议先了解：

- [数据模型](../core/data-model.md) - 理解 GanttItem 的结构
- [Bar 交互](./bar.md) - 了解任务条的显示

## 什么是基准线

基准线是项目计划中的原始时间安排，用于与实际执行时间进行对比。在甘特图中，基准线显示在任务条下方，通常以不同的颜色或样式区分。

**适用场景：**

- 项目进度跟踪
- 计划与实际对比
- 进度偏差分析
- 项目报告生成

## 数据结构

基准线数据通过 `baselineItems` 属性传入，每个基准线项对应一个任务：

```typescript
interface GanttBaselineItem {
  id: string; // 必须与任务项的 id 对应
  start?: number; // 基准线开始时间（Unix 时间戳）
  end?: number; // 基准线结束时间（Unix 时间戳）
}
```

### 数据组织

基准线项的 `id` 必须与对应任务的 `id` 一致：

```typescript
const items: GanttItem[] = [
  { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
  { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
];

const baselineItems: GanttBaselineItem[] = [
  { id: '1', start: 1627728888, end: 1628421197 }, // 对应任务 1
  { id: '2', start: 1617361997, end: 1625483597 } // 对应任务 2
];
```

## 基础使用

### 启用基准线

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="baselineItems">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];

  baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627728888, end: 1628421197 }];
}
```

### 动态显示/隐藏

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="showBaseline ? baselineItems : []">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="toggleBaseline()">{{ showBaseline ? '隐藏' : '显示' }}基准线</button>
  `
})
export class MyComponent {
  showBaseline = false;

  baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627728888, end: 1628421197 }];

  toggleBaseline() {
    this.showBaseline = !this.showBaseline;
  }
}
```

## 自定义基准线模板

使用 `#baseline` 模板可以自定义基准线的显示样式：

```html
<ngx-gantt [items]="items" [baselineItems]="baselineItems">
  <ng-template #baseline let-item="item" let-refs="refs">
    <div class="custom-baseline" [style.width.px]="refs.width">
      <span class="baseline-label">计划</span>
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt>
```

### 模板上下文

`#baseline` 模板提供以下上下文：

- `item`：基准线项数据（`GanttBaselineItem`）
- `refs`：基准线的位置和尺寸信息
  - `refs.x`：X 坐标
  - `refs.y`：Y 坐标
  - `refs.width`：宽度

### 自定义样式示例

```html
<ng-template #baseline let-item="item" let-refs="refs">
  <div
    class="custom-baseline"
    [style.left.px]="refs.x"
    [style.width.px]="refs.width"
    [style.height.px]="4"
    style="background: #ff6b6b; border-radius: 2px;"
  ></div>
</ng-template>
```

```scss
.custom-baseline {
  position: absolute;
  bottom: 2px;
  background: #ff6b6b;
  opacity: 0.6;
  border-radius: 2px;
}
```

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttBaselineItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-baseline',
  template: `
    <ngx-gantt [items]="items" [baselineItems]="baselineItems" [viewType]="viewType">
      <ng-template #baseline let-item="item" let-refs="refs">
        <div class="baseline-bar" [style.width.px]="refs.width" [style.left.px]="refs.x"></div>
      </ng-template>

      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `,
  styles: [
    `
      .baseline-bar {
        position: absolute;
        bottom: 2px;
        height: 4px;
        background: #ff6b6b;
        opacity: 0.6;
        border-radius: 2px;
      }
    `
  ]
})
export class GanttBaselineComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];

  baselineItems: GanttBaselineItem[] = [
    { id: '1', start: 1627728888, end: 1628421197 },
    { id: '2', start: 1617361997, end: 1625483597 }
  ];
}
```

## 实际应用场景

### 进度对比

```typescript
// 计划时间（基准线）
const baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627729997, end: 1628421197 }];

// 实际时间（任务条）
const items: GanttItem[] = [
  { id: '1', title: '任务 1', start: 1628507597, end: 1630667597 } // 实际开始时间延后
];
```

通过对比基准线和任务条的位置，可以直观看出：

- 任务是否延期（任务条在基准线右侧）
- 任务是否提前（任务条在基准线左侧）
- 任务时长变化（任务条宽度与基准线宽度对比）

### 多版本对比

```typescript
// 第一版计划
const baselineV1: GanttBaselineItem[] = [{ id: '1', start: 1627729997, end: 1628421197 }];

// 第二版计划
const baselineV2: GanttBaselineItem[] = [{ id: '1', start: 1628507597, end: 1630667597 }];

// 可以切换显示不同版本的基准线
currentBaseline = this.showV1 ? baselineV1 : baselineV2;
```

## 常见问题

### Q: 基准线不显示？

**A:** 检查：

1. `baselineItems` 数组不为空
2. 基准线项的 `id` 与任务项的 `id` 一致
3. 基准线项有 `start` 或 `end` 时间

### Q: 如何只显示部分任务的基准线？

**A:** 只传入需要显示基准线的任务 ID：

```typescript
baselineItems: GanttBaselineItem[] = [
  { id: '1', start: 1627728888, end: 1628421197 }  // 只显示任务 1 的基准线
];
```

### Q: 基准线位置不正确？

**A:** 确保基准线的时间格式正确（Unix 时间戳，秒），与任务时间使用相同的格式。

### Q: 如何自定义基准线颜色？

**A:** 使用 `#baseline` 模板自定义样式：

```html
<ng-template #baseline let-item="item" let-refs="refs">
  <div class="custom-baseline" [style.background]="getBaselineColor(item)" [style.width.px]="refs.width"></div>
</ng-template>
```

## 相关链接

- [数据模型](../core/data-model.md) - 了解数据结构
- [Bar 交互](./bar.md) - 了解任务条显示
- [时间与时区](../core/date-timezone.md) - 理解时间字段处理
