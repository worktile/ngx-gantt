---
title: 事件类型
path: 'event'
order: 40
---

# GanttDragEvent

数据项拖拽事件类，用于拖拽开始后或结束后传递数据项

```ts
export class GanttDragEvent<T = unknown> {
  item: GanttItem<T>;
}
```

# GanttTableEvent

左侧表格列数或拖拽改变列宽时传递当前所有列的信息

```ts
export class GanttTableEvent {
  columns: QueryList<NgxGanttTableColumnComponent>;
}
```

# GanttLinkDragEvent

拖拽数据项与其他数据项建立关联关系时传递当前数据项与目标数据项信息

```ts
export class GanttLinkDragEvent<T = unknown> {
  source: GanttItem<T>;
  target?: GanttItem<T>;
}
```

# GanttLoadOnScrollEvent

左右滚动时传递滚动后的时间区间，便于使用方加载数据

```ts
export class GanttLoadOnScrollEvent {
  start: number;
  end: number;
}
```

# GanttLineClickEvent

点击两个建立关联关系的数据项的关联线时传递鼠标事件和两个数据项

```ts
export class GanttLineClickEvent<T = unknown> {
  event: MouseEvent;
  source: GanttItem<T>;
  target: GanttItem<T>;
}
```

# GanttBarClickEvent

点击数据项时传递数据项信息

```ts
export class GanttBarClickEvent<T = unknown> {
  event: Event;
  item: GanttItem<T>;
}
```
