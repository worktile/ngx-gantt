---
title: Table Display and Interaction
path: 'table-interaction'
order: 310
---

ngx-gantt provides built-in table display capabilities, supporting custom content, row dragging, column resizing, click-to-select, and other rich interactions.

## How to Use the Table?

The table functionality is implemented through two core components:

- `ngx-gantt-table`: the table container component, wraps column definitions and configures table behavior
- `ngx-gantt-column`: the column component, defines what to display in each column and its properties

```html
<ngx-gantt #gantt [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="Task Name" width="200px" [showExpandIcon]="true">
      <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
    </ngx-gantt-column>

    <ngx-gantt-column name="Start Time" width="150px">
      <ng-template #cell let-item="item"> {{ item.start | date: 'yyyy-MM-dd' }} </ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

## Custom Display Templates

### Column Content Template

Use the `#cell` template to customize the cell content of each column:

```html
<ngx-gantt-column name="Task Name" width="200px">
  <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
</ngx-gantt-column>
```

### Row Before/After Slots

Use `#rowBeforeSlot` and `#rowAfterSlot` to add custom content before and after each row:

```html
<ngx-gantt-table>
  <!-- Row before content -->
  <ng-template #rowBeforeSlot let-item="item">
    <div class="row-before">Before content</div>
  </ng-template>

  <!-- Column definition -->
  <ngx-gantt-column name="Task" width="200px">
    <!-- ... -->
  </ngx-gantt-column>

  <!-- Row after content -->
  <ng-template #rowAfterSlot let-item="item">
    <div class="row-after">After content</div>
  </ng-template>
</ngx-gantt-table>
```

### Table Empty Template

Use `#tableEmpty` to customize what is displayed when the table is empty:

```html
<ngx-gantt-table>
  <ng-template #tableEmpty>
    <div class="empty-state">No tasks</div>
  </ng-template>

  <!-- ... -->
</ngx-gantt-table>
```

### Table Footer Template

Use `#tableFooter` to customize the table footer:

```html
<ngx-gantt-table>
  <ng-template #tableFooter let-columns="columns">
    <div class="table-footer">
      @for (column of columns; track $index) {
      <div class="gantt-table-column" [style.width]="column.columnWidth()">{{ column.name() }}</div>
      }
    </div>
  </ng-template>

  <!-- ... -->
</ngx-gantt-table>
```

## Table Interactions

### Row Drag Sorting

#### Enable Dragging

Enable dragging via the `draggable` parameter of `ngx-gantt-table`:

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items">
      <ngx-gantt-table
        [draggable]="true"
        (dragStarted)="onDragStarted($event)"
        (dragDropped)="onDragDropped($event)"
        (dragEnded)="onDragEnded($event)"
      >
        <!-- ... -->
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];

  onDragStarted(event: GanttTableDragStartedEvent) {
    console.log('Drag started', event.source);
  }

  onDragDropped(event: GanttTableDragDroppedEvent) {
    // Handle drag drop placement
    this.handleDragDrop(event);
  }

  onDragEnded(event: GanttTableDragEndedEvent) {
    console.log('Drag ended', event.source);
  }
}
```

#### Handle Drag Drop Events

```typescript
onDragDropped(event: GanttTableDragDroppedEvent) {
  const { source, target, dropPosition, sourceParent, targetParent } = event;

  // Remove from source position
  const sourceItems = sourceParent?.children || this.items;
  const sourceIndex = sourceItems.indexOf(source);
  sourceItems.splice(sourceIndex, 1);

  // Insert based on the drop position
  if (dropPosition === 'inside') {
    // As a child task
    target.children = [...(target.children || []), source];
  } else {
    // As a sibling task
    const targetItems = targetParent?.children || this.items;
    const targetIndex = targetItems.indexOf(target);
    if (dropPosition === 'before') {
      targetItems.splice(targetIndex, 0, source);
    } else {
      targetItems.splice(targetIndex + 1, 0, source);
    }
  }

  // Immutable update
  this.items = [...this.items];
}
```

Table rows support dragging to adjust task hierarchy and order. When you drag a task row to the target position, there are three possible placement positions:

- `before`: place before the target task (same level)
- `inside`: place inside the target task (used together with Tree mode; supports displaying child tasks)
- `after`: place after the target task (same level)

#### Intercept `dropEnterPredicate` Actions

Use `dropEnterPredicate` to control which drag operations are allowed:

```typescript
@Component({
  template: `
    <ngx-gantt-table [draggable]="true" [dropEnterPredicate]="canDrop">
      <!-- ... -->
    </ngx-gantt-table>
  `
})
export class MyComponent {
  canDrop = (context: GanttTableDragEnterPredicateContext) => {
    // Prevent dropping a task into itself
    if (context.source.id === context.target.id) {
      return false;
    }

    // Prevent dropping a parent task into its descendants
    if (this.isDescendant(context.target, context.source)) {
      return false;
    }

    // Only allow before and after, not inside
    if (context.dropPosition === 'inside') {
      return false;
    }

    return true;
  };

