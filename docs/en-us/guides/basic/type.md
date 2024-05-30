---
title: Input Date
path: 'data-type'
order: 30
---

The `ngx-gantt` component accepts two data input types: `GanttItem` and `GanttGroup`. `GanttItem` refers to the Gantt chart data item format, `GanttGroup` refers to the group data format, and the specific type definitions are as follows:

# GanttItem

```ts
export interface GanttItem<T = unknown> {
  id: string;
  title: string;
  start?: number;
  end?: number;
  group_id?: string;
  links?: string[];
  draggable?: boolean;
  linkable?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  children?: GanttItem[];
  color?: string;
  barStyle?: Partial<CSSStyleDeclaration>;
  origin?: T;
  type?: GanttItemType;
  progress?: number;
}
```

| Name       | Type                           | Default | Description                                                  |
| ---------- | ------------------------------ | ------- | ------------------------------------------------------------ |
| id         | `string`                       | `-`     | Unique identifier                                            |
| title      | `string`                       | `-`     | name                                                         |
| start      | `number`                       | `-`     | start time (10-digit timestamp)                              |
| end        | `number`                       | `-`     | end time (10-digit timestamp)                                |
| group_id   | `string`                       | `-`     | Id of the corresponding group                                |
| links      | `string[]`                     | `-`     | `id` collection of `GanttItem` with associated relationships |
| draggable  | `boolean`                      | `-`     | Set whether to drag                                          |
| linkable   | `boolean`                      | `-`     | Set whether to link/be linked                                |
| expandable | `boolean`                      | `-`     | Set whether to expand/collapse                               |
| expanded   | `boolean`                      | `false` | Set whether to expand/collapse                               |
| children   | `GanttItem[]`                  | `-`     | Set child data                                               |
| color      | `string`                       | `-`     | Set color                                                    |
| barStyle   | `Partial<CSSStyleDeclaration>` | `-`     | Set style                                                    |
| origin     | `T`                            | `-`     | Set original data                                            |
| type       | `GanttItemType`                | `-`     | Set data display mode (interval display and normal display)  |
| progress   | `number`                       | `-`     | Set progress                                                 |

# GanttGroup

```ts
export interface GanttGroup<T = unknown> {
  id: string;
  title: string;
  expanded?: boolean;
  origin?: T;
  class?: string;
}
```

| Name     | Type      | Default | Description                    |
| -------- | --------- | ------- | ------------------------------ |
| id       | `string`  | `-`     | Unique identifier              |
| title    | `string`  | `-`     | Name                           |
| expanded | `boolean` | `true`  | Set whether to expand/collapse |
| origin   | `T`       | `-`     | Set original data              |
| class    | `string`  | `-`     | Set `class`                    |
