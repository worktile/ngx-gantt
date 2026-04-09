---
title: 基线
path: 'baseline'
order: 370
---

基准线（Baseline）用于展示项目计划中的原始时间安排，与实际执行时间进行对比，帮助跟踪项目进度偏差。基准线以灰色条的形式显示在任务条下方。

## 基础使用

基准线数据通过 `baselineItems` 属性传入，每个基准线项的 `id` 必须与对应任务的 `id` 一致：

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttBaselineItem } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="baselineItems">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
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

### 数据结构

```typescript
interface GanttBaselineItem {
  id: string; // 必须与任务项的 id 对应
  start?: number; // 基准线开始时间（Unix 时间戳，秒）
  end?: number; // 基准线结束时间（Unix 时间戳，秒）
}
```

**注意：** `start` 和 `end` 都是可选的，但至少需要提供其中一个。时间格式必须使用 Unix 时间戳（秒），与任务项的时间格式保持一致。

### 动态显示/隐藏

可以通过控制 `baselineItems` 数组来实现动态显示或隐藏基准线：

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
  baselineItems: GanttBaselineItem[] = [...];

  toggleBaseline() {
    this.showBaseline = !this.showBaseline;
  }
}
```

## 自定义基准线模板

默认情况下，基准线显示为灰色条（高度 8px，颜色 `#cacaca`）。如果需要自定义样式，可以使用 `#baseline` 模板。

### 模板上下文

`#baseline` 模板提供以下上下文：

- `item`：基准线项数据（`GanttBaselineItem`）
- `refs`：基准线的位置和尺寸信息
  - `refs.x`：X 坐标
  - `refs.y`：Y 坐标
  - `refs.width`：宽度

### 自定义示例

```html
<ngx-gantt [items]="items" [baselineItems]="baselineItems">
  <ng-template #baseline let-item="item" let-refs="refs">
    <div class="custom-baseline" [style.width.px]="refs.width" [style.left.px]="refs.x"></div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

```scss
.custom-baseline {
  position: absolute;
  bottom: 2px;
  height: 4px;
  background: #ff6b6b;
  opacity: 0.6;
  border-radius: 2px;
  z-index: 2;
}
```
