---
title: Range Task Display
path: 'range'
order: 350
---

Range is a component in the Gantt chart used to display task items of a specific type. It is suitable for time-interval data that should be shown as ranges.

## Range Type Task Items

Range type tasks are identified by setting `type: 'range'`:

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'Version Release',
    start: 1627729997,
    end: 1627759997,
    type: 'range' // Set as range type
  }
];
```

## Range Display

### Custom Range Template

Use the `#range` template to customize the content of the range:

```html
<ngx-gantt [items]="items">
  <ng-template #range let-item="item" let-refs="refs">
    <div class="custom-range">
      <span>{{ item.title }}</span>
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt>
```

### Template Context

The `#range` template provides the following context:

- `item`: task item data (`GanttItem`)
- `refs`: range position and size information
  - `refs.x`: X coordinate
  - `refs.y`: Y coordinate
  - `refs.width`: width
  - `refs.height`: height

## Range vs Bar

| Feature  | Bar                                      | Range                                                |
| -------- | ---------------------------------------- | ---------------------------------------------------- |
| Use      | Standard task bar with drag interactions | Interval display, usually used to mark a time period |
| Template | `#bar`                                   | `#range`                                             |
| Drag     | Supports overall dragging and resizing   | Does not support dragging                            |

## Use Cases

Range type tasks are suitable for:

1. **Version release interval**: marking the time period of a version release
2. **Milestone interval**: displaying the range of important time nodes
3. **Planning interval**: showing planned time ranges

## Minimal Example

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-range',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ng-template #range let-item="item" let-refs="refs">
        <div class="range-item" [style.left.px]="refs.x" [style.width.px]="refs.width">
          {{ item.title }}
        </div>
      </ng-template>
      <ngx-gantt-table>
        <ngx-gantt-column name="Task" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttRangeComponent {
  viewType = GanttViewType.month;

  items: GanttItem[] = [
    {
      id: '1',
      title: 'Version V1.0',
      start: 1627729997,
      type: 'range'
    },
    {
      id: '2',
      title: 'Version V2.0',
      start: 1630421197,
      type: 'range'
    }
  ];
}
```

## Related Links

- [Bar Display and Interaction](guides/features/bar-interaction) - Learn about the interactions for Bar tasks
- [Data Model](guides/core-concepts/data-model) - Learn the structure of `GanttItem` and the `type` field
- [Date and Timezone](guides/core-concepts/date-timezone) - Understand how time fields are handled
