---
title: 组件说明
subtitle: Components
path: 'components'
order: 20
---

`NgxGanttModule` 导出了多个组件，基础的组件有 `ngx-gantt`、`ngx-gantt-table`、`ngx-gantt-column`，同时还导出了一些适用于自定义扩展的高级组件 `ngx-gantt-root`、`ngx-gantt-bar`、 `ngx-gantt-range`。

# 基础组件

## ngx-gantt

`ngx-gantt` 甘特图的根组件。

## ngx-gantt-table

`ngx-gantt-table`组件是指甘特图左侧的表格，该组件在`ngx-gantt`组件内部使用。

## ngx-gantt-column

`ngx-gantt-column`组件指甘特图左侧的表格中的列，该组件在`ngx-gantt-table`组件内部使用。

```html
<ngx-gantt>
  <ngx-gantt-table>
    <ngx-gantt-column> ... </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

# 扩展高级组件

## ngx-gantt-root

`ngx-gantt-root` 与 `ngx-gantt` 组件类似，参数也基本一致，基于 `ngx-gantt-root` 组件我们可以自定义左侧与右侧区域的内容，一般用于有自定义需求的甘特图基于此组件做二次封装。

# ngx-gantt-bar

`ngx-gantt-bar`组件指甘特图右侧水平的条形图，常用于表示项目下的任务。在无其他特殊需求，仅作为展示的情况下是用不到该组件的。该组件可在`ngx-gantt-root`组件内部使用，以满足一些自定义甘特图的场景。

# ngx-gantt-range

`ngx-gantt-range`组件和`ngx-gantt-bar`是相似的，区别在于`ngx-gantt-bar`是条形图展示而`ngx-gantt-range`组件是范围区间展示，常用于表示时间范围区间。

```html
<ngx-gantt-root>
  <ng-template #sideTemplate></ng-template>
  <ng-template #mainTemplate>
    <ngx-gantt-bar></ngx-gantt-bar>
  </ng-template>
</ngx-gantt-root>
```
