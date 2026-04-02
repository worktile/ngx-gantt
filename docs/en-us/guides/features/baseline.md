---
title: Baseline
path: 'baseline'
order: 370
---

Baselines are used to display the original schedule in a project plan and compare it against the actual execution time. They help track deviations in project progress. Baselines are shown as gray bars below the task bars.

## Basic Usage

Baseline data is passed in via the `baselineItems` property. For each baseline item, its `id` must match the `id` of the corresponding task:

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttBaselineItem } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="baselineItems">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];

  baselineItems: GanttBaselineItem[] = [
    { id: '1', start: 1627728888, end: 1628421197 },
    { id: '2', start: 1617361997, end: 1625483597 }
  ];
}
```

### Data Structure

```typescript
interface GanttBaselineItem {
  id: string; // Must correspond to the task item's id
  start?: number; // Baseline start time (Unix timestamp, seconds)
  end?: number; // Baseline end time (Unix timestamp, seconds)
}
```

**Note:** Both `start` and `end` are optional, but you must provide at least one. Time must be expressed as a Unix timestamp (seconds), and should match the format used by task items.

### Dynamic Show/Hide

You can dynamically show or hide baselines by controlling the `baselineItems` array:

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [baselineItems]="showBaseline ? baselineItems : []">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="toggleBaseline()">{{ showBaseline ? 'Hide' : 'Show' }} Baseline</button>
  `
})
export class MyComponent {
  showBaseline = false;
  baselineItems: GanttBaselineItem[] = [...];

  toggleBaseline() {
    this.showBaseline = !this.showBaseline;
  }
}
```

## Custom Baseline Template

By default, the baseline is displayed as a gray bar (height: 8px; color: `#cacaca`). If you want to customize the style, you can use the `#baseline` template.

### Template Context

The `#baseline` template provides the following context:

- `item`: baseline item data (`GanttBaselineItem`)
- `refs`: baseline position and size information
  - `refs.x`: X coordinate
  - `refs.y`: Y coordinate
  - `refs.width`: width

### Custom Example

```html
<ngx-gantt [items]="items" [baselineItems]="baselineItems">
  <ng-template #baseline let-item="item" let-refs="refs">
    <div class="custom-baseline" [style.width.px]="refs.width" [style.left.px]="refs.x"></div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

```scss
.custom-baseline {
  position: absolute;
  bottom: 2px;
  height: 4px;
  background: #ff6b6b;
  opacity: 0.6;
  border-radius: 2px;
  z-index: 2;
}
```
