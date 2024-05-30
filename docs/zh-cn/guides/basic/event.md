---
title: 事件类型
subtitle: Event Type
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

# GanttSelectedEvent

选择表格数据时传递数据项信息，在单选模式下返回单个数据对象，多选模式下返回数据项数组

```ts
export class GanttSelectedEvent<T = unknown> {
  event: Event;
  selectedValue: GanttItem<T> | GanttItem<T>[];
}
```

# GanttTableDragDroppedEvent

当在 Table 中把一个数据项拖动到另一个数据项时触发事件的 Event

```ts
export class GanttTableDragDroppedEvent<T = unknown> {
  source: GanttItem<T>; // 拖动开始数据项
  sourceParent: GanttItem<T>; // 拖动开始数据项父 ID
  target: GanttItem<T>; // 拖动目标数据项
  targetParent: GanttItem<T>; // 拖动目标数据项父 ID
  dropPosition: GanttTableDropPosition; // 拖动放下的位置  'before' | 'inside' | 'after'
}
```

# GanttTableDragStartedEvent

Table 组件拖拽开始后事件

```ts
export class GanttTableDragStartedEvent<T = unknown> {
  source: GanttItem<T>; // 拖动开始数据项
  sourceParent: GanttItem<T>; // 拖动开始数据项父
}
```

# GanttTableDragEndedEvent

Table 组件拖拽结束后事件

```ts
export class GanttTableDragEndedEvent<T = unknown> {
  source: GanttItem<T>; // 拖动开始数据项
  sourceParent: GanttItem<T>; // 拖动开始数据项父
}
```

# GanttVirtualScrolledIndexChangeEvent

Gantt 组件虚拟滚动视口中可见的第一个元素的索引发生变化时触发

```ts
export class GanttVirtualScrolledIndexChangeEvent {
  index: number; // 视口第一个元素 index
  renderedRange: {
    start: number;
    end: number;
  }; // 当前渲染的条目范围
  count: number; // 总条目数量
}
```
