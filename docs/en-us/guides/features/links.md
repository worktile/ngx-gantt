---
title: Task Dependencies
path: 'task-links'
order: 360
---

Task dependencies are an important feature in project management. ngx-gantt supports creating dependency relationships between tasks by dragging.

## How to Display Dependency Data?

In the `ngx-gantt` component, set `[linkable]="true"` to enable the dependency feature. Then define dependency relationships in each task's `links` field:

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttLinkType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [linkable]="true">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: 'A', title: 'Design', start: 1627729997, end: 1628421197 },
    {
      id: 'B',
      title: 'Development',
      start: 1628507597,
      end: 1633345997,
      links: [{ type: GanttLinkType.fs, link: 'A' }] // Task B depends on Task A
    }
  ];
}
```

## Building Dependency Data

### Data Formats

Dependency data supports two formats: string format (simplified) and object format (full):

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: 'Task 1',
    // String format: defaults to `fs`
    links: ['2', '3']
  },
  {
    id: '2',
    title: 'Task 2',
    // Object format: specify dependency type and custom styling
    links: [
      { type: GanttLinkType.fs, link: '3' },
      { type: GanttLinkType.ff, link: '4', color: '#ff6b6b' }
    ]
  }
];
```

### Dependency Types

ngx-gantt supports 4 dependency types (`GanttLinkType`):

| Type                    | Description     | Typical Use Case                                                        |
| ----------------------- | --------------- | ----------------------------------------------------------------------- |
| `fs` (Finish-to-Start)  | Finish → Start  | After the previous task finishes, the next task can start (most common) |
| `ff` (Finish-to-Finish) | Finish → Finish | After the previous task finishes, the next task can also finish         |
| `ss` (Start-to-Start)   | Start → Start   | After the previous task starts, the next task can also start            |
| `sf` (Start-to-Finish)  | Start → Finish  | After the previous task starts, the next task can finish (less common)  |

```typescript
const items: GanttItem[] = [
  { id: 'A', title: 'Design', start: 1627729997, end: 1628421197 },
  {
    id: 'B',
    title: 'Development',
    links: [
      { type: GanttLinkType.fs, link: 'A' } // FS: Task A finishes → Task B can start
      // { type: GanttLinkType.ff, link: 'A' }, // FF: Task A finishes → Task B can finish
      // { type: GanttLinkType.ss, link: 'A' }, // SS: Task A starts → Task B can start
      // { type: GanttLinkType.sf, link: 'A' }  // SF: Task A starts → Task B can finish
    ]
  }
];
```

## Create Dependencies by Dragging

In addition to defining dependencies directly in data, you can create them by dragging the task bar.

### Drag Operations

1. Start dragging from the task bar's **left endpoint** (start time) or **right endpoint** (end time)
2. Drag to any position of the target task
3. Release the mouse to finish creating the dependency relationship

The component automatically determines the dependency type based on the drag start and end points:

- Drag from the end point to the start point → `fs` (Finish-to-Start)
- Drag from the end point to the end point → `ff` (Finish-to-Finish)
- Drag from the start point to the start point → `ss` (Start-to-Start)
- Drag from the start point to the end point → `sf` (Start-to-Finish)

### Event Handling

```typescript
@Component({
  template: `
    <ngx-gantt
      [items]="items"
      (linkDragStarted)="onLinkDragStarted($event)"
      (linkDragEnded)="onLinkDragEnded($event)"
      (lineClick)="onLineClick($event)"
    >
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];

  onLinkDragStarted(event: GanttLinkDragEvent) {
    console.log('Start creating dependency', event.source);
  }

  onLinkDragEnded(event: GanttLinkDragEvent) {
    // Update dependency data
    this.items = this.items.map((item) => {
      if (item.id === event.source.id) {
        return {
          ...item,
          links: [...(item.links || []), { type: event.type, link: event.target.id }]
        };
      }
      return item;
    });
  }

  onLineClick(event: GanttLineClickEvent) {
    console.log('Clicked dependency link', event.source, event.target);
    // Show dependency details or delete the dependency
  }
}
```

## Dependency Link Styling

### Custom Dependency Link Color

```typescript
links: [
  {
    type: GanttLinkType.fs,
    link: '2',
    color: {
      default: '#6698ff', // Default color
      active: '#ff6b6b' // Active/hover color
    }
  }
];
```

### Dependency Link Style Configuration

Configure link type and whether to show the arrow via `linkOptions`:

```typescript
linkOptions: {
  lineType: 'straight', // 'curve' (default, curve) | 'straight' (straight)
  showArrow: true       // Whether to show the arrow at the end of the link
}
```

## Dependency Configuration

Dependency configuration supports both global configuration and component-level configuration:

```typescript
// Global configuration
import { GANTT_GLOBAL_CONFIG } from '@worktile/gantt';

@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        linkOptions: {
          dependencyTypes: [GanttLinkType.fs], // Allowed dependency types
          showArrow: false,
          lineType: 'curve'
        }
      }
    }
  ]
})
export class AppComponent {}

// Component-level configuration
@Component({
  template: `
    <ngx-gantt [items]="items" [linkOptions]="linkOptions">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  linkOptions: GanttLinkOptions = {
    dependencyTypes: [GanttLinkType.fs, GanttLinkType.ff],
    showArrow: true,
    lineType: 'straight'
  };
}
```

## Full Example

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttLinkDragEvent, GanttLinkType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [linkable]="true" (linkDragEnded)="onLinkDragEnded($event)">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task" width="200px">
          <ng-template #cell let-item="item">{{ item.title }}</ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttLinksComponent {
  viewType = GanttViewType.day;
  items: GanttItem[] = [
    { id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Task 2', start: 1628507597, end: 1633345997 }
  ];

  onLinkDragEnded(event: GanttLinkDragEvent) {
    this.items = this.items.map((item) => {
      if (item.id === event.source.id) {
        return {
          ...item,
          links: [...(item.links || []), { type: event.type, link: event.target.id }]
        };
      }
      return item;
    });
  }
}
```

## Common Questions

### Q: How do I delete a dependency?

**A:** Remove the corresponding dependency from the task's `links` array:

```typescript
removeLink(itemId: string, targetId: string) {
  this.items = this.items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        links: item.links?.filter(link => {
          const linkId = typeof link === 'string' ? link : link.link;
          return linkId !== targetId;
        })
      };
    }
    return item;
  });
}
```

### Q: How do I restrict dependency creation to only certain types?

**A:** Specify the allowed types in `linkOptions.dependencyTypes`:

```typescript
linkOptions: {
  dependencyTypes: [GanttLinkType.fs]; // Only allow fs
}
```

### Q: Dependency links are not displayed?

**A:** Check:

1. Whether `linkable` is `true`
2. Whether the task's `linkable` property is `true` (default value)
3. Whether the task IDs referenced in the `links` array exist

## Related Links

- [Data Model](guides/core-concepts/data-model) - Learn the structure of the `links` field
- [Bar Display and Interaction](guides/features/bar-interaction) - Learn about task bar interactions
- [Global Configuration](guides/configuration) - Learn global configuration for dependencies
