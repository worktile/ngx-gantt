---
title: 性能与加载
path: 'performance-loading'
order: 360
---

# 性能与加载

ngx-gantt 针对大数据量场景进行了性能优化，支持虚拟滚动、横向滚动加载等功能。

## 前置阅读

在深入学习性能优化之前，建议先了解：

- [数据模型](../core/data-model.md) - 理解数据结构
- [视图体系](../core/views.md) - 理解视图渲染

## 虚拟滚动

虚拟滚动是 ngx-gantt 的核心性能优化特性，默认启用。

### 工作原理

虚拟滚动只渲染可见区域的任务项，而不是渲染所有任务，从而大幅提升性能。

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [virtualScrollEnabled]="true">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  // 即使有数千条任务，也能流畅渲染
  items: GanttItem[] = generateLargeDataset(10000);
}
```

### 启用/禁用虚拟滚动

```typescript
// 启用虚拟滚动（默认）
<ngx-gantt [virtualScrollEnabled]="true">

// 禁用虚拟滚动（适用于少量数据）
<ngx-gantt [virtualScrollEnabled]="false">
```

### 虚拟滚动事件

监听虚拟滚动索引变化，可用于实现分页加载：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" (virtualScrolledIndexChange)="onVirtualScrollChange($event)">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  onVirtualScrollChange(event: GanttVirtualScrolledIndexChangeEvent) {
    const { index, renderedRange, count } = event;

    // 如果接近底部，加载更多数据
    if (renderedRange.end >= count - 10) {
      this.loadMoreItems();
    }
  }
}
```

## 横向滚动加载

当用户横向滚动到时间轴边界时，可以自动加载更多时间范围的数据。

### 启用滚动加载

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [viewOptions]="viewOptions" (loadOnScroll)="onLoadOnScroll($event)">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  viewOptions: GanttViewOptions = {
    loadDuration: {
      amount: 1,
      unit: 'month' // 每次加载 1 个月
    }
  };

  onLoadOnScroll(event: GanttLoadOnScrollEvent) {
    const { start, end } = event;

    // 加载该时间范围的数据
    this.loadItemsByDateRange(start, end);
  }
}
```

### 配置加载时间跨度

```typescript
viewOptions: GanttViewOptions = {
  loadDuration: {
    amount: 3, // 数量
    unit: 'month' // 单位：'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
  }
};
```

### 禁用滚动加载

```typescript
<ngx-gantt
  [items]="items"
  [disabledLoadOnScroll]="true">
```

## 大数据量配置建议

### 1. 启用虚拟滚动

```typescript
<ngx-gantt
  [items]="items"
  [virtualScrollEnabled]="true">  <!-- 默认已启用 -->
```

### 2. 优化视图配置

```typescript
viewOptions: GanttViewOptions = {
  unitWidth: 30, // 较小的单位宽度，减少渲染量
  loadDuration: {
    amount: 1,
    unit: 'month' // 合理的加载跨度
  }
};
```

### 3. 使用异步加载

对于树形结构，使用异步加载子节点：

```typescript
<ngx-gantt
  [items]="items"
  [async]="true"
  [childrenResolve]="childrenResolve">
```

### 4. 优化数据结构

```typescript
// ✅ 推荐：只加载必要的数据
const items: GanttItem[] = items.map((item) => ({
  id: item.id,
  title: item.title,
  start: item.start,
  end: item.end
  // 不加载不需要的字段
}));

// ❌ 不推荐：加载所有字段
const items: GanttItem[] = fullItems; // 包含大量不必要的数据
```

## 不可变数据更新

ngx-gantt 使用 OnPush 变更检测策略，要求使用不可变数据更新。

### ✅ 正确：不可变更新

```typescript
// 添加任务
addTask(newTask: GanttItem) {
  this.items = [...this.items, newTask];
}

// 更新任务
updateTask(updatedTask: GanttItem) {
  this.items = this.items.map(item =>
    item.id === updatedTask.id ? updatedTask : item
  );
}

// 删除任务
removeTask(taskId: string) {
  this.items = this.items.filter(item => item.id !== taskId);
}
```

### ❌ 错误：可变更新

```typescript
// 错误：直接修改原数组
addTask(newTask: GanttItem) {
  this.items.push(newTask);  // 不会触发视图更新
}

