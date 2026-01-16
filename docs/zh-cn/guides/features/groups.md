---
title: 分组模式
path: 'groups'
order: 320
---

ngx-gantt 支持任务按分组进行组织，适用于部门、项目、阶段等维度管理任务的场景。

## 如何渲染分组数据？

在分组模式下，通过 `groups` 和 `items` 两个数组来组织数据：

- `groups`：定义分组信息，每个分组包含 `id` 和 `title`
- `items`：定义任务项，通过 `group_id` 字段关联到对应的分组

```typescript
import { Component } from '@angular/core';
import { GanttGroup, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [groups]="groups" [items]="items" [viewType]="viewType">
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
export class GroupsExampleComponent {
  viewType = GanttViewType.month;

  groups: GanttGroup[] = [
    { id: 'dev', title: '开发组' },
    { id: 'test', title: '测试组' }
  ];

  items: GanttItem[] = [
    { id: '1', title: '前端开发', group_id: 'dev', start: 1627729997, end: 1628421197 },
    { id: '2', title: '后端开发', group_id: 'dev', start: 1628507597, end: 1633345997 },
    { id: '3', title: '功能测试', group_id: 'test', start: 1633433997, end: 1636035597 }
  ];
}
```

## 自定义模板

### #groupHeader 模板

使用 `#groupHeader` 模板自定义分组头部的显示内容：

```html
<ngx-gantt [groups]="groups" [items]="items">
  <ng-template #groupHeader let-group="group">
    <div class="custom-group-header">
      <span class="group-icon">📁</span>
      <span class="group-title">{{ group.title }}</span>
      <span class="group-count">({{ group.items?.length || 0 }} 个任务)</span>
    </div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

### #group 模板

使用 `#group` 模板自定义整个分组的显示（包括头部和内容区域）：

```html
<ngx-gantt [groups]="groups" [items]="items">
  <ng-template #group let-group="group" let-items="items">
    <div class="custom-group">
      <div class="group-header">{{ group.title }}</div>
      <div class="group-content">
        <!-- 分组内容 -->
      </div>
    </div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

模板上下文：

- `#groupHeader`：提供 `group` 对象（包含 `id`、`title`、`expanded`、`items` 等属性）
- `#group`：提供 `group` 对象和 `items` 数组（分组下的任务数组）

## 自定义分组样式

通过 `class` 属性为分组添加自定义 CSS 类：

```typescript
const groups: GanttGroup[] = [
  {
    id: 'dev',
    title: '开发组',
    class: 'group-dev'
  },
  {
    id: 'test',
    title: '测试组',
    class: 'group-test'
  }
];
```

## 展开/折叠

### 初始展开状态

通过 `expanded` 属性控制分组的初始展开状态：

```typescript
const groups: GanttGroup[] = [
  { id: 'dev', title: '开发组', expanded: true }, // 默认展开
  { id: 'test', title: '测试组', expanded: false } // 默认收起
];
```

### 函数控制展开

使用组件的公共方法程序化控制分组展开/收起：

```typescript
import { Component, viewChild } from '@angular/core';
import { NgxGanttComponent, GanttGroup, GanttItem } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [groups]="groups" [items]="items">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class GroupsComponent {
  gantt = viewChild<NgxGanttComponent>('gantt');

  groups: GanttGroup[] = [
    { id: 'dev', title: '开发组' },
    { id: 'test', title: '测试组' }
  ];

  items: GanttItem[] = [{ id: '1', title: '前端开发', group_id: 'dev', start: 1627729997, end: 1628421197 }];

  expandAll() {
    this.gantt()?.expandAll();
  }

  collapseAll() {
    this.gantt()?.collapseAll();
  }

  expandGroup(groupId: string) {
    const gantt = this.gantt();
    if (gantt) {
      const group = gantt.groups.find((g) => g.id === groupId);
      if (group) {
        gantt.expandGroup(group);
      }
    }
  }
}
```

## 相关链接

- [数据模型](guides/core-concepts/data-model) - 了解 GanttGroup 的数据结构
- [公共方法](guides/core-concepts/api-methods) - 了解分组相关的 API 方法
