---
title: 表格显示与交互
path: 'table-interaction'
order: 310
---

ngx-gantt 内置提供表格的展示功能，支持自定义内容、行拖拽、列调整、点击选择等丰富的交互功能。

## 如何使用表格？

表格功能通过两个核心组件实现：

- `ngx-gantt-table`：表格容器组件，用于包裹表格列定义和配置表格行为
- `ngx-gantt-column`：表格列组件，用于定义每一列的显示内容和属性

```html
<ngx-gantt #gantt [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="任务名称" width="200px" [showExpandIcon]="true">
      <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
    </ngx-gantt-column>

    <ngx-gantt-column name="开始时间" width="150px">
      <ng-template #cell let-item="item"> {{ item.start | date: 'yyyy-MM-dd' }} </ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

## 自定义展示模板

### 列内容模板

使用 `#cell` 模板自定义每列的单元格内容：

```html
<ngx-gantt-column name="任务名称" width="200px">
  <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
</ngx-gantt-column>
```

### 行前置/后置插槽

使用 `#rowBeforeSlot` 和 `#rowAfterSlot` 在每行的前后添加自定义内容：

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

使用 `#tableEmpty` 自定义表格为空时的显示内容：

```html
<ngx-gantt-table>
  <ng-template #tableEmpty>
    <div class="empty-state">暂无任务</div>
  </ng-template>

  <!-- ... -->
</ngx-gantt-table>
```

### 底部模板

使用 `#tableFooter` 自定义表格底部内容：

```html
<ngx-gantt-table>
  <ng-template #tableFooter let-columns="columns">
    <div class="table-footer">
      @for (column of columns; track $index) {
      <div class="gantt-table-column" [style.width]="column.columnWidth()">{{ column.name() }}</div>
      }
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt-table>
```

## 表格交互

### 行拖拽排序

#### 启用拖拽

通过 `ngx-gantt-table` 的 `draggable` 参数启用拖拽

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

#### 拖拽事件处理

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

表格行支持拖拽来调整任务的层级关系和顺序。拖拽任务行到目标位置时，有三种放置位置：

- `before`：放置在目标任务之前（同级）
- `inside`：放置在目标任务内部（结合 Tree 模式使用，支持子任务展示时）
- `after`：放置在目标任务之后（同级）

#### dropEnterPredicate 动作拦截

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

### 列拖拽改变宽度

表格的每列和表格整体都可以拖拽改变宽度，表格整体宽度改变会触发 `resizeChange` 事件。

```typescript
@Component({
  template: `
    <ngx-gantt-table (resizeChange)="resizeChange($event)">
      <!-- ... -->
    </ngx-gantt-table>
  `
})
export class MyComponent {
  resizeChange(width: number) {
    console.log('改变了宽度', width);
  }
}
```

### 行点击与选择

#### 行点击事件

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

#### 选择功能

启用选择功能后，点击行会触发选择：

```html
<ngx-gantt [items]="items" [selectable]="true" [multiple]="false" (selectedChange)="onSelectedChange($event)">
  <!-- ... -->
</ngx-gantt>
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
import { GanttTableDragEnterPredicateContext } from '@worktile/gantt';

canDrop = (context: GanttTableDragEnterPredicateContext) => {
  // 基于其他业务属性判断
  return context.target.origin?.status === 'active';
};
```

### Q: 拖拽后数据没有更新？

**A:** 确保使用不可变数据更新，创建新数组。

## 相关链接

- [数据模型](guides/core-concepts/data-model) - 了解数据结构
- [Bar 显示与交互](guides/features/bar-interaction) - 了解任务条交互
- [Tree 模式](guides/features/tree) - 了解层级结构
