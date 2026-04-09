---
title: Bar Display and Interaction
path: 'bar-interaction'
order: 340
---

Task bars (Bar) are the core interactive element in a Gantt chart. They support dragging to move, resizing to adjust the time range, and rich customization capabilities.

## Bar Display

### Custom Bar Template

Use the `#bar` template to customize the content of a task bar:

```html
<ngx-gantt [items]="items">
  <ng-template #bar let-item="item" let-refs="refs">
    <div class="custom-bar">
      <span>{{ item.title }}</span>
      <span class="progress" *ngIf="item.progress"> {{ (item.progress * 100).toFixed(0) }}% </span>
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt>
```

### Template Context

The `#bar` template provides the following context:

- `item`: task item data (`GanttItem`)
- `refs`: bar position and size information
  - `refs.x`: X coordinate
  - `refs.y`: Y coordinate
  - `refs.width`: width
  - `refs.height`: height

### Custom Item Template

Use the `#item` template to customize the whole task row content (including the bar and row background):

```html
<ng-template #item let-item="item">
  <div class="custom-item">
    <!-- Custom content -->
  </div>
</ng-template>
```

## Styling Customization

### Custom Color

Set the bar color via the `color` property:

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'High Priority Task',
    start: 1627729997,
    end: 1628421197,
    color: '#ff6b6b' // Custom color
  }
];
```

### Custom Style

Customize styles via the `barStyle` and `laneStyle` properties:

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'Task',
    start: 1627729997,
    end: 1628421197,
    barStyle: {
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    laneStyle: {
      backgroundColor: '#f5f5f5'
    }
  }
];
```

- `barStyle`: style object for the task bar
- `laneStyle`: style object for the task row background

## Drag Interactions

Bar supports two drag modes:

- **Overall dragging**: drag the middle area of the task bar to move the task time range as a whole
- **Resize dragging**: drag the handles on the left/right sides of the task bar to adjust start/end time
  - **Left handle**: adjust the start time
  - **Right handle**: adjust the end time

### Enable Dragging

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttDragEvent, GanttBarClickEvent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [draggable]="true"
      (dragStarted)="onDragStarted($event)"
      (dragMoved)="onDragMoved($event)"
      (dragEnded)="onDragEnded($event)"
      (barClick)="onBarClick($event)"
    >
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
export class MyComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [{ id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 }];

  onBarClick(event: GanttBarClickEvent) {
    console.log('Clicked task bar', event.item);
  }

  onDragStarted(event: GanttDragEvent) {
    console.log('Drag started', event.item);
  }

  onDragMoved(event: GanttDragEvent) {
    console.log('Dragging', event.item);
  }

  onDragEnded(event: GanttDragEvent) {
    this.items = [...this.items];
  }
}
```

### Event Object

```typescript
interface GanttDragEvent {
  item: GanttItem; // The task being dragged (includes updated time)
}

interface GanttBarClickEvent {
  item: GanttItem; // The clicked task
  event: MouseEvent; // Original mouse event
}
```

### Disable Dragging

#### Disable All Bar Dragging

```typescript
// Disable dragging for all tasks
<ngx-gantt [draggable]="false" [items]="items">
```

#### Disable Dragging for a Specific Task

```typescript
const items: GanttItem[] = [
  {
    id: '2',
    title: 'Non-draggable Task',
    start: 1628507597,
    end: 1633345997,
    draggable: false // Disable dragging
  }
];
```

**Priority:** The task-level `draggable` property overrides the global configuration.

### Drag Tooltip Format

During dragging, a date preview is shown. The format is controlled by `viewOptions.dragTooltipFormat`:

```typescript
const viewOptions: GanttViewOptions = {
  dragTooltipFormat: 'MM-dd HH:mm' // Use date-fns format string
};
```

## Minimal Example

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-bar',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
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
export class GanttBarComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];
}
```

## Common Questions

### Q: The view doesn’t update after dragging?

**A:** Make sure you update using immutable data and create a new array reference:

```typescript
// ✅ Correct: event.item already contains the updated data; just update the array reference
onDragEnded(event: GanttDragEvent) {
  this.items = [...this.items];
}

// ❌ Wrong: directly modifying the original array will not trigger a view update
onDragEnded(event: GanttDragEvent) {
  // This will not trigger a view update
}
```

### Q: How do I disable dragging for a specific task?

**A:** Set the task's `draggable: false`:

```typescript
{ id: '1', title: 'Task', draggable: false }
```

### Q: How do I customize the dragged tooltip content?

**A:** Set the date format via `viewOptions.dragTooltipFormat`, using a date-fns format string.

## Related Links

- [Data Model](guides/core-concepts/data-model) - Learn the structure of `GanttItem`
- [Date and Timezone](guides/core-concepts/date-timezone) - Understand how time fields are handled
- [Task Links](guides/features/task-links) - Learn how to create task dependencies
