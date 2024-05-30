---
title: Style Variables
path: 'style'
order: 50
---

`ngx-gantt` uses the `css` preprocessor `scss`, which supports overriding most of the color values ​​and some layout styles of components. The example is as follows:

```scss
@use '@worktile/gantt/styles/variables.scss' with (
  // basic
  $gantt-color: #333,
  $gantt-border-color: #eee,
  $gantt-bg-color: #fff,
  $gantt-side-shadow: 12px 0 16px -10px rgba(0, 0, 0, 0.15),
  $gantt-container-background-color: #fafafa,
  $gantt-group-background-color: rgba($color: #f3f3f3, $alpha: 0.5),
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
  $gantt-bar-background-color: #6698ff,

  // drag
  $gantt-item-drag-mask-color: #6698ff,
  $gantt-link-dragging-line-color: #6698ff,

  // link
  $gantt-link-line-color: #6698ff,

  // table
  $gantt-table-header-drag-line-width: 3px,
  $gantt-table-header-drag-line-color: #6698ff
);
```

`$gantt-header-height` `$gantt-group-height` are deprecated in v17.0.0, please customize them through GANTT_GLOBAL_CONFIG
