---
title: 工具栏
path: 'toolbar'
order: 380
---

# 工具栏

工具栏提供视图类型切换功能，方便用户在不同时间粒度之间快速切换。

## 前置阅读

在深入学习工具栏之前，建议先了解：

- [视图体系](../core/views.md) - 理解 6 种视图类型

## 启用工具栏

### 基础使用

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [showToolbar]="true">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  viewType = GanttViewType.day;
  items: GanttItem[] = [];
}
```

### 配置可切换的视图类型

通过 `toolbarOptions` 配置工具栏显示的视图类型：

```typescript
@Component({
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [showToolbar]="true"
      [toolbarOptions]="toolbarOptions"
      (viewChange)="onViewChange($event)"
    >
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  viewType = GanttViewType.day;

  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.hour, GanttViewType.day, GanttViewType.week, GanttViewType.month, GanttViewType.quarter, GanttViewType.year]
  };

  onViewChange(event: GanttView) {
    console.log('视图切换', event.viewType);
    this.viewType = event.viewType;
  }
}
```

## 视图切换

工具栏会自动根据 `toolbarOptions.viewTypes` 显示对应的视图切换按钮。点击按钮会触发视图切换，并发出 `viewChange` 事件。

### 视图切换事件

```typescript
onViewChange(event: GanttView) {
  const { viewType } = event;

  // 更新视图类型
  this.viewType = viewType;

  // 可以保存用户偏好
  localStorage.setItem('preferredViewType', viewType);

  // 可以触发其他逻辑
  this.onViewTypeChanged(viewType);
}
```

## 自定义工具栏模板

使用 `#toolbar` 模板可以完全自定义工具栏内容：

```html
<ngx-gantt [items]="items" [viewType]="viewType" [showToolbar]="true">
  <ng-template #toolbar>
    <div class="custom-toolbar">
      <button *ngFor="let view of availableViews" [class.active]="viewType === view.value" (click)="switchView(view.value)">
        {{ view.label }}
      </button>

      <button (click)="scrollToToday()">今天</button>
      <button (click)="exportImage()">导出</button>
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt>
```

### 自定义工具栏示例

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [showToolbar]="true">
      <ng-template #toolbar>
        <div class="custom-toolbar">
          <div class="view-switcher">
            <button *ngFor="let view of views" [class.active]="viewType === view.value" (click)="selectView(view.value)">
              {{ view.label }}
            </button>
          </div>

          <div class="toolbar-actions">
            <button (click)="scrollToToday()"><i class="icon-today"></i> 今天</button>
            <button (click)="expandAll()">展开全部</button>
            <button (click)="collapseAll()">折叠全部</button>
          </div>
        </div>
      </ng-template>

      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  @ViewChild('gantt') gantt: NgxGanttComponent;

  viewType = GanttViewType.day;

  views = [
    { label: '日', value: GanttViewType.day },
    { label: '周', value: GanttViewType.week },
    { label: '月', value: GanttViewType.month },
    { label: '年', value: GanttViewType.year }
  ];

  selectView(viewType: GanttViewType) {
    this.viewType = viewType;
  }

  scrollToToday() {
    this.gantt.scrollToToday();
  }

  expandAll() {
    this.gantt.expandAll();
  }

  collapseAll() {
    this.gantt.collapseAll();
  }
}
```

## 工具栏配置选项

### GanttToolbarOptions

```typescript
interface GanttToolbarOptions {
  viewTypes: GanttViewType[]; // 可切换的视图类型数组
}
```

### 配置示例

```typescript
// 只显示常用视图
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
};

// 显示所有视图
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.hour, GanttViewType.day, GanttViewType.week, GanttViewType.month, GanttViewType.quarter, GanttViewType.year]
};
```

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttToolbarOptions, GanttView } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-toolbar',
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [showToolbar]="true"
      [toolbarOptions]="toolbarOptions"
      (viewChange)="onViewChange($event)"
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
export class GanttToolbarComponent {
  viewType = GanttViewType.day;

  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
  };

  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

## 工具栏样式定制

### 自定义工具栏样式

```scss
::ng-deep .gantt-toolbar {
  background: #f5f5f5;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;

  .toolbar-button {
    margin-right: 8px;
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    &.active {
      background: #6698ff;
      color: #fff;
      border-color: #6698ff;
    }
  }
}
```

## 常见问题

### Q: 工具栏不显示？

**A:** 确保 `showToolbar` 为 `true`：

```typescript
[showToolbar] = 'true';
```

### Q: 如何隐藏某些视图类型？

**A:** 在 `toolbarOptions.viewTypes` 中只包含需要的视图类型：

```typescript
toolbarOptions: {
  viewTypes: [GanttViewType.day, GanttViewType.month]; // 只显示日视图和月视图
}
```

### Q: 如何获取当前选中的视图类型？

**A:** 监听 `viewChange` 事件或直接使用 `viewType` 属性：

```typescript
onViewChange(event: GanttView) {
  const currentViewType = event.viewType;
}
```

### Q: 可以完全自定义工具栏吗？

**A:** 可以，使用 `#toolbar` 模板可以完全自定义工具栏的内容和样式。

## 相关链接

- [视图体系](../core/views.md) - 了解 6 种视图类型
- [滚动定位](./performance.md) - 了解 scrollToToday 等 API
