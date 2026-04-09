---
title: 性能与加载状态
path: 'performance'
order: 380
---

在处理大规模任务数据时，`ngx-gantt` 通过 **列表虚拟滚动** 和 **视图滚动加载** 来保证流畅的交互体验。

## 核心机制

- **列表虚拟滚动**：仅渲染当前视口内可见的任务行，即使有数千条数据，实际渲染的 DOM 节点也保持在极小数量级。
- **视图滚动加载**：通过配置时间轴边界和步长，实现在时间轴滚动到边缘时自动按需加载时间区间。

## 列表虚拟滚动

甘特图通过虚拟滚动支持大数据量列表，组件默认开启了虚拟滚动。

```html
<ngx-gantt [virtualScrollEnabled]="true"></ngx-gantt>
```

### 示例：滚动到底部加载下一页数据

当服务端没有通过一次将数据全量返回时，也可以通过监听 `(virtualScrolledIndexChange)` 事件，在滚动接近底部时实现无限加载（Infinite Scroll）。

```html
<ngx-gantt [items]="items" [loading]="loading" [loadingDelay]="200" (virtualScrolledIndexChange)="onVirtualScroll($event)">
  <ngx-gantt-table>
    <ngx-gantt-column name="任务标题" width="200px">
      <ng-template #cell let-item="item">{{ item.title }}</ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

```ts
import { Component } from '@angular/core';
import { GanttItem, GanttVirtualScrolledIndexChangeEvent } from '@worktile/gantt';

@Component({ ... })
export class GanttPerformanceExampleComponent {
  items: GanttItem[] = [];
  loading = false;

  onVirtualScroll(event: GanttVirtualScrolledIndexChangeEvent) {
    // 当滚动到距离底部还剩 10 条数据时，加载下一页
    if (event.renderedRange.end + 10 >= event.count && !this.loading) {
      this.loadNextPage();
    }
  }

  loadNextPage() {
    this.loading = true;
    this.taskService.getTasks().subscribe(res => {
      this.items = [...this.items, ...res.data];
      this.loading = false;
    });
  }
}
```

## 视图滚动加载

组件默认情况下滚动加载是禁用的，当甘特图的时间跨度非常大时，一次性加载所有时间轴数据会影响性能，可通过参数 `disabledLoadOnScroll` 设置 `false` 来启用，启用后当滚动到视图边界时，会触发视图滚动加载。

```html
<ngx-gantt [disabledLoadOnScroll]="false"></ngx-gantt>
```

### 滚动加载机制

根据不同的视图类型，滚动加载的时间跨度（步长）会自动调整，例如：

- 日视图 (Day)：默认单次扩展 1 个月。
- 月视图 (Month)：默认单次扩展 1 个季度。

你可以通过 `viewOptions` 中的 `loadDuration` 自定义这个步长，并通过 `minBoundary` 和 `maxBoundary` 限制时间轴的最大范围（默认限制在当前年份的前后一年）。

### 示例：视图滚动加载数据

开启滚动加载后，当用户将时间轴拖动到边缘时，会触发 `(loadOnScroll)` 事件，此时可以根据返回的新区间请求数据。

```html
<ngx-gantt
  [items]="items"
  [loading]="loading"
  [loadingDelay]="200"
  [disabledLoadOnScroll]="false"
  [viewOptions]="{
    loadDuration: { amount: 1, unit: 'month' },
    minBoundary: minDate,
    maxBoundary: maxDate
  }"
  (loadOnScroll)="onLoadOnScroll($event)"
>
</ngx-gantt>
```

```ts
import { GanttLoadOnScrollEvent } from '@worktile/gantt';

onLoadOnScroll(event: GanttLoadOnScrollEvent) {
  this.loading = true;
  // event.start 和 event.end 是新增的时间范围（Unix 时间戳）
  this.taskService.getTasksByRange(event.start, event.end).subscribe(newItems => {
    this.items = [...this.items, ...newItems];
    this.loading = false;
  });
}
```

## 加载状态处理

在异步加载数据时，良好的加载反馈能提升用户体验。`ngx-gantt` 提供了内置的加载器（Loader）：

- **`loading`**: 设置为 `true` 时展示加载状态。
- **`loadingDelay`**: 设置加载状态显示的延迟时间（单位：`ms`）。当数据请求在极短时间内（小于延迟时间）返回时，加载器将不会显示，从而有效避免因网络较快导致的加载动画瞬间闪烁。

## 相关链接

- [视图](guides/core-concepts/views) - 了解视图类型及其配置选项
