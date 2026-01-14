---
title: 树形与异步
path: 'groups-tree-async'
order: 340
---

ngx-gantt 支持树形结构（通过 `children` 属性）和异步加载子节点，适用于大型项目管理和 WBS（工作分解结构）场景。

## 树形

### 基础结构

使用 `children` 属性构建层级结构，支持无限层级嵌套：

```typescript
import { GanttItem } from '@worktile/gantt';

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
        children: [
          {
            id: '1-1-1',
            title: '需求调研',
            start: 1627729997,
            end: 1627751597
          }
        ]
      },
      {
        id: '1-2',
        title: '技术选型',
        start: 1628507597,
        end: 1630667597
        // 没有 children 属性表示叶子节点
      }
    ]
  }
];
```

### 展开/折叠控制

通过 `expanded` 属性控制节点的初始展开状态：

```typescript
import { GanttItem } from '@worktile/gantt';

// 初始展开状态
const items: GanttItem[] = [
  {
    id: '1',
    title: '父任务',
    start: 1627729997,
    end: 1633345997,
    expanded: true, // 默认展开，子节点可见
    children: [
      {
        id: '1-1',
        title: '子任务 1',
        start: 1627729997,
        end: 1627902797,
        expanded: false // 默认折叠，子节点隐藏
      }
    ]
  }
];
```

### 展开/折叠 API

通过 `ViewChild` 获取组件实例，可以程序化控制展开/折叠：

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxGanttComponent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="expandAll()">展开全部</button>
    <button (click)="collapseAll()">折叠全部</button>
    <button (click)="expandItem('1')">展开指定节点</button>
  `
})
export class MyComponent {
  @ViewChild('gantt') gantt!: NgxGanttComponent;

  // 展开所有节点
  expandAll() {
    this.gantt.expandAll();
  }

  // 折叠所有节点
  collapseAll() {
    this.gantt.collapseAll();
  }

  // 展开指定节点
  expandItem(itemId: string) {
    const item = this.gantt.getGanttItem(itemId);
    if (item) {
      this.gantt.expandChildren(item);
    }
  }
}
```

## 异步加载

当数据量大或需要按需加载时，可以使用异步加载子节点。

### 启用异步模式

要启用异步加载，需要设置 `async` 为 `true` 并提供 `childrenResolve` 函数：

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { GanttItem } from '@worktile/gantt';

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

  constructor(private http: HttpClient) {}

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

`childrenResolve` 函数接收父任务项，返回 `Observable<GanttItem[]>`。你可以根据不同的业务逻辑实现不同的加载策略：

```typescript
import { Observable, of } from 'rxjs';

// 基础用法：根据任务类型加载
childrenResolve = (item: GanttItem) => {
  // 可以根据 item 的属性决定加载逻辑
  if (item.type === 'project') {
    return this.projectService.getChildren(item.id);
  } else {
    return this.taskService.getChildren(item.id);
  }
};

// 条件加载：某些节点不需要加载子节点
childrenResolve = (item: GanttItem) => {
  if (item.level >= 3) {
    // 超过 3 层不再加载
    return of([]);
  }
  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`);
};