// 错误：直接修改对象
updateTask(taskId: string, newData: Partial<GanttItem>) {
  const item = this.items.find(i => i.id === taskId);
  Object.assign(item, newData);  // 不会触发视图更新
}
```

## 性能监控

### 监听虚拟滚动事件

```typescript
onVirtualScrollChange(event: GanttVirtualScrolledIndexChangeEvent) {
  const { index, renderedRange, count } = event;

  console.log('当前索引:', index);
  console.log('可见范围:', renderedRange);
  console.log('总数量:', count);

  // 可以用于性能分析
  this.performanceMonitor.record({
    visibleItems: renderedRange.end - renderedRange.start,
    totalItems: count
  });
}
```

## 最小示例

### 大数据量示例

```typescript
import { Component, OnInit } from '@angular/core';
import { GanttItem, GanttViewType, GanttViewOptions, GanttLoadOnScrollEvent, GanttVirtualScrolledIndexChangeEvent } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-performance',
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [viewOptions]="viewOptions"
      [virtualScrollEnabled]="true"
      (loadOnScroll)="onLoadOnScroll($event)"
      (virtualScrolledIndexChange)="onVirtualScrollChange($event)"
    >
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
export class GanttPerformanceComponent implements OnInit {
  viewType = GanttViewType.month;

  viewOptions: GanttViewOptions = {
    unitWidth: 30,
    loadDuration: {
      amount: 1,
      unit: 'month'
    }
  };

  items: GanttItem[] = [];

  ngOnInit() {
    // 初始加载
    this.loadInitialData();
  }

  loadInitialData() {
    // 只加载当前可见范围的数据
    this.items = this.generateItems(100);
  }

  onLoadOnScroll(event: GanttLoadOnScrollEvent) {
    // 横向滚动加载
    const { start, end } = event;
    const newItems = this.loadItemsByDateRange(start, end);
    this.items = [...this.items, ...newItems];
  }

  onVirtualScrollChange(event: GanttVirtualScrolledIndexChangeEvent) {
    // 纵向滚动，可以加载更多任务
    if (event.renderedRange.end >= this.items.length - 10) {
      this.loadMoreItems();
    }
  }

  private loadMoreItems() {
    const moreItems = this.generateItems(50);
    this.items = [...this.items, ...moreItems];
  }

  private generateItems(count: number): GanttItem[] {
    // 生成测试数据
    return Array.from({ length: count }, (_, i) => ({
      id: `task-${i}`,
      title: `任务 ${i}`,
      start: 1627729997 + i * 86400,
      end: 1627729997 + (i + 7) * 86400
    }));
  }

  private loadItemsByDateRange(start: number, end: number): GanttItem[] {
    // 根据时间范围加载数据
    return [];
  }
}
```

## 性能优化建议

### 1. 数据量控制

- **少量数据（< 100）**：可以禁用虚拟滚动
- **中等数据（100-1000）**：启用虚拟滚动
- **大量数据（> 1000）**：启用虚拟滚动 + 分页加载

### 2. 视图配置优化

```typescript
// 对于大数据量，使用较小的 unitWidth
viewOptions: GanttViewOptions = {
  unitWidth: 25, // 而不是 35 或更大
  loadDuration: {
    amount: 1,
    unit: 'month'
  }
};
```

### 3. 避免频繁更新

```typescript
// ✅ 推荐：批量更新
updateMultipleTasks(updates: Array<{id: string, data: Partial<GanttItem>}>) {
  this.items = this.items.map(item => {
    const update = updates.find(u => u.id === item.id);
    return update ? { ...item, ...update.data } : item;
  });
}

// ❌ 不推荐：逐个更新
updateTask1() { this.items = [...]; }
updateTask2() { this.items = [...]; }
updateTask3() { this.items = [...]; }
```

### 4. 使用异步加载

对于树形结构，使用异步加载减少初始数据量：

```typescript
items: GanttItem[] = [
  { id: '1', title: '父任务', children: [] }  // 初始为空
];

childrenResolve = (item: GanttItem) => {
  return this.loadChildren(item.id);
};
```

## 常见问题

### Q: 虚拟滚动不工作？

**A:** 检查：

1. `virtualScrollEnabled` 是否为 `true`（默认值）
2. 数据是否正确传入
3. 浏览器控制台是否有错误

### Q: 滚动加载不触发？

**A:** 检查：

1. `viewOptions.loadDuration` 是否正确配置
2. `loadOnScroll` 事件是否绑定
3. 是否设置了 `disabledLoadOnScroll="true"`

### Q: 大数据量下性能差？

**A:** 优化建议：

1. 确保启用虚拟滚动
2. 减小 `unitWidth` 值
3. 使用异步加载
4. 优化数据结构，只加载必要字段

### Q: 如何实现分页加载？

**A:** 监听 `virtualScrolledIndexChange` 事件：

```typescript
onVirtualScrollChange(event: GanttVirtualScrolledIndexChangeEvent) {
  if (event.renderedRange.end >= this.items.length - 10) {
    this.loadNextPage();
  }
}
```

## 相关链接

- [数据模型](../core/data-model.md) - 了解数据结构
- [视图体系](../core/views.md) - 了解视图配置
- [树形与异步](./tree.md) - 了解异步加载
