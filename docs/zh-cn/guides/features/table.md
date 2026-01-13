---
title: 表格显示与交互
path: 'table-interaction'
order: 310
---

# 表格交互

表格区域支持行拖拽、列调整、点击选择等丰富的交互功能，是甘特图的重要组成部分。

## 前置阅读

在深入学习表格交互之前，建议先了解：

- [数据模型](../core/data-model.md) - 理解 GanttItem 的结构
- [Bar 交互](./bar.md) - 了解任务条交互

## 行拖拽排序

表格行支持拖拽来调整任务的层级关系和顺序。

### 拖拽位置

拖拽任务行到目标位置时，有三种放置位置：

- **`before`**：放置在目标任务之前（同级）
- **`inside`**：放置在目标任务内部（作为子任务）
- **`after`**：放置在目标任务之后（同级）

### 启用拖拽

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items">
      <ngx-gantt-table
        [draggable]="true"
        (dragStarted)="onDragStarted($event)"
        (dragDropped)="onDragDropped($event)"
        (dragEnded)="onDragEnded($event)"
      >
        <!-- ... -->
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];

  onDragStarted(event: GanttTableDragStartedEvent) {
    console.log('拖拽开始', event.source);
  }

  onDragDropped(event: GanttTableDragDroppedEvent) {
    // 处理拖拽放置
    this.handleDragDrop(event);
  }

  onDragEnded(event: GanttTableDragEndedEvent) {
    console.log('拖拽结束', event.source);
  }
}
```

### 拖拽事件处理

```typescript
onDragDropped(event: GanttTableDragDroppedEvent) {
  const { source, target, dropPosition, sourceParent, targetParent } = event;

  // 从源位置移除
  const sourceItems = sourceParent?.children || this.items;
  const sourceIndex = sourceItems.indexOf(source);
  sourceItems.splice(sourceIndex, 1);

  // 根据放置位置插入
  if (dropPosition === 'inside') {
    // 作为子任务
    target.children = [...(target.children || []), source];
  } else {
    // 作为同级任务
    const targetItems = targetParent?.children || this.items;
    const targetIndex = targetItems.indexOf(target);
    if (dropPosition === 'before') {
      targetItems.splice(targetIndex, 0, source);
    } else {
      targetItems.splice(targetIndex + 1, 0, source);
    }
  }

  // 不可变更新
  this.items = [...this.items];
}
```

## dropEnterPredicate 动作拦截

使用 `dropEnterPredicate` 可以控制哪些拖拽操作被允许：

```typescript
@Component({
  template: `
    <ngx-gantt-table [draggable]="true" [dropEnterPredicate]="canDrop">
      <!-- ... -->
    </ngx-gantt-table>
  `
})
export class MyComponent {
  canDrop = (context: GanttTableDragEnterPredicateContext) => {
    // 禁止将任务拖入自己
    if (context.source.id === context.target.id) {
      return false;
    }

    // 禁止将父任务拖入子任务
    if (this.isDescendant(context.target, context.source)) {
      return false;
    }

    // 只允许 before 和 after，不允许 inside
    if (context.dropPosition === 'inside') {
      return false;
    }

    return true;
  };

  private isDescendant(ancestor: GanttItem, descendant: GanttItem): boolean {
    // 检查 descendant 是否是 ancestor 的后代
    // 实现逻辑...
    return false;
  }
}
```

## 列配置

### 列定义

```html
<ngx-gantt-table>
  <ngx-gantt-column name="任务名称" width="200px" [showExpandIcon]="true">
    <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
  </ngx-gantt-column>

  <ngx-gantt-column name="开始时间" width="150px">
    <ng-template #cell let-item="item"> {{ item.start | date: 'yyyy-MM-dd' }} </ng-template>
  </ngx-gantt-column>
</ngx-gantt-table>
```

### 列属性

- `name`：列标题
- `width`：列宽度（支持像素值或数字）
- `showExpandIcon`：是否显示展开图标（用于有子任务的行）
- `class`：自定义 CSS 类名

## 行点击与选择

### 行点击事件

```typescript
@Component({
  template: `
    <ngx-gantt-table (itemClick)="onItemClick($event)">
      <!-- ... -->
    </ngx-gantt-table>
  `
})
export class MyComponent {
  onItemClick(event: GanttTableItemClickEvent) {
    console.log('点击了任务', event.current);
    // 显示任务详情
    this.showTaskDetail(event.current);
  }
}
```

### 选择功能

启用选择功能后，点击行会触发选择：

```typescript
<ngx-gantt
  [items]="items"
  [selectable]="true"
  [multiple]="false"
  (selectedChange)="onSelectedChange($event)">
  <!-- ... -->
</ngx-gantt>
```

## 自定义模板

### 行前置/后置插槽

```html
<ngx-gantt-table>
  <!-- 行前置内容 -->
  <ng-template #rowBeforeSlot let-item="item">
    <div class="row-before">前置内容</div>
  </ng-template>

  <!-- 列定义 -->
  <ngx-gantt-column name="任务" width="200px">
    <!-- ... -->
  </ngx-gantt-column>

  <!-- 行后置内容 -->
  <ng-template #rowAfterSlot let-item="item">
    <div class="row-after">后置内容</div>
  </ng-template>
</ngx-gantt-table>
```

### 空状态模板

```html
<ngx-gantt-table>
  <ng-template #tableEmpty>
    <div class="empty-state">暂无任务</div>
  </ng-template>

  <!-- ... -->
</ngx-gantt-table>
```

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttTableDragDroppedEvent } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-table',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table [draggable]="true" (dragDropped)="onDragDropped($event)">
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttTableComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];

  onDragDropped(event: GanttTableDragDroppedEvent) {
    // 处理拖拽逻辑
    this.reorganizeItems(event);
    // 不可变更新
    this.items = [...this.items];
  }

  private reorganizeItems(event: GanttTableDragDroppedEvent) {
    // 实现拖拽后的数据重组逻辑
  }
}
```

## 常见问题

### Q: 如何禁用特定任务的拖拽？

**A:** 设置任务的 `itemDraggable: false`：

```typescript
{ id: '1', title: '任务', itemDraggable: false }
```

### Q: 如何限制拖拽范围？

**A:** 使用 `dropEnterPredicate` 函数：

```typescript
dropEnterPredicate = (context) => {
  // 只允许拖拽到特定类型的任务
  return context.target.type === 'allowed-type';
};
```

### Q: 拖拽后数据没有更新？

**A:** 确保使用不可变数据更新，创建新数组。

## 相关链接

- [数据模型](../core/data-model.md) - 了解数据结构
- [Bar 交互](./bar.md) - 了解任务条交互
- [树形与异步](./tree.md) - 了解层级结构