// 带参数的加载：传递额外信息
childrenResolve = (item: GanttItem) => {
  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`, {
    params: {
      includeCompleted: 'true',
      limit: '100'
    }
  });
};
```

### Loading 状态

组件提供了两种 loading 状态管理方式：

#### 1. 自动管理（推荐）

组件会自动为每个节点管理 loading 状态，无需手动控制：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [async]="true" [childrenResolve]="childrenResolve">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  childrenResolve = (item: GanttItem) => {
    // 组件会自动显示/隐藏该节点的 loading 状态
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`);
  };
}
```

#### 2. 手动控制全局 Loading

如果需要全局 loading 状态（例如显示全屏加载遮罩），可以手动控制：

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

`loadingDelay` 可以延迟显示 loading，避免快速操作时的闪烁。这对于网络请求很快的场景特别有用：

```typescript
<ngx-gantt
  [loadingDelay]="500"  // 500ms 后才显示 loading
  [loading]="loading">
```

## 最大层级限制

通过 `maxLevel` 限制最大层级深度，超过该层级的节点将不会显示：

```typescript
<ngx-gantt
  [items]="items"
  [maxLevel]="3">  <!-- 最多 3 层 -->
```

**说明：**

- 默认值为 `2`（即最多 2 层：根节点 + 1 层子节点）
- 超过 `maxLevel` 的节点会被隐藏，但数据仍然存在

**示例：**

```typescript
// maxLevel = 2 时
根节点 (level 0)
  └─ 子节点 1 (level 1) ✅ 显示
      └─ 孙节点 1 (level 2) ❌ 隐藏
```

## 最小示例

### 基础树形结构

完整的树形结构示例：

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
      expanded: true, // 默认展开
      children: [
        {
          id: '1-1',
          title: '阶段 1',
          start: 1627729997,
          end: 1627902797,
          expanded: false // 默认折叠
        },
        {
          id: '1-2',
          title: '阶段 2',
          start: 1628507597,
          end: 1630667597
        }
      ]
    }
  ];
}
```

**注意：**

- `[showExpandIcon]="true"` 用于显示展开/折叠图标
- 只有包含 `children` 的节点才会显示展开图标
- 用户点击图标可以展开/折叠节点

### 异步加载示例

完整的异步加载示例，包含错误处理和 loading 状态：

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GanttItem, GanttViewType } from '@worktile/gantt';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-gantt-async',
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [async]="true"
      [childrenResolve]="childrenResolve"
      [loading]="loading"
      [loadingDelay]="300"
    >
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
      children: [] // 初始为空，展开时异步加载
    }
  ];

  constructor(private http: HttpClient) {}

  childrenResolve = (item: GanttItem) => {
    this.loading = true;
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      catchError((error) => {
        console.error('加载子节点失败:', error);
        // 错误时返回空数组，避免阻塞
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  };
}
```

## 最佳实践

### 1. 初始数据加载

**推荐做法：** 只加载第一层数据，子节点按需加载

```typescript
// ✅ 推荐：只加载第一层数据
items: GanttItem[] = [
  {
    id: '1',
    title: '项目',
    start: 1627729997,
    end: 1633345997,
    children: []  // 初始为空，展开时异步加载
  }
];

// ❌ 不推荐：一次性加载所有数据
items: GanttItem[] = [
  {
    id: '1',
    title: '项目',
    children: [
      // 大量子节点...
      // 影响初始加载性能和内存占用
    ]
  }
];
```

### 2. 错误处理

始终为 `childrenResolve` 添加错误处理，避免加载失败时阻塞用户操作：

```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

childrenResolve = (item: GanttItem) => {
  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
    catchError((error) => {
      console.error('加载子节点失败', error);
      // 显示错误提示
      this.notify.error('加载失败，请稍后重试');
      // 返回空数组，避免阻塞
      return of([]);
    })
  );
};
```

### 3. 缓存策略

对于数据变化不频繁的场景，可以使用缓存避免重复请求：

```typescript
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

private childrenCache = new Map<string, GanttItem[]>();

childrenResolve = (item: GanttItem) => {
  // 检查缓存
  if (this.childrenCache.has(item.id)) {
    return of(this.childrenCache.get(item.id)!);
  }

  // 加载并缓存
  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
    tap(children => {
      this.childrenCache.set(item.id, children);
    }),
    catchError((error) => {
      // 错误时也缓存空数组，避免重复请求
      this.childrenCache.set(item.id, []);
      return of([]);
    })
  );
};

// 清除缓存（当数据更新时调用）
clearCache(itemId?: string) {
  if (itemId) {
    this.childrenCache.delete(itemId);
  } else {
    this.childrenCache.clear();
  }
}
```

### 4. 判断节点是否有子节点

在某些场景下，你可能需要判断节点是否有子节点（例如决定是否显示展开图标）：

