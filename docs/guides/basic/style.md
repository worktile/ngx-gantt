---
title: 样式重写
path: 'style'
order: 50
---

`ngx-gantt` 使用了 `css` 预处理器 `scss`，支持重写组件的大部分的色值和部分 layout 样式。示例如下：

```scss
@use '@worktile/gantt/styles/variables.scss' with (
  // basic
  $gantt-color: #333,
  $gantt-header-height: 44px,
  $gantt-border-color: #eee,
  $gantt-bg-color: #fff,
  $gantt-side-shadow: 12px 0 16px -10px rgba(0, 0, 0, 0.15),
  $gantt-container-background-color: #fafafa,
  $gantt-item-height: 44px,
  $gantt-group-background-color: rgba($color: #f3f3f3, $alpha: 0.5),
  $gantt-group-height: 44px,
  $gantt-table-td-padding: 0 15px,

  // calendar
  $gantt-date-primary-color: #888,
  $gantt-date-primary-font-size: 14px,
  $gantt-date-primary-border: #ddd,
  $gantt-date-secondary-color: #333,
  $gantt-date-secondary-font-size: 14px,
  $gantt-date-secondary-weekend-color: #aaa,
  $gantt-date-week-backdrop-bg: rgba($color: #f3f3f3, $alpha: 0.5),
  $gantt-date-today-color: #ff9f73,
  $gantt-date-today-text-color: #fff,

  // bar
  $gantt-bar-bg: #fff,
  $gantt-bar-layer-bg: #fff,
  $gantt-bar-handle-color: #cacaca,
  $gantt-bar-handle-height: 12px,
  $gantt-bar-background-color: #348fe4,

  // drag
  $gantt-item-drag-mask-color: #348fe4,
  $gantt-link-dragging-line-color: #348fe4,

  // link
  $gantt-link-line-color: #348fe4,

  // table
  $gantt-table-header-drag-line-width: 3px,
  $gantt-table-header-drag-line-color: #348fe4
);
```
