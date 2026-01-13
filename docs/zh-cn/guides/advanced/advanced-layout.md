---
title: 高级布局
path: 'advanced-layout'
order: 520
---

# 高级布局

当默认的甘特图布局无法满足需求时，可以使用 `ngx-gantt-root` 组件完全自定义 Side（左侧）和 Main（右侧）区域。

## 前置阅读

在深入学习高级布局之前，建议先了解：

- [数据模型](../core/data-model.md) - 理解数据结构
- [Bar 交互](../features/bar.md) - 了解任务条组件

## 适用场景

**适用场景：**

- 需要完全自定义左侧表格区域
- 需要完全自定义右侧甘特图区域
- 需要实现特殊的布局需求（如打平模式、多行显示）
- 需要自定义滚动同步逻辑

**非适用场景：**

- 只需要调整样式（使用 CSS 即可）
- 只需要调整表格列（使用 `ngx-gantt-table` 即可）

## ngx-gantt-root 组件

`ngx-gantt-root` 是甘特图的根组件，提供了完全自定义布局的能力。

### 组件属性

```typescript
interface NgxGanttRootComponent {
  sideWidth?: number; // 左侧区域宽度
  sideTemplate?: TemplateRef<any>; // 左侧区域模板
  mainTemplate?: TemplateRef<any>; // 右侧区域模板
}
```

### 基础使用

```html
<ngx-gantt-root [sideWidth]="300">
  <ng-template #sideTemplate>
    <!-- 自定义左侧内容 -->
    <div class="custom-side">
      <div>自定义表格</div>
    </div>
  </ng-template>

  <ng-template #mainTemplate>
    <!-- 自定义右侧内容 -->
    <div class="custom-main">
      <div>自定义甘特图</div>
    </div>
  </ng-template>
</ngx-gantt-root>
```

## 布局结构

### 默认布局

`ngx-gantt` 组件内部使用 `ngx-gantt-root` 的默认布局：

```
┌─────────────────────────────────────┐
│  Header (表格头 + 日历头)            │
├──────────┬──────────────────────────┤
│          │  Calendar Grid           │
│  Table   ├──────────────────────────┤
│  Body    │  Main (任务条区域)        │
│          │                          │
└──────────┴──────────────────────────┘
```

### 自定义布局

使用 `ngx-gantt-root` 可以完全重新定义布局：

```html
<ngx-gantt-root [sideWidth]="300">
  <ng-template #sideTemplate>
    <!-- 完全自定义的左侧区域 -->
  </ng-template>

  <ng-template #mainTemplate>
    <!-- 完全自定义的右侧区域 -->
  </ng-template>
</ngx-gantt-root>
```

## 滚动同步

`ngx-gantt-root` 内部使用 `syncScrollX` 和 `syncScrollY` 指令实现滚动同步。

### 水平滚动同步

```html
<div syncScrollX="ganttMainXScroll">
  <!-- 与主区域水平滚动同步 -->
</div>
```

### 垂直滚动同步

```html
<div syncScrollY="ganttMainYScroll">
  <!-- 与主区域垂直滚动同步 -->
</div>
```

### 滚动同步标识

- `ganttTableXScroll` - 表格水平滚动
- `ganttMainXScroll` - 主区域水平滚动
- `ganttMainYScroll` - 主区域垂直滚动

## 完整示例

### 打平模式示例

实现同一行多任务不重叠排布：

```typescript
import { Component } from '@angular/core';
import {
  GANTT_UPPER_TOKEN,
  GanttUpper,
  GanttItemInternal,
  GanttGroupInternal,
  NgxGanttRootComponent,
  NgxGanttBarComponent
} from '@worktile/gantt';

@Component({
  selector: 'app-gantt-flat',
  template: `
    <ngx-gantt-root [sideWidth]="300">
      <ng-template #sideTemplate>
        <div class="gantt-flat-side-header">项目</div>
        <div class="gantt-flat-side-body">
          @for (group of groups; track group.id) {
            <div class="gantt-group">
              <div class="gantt-group-content">
                {{ group.title }}
              </div>
            </div>
          }
        </div>
      </ng-template>

      <ng-template #mainTemplate>
        <div class="gantt-main-groups" [style.width.px]="view.width">
          @for (group of groups; track group.id) {
            <div class="gantt-main-group">
              @for (items of group.mergedItems; track $index) {
                <div class="gantt-flat-items" [style.height.px]="styles().rowHeight">
                  @for (item of items; track item.id) {
                    <ngx-gantt-bar [item]="item" [template]="barTemplate()" (barClick)="barClick.emit($event)"> </ngx-gantt-bar>
                  }
                </div>
              }
            </div>
          }
        </div>
      </ng-template>
    </ngx-gantt-root>
  `,
  providers: [
    {
      provide: GANTT_UPPER_TOKEN,
      useExisting: AppGanttFlatComponent
    }
  ],
  imports: [NgxGanttRootComponent, NgxGanttBarComponent]
})
export class AppGanttFlatComponent extends GanttUpper {
  override groups: GanttGroupInternal[] = [];

  // 实现打平算法
  private buildGroupMergedItems(items: GanttItemInternal[]) {
    const mergedItems: GanttItemInternal[][] = [];
    // 排序
    items = items.filter((item) => item.start && item.end).sort((a, b) => a.start.getUnixTime() - b.start.getUnixTime());

    // 合并算法
    items.forEach((item) => {
      let inserted = false;
      for (let i = 0; i < mergedItems.length; i++) {
        const subItems = mergedItems[i];
        const lastItem = subItems[subItems.length - 1];
        // 如果当前任务开始时间大于上一行最后一个任务的结束时间，可以插入
        if (item.start.value > lastItem.end.addDays(3).value) {
          subItems.push(item);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        mergedItems.push([item]);
      }
    });

    return mergedItems;
  }
}
```