```typescript
// 在 childrenResolve 中，可以根据返回的数据判断
childrenResolve = (item: GanttItem) => {
  return this.http.get<{ hasChildren: boolean; children: GanttItem[] }>(`/api/tasks/${item.id}/children`).pipe(
    map((response) => {
      // 如果后端返回了 hasChildren 标志，可以设置到 item 上
      if (!response.hasChildren) {
        // 标记为叶子节点
        item.children = null; // 或保持为空数组
      }
      return response.children;
    })
  );
};
```

## 常见问题

### Q: 异步加载不触发？

**A:** 检查以下几点：

1. **`async` 是否为 `true`**

   ```typescript
   <ngx-gantt [async]="true" ...>
   ```

2. **`childrenResolve` 是否正确设置**

   ```typescript
   [childrenResolve] = 'childrenResolve'; // 确保函数已定义
   ```

3. **任务的 `children` 是否为空数组**

   ```typescript
   // ✅ 会触发加载
   children: []

   // ❌ 不会触发加载（已有数据）
   children: [{ id: '1-1', ... }]
   ```

4. **节点是否已展开**
   - 只有展开节点时才会触发加载
   - 如果节点已经是展开状态，需要先折叠再展开

### Q: 如何刷新子节点？

**A:** 清空 `children` 并重新展开：

```typescript
import { ViewChild } from '@angular/core';
import { NgxGanttComponent } from '@worktile/gantt';

@ViewChild('gantt') gantt!: NgxGanttComponent;

refreshChildren(itemId: string) {
  // 方法 1: 更新 items 数组
  this.items = this.items.map(item => {
    if (item.id === itemId) {
      return { ...item, children: [], expanded: false };
    }
    return item;
  });

  // 重新展开会触发加载
  setTimeout(() => {
    const item = this.gantt.getGanttItem(itemId);
    if (item) {
      this.gantt.expandChildren(item);
    }
  });
}

// 方法 2: 直接操作内部 item（更高效）
refreshChildrenDirect(itemId: string) {
  const item = this.gantt.getGanttItem(itemId);
  if (item) {
    item.children = [];
    item.setExpand(false);
    // 重新展开
    setTimeout(() => {
      this.gantt.expandChildren(item);
    });
  }
}
```

### Q: 如何限制层级深度？

**A:** 使用 `maxLevel` 属性：

```typescript
<ngx-gantt [items]="items" [maxLevel]="3">
```

超过指定层级的节点将不会显示。

### Q: 如何监听展开/折叠事件？

**A:** 监听 `expandChange` 事件：

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" (expandChange)="onExpandChange($event)">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  onExpandChange(item: GanttItemInternal) {
    console.log('节点展开状态变化:', {
      id: item.id,
      title: item.title,
      expanded: item.expanded,
      children: item.children
    });

    // 可以在这里执行其他操作，如记录日志、发送统计等
  }
}
```

**事件参数：**

- `$event` 类型为 `GanttItemInternal`，包含节点的完整信息
- `item.expanded` 表示当前展开状态（`true` 为展开，`false` 为折叠）

### Q: 异步加载时如何显示自定义 loading？

**A:** 组件会自动显示 loading，但你也可以自定义：

```typescript
// 使用全局 loading
<ngx-gantt [loading]="customLoading" ...>

// 或者通过 CSS 自定义 loading 样式
::ng-deep .gantt-item-loading {
  // 自定义样式
}
```

### Q: 如何实现懒加载（只在需要时加载）？

**A:** 异步加载本身就是懒加载，但你可以进一步优化：

```typescript
childrenResolve = (item: GanttItem) => {
  // 只在特定条件下加载
  if (item.level >= 5) {
    return of([]); // 超过 5 层不再加载
  }

  // 检查是否需要加载
  if (item.loaded) {
    return of(item.children || []);
  }

  return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
    tap((children) => {
      item.loaded = trBue; // 标记为已加载
    })
  );
};
```
