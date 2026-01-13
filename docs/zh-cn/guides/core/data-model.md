---
title: 数据模型
path: 'data-model'
order: 210
---

数据模型是 ngx-gantt 的核心基础，理解 `GanttItem` 和 `GanttGroup` 的结构是使用组件的前提。

## GanttItem

`GanttItem` 是任务项的数据接口，定义了任务的所有属性：

```typescript
interface GanttItem {
  id: string; // 唯一标识符（必需）
  title: string; // 任务标题（必需）
  start?: number | Date; // 开始时间（Unix 时间戳或 Date）
  end?: number | Date; // 结束时间（Unix 时间戳或 Date）
  group_id?: string; // 所属分组ID（分组模式）
  children?: GanttItem[]; // 子任务数组（树形模式）
  links?: (GanttLink | string)[]; // 依赖关系
  color?: string; // 自定义颜色
  barStyle?: Partial<CSSStyleDeclaration>; // 任务条样式
  laneStyle?: Partial<CSSStyleDeclaration>; // 任务行样式
  type?: GanttItemType; // 任务类型：bar | range | custom
  progress?: number; // 进度百分比（0-1）
  draggable?: boolean; // 是否可拖拽（默认 true）
  itemDraggable?: boolean; // 是否可在表格中拖拽
  linkable?: boolean; // 是否可创建链接（默认 true）
  expandable?: boolean; // 是否可展开（自动判断）
  expanded?: boolean; // 是否已展开（默认 false）
  origin?: T; // 原始业务数据（推荐使用）
}
```

### 必需字段

- `id`：任务的唯一标识符，必须保证唯一性
- `title`：任务显示名称

### 时间字段

- `start`：支持 Unix 时间戳（秒）或 `Date` 对象
- `end`：支持 Unix 时间戳（秒）或 `Date` 对象
- 如果只提供 `start` 或 `end`，组件会自动填充默认占位宽度

### 使用 origin 挂载业务数据

推荐使用 `origin` 字段存储完整的业务数据，这样在事件回调中可以访问原始数据：

```typescript
interface MyBusinessData {
  taskId: string;
  assignee: string;
  priority: number;
  // ... 其他业务字段
}

const items: GanttItem[] = [
  {
    id: '1',
    title: '任务 1',
    start: 1627729997,
    end: 1628421197,
    origin: {
      taskId: 'TASK-001',
      assignee: '张三',
      priority: 1
    } as MyBusinessData
  }
];

// 在事件回调中访问
dragEnded(event: GanttDragEvent) {
  const businessData = event.item.origin as MyBusinessData;
  console.log(businessData.assignee); // '张三'
}
```

## GanttGroup

`GanttGroup` 数据接口用于分组模式，将任务按组组织：

```typescript
interface GanttGroup {
  id: string; // 分组唯一标识符（必需）
  title: string; // 分组标题（必需）
  expanded?: boolean; // 是否默认展开（默认 true）
  class?: string; // 自定义CSS类名
  origin?: T; // 原始业务数据
}
```

## Group 与 Tree 模式数据组织

ngx-gantt 支持两种数据组织方式，适用于不同的业务场景：

### 分组模式（Group + items）

使用 `groups` 和 `items` 分别定义分组和任务，通过 `group_id` 关联：

```typescript
const groups: GanttGroup[] = [
  { id: 'group1', title: '开发组' },
  { id: 'group2', title: '测试组' }
];

const items: GanttItem[] = [
  { id: '1', title: '前端开发', group_id: 'group1', start: 1627729997, end: 1628421197 },
  { id: '2', title: '后端开发', group_id: 'group1', start: 1628507597, end: 1633345997 },
  { id: '3', title: '功能测试', group_id: 'group2', start: 1633433997, end: 1636035597 }
];
```

### 树形模式（Children）

使用 `children` 属性构建层级结构：

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '项目启动',
    start: 1627729997,
    end: 1633345997,
    children: [
      {
        id: '1-1',
        title: '需求分析',
        start: 1627729997,
        end: 1628421197,
        children: [{ id: '1-1-1', title: '需求调研', start: 1627729997, end: 1627902797 }]
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

## 数据更新

ngx-gantt 使用 OnPush 变更检测策略，要求使用不可变数据更新：

### ❌ 错误示例（可变更新）

```typescript
// 错误：直接修改原对象
dragEnded(event: GanttDragEvent) {
  event.item.start = newDate; // 不会触发视图更新
  event.item.end = newDate;
}
```

### ✅ 正确示例（不可变更新）

```typescript
// 正确：创建新数组
dragEnded(event: GanttDragEvent) {
  this.items = this.items.map(item => {
    if (item.id === event.item.id) {
      return {
        ...item,
        start: event.item.start.getUnixTime(),
        end: event.item.end.getUnixTime()
      };
    }
    return item;
  });
}
```

## 最小示例

### 基础任务列表

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-basic',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
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
export class GanttBasicComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];
}
```

### 分组模式示例

```typescript
const groups: GanttGroup[] = [
  { id: 'g1', title: '开发组' },
  { id: 'g2', title: '测试组' }
];

const items: GanttItem[] = [
  { id: '1', title: '前端开发', group_id: 'g1', start: 1627729997, end: 1628421197 },
  { id: '2', title: '后端开发', group_id: 'g1', start: 1628507597, end: 1633345997 },
  { id: '3', title: '功能测试', group_id: 'g2', start: 1633433997, end: 1636035597 }
];
```

### 树形模式示例

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '项目阶段',
    start: 1627729997,
    end: 1633345997,
    children: [
      { id: '1-1', title: '子任务 1', start: 1627729997, end: 1627902797 },
      { id: '1-2', title: '子任务 2', start: 1628507597, end: 1630667597 }
    ]
  }
];
```

## 常见问题

### Q: 为什么修改了数据但视图没有更新？

**A:** 确保使用不可变数据更新，创建新数组而不是修改原数组：

```typescript
// ✅ 正确
this.items = [...this.items, newItem];

// ❌ 错误
this.items.push(newItem);
```

### Q: 如何判断任务是否有子节点？

**A:** 检查 `children` 数组和 `expandable` 属性：

### Q: 分组模式和树形模式可以混用吗？

**A:** 可以，混用时需要注意数据结构的清晰性。

### Q: origin 字段是必需的吗？

**A:** 不是必需的，但强烈推荐使用，便于在事件回调中访问完整的业务数据。

<!-- ## 相关链接

- [树形与异步](../features/tree.md) - 了解异步加载的详细用法
- [时间与时区](./date-timezone.md) - 理解时间字段的处理方式
- [Bar 交互](../features/bar.md) - 学习任务条交互和事件处理
 -->