### 自定义表格和甘特图

```html
<ngx-gantt-root [sideWidth]="400">
  <ng-template #sideTemplate>
    <div class="custom-table" syncScrollY="ganttMainYScroll">
      <table>
        <thead>
          <tr>
            <th>任务名称</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items; track item.id) {
          <tr>
            <td>{{ item.title }}</td>
            <td>{{ item.origin.assignee }}</td>
            <td>{{ item.origin.status }}</td>
          </tr>
          }
        </tbody>
      </table>
    </div>
  </ng-template>

  <ng-template #mainTemplate>
    <div class="custom-gantt" syncScrollX="ganttMainXScroll">
      <gantt-calendar-grid syncScrollX="ganttMainXScroll"></gantt-calendar-grid>
      <div class="gantt-main">
        <gantt-main [flatItems]="flatItems" [viewportItems]="viewportItems" syncScrollX="ganttMainXScroll" syncScrollY="ganttMainYScroll">
        </gantt-main>
      </div>
    </div>
  </ng-template>
</ngx-gantt-root>
```

## 关键配置

### sideWidth

设置左侧区域宽度：

```html
<ngx-gantt-root [sideWidth]="300"></ngx-gantt-root>
```

如果不设置，左侧区域宽度由内容决定。

### 滚动同步

确保相关区域使用相同的滚动标识：

```html
<!-- 左侧区域 -->
<div syncScrollX="ganttTableXScroll" syncScrollY="ganttMainYScroll">
  <!-- 表格内容 -->
</div>

<!-- 右侧区域 -->
<div syncScrollX="ganttMainXScroll" syncScrollY="ganttMainYScroll">
  <!-- 甘特图内容 -->
</div>
```

## 扩展与限制

### 样式定制

可以通过 CSS 完全自定义样式：

```scss
::ng-deep .gantt-side {
  background: #f5f5f5;
  border-right: 1px solid #ddd;
}

::ng-deep .gantt-main {
  background: #fff;
}
```

### 组件限制

1. **必须继承 GanttUpper**：自定义布局组件需要继承 `GanttUpper` 类
2. **提供 GANTT_UPPER_TOKEN**：需要在 providers 中提供
3. **滚动同步**：需要正确使用滚动同步指令

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper, NgxGanttRootComponent, GanttItem } from '@worktile/gantt';

@Component({
  selector: 'app-custom-layout',
  template: `
    <ngx-gantt-root [sideWidth]="300">
      <ng-template #sideTemplate>
        <div class="custom-side">
          <h3>任务列表</h3>
          <ul>
            @for (item of items; track item.id) {
              <li>{{ item.title }}</li>
            }
          </ul>
        </div>
      </ng-template>

      <ng-template #mainTemplate>
        <div class="custom-main">
          <h3>甘特图</h3>
          <!-- 自定义甘特图内容 -->
        </div>
      </ng-template>
    </ngx-gantt-root>
  `,
  providers: [
    {
      provide: GANTT_UPPER_TOKEN,
      useExisting: AppCustomLayoutComponent
    }
  ],
  imports: [NgxGanttRootComponent]
})
export class AppCustomLayoutComponent extends GanttUpper {
  items: GanttItem[] = [];
}
```

## 常见问题

### Q: 滚动不同步？

**A:** 检查：

1. 是否使用了正确的滚动同步标识
2. 滚动同步指令是否正确应用
3. 容器是否正确设置了 `cdkScrollable`

### Q: 布局显示不正确？

**A:** 检查：

1. 是否继承了 `GanttUpper` 类
2. 是否提供了 `GANTT_UPPER_TOKEN`
3. CSS 样式是否正确

### Q: 如何访问 ganttRoot 实例？

**A:** 使用 `@ViewChild`：

```typescript
@ViewChild('ganttRoot') ganttRoot: NgxGanttRootComponent;

scrollToToday() {
  this.ganttRoot.scrollToToday();
}
```

## 相关链接

- [数据模型](../core/data-model.md) - 了解数据结构
- [Bar 交互](../features/bar.md) - 了解任务条组件
- [example 示例](https://github.com/worktile/ngx-gantt/tree/master/example/src/app/gantt-advanced) - 查看完整示例
