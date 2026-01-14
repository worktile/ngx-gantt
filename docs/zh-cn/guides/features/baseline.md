---
title: 基线
path: 'baseline'
order: 350
---

# 基准线

基准线（Baseline）是项目计划中的原始时间安排，用于与实际执行时间进行对比，帮助项目管理者跟踪项目进度偏差。在甘特图中，基准线以灰色条的形式显示在任务条下方，直观地展示计划与实际的差异。

### 适用场景

- **项目进度跟踪** - 实时监控项目是否按计划执行
- **计划与实际对比** - 直观展示计划时间与实际时间的差异
- **进度偏差分析** - 识别延期或提前完成的任务
- **项目报告生成** - 为项目报告提供可视化数据支持

## 数据结构

基准线数据通过 `baselineItems` 属性传入，每个基准线项对应一个任务。

### 接口定义

```typescript
interface GanttBaselineItem {
  id: string; // 必须与任务项的 id 对应
  start?: number; // 基准线开始时间（Unix 时间戳，秒）
  end?: number; // 基准线结束时间（Unix 时间戳，秒）
}
```

### 数据组织

基准线项的 `id` 必须与对应任务的 `id` 一致，系统会根据 `id` 匹配基准线与任务：

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

> **注意：**
>
> - `start` 和 `end` 都是可选的，但至少需要提供其中一个
> - 时间格式必须使用 Unix 时间戳（秒），与任务项的时间格式保持一致
> - 如果某个任务没有对应的基准线项，则不会显示基准线

## 基础使用

### 启用基准线

最简单的使用方式是将 `baselineItems` 绑定到甘特图组件：

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttBaselineItem } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-baseline',
  template: `
    <ngx-gantt [items]="items" [baselineItems]="baselineItems">
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

  baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627728888, end: 1628421197 }];
}
```

### 动态显示/隐藏

可以通过控制 `baselineItems` 数组来实现动态显示或隐藏基准线：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="showBaseline ? baselineItems : []">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
    <button (click)="toggleBaseline()">{{ showBaseline ? '隐藏' : '显示' }}基准线</button>
  `
})
export class MyComponent {
  showBaseline = false;

  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];

  baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627728888, end: 1628421197 }];

  toggleBaseline() {
    this.showBaseline = !this.showBaseline;
  }
}
```

## 自定义基准线模板

默认情况下，基准线显示为灰色条（高度 8px，颜色 `#cacaca`）。如果需要自定义样式，可以使用 `#baseline` 模板。

### 模板上下文

`#baseline` 模板提供以下上下文变量：

- `item` ：基准线项数据（`GanttBaselineItem`），包含 `id`、`start`、`end` 等属性
- `refs`：基准线的位置和尺寸信息
  - `refs.x`：X 坐标（相对于甘特图容器的左侧偏移）
  - `refs.y`：Y 坐标（相对于甘特图容器的顶部偏移）
  - `refs.width`：基准线的宽度（像素）

### 基础自定义示例

```html
<ngx-gantt [items]="items" [baselineItems]="baselineItems">
  <ng-template #baseline let-item="item" let-refs="refs">
    <div class="custom-baseline" [style.width.px]="refs.width">
      <span class="baseline-label">计划</span>
    </div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

### 完整自定义样式示例

如果需要完全控制基准线的样式，可以同时设置位置和尺寸：

```html
<ng-template #baseline let-item="item" let-refs="refs">
  <div class="custom-baseline" [style.left.px]="refs.x" [style.width.px]="refs.width" [style.height.px]="4"></div>
</ng-template>
```

```scss
.custom-baseline {
  position: absolute;
  bottom: 2px;
  background: #ff6b6b;
  opacity: 0.6;
  border-radius: 2px;
  z-index: 2;
}
```

> **提示：**
>
> - 基准线组件已经设置了 `position: absolute`，所以自定义模板中的元素也会自动绝对定位
> - 默认基准线位于任务条下方 2px 处，可以通过 CSS 的 `bottom` 属性调整
> - 建议设置合适的 `z-index` 确保基准线显示在正确的层级

## 完整示例

以下是一个完整的基准线使用示例，包含自定义样式：

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

### 进度对比分析

基准线最常见的用途是进行计划与实际进度的对比分析：

```typescript
// 计划时间（基准线）
const baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627729997, end: 1628421197 }];

// 实际时间（任务条）
const items: GanttItem[] = [
  {
    id: '1',
    title: '任务 1',
    start: 1628507597, // 实际开始时间延后
    end: 1630667597 // 实际结束时间也延后
  }
];
```

通过对比基准线和任务条的位置，可以直观看出：

- **任务延期**：任务条在基准线右侧，说明实际开始时间晚于计划
- **任务提前**：任务条在基准线左侧，说明实际开始时间早于计划
- **时长变化**：通过对比任务条宽度与基准线宽度，可以看出任务实际耗时与计划时长的差异

### 多版本计划对比

在项目执行过程中，计划可能会多次调整。可以使用基准线来对比不同版本的计划：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="currentBaseline">
      <!-- ... -->
    </ngx-gantt>
    <div>
      <button (click)="switchBaseline('v1')">显示第一版计划</button>
      <button (click)="switchBaseline('v2')">显示第二版计划</button>
    </div>
  `
})
export class MyComponent {
  // 第一版计划
  baselineV1: GanttBaselineItem[] = [{ id: '1', start: 1627729997, end: 1628421197 }];

