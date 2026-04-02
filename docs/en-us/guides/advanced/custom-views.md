---
title: Custom Views
path: 'custom-views'
order: 510
---

When the built-in 6 view types cannot meet your needs, you can create a custom view by extending the `GanttView` abstract class.

## When Do You Need a Custom View?

**Use cases:**

- You need special time granularity (e.g., a biweekly view or a bimonthly view)
- You need special time range calculation logic

**Not suitable for:**

- You only need to adjust view styles (use CSS)
- You only need to adjust time formats (use `viewOptions.tickFormats`)

## Implement a Custom View

The following example implements a biweekly view (2 weeks per period, 1 week per unit):

```typescript
import {
  GanttView,
  GanttViewOptions,
  PERIOD_TICK_TOP,
  UNIT_TICK_TOP,
  GanttViewDate,
  GanttDate,
  eachWeekOfInterval,
  GanttViewTick
} from '@worktile/gantt';

// Default view options
const defaultViewOptions: GanttViewOptions = {
  unitWidth: 200, // Unit width (px). Here the unit is a week.
  start: new GanttDate().startOfYear().startOfWeek({ weekStartsOn: 1 }), // View start time
  end: new GanttDate().endOfYear().endOfWeek({ weekStartsOn: 1 }), // View end time
  loadDuration: {
    amount: 3,
    unit: 'month' // Load duration: 3 months
  }
};

export class GanttViewBiweekly extends GanttView {
  // Show the "now" indicator
  override showNowIndicator = true;

  // View type (custom string)
  override viewType = 'biweekly';

  constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
    // Merge default options and the passed options
    super(start, end, Object.assign({}, defaultViewOptions, options));
  }

  /**
   * Return the start date of the range containing the specified date
   * Biweekly view: return the start of the biweekly period that contains the date (a period = every 2 weeks)
   */
  rangeStartOf(date: GanttDate) {
    const weekStart = date.startOfWeek({ weekStartsOn: 1 }); // First find the start of the week
    const weekNumber = weekStart.getWeek({ weekStartsOn: 1 }); // Get the week number
    // If it's an odd week, step back one week; otherwise it's the current week
    const offset = (weekNumber - 1) % 2; // 0 or 1
    return weekStart.addWeeks(-offset); // Return to the start of the biweekly period
  }

  /**
   * Return the end date of the range containing the specified date
   * Biweekly view: return the end of the biweekly period that contains the date
   */
  rangeEndOf(date: GanttDate) {
    const rangeStart = this.rangeStartOf(date);
    return rangeStart.addWeeks(2).addDays(-1); // End of the biweekly period (the day before 2 weeks later)
  }

  /**
   * Return the width of a period (px)
   * Biweekly view: a period is 2 weeks, so the width is 2 unit widths
   */
  getPeriodWidth() {
    return this.getUnitWidth() * 2; // 2 weeks = 2 unit widths
  }

  /**
   * Return the width of a specific date (px)
   * Biweekly view: one day width is unit width / 7 (7 days per week)
   */
  getDayWidth(date: GanttDate): number {
    return this.unitWidth / 7; // Unit is week; 7 days in a week
  }

  /**
   * Return the array of period ticks
   * Period ticks are displayed at the top of the view to identify biweekly periods
   */
  getPeriodTicks(): GanttViewTick[] {
    // Get all weeks in the view range
    const weeks = eachWeekOfInterval(
      {
        start: this.start.value,
        end: this.end.addSeconds(1).value
      },
      { weekStartsOn: 1 }
    );

    const ticks: GanttViewTick[] = [];
    const periodWidth = this.getPeriodWidth();

    // Generate a period tick every 2 weeks
    for (let i = 0; i < weeks.length; i += 2) {
      const weekStart = new GanttDate(weeks[i]);
      const rectX = (i / 2) * periodWidth;

      // Create the period tick object
      const tick = new GanttViewTick({
        date: weekStart,
        rect: {
          x: rectX, // X coordinate
          width: periodWidth // Width (2 weeks)
        },
        label: {
          text: `${weekStart.format('MM/dd')} - ${weekStart.addWeeks(2).addDays(-1).format('MM/dd')}`, // Show the biweekly range
          y: PERIOD_TICK_TOP, // Y coordinate (period tick position)
          x: rectX + periodWidth / 2 // Center the label
        }
      });
      ticks.push(tick);
    }

    return ticks;
  }

  /**
   * Return the array of unit ticks
   * Unit ticks are displayed at the bottom of the view to identify each week
   */
  getUnitTicks(): GanttViewTick[] {
    // Get all weeks in the view range
    const weeks = eachWeekOfInterval(
      {
        start: this.start.value,
        end: this.end.addSeconds(1).value
      },
      { weekStartsOn: 1 }
    );

    const ticks: GanttViewTick[] = [];
    const unitWidth = this.getUnitWidth();

    // Iterate through all weeks and generate unit ticks
    for (let i = 0; i < weeks.length; i++) {
      const weekStart = new GanttDate(weeks[i]);
      const rectX = i * unitWidth;

      // Create the unit tick object
      const tick = new GanttViewTick({
        date: weekStart,
        rect: {
          x: rectX, // X coordinate
          width: unitWidth // Width (1 week)
        },
        label: {
          text: `Week ${weekStart.getWeek({ weekStartsOn: 1 })}`, // Show the week number
          y: UNIT_TICK_TOP, // Y coordinate (unit tick position)
          x: rectX + unitWidth / 2 // Center the label
        }
      });
      ticks.push(tick);
    }

    return ticks;
  }
}
```

## Register and Use Custom Views

### Register a Custom View

Use the `registerView` function to register a custom view. It is recommended to register it when the app starts:

```typescript
import { registerView } from '@worktile/gantt';
import { GanttViewCustom } from './custom-day-view';

// Register at app startup (e.g., main.ts or app.component.ts)
registerView('biweekly', GanttViewBiweekly);
```

### Use the Custom View

After registering, use the custom view via the `viewType` attribute in your component:

```typescript
import { Component } from '@angular/core';
import { GanttItem } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="'biweekly'">
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
  items: GanttItem[] = [{ id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 }];
}
```

### Override Built-in Views

To override a built-in view, use the same `GanttViewType` value:

```typescript
import { registerView, GanttViewType } from '@worktile/gantt';
import { GanttViewBiweekly } from './biweekly-view';

// Override the built-in week view
registerView(GanttViewType.week, GanttViewBiweekly);
```

## Common Questions

### Q: The custom view is not displayed?

**A:** Check:

1. Whether you called `registerView` to register the view
2. Whether the registered `viewType` matches the `viewType` you are using
3. Whether all required methods have been implemented
