---
title: Components
path: 'components'
order: 20
---

`NgxGanttModule` exports multiple components, including `ngx-gantt`, `ngx-gantt-table`, and `ngx-gantt-column`. It also exports some advanced components suitable for custom extensions, including `ngx-gantt-root`, `ngx-gantt-bar`, and `ngx-gantt-range`.

# Basic components

## ngx-gantt

`ngx-gantt` is the root component of the Gantt chart.

## ngx-gantt-table

`ngx-gantt-table` is the table on the left side of the Gantt chart. It is used inside the `ngx-gantt` component.

## ngx-gantt-column

The `ngx-gantt-column` component refers to the column in the table on the left side of the Gantt chart. This component is used inside the `ngx-gantt-table` component.

```html
<ngx-gantt>
  <ngx-gantt-table>
    <ngx-gantt-column> ... </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

# Extended advanced components

## ngx-gantt-root

`ngx-gantt-root` is similar to the `ngx-gantt` component, and the parameters are basically the same. Based on the `ngx-gantt-root` component, we can customize the content of the left and right areas. It is generally used for Gantt charts with customized requirements to do secondary packaging based on this component.

# ngx-gantt-bar

The `ngx-gantt-bar` component refers to the horizontal bar chart on the right side of the Gantt chart, which is often used to represent the tasks under the project. This component is not used if there is no other special requirement and it is only used for display. This component can be used inside the `ngx-gantt-root` component to meet some custom Gantt chart scenarios.

# ngx-gantt-range

The `ngx-gantt-range` component is similar to the `ngx-gantt-bar` component, the difference is that the `ngx-gantt-bar` component is a bar chart display while the `ngx-gantt-range` component is a range interval display, which is often used to represent the time range interval.

```html
<ngx-gantt-root>
  <ng-template #sideTemplate></ng-template>
  <ng-template #mainTemplate>
    <ngx-gantt-bar></ngx-gantt-bar>
  </ng-template>
</ngx-gantt-root>
```
