---
title: Bar 显示与交互
path: 'bar-interaction'
order: 320
---

任务条（Bar）是甘特图的核心交互元素，支持拖拽移动、缩放调整时间，以及丰富的自定义能力。

## 自定义 Bar 模板

使用 `#bar` 模板自定义任务条的内容：

```html
<ngx-gantt [items]="items">
  <ng-template #bar let-item="item">
    <div class="custom-bar">
      <span>{{ item.title }}</span>
      <span class="progress" *ngIf="item.progress"> {{ (item.progress * 100).toFixed(0) }}% </span>
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt>
```

## 自定义 Item 模板

使用 `#item` 模板自定义整个任务行的内容（包括任务条和行背景）：

```html
<ng-template #item let-item="item">
  <div class="custom-item">
    <!-- 自定义内容 -->
  </div>
</ng-template>
```

## 拖拽交互

Bar 支持两种拖拽方式：

- **整体拖拽**：拖拽任务条中间区域，整体移动任务的时间
- **缩放拖拽**：拖拽任务条左右两侧的手柄，调整开始或结束时间
  - **左侧手柄**：调整开始时间
  - **右侧手柄**：调整结束时间

两种拖拽方式共用同一套事件系统：

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttDragEvent, GanttBarClickEvent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [draggable]="true"
      (dragStarted)="onDragStarted($event)"
      (dragMoved)="onDragMoved($event)"
      (dragEnded)="onDragEnded($event)"
      (barClick)="onBarClick($event)"
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
export class MyComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];

  onBarClick(event: GanttBarClickEvent) {
    console.log('点击任务条', event.item);
  }

  onDragStarted(event: GanttDragEvent) {
    console.log('拖拽开始', event.item);
  }

  onDragMoved(event: GanttDragEvent) {
    console.log('拖拽中', event.item);
  }

  onDragEnded(event: GanttDragEvent) {
    // 使用不可变更新
    this.items = this.items.map((item) => {
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
}
```

### 事件对象

```typescript
interface GanttDragEvent {
  item: GanttItem; // 被拖拽的任务（包含更新后的时间）
}

interface GanttBarClickEvent {
  item: GanttItem; // 被点击的任务
  event: MouseEvent; // 原始鼠标事件
}
```

## 拖拽禁用

### 禁用所有 Bar 拖拽

```typescript
// 禁用所有任务的拖拽
<ngx-gantt [draggable]="false" [items]="items">
```

### 禁用指定任务脱宅

```typescript
const items: GanttItem[] = [
  {
    id: '2',
    title: '不可拖拽任务',
    start: 1628507597,
    end: 1633345997,
    draggable: false // 禁用拖拽
  }
];
```

**优先级：** 任务级别的 `draggable` 属性会覆盖全局配置。

## 样式定制

### 自定义颜色

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '高优先级任务',
    start: 1627729997,
    end: 1628421197,
    color: '#ff6b6b' // 自定义颜色
  }
];
```

### 自定义样式

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '任务',
    start: 1627729997,
    end: 1628421197,
    barStyle: {
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    laneStyle: {
      backgroundColor: '#f5f5f5'
    }
  }
];
```

## 拖拽提示框格式

拖拽时会显示日期预览，格式由 `viewOptions.dragTooltipFormat` 控制：

```typescript
const viewOptions: GanttViewOptions = {
  dragTooltipFormat: 'MM-dd HH:mm' // 使用 date-fns 格式字符串
};
```

## 常见问题

### Q: 拖拽后视图没有更新？

**A:** 确保使用不可变数据更新，创建新数组而不是修改原数组：

```typescript
// ✅ 正确
this.items = this.items.map((item) => {
  if (item.id === event.item.id) {
    return { ...item, start: event.item.start.getUnixTime() };
  }
  return item;
});

// ❌ 错误
const item = this.items.find((i) => i.id === event.item.id);
item.start = event.item.start.getUnixTime(); // 不会触发视图更新
```

### Q: 如何禁用特定任务的拖拽？

**A:** 设置任务的 `draggable: false`：

```typescript
{ id: '1', title: '任务', draggable: false }
```

### Q: 如何获取拖拽后的新时间？

**A:** 在 `dragEnded` 事件中，`event.item.start` 和 `event.item.end` 是更新后的 `GanttDate` 对象：

```typescript
onDragEnded(event: GanttDragEvent) {
  const startTimestamp = event.item.start.getUnixTime();
  const endTimestamp = event.item.end.getUnixTime();
}
```

<!-- ## 相关链接

- [数据模型](../core/data-model.md) - 了解 GanttItem 的结构
- [时间与时区](../core/date-timezone.md) - 理解时间字段的处理
- [任务关联](./links.md) - 学习任务依赖关系的创建 -->
