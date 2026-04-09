---
title: Group Mode
path: 'groups'
order: 320
---

ngx-gantt supports organizing tasks by groups. It is suitable for scenarios like managing tasks by dimensions such as departments, projects, and phases.

## How to Render Group Data?

In group mode, you organize data using two arrays: `groups` and `items`:

- `groups`: defines group information; each group contains `id` and `title`
- `items`: defines task items; associate each task with its group via `group_id`

```typescript
import { Component } from '@angular/core';
import { GanttGroup, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [groups]="groups" [items]="items" [viewType]="viewType">
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
export class GroupsExampleComponent {
  viewType = GanttViewType.month;

  groups: GanttGroup[] = [
    { id: 'dev', title: 'Development Team' },
    { id: 'test', title: 'QA Team' }
  ];

  items: GanttItem[] = [
    { id: '1', title: 'Frontend Development', group_id: 'dev', start: 1627729997, end: 1628421197 },
    { id: '2', title: 'Backend Development', group_id: 'dev', start: 1628507597, end: 1633345997 },
    { id: '3', title: 'Functional Testing', group_id: 'test', start: 1633433997, end: 1636035597 }
  ];
}
```

## Custom Templates

### #groupHeader Template

Use the `#groupHeader` template to customize what is displayed in the group header:

```html
<ngx-gantt [groups]="groups" [items]="items">
  <ng-template #groupHeader let-group="group">
    <div class="custom-group-header">
      <span class="group-icon">📁</span>
      <span class="group-title">{{ group.title }}</span>
      <span class="group-count">({{ group.items?.length || 0 }} tasks)</span>
    </div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

### #group Template

Use the `#group` template to customize the entire group display (including the header and content area):

```html
<ngx-gantt [groups]="groups" [items]="items">
  <ng-template #group let-group="group" let-items="items">
    <div class="custom-group">
      <div class="group-header">{{ group.title }}</div>
      <div class="group-content">
        <!-- Group content -->
      </div>
    </div>
  </ng-template>

  <ngx-gantt-table>
    <!-- ... -->
  </ngx-gantt-table>
</ngx-gantt>
```

Template context:

- `#groupHeader`: provides the `group` object (including `id`, `title`, `expanded`, `items`, etc.)
- `#group`: provides the `group` object and the `items` array (the task array under the group)

## Custom Group Styling

Add a custom CSS class to groups via the `class` attribute:

```typescript
const groups: GanttGroup[] = [
  {
    id: 'dev',
    title: 'Development Team',
    class: 'group-dev'
  },
  {
    id: 'test',
    title: 'QA Team',
    class: 'group-test'
  }
];
```

## Expand / Collapse

### Initial Expanded State

Control the initial expanded state of each group using the `expanded` property:

```typescript
const groups: GanttGroup[] = [
  { id: 'dev', title: 'Development Team', expanded: true }, // Default expanded
  { id: 'test', title: 'QA Team', expanded: false } // Default collapsed
];
```

### Programmatic Control

Use ngx-gantt's public methods to control group expand/collapse programmatically:

```typescript
import { Component, viewChild } from '@angular/core';
import { NgxGanttComponent, GanttGroup, GanttItem } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [groups]="groups" [items]="items">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class GroupsComponent {
  gantt = viewChild<NgxGanttComponent>('gantt');

  groups: GanttGroup[] = [
    { id: 'dev', title: 'Development Team' },
    { id: 'test', title: 'QA Team' }
  ];

  items: GanttItem[] = [{ id: '1', title: 'Frontend Development', group_id: 'dev', start: 1627729997, end: 1628421197 }];

  expandAll() {
    this.gantt()?.expandAll();
  }

  collapseAll() {
    this.gantt()?.collapseAll();
  }

  expandGroup(groupId: string) {
    const gantt = this.gantt();
    if (gantt) {
      const group = gantt.groups.find((g) => g.id === groupId);
      if (group) {
        gantt.expandGroup(group);
      }
    }
  }
}
```

## Related Links

- [Data Model](guides/core-concepts/data-model) - Learn the data structure of `GanttGroup`
- [Public Methods](guides/core-concepts/api-methods) - Learn API methods related to groups