  private isDescendant(ancestor: GanttItem, descendant: GanttItem): boolean {
    // Check whether descendant is a descendant of ancestor
    // Implement logic...
    return false;
  }
}
```

### Column Drag to Change Width

Each column and the table as a whole support dragging to change widths. Changing the table width triggers the `resizeChange` event:

```typescript
@Component({
  template: `
    <ngx-gantt-table (resizeChange)="resizeChange($event)">
      <!-- ... -->
    </ngx-gantt-table>
  `
})
export class MyComponent {
  resizeChange(width: number) {
    console.log('Changed width', width);
  }
}
```

### Row Click and Selection

#### Row Click Event

```typescript
@Component({
  template: `
    <ngx-gantt-table (itemClick)="onItemClick($event)">
      <!-- ... -->
    </ngx-gantt-table>
  `
})
export class MyComponent {
  onItemClick(event: GanttTableItemClickEvent) {
    console.log('Clicked task', event.current);
    // Show task details
    this.showTaskDetail(event.current);
  }
}
```

#### Selection Feature

After enabling selection, clicking a row triggers selection:

```html
<ngx-gantt [items]="items" [selectable]="true" [multiple]="false" (selectedChange)="onSelectedChange($event)">
  <!-- ... -->
</ngx-gantt>
```

## Minimal Example

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttTableDragDroppedEvent } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-table',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table [draggable]="true" (dragDropped)="onDragDropped($event)">
        <ngx-gantt-column name="Task" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttTableComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];

  onDragDropped(event: GanttTableDragDroppedEvent) {
    // Handle drag drop logic
    this.reorganizeItems(event);
    // Immutable update
    this.items = [...this.items];
  }

  private reorganizeItems(event: GanttTableDragDroppedEvent) {
    // Implement drag-and-drop data reorganization logic
  }
}
```

## Common Questions

### Q: How do I disable dragging for a specific task?

**A:** Set the task's `itemDraggable: false`:

```typescript
{ id: '1', title: 'Task', itemDraggable: false }
```

### Q: How do I limit the drag range?

**A:** Use the `dropEnterPredicate` function:

```typescript
import { GanttTableDragEnterPredicateContext } from '@worktile/gantt';

canDrop = (context: GanttTableDragEnterPredicateContext) => {
  // Decide based on other business properties
  return context.target.origin?.status === 'active';
};
```

### Q: The data doesn’t update after dragging?

**A:** Make sure you use immutable data updates and create a new array.

## Related Links

- [Data Model](guides/core-concepts/data-model) - Learn the data structure
- [Bar Display and Interaction](guides/features/bar-interaction) - Learn task bar interactions
- [Tree Mode](guides/features/tree) - Learn the hierarchy structure