  // 第二版计划（调整后）
  baselineV2: GanttBaselineItem[] = [{ id: '1', start: 1628507597, end: 1630667597 }];

  currentBaseline = this.baselineV1;

  switchBaseline(version: 'v1' | 'v2') {
    this.currentBaseline = version === 'v1' ? this.baselineV1 : this.baselineV2;
  }
}
```

### 条件显示基准线

可以根据任务状态或其他条件来决定是否显示基准线：

```typescript
getBaselineItems(): GanttBaselineItem[] {
  // 只为已完成或进行中的任务显示基准线
  return this.items
    .filter(item => item.progress > 0)
    .map(item => this.baselineItems.find(b => b.id === item.id))
    .filter(Boolean);
}
```

## 常见问题

### Q: 基准线不显示？

**A:** 请按以下步骤排查：

1. **检查数据绑定**：确保 `baselineItems` 数组不为空且已正确绑定
2. **检查 ID 匹配**：基准线项的 `id` 必须与任务项的 `id` 完全一致（区分大小写）
3. **检查时间数据**：基准线项至少需要提供 `start` 或 `end` 其中一个时间
4. **检查时间范围**：确保基准线的时间在甘特图的可见时间范围内

```typescript
// 错误示例：ID 不匹配
items: GanttItem[] = [{ id: 'task-1', ... }];
baselineItems: GanttBaselineItem[] = [{ id: '1', ... }]; // ❌ ID 不匹配

// 正确示例：ID 完全一致
items: GanttItem[] = [{ id: 'task-1', ... }];
baselineItems: GanttBaselineItem[] = [{ id: 'task-1', ... }]; // ✅ ID 匹配
```

### Q: 如何只显示部分任务的基准线？

**A:** 只传入需要显示基准线的任务对应的基准线项：

```typescript
// 假设有 3 个任务，但只想显示任务 1 和任务 3 的基准线
baselineItems: GanttBaselineItem[] = [
  { id: '1', start: 1627728888, end: 1628421197 },  // 任务 1 的基准线
  { id: '3', start: 1628507597, end: 1633345997 }  // 任务 3 的基准线
  // 任务 2 没有基准线项，所以不会显示
];
```

### Q: 基准线位置不正确？

**A:** 可能的原因和解决方法：

1. **时间格式不一致**：确保基准线的时间格式与任务时间格式一致（都是 Unix 时间戳，秒）
2. **时区问题**：如果任务时间和基准线时间使用了不同的时区，会导致位置偏移
3. **时间单位错误**：确认使用的是秒级时间戳，而不是毫秒级

```typescript
// 错误：混用毫秒和秒
items: GanttItem[] = [{ id: '1', start: 1627729997000 }]; // 毫秒
baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627729997 }]; // 秒 ❌

// 正确：统一使用秒
items: GanttItem[] = [{ id: '1', start: 1627729997 }]; // 秒
baselineItems: GanttBaselineItem[] = [{ id: '1', start: 1627728888 }]; // 秒 ✅
```

### Q: 如何自定义基准线颜色和样式？

**A:** 使用 `#baseline` 模板可以完全自定义基准线的样式：

```html
<ng-template #baseline let-item="item" let-refs="refs">
  <div class="custom-baseline" [style.background]="getBaselineColor(item)" [style.width.px]="refs.width" [style.left.px]="refs.x"></div>
</ng-template>
```

```typescript
// 根据任务状态返回不同颜色
getBaselineColor(item: GanttBaselineItem): string {
  const task = this.items.find(t => t.id === item.id);
  if (task?.progress === 1) return '#52c41a'; // 已完成：绿色
  if (task?.progress > 0) return '#1890ff';  // 进行中：蓝色
  return '#ff6b6b'; // 未开始：红色
}
```

### Q: 基准线显示在任务条上方？

**A:** 基准线默认显示在任务条下方 2px 处。如果需要调整位置，可以在自定义模板中使用 CSS：

```scss
.custom-baseline {
  bottom: 2px; // 调整这个值来改变垂直位置
  // 或者使用 top 属性
  // top: 20px;
}
```

## 默认样式

如果不使用自定义模板，基准线会使用以下默认样式：

- **高度**：8px
- **颜色**：`#cacaca`（灰色）
- **位置**：任务条下方 2px
- **圆角**：2px
- **层级**：z-index: 2

可以通过 CSS 变量或全局配置来自定义默认样式。
