---
title: Tree Mode
path: 'tree'
order: 330
---

ngx-gantt supports a tree structure (via the `children` property) and async loading of child nodes. It is suitable for large project management scenarios and WBS (Work Breakdown Structure).

## How to Use Tree Mode?

Build a hierarchical structure using the `children` property. It supports infinite nesting:

```typescript
import { GanttItem } from '@worktile/gantt';

const items: GanttItem[] = [
  {
    id: '1',
    title: 'Project Stage',
    start: 1627729997,
    end: 1633345997,
    children: [
      {
        id: '1-1',
        title: 'Requirements Analysis',
        start: 1627729997,
        end: 1627902797,
        children: [
          {
            id: '1-1-1',
            title: 'Requirements Research',
            start: 1627729997,
            end: 1627751597
          }
        ]
      },
      {
        id: '1-2',
        title: 'Technology Selection',
        start: 1628507597,
        end: 1630667597
      }
    ]
  }
];
```

## Expand / Collapse Control

### Initial Expanded State

Control the initial expanded state of nodes with the `expanded` property (default is `false`):

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'Parent Task',
    start: 1627729997,
    end: 1633345997,
    expanded: true, // Default expanded
    children: [
      {
        id: '1-1',
        title: 'Child Task',
        start: 1627729997,
        end: 1627902797,
        expanded: false // Default collapsed
      }
    ]
  }
];
```

### Programmatic Control

By getting the component instance via `viewChild`, you can programmatically control expand/collapse:

```typescript
import { Component, viewChild } from '@angular/core';
import { NgxGanttComponent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="expandAll()">Expand All</button>
    <button (click)="collapseAll()">Collapse All</button>
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

### Maximum Level Limit

Use `maxLevel` to limit the maximum nesting depth (default: `2`). Nodes beyond this level will not be displayed:

```typescript
<ngx-gantt [items]="items" [maxLevel]="3">
```

## Async Loading

When the dataset is large or you need on-demand loading, use async loading for child nodes. Set `async` to `true` and provide a `childrenResolve` function. `childrenResolve` receives a parent task item and returns an `Observable<GanttItem[]>`:

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
      title: 'Parent Task',
      start: 1627729997,
      end: 1633345997,
      children: [] // Initially empty; load via childrenResolve
    }
  ];

  constructor(private http: HttpClient) {}

  childrenResolve = (item: GanttItem) => {
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      catchError((error) => {
        console.error('Failed to load child nodes:', error);
        return of([]);
      })
    );
  };
}
```

## Complete Example

### Basic Tree Structure

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task">
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
      title: 'Project',
      start: 1627729997,
      end: 1633345997,
      expanded: true,
      children: [
        {
          id: '1-1',
          title: 'Stage 1',
          start: 1627729997,
          end: 1627902797
        },
        {
          id: '1-2',
          title: 'Stage 2',
          start: 1628507597,
          end: 1630667597
        }
      ]
    }
  ];
}
```

### Async Loading Example

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
        <ngx-gantt-column name="Task" width="200px" [showExpandIcon]="true">
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
      title: 'Parent Task',
      start: 1627729997,
      end: 1633345997,
      children: [] // Initially empty; load asynchronously when expanded
    }
  ];

  constructor(private http: HttpClient) {}

  childrenResolve = (item: GanttItem) => {
    return this.http.get<GanttItem[]>(`/api/tasks/${item.id}/children`).pipe(
      catchError((error) => {
        console.error('Failed to load child nodes:', error);
        return of([]);
      })
    );
  };
}
```
