---
title: Event Type
path: 'event'
order: 40
---

# GanttDragEvent

Data item drag event class, used to pass data items after dragging starts or ends

```ts
export class GanttDragEvent<T = unknown> {
  item: GanttItem<T>;
}
```

# GanttTableEvent

Transmits information about all current columns when the number of columns in the left table or the width of the column is changed by dragging

```ts
export class GanttTableEvent {
  columns: QueryList<NgxGanttTableColumnComponent>;
}
```

# GanttLinkDragEvent

Transmits information about the current data item and the target data item when dragging a data item to establish an association with other data items

```ts
export class GanttLinkDragEvent<T = unknown> {
  source: GanttItem<T>;
  target?: GanttItem<T>;
}
```

# GanttLoadOnScrollEvent

When scrolling left or right, the time interval after scrolling is transmitted, which is convenient for users to load data

```ts
export class GanttLoadOnScrollEvent {
  start: number;
  end: number;
}
```

# GanttLineClickEvent

When clicking the association line of two data items that establish an association relationship, the mouse event and two data items are transmitted

```ts
export class GanttLineClickEvent<T = unknown> {
  event: MouseEvent;
  source: GanttItem<T>;
  target: GanttItem<T>;
}
```

# GanttBarClickEvent

When clicking a data item, the data item information is transmitted

```ts
export class GanttBarClickEvent<T = unknown> {
  event: Event;
  item: GanttItem<T>;
}
```

# GanttSelectedEvent

When selecting table data, data item information is passed. In single-selection mode, a single data object is returned, and in multi-selection mode, an array of data items is returned.

```ts
export class GanttSelectedEvent<T = unknown> {
  event: Event;
  selectedValue: GanttItem<T> | GanttItem<T>[];
}
```

# GanttTableDragDroppedEvent

The event that triggers the event when a data item is dragged to another data item in the Table

```ts
export class GanttTableDragDroppedEvent<T = unknown> {
  source: GanttItem<T>; // Drag start data item
  sourceParent: GanttItem<T>; // Drag start data item parent ID
  target: GanttItem<T>; // Drag target data item
  targetParent: GanttItem<T>; // Drag target data item parent ID
  dropPosition: GanttTableDropPosition; // Drag drop position 'before' | 'inside' | 'after'
}
```

# GanttTableDragStartedEvent

Event after the drag of the Table component starts

```ts
export class GanttTableDragStartedEvent<T = unknown> {
  source: GanttItem<T>; // Drag start data item
  sourceParent: GanttItem<T>; // Drag start data item parent
}
```

# GanttTableDragEndedEvent

Event after the drag of the Table component ends

```ts
export class GanttTableDragEndedEvent<T = unknown> {
  source: GanttItem<T>; // Drag start data item
  sourceParent: GanttItem<T>; // Drag start data item parent
}
```

# GanttVirtualScrolledIndexChangeEvent

Triggered when the index of the first visible element in the virtual scroll viewport of the Gantt component changes

```ts
export class GanttVirtualScrolledIndexChangeEvent {
  index: number; // index of the first element in the viewport
  renderedRange: {
    start: number;
    end: number;
  }; // range of currently rendered items
  count: number; // total number of items
}
```
