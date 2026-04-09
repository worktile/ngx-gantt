---
title: Data Model
path: 'data-model'
order: 210
---

The data model is the core foundation of ngx-gantt. Understanding the structure of `GanttItem` and `GanttGroup` is the prerequisite for using the component.

## GanttItem

`GanttItem` is the data interface for task items. It defines all properties of a task:

```typescript
interface GanttItem {
  id: string; // Unique identifier (required)
  title: string; // Task title (required)
  start?: number | Date; // Start time (Unix timestamp or Date)
  end?: number | Date; // End time (Unix timestamp or Date)
  group_id?: string; // Associated group ID (group mode)
  children?: GanttItem[]; // Child tasks array (tree mode)
  links?: (GanttLink | string)[]; // Dependency relationships
  color?: string; // Custom color
  barStyle?: Partial<CSSStyleDeclaration>; // Task bar style
  laneStyle?: Partial<CSSStyleDeclaration>; // Task row style
  type?: GanttItemType; // Task type: bar | range | custom
  progress?: number; // Progress percentage (0-1)
  draggable?: boolean; // Whether it is draggable (default true)
  itemDraggable?: boolean; // Whether it can be dragged in the table
  linkable?: boolean; // Whether links can be created (default true)
  expandable?: boolean; // Whether it can be expanded (auto-detected)
  expanded?: boolean; // Whether it is expanded (default false)
  origin?: T; // Original business data (recommended)
}
```

### Required Fields

- `id`: the unique identifier for the task (must be unique)
- `title`: the display name of the task

### Time Fields

- `start`: supports Unix timestamps (seconds) or `Date` objects
- `end`: supports Unix timestamps (seconds) or `Date` objects
- If you provide only `start` or `end`, the component will automatically fill the default placeholder width

### Using `origin` to attach business data

We recommend using the `origin` field to store complete business data, so you can access the original data in event callbacks:

```typescript
interface MyBusinessData {
  taskId: string;
  assignee: string;
  priority: number;
  // ... other business fields
}

const items: GanttItem[] = [
  {
    id: '1',
    title: 'Task 1',
    start: 1627729997,
    end: 1628421197,
    origin: {
      taskId: 'TASK-001',
      assignee: 'John Doe',
      priority: 1
    } as MyBusinessData
  }
];

// Access in event callbacks
dragEnded(event: GanttDragEvent) {
  const businessData = event.item.origin as MyBusinessData;
  console.log(businessData.assignee); // 'John Doe'
}
```

## GanttGroup

`GanttGroup` is the data interface used in group mode, organizing tasks by groups:

```typescript
interface GanttGroup {
  id: string; // Group unique identifier (required)
  title: string; // Group title (required)
  expanded?: boolean; // Whether it is expanded by default (default true)
  class?: string; // Custom CSS class name
  origin?: T; // Original business data
}
```

## Organizing Data in Group and Tree Modes

ngx-gantt supports two ways of organizing data, suitable for different business scenarios:

### Group Mode (Group + items)

Use `groups` and `items` to define groups and tasks respectively, and associate them via `group_id`:

```typescript
const groups: GanttGroup[] = [
  { id: 'group1', title: 'Development Team' },
  { id: 'group2', title: 'QA Team' }
];

const items: GanttItem[] = [
  { id: '1', title: 'Frontend Development', group_id: 'group1', start: 1627729997, end: 1628421197 },
  { id: '2', title: 'Backend Development', group_id: 'group1', start: 1628507597, end: 1633345997 },
  { id: '3', title: 'Functional Testing', group_id: 'group2', start: 1633433997, end: 1636035597 }
];
```

### Tree Mode (Children)

Use the `children` property to build a hierarchical structure:

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'Project Kickoff',
    start: 1627729997,
    end: 1633345997,
    children: [
      {
        id: '1-1',
        title: 'Requirements Analysis',
        start: 1627729997,
        end: 1628421197,
        children: [{ id: '1-1-1', title: 'Requirements Research', start: 1627729997, end: 1627902797 }]
      },
      {
        id: '1-2',
        title: 'Technology Selection',
        start: 1628507597,
        end: 1630667597
      }
    ]
  }
];
```

## Data Updates

ngx-gantt uses the OnPush change detection strategy and requires immutable data updates:

### ❌ Wrong Example (mutable update)

```typescript
// Wrong: directly modifying the original object
dragEnded(event: GanttDragEvent) {
  event.item.start = newDate; // Does not trigger view updates
  event.item.end = newDate;
}
```

### ✅ Correct Example (immutable update)

```typescript
dragEnded(event: GanttDragEvent) {
  this.items = [...this.items];
}
```

## Minimal Example

### Basic Task List

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-basic',
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
export class GanttBasicComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];
}
```

### Group Mode Example

```typescript
const groups: GanttGroup[] = [
  { id: 'g1', title: 'Development Team' },
  { id: 'g2', title: 'QA Team' }
];

const items: GanttItem[] = [
  { id: '1', title: 'Frontend Development', group_id: 'g1', start: 1627729997, end: 1628421197 },
  { id: '2', title: 'Backend Development', group_id: 'g1', start: 1628507597, end: 1633345997 },
  { id: '3', title: 'Functional Testing', group_id: 'g2', start: 1633433997, end: 1636035597 }
];
```

### Tree Mode Example

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'Project Stage',
    start: 1627729997,
    end: 1633345997,
    children: [
      { id: '1-1', title: 'Sub Task 1', start: 1627729997, end: 1627902797 },
      { id: '1-2', title: 'Sub Task 2', start: 1628507597, end: 1630667597 }
    ]
  }
];
```

## Common Questions

### Q: Why doesn’t the view update after modifying the data?

**A:** Make sure you update with immutable data, and create a new array instead of modifying the original array:

```typescript
// ✅ Correct
this.items = [...this.items, newItem];

// ❌ Wrong
this.items.push(newItem);
```

### Q: How to tell whether a task has child nodes?

**A:** Check the `children` array and the `expandable` property:

```typescript
// Method 1: Check directly on GanttItem
function hasChildren(item: GanttItem): boolean {
  return (item.children && item.children.length > 0) || item.expandable === true;
}

// Method 2: Get the internal object via getGanttItem (more accurate)
const internalItem = this.gantt()?.getGanttItem(itemId);
if (internalItem) {
  const hasChildren = internalItem.children.length > 0 || internalItem.expandable;
}
```

### Q: Can Group mode and Tree mode be used together?

**A:** Yes. When mixing them, make sure the data structure is clear.

### Q: Is the `origin` field required?

**A:** No, it’s not required, but it is strongly recommended so you can access the complete business data in event callbacks.

## Related Links

- [Tree Mode](guides/features/tree) - Learn the detailed usage of async loading
- [Date and Timezone](guides/core-concepts/date-timezone) - Learn how time fields are handled
- [Bar Display and Interaction](guides/features/bar-interaction) - Learn task bar interactions and event handling
