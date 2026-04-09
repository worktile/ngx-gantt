---
title: Tree 模式
path: 'tree'
order: 330
---

ngx-gantt 支持树形结构（通过 `children` 属性）和异步加载子节点，适用于大型项目管理和 WBS（工作分解结构）场景。

## 如何使用 Tree 模式？

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
      }
    ]
  }
];
```

## 展开/折叠控制

### 初始展开状态

通过 `expanded` 属性控制节点的初始展开状态（默认为 `false`）：

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '父任务',
    start: 1627729997,
    end: 1633345997,
    expanded: true, // 默认展开
    children: [
      {
        id: '1-1',
        title: '子任务',
        start: 1627729997,
        end: 1627902797,
        expanded: false // 默认折叠
      }
    ]
  }
];
```

### 程序化控制

通过 `viewChild` 获取组件实例，可以程序化控制展开/折叠：

```typescript
import { Component, viewChild } from '@angular/core';
import { NgxGanttComponent } from '@worktile/gantt';

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
  gantt = viewChild<NgxGanttComponent>('gantt');

  expandAll() {
    this.gantt()?.expandAll();
  }

  collapseAll() {
    this.gantt()?.collapseAll();
  }
}
```

### 最大层级限制

通过 `maxLevel` 限制最大层级深度（默认值为 `2`），超过该层级的节点将不会显示：

```typescript
<ngx-gantt [items]="items" [maxLevel]="3">
```

## 异步加载

当数据量大或需要按需加载时，可以使用异步加载子节点。设置 `async` 为 `true` 并提供 `childrenResolve` 函数，`childrenResolve` 接收父任务项，返回 `Observable<GanttItem[]>`：

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GanttItem } from '@worktile/gantt';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  template: `
    <ngx-gantt [items]="items" [async]="true" [childrenResolve]="childrenResolve">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
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

  childrenResolve = (item: GanttItem) => {
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      catchError((error) => {
        console.error('加载子节点失败:', error);
        return of([]);
      })
    );
  };
}
```

## 完整示例

### 基础树形结构

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务">
          <ng-template #cell let-item="item">{{ item.title }}</ng-template>
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
      expanded: true,
      children: [
        {
          id: '1-1',
          title: '阶段 1',
          start: 1627729997,
          end: 1627902797
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

### 异步加载示例

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GanttItem, GanttViewType } from '@worktile/gantt';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [async]="true" [childrenResolve]="childrenResolve">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px" [showExpandIcon]="true">
          <ng-template #cell let-item="item">{{ item.title }}</ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttAsyncComponent {
  viewType = GanttViewType.day;
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
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      catchError((error) => {
        console.error('加载子节点失败:', error);
        return of([]);
      })
    );
  };
}
```
