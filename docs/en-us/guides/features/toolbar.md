---
title: Toolbar
path: 'toolbar'
order: 390
---

The toolbar provides view-type switching, allowing users to quickly switch between different time granularities.

## Basic Usage

Enable the toolbar by setting `showToolbar` to `true`, and configure which view types are shown via `toolbarOptions`:

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttToolbarOptions, GanttView } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [showToolbar]="true"
      [toolbarOptions]="toolbarOptions"
      (viewChange)="onViewChange($event)"
    >
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  viewType = GanttViewType.day;

  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
  };

  items: GanttItem[] = [];

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

**Note:** The `viewChange` event is required. You must update the `viewType` property in the event handler for the view to actually switch.

## Custom Toolbar

Use the `#toolbar` template to fully customize the content and layout of the toolbar:

```typescript
import { Component, viewChild } from '@angular/core';
import { GanttItem, GanttViewType, NgxGanttComponent } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items" [viewType]="viewType" [showToolbar]="true">
      <ng-template #toolbar>
        <div class="custom-toolbar">
          <button *ngFor="let view of views" [class.active]="viewType === view.value" (click)="selectView(view.value)">
            {{ view.label }}
          </button>
          <button (click)="scrollToToday()">Today</button>
        </div>
      </ng-template>

      <ngx-gantt-table>
        <!-- ... -->
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class MyComponent {
  gantt = viewChild<NgxGanttComponent>('gantt');

  viewType = GanttViewType.day;

  views = [
    { label: 'Day', value: GanttViewType.day },
    { label: 'Week', value: GanttViewType.week },
    { label: 'Month', value: GanttViewType.month }
  ];

  items: GanttItem[] = [];

  selectView(viewType: GanttViewType) {
    this.viewType = viewType;
  }

  scrollToToday() {
    this.gantt()?.scrollToToday();
  }
}
```

**Note:** When using a custom template, you need to handle the view-switching logic yourself. If `toolbarOptions.viewTypes` is an empty array or not provided, the toolbar will not show any view-switching buttons.

## Style Customization

Override the default toolbar styles using CSS to customize its appearance:

```scss
:::ng-deep .gantt-toolbar {
  background: #f5f5f5;
  padding: 8px 16px;

  .toolbar-button {
    margin-right: 8px;
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    &.active {
      background: #6698ff;
      color: #fff;
      border-color: #6698ff;
    }
  }
}
```

## Minimal Example

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttToolbarOptions, GanttView } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-toolbar',
  template: `
    <ngx-gantt
      [items]="items"
      [viewType]="viewType"
      [showToolbar]="true"
      [toolbarOptions]="toolbarOptions"
      (viewChange)="onViewChange($event)"
    >
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
export class GanttToolbarComponent {
  viewType = GanttViewType.day;

  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.week, GanttViewType.month]
  };

  items: GanttItem[] = [{ id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 }];

  onViewChange(event: GanttView) {
    this.viewType = event.viewType;
  }
}
```

## Common Questions

### Q: Toolbar is not displayed?

**A:** Check the following:

1. Whether `showToolbar` is `true`
2. Whether `toolbarOptions.viewTypes` is not an empty array

```typescript
// ✅ Correct
<ngx-gantt [showToolbar]="true" [toolbarOptions]="toolbarOptions">
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.week]
};
```

### Q: The view switch doesn’t take effect?

**A:** Make sure you update the `viewType` property inside the `viewChange` event handler:

```typescript
onViewChange(event: GanttView) {
  this.viewType = event.viewType; // ✅ Must update
}
```

### Q: How to hide certain view types?

**A:** Include only the view types you want in `toolbarOptions.viewTypes`:

```typescript
toolbarOptions: GanttToolbarOptions = {
  viewTypes: [GanttViewType.day, GanttViewType.month]
};
```
