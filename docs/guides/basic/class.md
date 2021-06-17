---
title: 接口
path: 'class'
order: 30
---

`Gantt`中有两个主要提供给外部使用的接口，分别是`GanttItem`和`GanttGroup`。`GanttItem`指甘特图数据项格式，`GanttGroup`指分组数据格式，下面是这两个接口的具体定义。

# `GanttItem`

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

具体含义如下

| Name       | Type                           | Default | Description                            |
| ---------- | ------------------------------ | ------- | -------------------------------------- |
| id         | `string`                       | `-`     | 唯一标识                               |
| title      | `string`                       | `-`     | 名称                                   |
| start      | `number`                       | `-`     | 开始时间                               |
| end        | `number`                       | `-`     | 截止时间                               |
| group_id   | `string`                       | `-`     | 对应分组的 Id                          |
| links      | `string[]`                     | `-`     | 具有关联关系的`GanttItem`的`id`集合    |
| draggable  | `boolean`                      | `-`     | 设置是否可拖拽                         |
| linkable   | `boolean`                      | `-`     | 设置是否可关联/被关联                  |
| expandable | `boolean`                      | `-`     | 设置是否可展开/收起                    |
| expanded   | `boolean`                      | `false` | 设置是否展开/收起                      |
| children   | `GanttItem[]`                  | `-`     | 设置子数据                             |
| color      | `string`                       | `-`     | 设置颜色                               |
| barStyle   | `Partial<CSSStyleDeclaration>` | `-`     | 设置样式                               |
| origin     | `T`                            | `-`     | 设置原始数据                           |
| type       | `GanttItemType`                | `-`     | 设置数据展示方式（区间展示和普通展示） |
| progress   | `number`                       | `-`     | 设置进度                               |

# `GanttGroup`

```ts
export interface GanttGroup<T = unknown> {
  id: string;
  title: string;
  expanded?: boolean;
  origin?: T;
  class?: string;
}
```

具体含义如下

| Name     | Type      | Default | Description       |
| -------- | --------- | ------- | ----------------- |
| id       | `string`  | `-`     | 唯一标识          |
| title    | `string`  | `-`     | 名称              |
| expanded | `boolean` | `true`  | 设置是否展开/收起 |
| origin   | `T`       | `-`     | 设置原始数据      |
| class    | `string`  | `-`     | 设置`class`       |
