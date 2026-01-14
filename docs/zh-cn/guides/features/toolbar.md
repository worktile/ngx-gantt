---
title: 工具栏
path: 'toolbar'
order: 380
---

工具栏提供视图类型切换功能，方便用户在不同时间粒度之间快速切换。

## 适用场景

- **视图切换** - 快速在不同时间粒度之间切换
- **常用操作** - 放置常用的快捷操作按钮
- **自定义功能** - 根据业务需求自定义工具栏内容

## 基础使用

### 启用工具栏

通过设置 `showToolbar` 为 `true` 来启用工具栏。启用后，工具栏会显示默认的视图切换按钮。

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: ` <ngx-gantt [items]="items" [viewType]="viewType" [showToolbar]="true"> </ngx-gantt> `
})
export class MyComponent {
  viewType = GanttViewType.day;
  items: GanttItem[] = [];
}
```

### 配置视图类型

通过 `toolbarOptions` 配置工具栏显示的视图类型：

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

## 视图切换

工具栏会根据 `toolbarOptions.viewTypes` 自动显示对应的视图切换按钮。点击按钮会触发视图切换，并发出 `viewChange` 事件。

### 视图切换事件处理

当用户点击工具栏中的视图切换按钮时，会触发 `viewChange` 事件：

```typescript
onViewChange(event: GanttView) {
  const { viewType } = event;

  // 更新视图类型
  this.viewType = viewType;

  // 保存用户偏好（可选）
  localStorage.setItem('preferredViewType', viewType);

  // 触发其他业务逻辑（可选）
  this.handleViewTypeChange(viewType);
}
```

> **提示：** `viewChange` 事件是必需的，需要在事件处理中更新 `viewType` 属性，视图才会真正切换。

## 自定义工具栏

### 使用模板自定义

使用 `#toolbar` 模板可以完全自定义工具栏的内容和布局：

```typescript
import { Component, ViewChild } from '@angular/core';
import { GanttItem, GanttViewType, NgxGanttComponent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items" [viewType]="viewType" [showToolbar]="true">
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
  @ViewChild('gantt') gantt: NgxGanttComponent;

  viewType = GanttViewType.day;

  views = [
    { label: '日', value: GanttViewType.day },
    { label: '周', value: GanttViewType.week },
    { label: '月', value: GanttViewType.month },
    { label: '年', value: GanttViewType.year }
  ];

  items: GanttItem[] = [];

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

> **注意：** 使用自定义模板时，需要自行处理视图切换逻辑。可以通过 `@ViewChild` 获取组件实例，调用相关方法。

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

// 使用默认配置（不提供 viewTypes）
toolbarOptions: GanttToolbarOptions = {};
```

> **注意：**
>
> - 如果 `viewTypes` 为空数组或未提供，工具栏将不显示任何视图切换按钮
> - 视图类型会按照数组中的顺序显示
> - 只有当前 `viewType` 对应的按钮会显示为激活状态

## 样式定制

### 自定义工具栏样式

可以通过 CSS 覆盖默认样式来自定义工具栏的外观：

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
    transition: all 0.2s;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #6698ff;
      color: #fff;
      border-color: #6698ff;
    }
  }
}
```

## 实际应用场景

### 保存用户视图偏好

在用户切换视图时，可以将偏好保存到本地存储，下次打开时自动恢复：

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
export class MyComponent implements OnInit {
  viewType = GanttViewType.day;

  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month, GanttViewType.year]
  };

  items: GanttItem[] = [];

  ngOnInit() {
    // 从本地存储恢复用户偏好
    const savedViewType = localStorage.getItem('preferredViewType');
    if (savedViewType) {
      this.viewType = parseInt(savedViewType, 10) as GanttViewType;
    }
  }

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
    // 保存用户偏好
    localStorage.setItem('preferredViewType', event.viewType.toString());
  }
}
```

### 根据权限控制视图类型

根据用户权限动态显示可用的视图类型：

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

  get toolbarOptions(): GanttToolbarOptions {
    // 根据用户权限返回不同的视图类型
    if (this.userRole === 'admin') {
      return {
        viewTypes: [
          GanttViewType.hour,
          GanttViewType.day,
          GanttViewType.week,
          GanttViewType.month,
          GanttViewType.quarter,
          GanttViewType.year
        ]
      };
    } else {
      return {
        viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
      };
    }
  }

  items: GanttItem[] = [];
  userRole = 'user'; // 或 'admin'

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

### 动态显示/隐藏工具栏

可以根据业务需求动态控制工具栏的显示：

