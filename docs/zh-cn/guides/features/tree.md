---
title: 树形与异步
path: 'groups-tree-async'
order: 340
---

# 树形与异步

ngx-gantt 支持树形结构（通过 `children` 属性）和异步加载子节点，适用于大型项目管理和 WBS（工作分解结构）场景。

## 前置阅读

在深入学习树形与异步之前，建议先了解：

- [数据模型](../core/data-model.md) - 理解树形模式的数据结构
- [表格交互](./table.md) - 了解表格行拖拽

## 树形结构

### 基础树形结构

使用 `children` 属性构建层级结构：

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '项目阶段',
    start: 1627729997,
    end: 1633345997,
    children: [
      {
        id: '1-1',
        title: '需求分析',
        start: 1627729997,
        end: 1627902797,
        children: [{ id: '1-1-1', title: '需求调研', start: 1627729997, end: 1627751597 }]
      },
      {
        id: '1-2',
        title: '技术选型',
        start: 1628507597,
        end: 1630667597
      }
    ]
  }
];
```

### 展开/折叠控制

```typescript
// 初始展开状态
const items: GanttItem[] = [
  {
    id: '1',
    title: '父任务',
    expanded: true, // 默认展开
    children: [
      { id: '1-1', title: '子任务 1', expanded: false } // 默认折叠
    ]
  }
];
```

### 展开/折叠 API

```typescript
@Component({
  template: `
    <ngx-gantt #gantt [items]="items">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="expandAll()">展开全部</button>
    <button (click)="collapseAll()">折叠全部</button>
  `
})
export class MyComponent {
  @ViewChild('gantt') gantt: NgxGanttComponent;

  expandAll() {
    this.gantt.expandAll();
  }

  collapseAll() {
    this.gantt.collapseAll();
  }
}
```

## 异步加载

当数据量大或需要按需加载时，可以使用异步加载子节点。

### 启用异步模式

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [async]="true" [childrenResolve]="childrenResolve" [loading]="loading">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  loading = false;

  items: GanttItem[] = [
    {
      id: '1',
      title: '父任务',
      start: 1627729997,
      end: 1633345997,
      children: [] // 初始为空，通过 childrenResolve 加载
    }
  ];

  // 定义子节点加载函数
  childrenResolve = (item: GanttItem) => {
    this.loading = true;
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      finalize(() => {
        this.loading = false;
      })
    );
  };
}
```

### childrenResolve 函数

`childrenResolve` 函数接收父任务项，返回 `Observable<GanttItem[]>`：

```typescript
childrenResolve = (item: GanttItem) => {
  // 可以根据 item 的属性决定加载逻辑
  if (item.type === 'project') {
    return this.projectService.getChildren(item.id);
  } else {
    return this.taskService.getChildren(item.id);
  }
};
```

### Loading 状态

组件会自动处理 loading 状态：

1. 首次展开时，如果 `children.length === 0`，触发 `childrenResolve`
2. 显示 loading 指示器
3. 加载完成后，更新子节点并隐藏 loading

也可以手动控制 loading：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [async]="true" [childrenResolve]="childrenResolve" [loading]="globalLoading" [loadingDelay]="500">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  globalLoading = false;

  childrenResolve = (item: GanttItem) => {
    this.globalLoading = true;
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      finalize(() => {
        this.globalLoading = false;
      })
    );
  };
}
```

### loadingDelay

`loadingDelay` 可以延迟显示 loading，避免快速操作时的闪烁：

```typescript
<ngx-gantt
  [loadingDelay]="500"  // 500ms 后才显示 loading
  [loading]="loading">
```

## 最大层级限制

通过 `maxLevel` 限制最大层级深度：

```typescript
<ngx-gantt
  [items]="items"
  [maxLevel]="3">  <!-- 最多 3 层 -->
```

默认值为 `2`（即最多 2 层）。

## 最小示例

### 基础树形结构

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-tree',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px" [showExpandIcon]="true">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttTreeComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    {
      id: '1',
      title: '项目',
      start: 1627729997,
      end: 1633345997,
      children: [
        { id: '1-1', title: '阶段 1', start: 1627729997, end: 1627902797 },
        { id: '1-2', title: '阶段 2', start: 1628507597, end: 1630667597 }
      ]
    }
  ];
}
```

### 异步加载示例

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GanttItem, GanttViewType } from '@worktile/gantt';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-gantt-async',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [async]="true" [childrenResolve]="childrenResolve" [loading]="loading">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px" [showExpandIcon]="true">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttAsyncComponent {
  viewType = GanttViewType.day;
  loading = false;

  items: GanttItem[] = [
    {
      id: '1',
      title: '父任务',
      start: 1627729997,
      end: 1633345997,
      children: []
    }
  ];

  constructor(private http: HttpClient) {}

  childrenResolve = (item: GanttItem) => {
    this.loading = true;
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      finalize(() => {
        this.loading = false;
      })
    );
  };
}
```

## 最佳实践

### 1. 初始数据加载

```typescript
// ✅ 推荐：只加载第一层数据
items: GanttItem[] = [
  { id: '1', title: '项目', children: [] }  // children 为空
];

// ❌ 不推荐：一次性加载所有数据
items: GanttItem[] = [
  {
    id: '1',
    title: '项目',
    children: [/* 大量子节点 */]  // 影响性能
  }
];
```

### 2. 错误处理

```typescript
childrenResolve = (item: GanttItem) => {
  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
    catchError((error) => {
      console.error('加载子节点失败', error);
      // 显示错误提示
      this.notify.error('加载失败');
      return of([]); // 返回空数组
    })
  );
};
```

### 3. 缓存策略

```typescript
private childrenCache = new Map<string, GanttItem[]>();

childrenResolve = (item: GanttItem) => {
  // 检查缓存
  if (this.childrenCache.has(item.id)) {
    return of(this.childrenCache.get(item.id));
  }

  // 加载并缓存
  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
    tap(children => {
      this.childrenCache.set(item.id, children);
    })
  );
};
```

## 常见问题

### Q: 异步加载不触发？

**A:** 检查：

1. `async` 是否为 `true`
2. `childrenResolve` 是否正确设置
3. 任务的 `children` 是否为空数组（如果已有数据，不会触发加载）

### Q: 如何刷新子节点？

**A:** 清空 `children` 并重新展开：

```typescript
refreshChildren(itemId: string) {
  this.items = this.items.map(item => {
    if (item.id === itemId) {
      return { ...item, children: [], expanded: false };
    }
    return item;
  });
  // 重新展开会触发加载
  setTimeout(() => {
    this.gantt.expandChildren(this.gantt.getGanttItem(itemId));
  });
}
```

### Q: 如何限制层级深度？

**A:** 使用 `maxLevel` 属性：

```typescript
<ngx-gantt [maxLevel]="3">
```

### Q: 展开/折叠事件？

**A:** 监听 `expandChange` 事件：

```typescript
<ngx-gantt
  [items]="items"
  (expandChange)="onExpandChange($event)">
```

## 相关链接

- [数据模型](../core/data-model.md) - 了解树形模式的数据结构
- [表格交互](./table.md) - 了解表格行拖拽调整层级
- [性能优化](./performance.md) - 了解虚拟滚动和性能优化
