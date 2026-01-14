---
title: 工具栏
path: 'toolbar'
order: 380
---

工具栏提供视图类型切换功能，方便用户在不同时间粒度之间快速切换。

## 基础使用

通过设置 `showToolbar` 为 `true` 来启用工具栏，并通过 `toolbarOptions` 配置显示的视图类型：

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttToolbarOptions, GanttView } from '@worktile/gantt';

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
    viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
  };

  items: GanttItem[] = [];

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

**注意：** `viewChange` 事件是必需的，需要在事件处理中更新 `viewType` 属性，视图才会真正切换。

## 自定义工具栏

使用 `#toolbar` 模板可以完全自定义工具栏的内容和布局：

```typescript
import { Component, ViewChild } from '@angular/core';
import { GanttItem, GanttViewType, NgxGanttComponent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items" [viewType]="viewType" [showToolbar]="true">
      <ng-template #toolbar>
        <div class="custom-toolbar">
          <button *ngFor="let view of views" [class.active]="viewType === view.value" (click)="selectView(view.value)">
            {{ view.label }}
          </button>
          <button (click)="scrollToToday()">今天</button>
        </div>
      </ng-template>

      <ngx-gantt-table>
        <!-- ... -->
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
  @ViewChild('gantt') gantt: NgxGanttComponent;

  viewType = GanttViewType.day;

  views = [
    { label: '日', value: GanttViewType.day },
    { label: '周', value: GanttViewType.week },
    { label: '月', value: GanttViewType.month }
  ];

  items: GanttItem[] = [];

  selectView(viewType: GanttViewType) {
    this.viewType = viewType;
  }

  scrollToToday() {
    this.gantt.scrollToToday();
  }
}
```

**注意：** 使用自定义模板时，需要自行处理视图切换逻辑。如果 `toolbarOptions.viewTypes` 为空数组或未提供，工具栏将不显示任何视图切换按钮。

## 样式定制

可以通过 CSS 覆盖默认样式来自定义工具栏的外观：

```scss
::ng-deep .gantt-toolbar {
  background: #f5f5f5;
  padding: 8px 16px;

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
        <ngx-gantt-column name="任务">
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

## 常见问题

### Q: 工具栏不显示？

**A:** 检查以下几点：

1. `showToolbar` 是否为 `true`
2. `toolbarOptions.viewTypes` 是否不为空数组

```typescript
// ✅ 正确
<ngx-gantt [showToolbar]="true" [toolbarOptions]="toolbarOptions">
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.week]
};
```

### Q: 视图切换后没有生效？

**A:** 确保在 `viewChange` 事件处理中更新 `viewType` 属性：

```typescript
onViewChange(event: GanttView) {
  this.viewType = event.viewType; // ✅ 必须更新
}
```

### Q: 如何隐藏某些视图类型？

**A:** 在 `toolbarOptions.viewTypes` 中只包含需要显示的视图类型：

```typescript
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.month]
};
```
