---
title: Performance & Loading Status
path: 'performance'
order: 380
---

When handling large-scale task datasets, `ngx-gantt` ensures a smooth interaction experience through **list virtual scrolling** and **view scroll loading**.

## Core Mechanisms

- **List virtual scrolling**: only renders task rows visible within the current viewport. Even with thousands of items, the actual number of rendered DOM nodes stays very small.
- **View scroll loading**: by configuring time-axis boundaries and step size, it automatically loads the needed time interval when the user scrolls to the edge.

## List Virtual Scrolling

The Gantt chart uses virtual scrolling to support large lists, and virtual scrolling is enabled by default.

```html
<ngx-gantt [virtualScrollEnabled]="true"></ngx-gantt>
```

### Example: Load the Next Page When Scrolling to the Bottom

If your server does not return the full dataset in one response, you can implement Infinite Scroll by listening to `(virtualScrolledIndexChange)`. When the scroll approaches the bottom, load the next page:

```html
<ngx-gantt [items]="items" [loading]="loading" [loadingDelay]="200" (virtualScrolledIndexChange)="onVirtualScroll($event)">
  <ngx-gantt-table>
    <ngx-gantt-column name="Task Title" width="200px">
      <ng-template #cell let-item="item">{{ item.title }}</ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

```ts
import { Component } from '@angular/core';
import { GanttItem, GanttVirtualScrolledIndexChangeEvent } from '@worktile/gantt';

@Component({ ... })
export class GanttPerformanceExampleComponent {
  items: GanttItem[] = [];
  loading = false;

  onVirtualScroll(event: GanttVirtualScrolledIndexChangeEvent) {
    // When there are 10 items left before reaching the bottom, load the next page
    if (event.renderedRange.end + 10 >= event.count && !this.loading) {
      this.loadNextPage();
    }
  }

  loadNextPage() {
    this.loading = true;
    this.taskService.getTasks().subscribe(res => {
      this.items = [...this.items, ...res.data];
      this.loading = false;
    });
  }
}
```

## View Scroll Loading

By default, scroll loading is disabled. When the time span of the Gantt chart is very large, loading all time-axis data at once may impact performance. You can enable it by setting `disabledLoadOnScroll` to `false`. After enabling, when scrolling to the view boundary it will trigger view scroll loading:

```html
<ngx-gantt [disabledLoadOnScroll]="false"></ngx-gantt>
```

### Scroll Loading Mechanism

Depending on the view type, the scroll-loading time span (step size) is adjusted automatically. For example:

- Day view (Day): default expands by 1 month per load
- Month view (Month): default expands by 1 quarter per load

You can customize the step size via `viewOptions` → `loadDuration`, and limit the maximum time-axis range via `minBoundary` and `maxBoundary` (by default, it’s constrained to one year before and after the current year).

### Example: Load Data with View Scroll Loading

After enabling scroll loading, when the user drags the time axis to the edge, the `(loadOnScroll)` event is triggered. At this point, you can request data based on the new interval returned:

```html
<ngx-gantt
  [items]="items"
  [loading]="loading"
  [loadingDelay]="200"
  [disabledLoadOnScroll]="false"
  [viewOptions]="{
    loadDuration: { amount: 1, unit: 'month' },
    minBoundary: minDate,
    maxBoundary: maxDate
  }"
  (loadOnScroll)="onLoadOnScroll($event)"
>
</ngx-gantt>
```

```ts
import { GanttLoadOnScrollEvent } from '@worktile/gantt';

onLoadOnScroll(event: GanttLoadOnScrollEvent) {
  this.loading = true;
  // event.start and event.end are the newly added time range (Unix timestamps)
  this.taskService.getTasksByRange(event.start, event.end).subscribe(newItems => {
    this.items = [...this.items, ...newItems];
    this.loading = false;
  });
}
```

## Loading State Handling

With async data loading, good loading feedback improves the user experience. `ngx-gantt` provides a built-in Loader:

- **`loading`**: set to `true` to show the loading state.
- **`loadingDelay`**: delay time before showing the loader (unit: `ms`). If the data request returns within the delay, the loader will not be shown, which helps prevent loading animations flickering due to very fast responses.

## Related Links

- [Views](guides/core-concepts/views) - Learn about view types and configuration options
