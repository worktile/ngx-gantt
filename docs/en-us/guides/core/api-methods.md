---
title: Public Methods
path: 'api-methods'
order: 240
---

The ngx-gantt component instance provides several public methods to programmatically control the behavior of the Gantt chart.

## Method List

| Method                 | Parameters                          | Return Value                | Description                                              |
| ---------------------- | ----------------------------------- | --------------------------- | -------------------------------------------------------- |
| `scrollToToday()`      | -                                   | `void`                      | Scroll to today's position                               |
| `scrollToDate(date)`   | `date: number \| Date \| GanttDate` | `void`                      | Scroll to the specified date                             |
| `expandAll()`          | -                                   | `void`                      | Expand all groups and task items                         |
| `collapseAll()`        | -                                   | `void`                      | Collapse all groups and task items                       |
| `expandGroup(group)`   | `group: GanttGroupInternal`         | `void`                      | Expand or collapse the specified group                   |
| `expandChildren(item)` | `item: GanttItemInternal`           | `void`                      | Expand or collapse the child tasks of the specified item |
| `getGanttItem(id)`     | `id: string`                        | `GanttItemInternal \| null` | Get the task item by ID                                  |
| `getGanttItems(ids)`   | `ids: string[]`                     | `GanttItemInternal[]`       | Get multiple task items by an array of IDs               |
| `isSelected(id)`       | `id: string`                        | `boolean`                   | Check whether the specified task item is selected        |
| `rerenderView()`       | -                                   | `void`                      | Re-render the view (calls `changeView`)                  |

## Example

```typescript
import { Component, viewChild } from '@angular/core';
import { NgxGanttComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>

    <button (click)="gantt()?.scrollToToday()">Back to Today</button>
  `
})
export class GanttExampleComponent {
  gantt = viewChild<NgxGanttComponent>('gantt');

  viewType = GanttViewType.month;
  items: GanttItem[] = [{ id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 }];

  // Scroll to a specific date
  scrollToDate() {
    this.gantt()?.scrollToDate(1627729997);
  }

  // Get the task item
  getTask() {
    const item = this.gantt()?.getGanttItem('1');
    if (item) {
      console.log(item.origin);
    }
  }

  // Check whether it is selected
  checkSelected() {
    const selected = this.gantt()?.isSelected('1');
    console.log('Is selected:', selected);
  }

  // Expand/collapse the child tasks of an item
  toggleChildren(itemId: string) {
    const item = this.gantt()?.getGanttItem(itemId);
    if (item) {
      this.gantt()?.expandChildren(item);
    }
  }

  // Expand/collapse the group
  toggleGroup(groupId: string) {
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

- [Data Model](guides/core-concepts/data-model) - Learn the structure of `GanttItem` and `GanttGroup`
- [Group Feature](guides/features/groups) - Learn how to use group mode
