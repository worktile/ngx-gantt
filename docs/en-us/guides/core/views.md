---
title: Views
path: 'views'
order: 220
---

Views are the most core part of the ngx-gantt component. ngx-gantt comes with 6 built-in views. Developers can choose the appropriate view for their scenario and personalize it via `viewOptions`. If the built-in views can’t meet your needs, you can also implement custom views.

## Using Views

ngx-gantt supports configuring views through `viewType` and `viewOptions`:

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [viewOptions]="viewOptions">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  viewType: GanttViewType = GanttViewType.day;
  viewOptions: GanttViewOptions = {
    // View configuration options
  };
}
```

## View Types

ngx-gantt provides 6 built-in view types for different time-granularity needs:

```typescript
enum GanttViewType {
  hour = 'hour', // Hour view
  day = 'day', // Day view
  week = 'week', // Week view
  month = 'month', // Month view
  quarter = 'quarter', // Quarter view
  year = 'year' // Year view
}
```

### View Display Notes

The time axis ticks are displayed in two layers:

- **Period ticks** (top): used for grouping/identifiers, e.g. "2021-07"
- **Unit ticks** (bottom): used for specific time points, e.g. "31"

| View Type | Period Ticks (Level 1)         | Unit Ticks (Level 2) | Drag Precision |
| --------- | ------------------------------ | -------------------- | -------------- |
| `hour`    | Grouped by day (M month d day) | Hour: minute (HH:mm) | `minute`       |
| `day`     | Grouped by month (yyyy-MM)     | Date (d)             | `day`          |
| `week`    | Grouped by year (yyyy)         | Week number (week w) | `day`          |
| `month`   | Grouped by quarter (yyyy-Q)    | Month (M)            | `day`          |
| `quarter` | Grouped by year (yyyy)         | Quarter (yyyy-Q)     | `day`          |
| `year`    | -                              | Year (yyyy)          | `day`          |

## ViewOptions Configuration

`GanttViewOptions` provides many view configuration options:

```typescript
interface GanttViewOptions {
  start?: GanttDate; // Custom start time
  end?: GanttDate; // Custom end time
  minBoundary?: GanttDate; // Minimum boundary (default: current year - 1)
  maxBoundary?: GanttDate; // Maximum boundary (default: current year + 1)
  unitWidth?: number; // Width of a single time unit (px)
  loadDuration?: {
    // Scroll loading time span
    amount: number;
    unit: GanttDateUtil;
  };
  tickFormats?: {
    // Tick formatting
    period: string; // Period tick format
    unit: string; // Unit tick format
  };
  dragTooltipFormat?: string; // Drag tooltip format
  holiday?: {
    // Holiday configuration (currently only supported in the day view)
    isHoliday: (date: GanttDate) => boolean;
    hideHoliday: boolean;
  };
  [key: string]: any; // Custom options
}
```

## Tick Formatting (tickFormats)

Use `tickFormats` to customize the format of time ticks. You can configure `period` (period ticks) and `unit` (unit ticks) with `date-fns` format strings:

```typescript
const viewOptions: GanttViewOptions = {
  tickFormats: {
    period: 'yyyy-MM', // Period ticks (e.g., 2021-07)
    unit: 'dd' // Unit ticks (e.g., 31)
  }
};
```

## Drag Tooltip Format (dragTooltipFormat)

Use `dragTooltipFormat` to customize the date format shown in the drag tooltip:

```typescript
const viewOptions: GanttViewOptions = {
  dragTooltipFormat: 'MM-dd HH:mm' // Default 'MM-dd'
};
```

## Scroll Loading Configuration (loadDuration)

When horizontal scroll loading is enabled, the time span added on each scroll differs by view. You can configure it via `loadDuration`:

```typescript
const viewOptions: GanttViewOptions = {
  loadDuration: {
    amount: 1,
    unit: 'month' // 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
  }
};
```

When the user scrolls to the boundary, the time range expands automatically. For example:

- `amount: 3, unit: 'month'` - load 3 months each time
- `amount: 1, unit: 'week'` - load 1 week each time

## Holiday Configuration (holiday)

Configure whether to show/hide holidays. **Currently only the day view supports it**:

```typescript
const viewOptions: GanttViewOptions = {
  holiday: {
    isHoliday: (date: GanttDate) => {
      // Determine whether it is a holiday
      return date.isWeekend() || isHoliday(date.value);
    },
    hideHoliday: false // Whether to hide the holiday column; if true, it won’t be displayed but still takes space
  }
};
```

- `isHoliday`: a function that receives a `GanttDate` and returns a `boolean` indicating whether it is a holiday
- `hideHoliday`: whether to hide the holiday column; when `true`, the holiday column is not shown but still occupies space

## Minimal Example

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttViewOptions, GanttDate } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-view',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [viewOptions]="viewOptions">
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
export class GanttViewComponent {
  viewType = GanttViewType.day;

  viewOptions: GanttViewOptions = {
    // Custom time range
    start: new GanttDate('2021-01-01'),
    end: new GanttDate('2021-12-31'),
    minBoundary: new GanttDate('2020-01-01'),
    maxBoundary: new GanttDate('2022-12-31'),

    // Unit width
    unitWidth: 35,

    // Tick formatting
    tickFormats: {
      period: 'yyyy-MM',
      unit: 'dd'
    },

    // Drag tooltip format
    dragTooltipFormat: 'MM-dd HH:mm',

    // Scroll loading configuration
    loadDuration: {
      amount: 3,
      unit: 'month'
    },

    // Holiday configuration (supported in day view only)
    holiday: {
      isHoliday: (date: GanttDate) => {
        return date.isWeekend();
      },
      hideHoliday: false
    }
  };

  items: GanttItem[] = [
    {
      id: '1',
      title: 'Task 1',
      start: 1627729997,
      end: 1628421197
    }
  ];
}
```

## Common Questions

### Q: How do I implement a custom view?

**A:** Refer to [Custom Views](guides/advanced/custom-views). Extend the `GanttView` abstract class and implement the necessary methods.

## Related Links

- [Custom Views](guides/advanced/custom-views) - Learn how to create a custom view type
- [Toolbar](guides/features/toolbar) - Understand the UI implementation of view switching
- [Date and Timezone](guides/core-concepts/date-timezone) - Understand the basics of time handling
