---
title: 组件
path: 'component'
order: 20
---

`Gantt`中有多个对外暴露的组件，基础的组件有`ngx-gantt`、`ngx-gantt-table`和`ngx-gantt-column`，同时还有几个不太常用的组件`ngx-gantt-root`、`ngx-gantt-bar`和`ngx-gantt-range`，下面就分别介绍一下各个组件的使用场景。

# ngx-gantt

`ngx-gantt`是最基本的也将会是被使用最多的组件，该组件能满足我们日常的甘特图需求。

# ngx-gantt-table

`ngx-gantt-table`组件是指甘特图左侧的表格，该组件在`ngx-gantt`组件内部使用。

# ngx-gantt-column

`ngx-gantt-column`组件指甘特图左侧的表格中的列，该组件在`ngx-gantt-table`组件内部使用。

# 组件示例

```html
<ngx-gantt>
  <ngx-gantt-table>
    <ngx-gantt-column> ... </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

# ngx-gantt-bar

`ngx-gantt-bar`组件指甘特图右侧水平的条形图，常用于表示项目下的工作项。在无其他特殊需求，仅作为展示的情况下是用不到该组件的。该组件可在`ngx-gantt-root`组件内部使用，以满足一些自定义甘特图的场景。

# ngx-gantt-range

`ngx-gantt-range`组件和`ngx-gantt-bar`是相似的，区别在于`ngx-gantt-bar`是条形图展示而`ngx-gantt-range`组件是范围区间展示，常用于表示工作组。

# ngx-gantt-root

`ngx-gantt-root`组件整个甘特图的根组件，在无自定义甘特图需求的情况下，不会用到该组件。

# 组件示例

```html
<ngx-gantt-root>
  <ng-template #sideTemplate></ng-template>
  <ng-template #mainTemplate>
    <ngx-gantt-bar></ngx-gantt-bar>
  </ng-template>
</ngx-gantt-root>
```

以上就是`Gantt`中的所有外部组件，这些组件基本能满足我们日常甘特图相关的需求。由于开放了`ngx-gantt-root`根组件，`Gantt`拥有着强大的自定义能力，更多酷炫的玩法等待你来开发。