```typescript
@Component({
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [showToolbar]="showToolbar"
      [toolbarOptions]="toolbarOptions"
      (viewChange)="onViewChange($event)"
    >
      <!-- ... -->
    </ngx-gantt>
    <button (click)="toggleToolbar()">{{ showToolbar ? '隐藏' : '显示' }}工具栏</button>
  `
})
export class MyComponent {
  showToolbar = true;
  viewType = GanttViewType.day;

  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
  };

  items: GanttItem[] = [];

  toggleToolbar() {
    this.showToolbar = !this.showToolbar;
  }

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

## 完整示例

以下是一个完整的工具栏使用示例：

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

  items: GanttItem[] = [
    {
      id: '1',
      title: '任务 1',
      start: 1627729997,
      end: 1628421197
    }
  ];

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

## 默认样式

如果不使用自定义模板，工具栏会使用以下默认样式：

- **位置**：绝对定位，位于甘特图顶部右侧（`top: calc(header-height + 16px)`, `right: 20px`）
- **层级**：`z-index: 1000`
- **按钮样式**：
  - 内边距：`0 15px`
  - 边框：`1px solid` 灰色
  - 背景色：白色
  - 圆角：首尾按钮分别有左右圆角（`4px`）
- **激活状态**：
  - 文字颜色：主题色
  - 边框颜色：主题色
  - 层级提升：`z-index: 1`

可以通过 CSS 变量或全局配置来自定义默认样式

## 常见问题

### Q: 工具栏不显示？

**A:** 请按以下步骤排查：

1. **检查 `showToolbar` 属性**：确保设置为 `true`
2. **检查 `toolbarOptions.viewTypes`属性**：确保不为空数组
3. **检查视图类型配置**：确保配置的视图类型有效

```typescript
// 错误示例：showToolbar 未设置或为 false
<ngx-gantt [items]="items" [viewType]="viewType"> // ❌ 缺少 showToolbar

// 错误示例：viewTypes 为空数组
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [] // ❌ 空数组，工具栏不显示按钮
};

// 正确示例
<ngx-gantt [items]="items" [viewType]="viewType" [showToolbar]="true"> // ✅
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.week] // ✅
};
```

### Q: 如何隐藏某些视图类型？

**A:** 在 `toolbarOptions.viewTypes` 中只包含需要显示的视图类型：

```typescript
// 只显示日视图和月视图
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.month]
};
```

### Q: 如何获取当前选中的视图类型？

**A:** 可以通过监听 `viewChange` 事件或直接使用组件中的 `viewType` 属性：

```typescript
// 方式1: 通过事件（推荐）
onViewChange(event: GanttView) {
  const currentViewType = event.viewType;
  console.log('当前视图类型:', currentViewType);
}

// 方式2: 直接使用属性
const currentViewType = this.viewType;
```

### Q: 可以完全自定义工具栏吗？

**A:** 可以，使用 `#toolbar` 模板可以完全自定义工具栏的内容和样式，不受默认配置限制。

### Q: 视图切换后没有生效？

**A:** 请按以下步骤排查：

1. **检查事件处理**：确保在 `viewChange` 事件处理函数中更新了 `viewType` 属性
2. **检查双向绑定**：确保 `viewType` 属性正确绑定到组件

```typescript
// 错误示例：未更新 viewType
onViewChange(event: GanttView) {
  console.log('视图切换', event.viewType); // ❌ 只打印，未更新
}

// 正确示例：更新 viewType
onViewChange(event: GanttView) {
  this.viewType = event.viewType; // ✅ 必须更新 viewType
}
```

### Q: 自定义工具栏模板不显示？

**A:** 可能的原因和解决方法：

1. **模板引用错误**：确保使用 `#toolbar` 作为模板引用名
2. **模板位置错误**：确保模板放在 `<ngx-gantt>` 标签内部

```html
<!-- 错误示例：模板引用名错误 -->
<ng-template #customToolbar>
  <!-- ❌ 应该是 #toolbar -->
  <!-- ... -->
</ng-template>

<!-- 错误示例：模板位置错误 -->
<ng-template #toolbar>
  <!-- ... -->
</ng-template>
<ngx-gantt>
  <!-- ❌ 模板应该在组件内部 -->
  <!-- ... -->
</ngx-gantt>

<!-- 正确示例 -->
<ngx-gantt>
  <ng-template #toolbar>
    <!-- ✅ -->
    <!-- ... -->
  </ng-template>
  <!-- ... -->
</ngx-gantt>
```
