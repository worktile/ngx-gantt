---
title: 高级布局
path: 'advanced-layout'
order: 520
---

如果你只想依赖 ngx-gantt 的视图能力，希望基于 ngx-gantt 视图自定义自己的布局与渲染逻辑，可以使用 `ngx-gantt-root` 组件实现布局的完全自定义。

## ⚠️ 重要提示

**自定义布局实现需要非常深入的了解甘特图的内部实现，对使用者要求较高。**

在使用 `ngx-gantt-root` 之前，请确保：

- ✅ 已充分理解甘特图的核心概念和数据结构
- ✅ 已了解视图系统、任务条定位等内部机制
- ✅ 已阅读源码，熟悉 `GanttUpper` 类提供的属性和方法

## 什么时候需要自定义布局？

`ngx-gantt-root` 适用于以下场景：

- **想使用甘特图的视图展示能力**（时间刻度、视图计算等）
- **需要完全自定义左侧区域**（不是表格，可能是列表、卡片等任意内容）
- **需要完全自定义主区域**（任务条的展示逻辑完全自定义）
- **Bar 的展示逻辑完全自定义**（可以使用内置的 `<ngx-gantt-bar>` 组件，也可以完全自己实现）

## ngx-gantt-root 组件

`ngx-gantt-root` 提供了完全自定义布局的能力。它是 `ngx-gantt` 组件内部使用的底层组件。

### 组件属性

```typescript
interface NgxGanttRootComponent {
  sideWidth?: number; // 左侧区域宽度（像素），可选
  sideTemplate?: TemplateRef<any>; // 左侧区域模板引用
  mainTemplate?: TemplateRef<any>; // 右侧区域模板引用
}
```

### 模板结构

`ngx-gantt-root` 通过两个模板来定义布局：

- **sideTemplate**：左侧区域模板，完全自定义左侧内容
- **mainTemplate**：右侧区域模板，完全自定义右侧内容（包括任务条展示）

### 最小示例

以下示例展示了 `ngx-gantt-root` 的基本使用结构：

```typescript
import { Component, OnInit } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper, NgxGanttRootComponent, NgxGanttBarComponent, GanttItemInternal } from '@worktile/gantt';

@Component({
  selector: 'app-custom-gantt',
  template: `
    <ngx-gantt-root [sideWidth]="300">
      <ng-template #sideTemplate>
        <!-- 自定义左侧区域 -->
        <div class="custom-side">
          @for (item of customItems; track item.id) {
            <div>{{ item.title }}</div>
          }
        </div>
      </ng-template>

      <ng-template #mainTemplate>
        <!-- 自定义右侧区域 -->
        <div class="gantt-main" [style.width.px]="view.width">
          @for (item of customItems; track item.id) {
            <ngx-gantt-bar [item]="item"></ngx-gantt-bar>
          }
        </div>
      </ng-template>
    </ngx-gantt-root>
  `,
  providers: [
    {
      provide: GANTT_UPPER_TOKEN,
      useExisting: AppCustomGanttComponent
    }
  ],
  imports: [NgxGanttRootComponent, NgxGanttBarComponent]
})
export class AppCustomGanttComponent extends GanttUpper implements OnInit {
  customItems: GanttItemInternal[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.buildItems();
  }

  private buildItems() {
    // 自定义数据处理逻辑
  }
}
```

## 实现要点

使用 `ngx-gantt-root` 实现自定义布局时，需要：

1. **理解数据结构**：了解 `GanttItem`、`GanttItemInternal`、`GanttGroup` 等数据结构
2. **理解视图系统**：了解视图如何计算时间范围和宽度
3. **理解任务条定位**：了解如何根据任务的开始和结束时间计算任务条的位置和宽度
4. **处理交互逻辑**：需要自己实现拖拽、点击等交互逻辑（如果使用内置组件则自动支持）

### 示例代码

- [example 示例](https://github.com/worktile/ngx-gantt/tree/master/example/src/app/gantt-advanced) - 查看完整示例代码
