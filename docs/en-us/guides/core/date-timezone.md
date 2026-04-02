---
title: Date and Timezone
path: 'date-timezone'
order: 230
---

ngx-gantt uses `date-fns` and `@date-fns/tz` to handle time. It provides a unified `GanttDate` class for time handling, supports timezone configuration, and accepts multiple time input formats.

## Time Input Formats

`GanttItem`'s `start` and `end` fields support the following formats:

```typescript
// 1. Unix timestamp (10-digit seconds or 13-digit milliseconds)
const items1: GanttItem[] = [
  {
    id: '1',
    title: 'Task',
    start: 1627729997, // 10-digit Unix timestamp (seconds)
    end: 1627729997000 // 13-digit Unix timestamp (milliseconds)
  }
];

// 2. Date object
const items2: GanttItem[] = [
  {
    id: '2',
    title: 'Task',
    start: new Date(1627729997 * 1000),
    end: new Date(1628421197 * 1000)
  }
];
```

## GanttDate Time Operations

`GanttDate` is a time utility class wrapped on top of `date-fns` and `@date-fns/tz`. It provides many time-related methods. You may choose to use it optionally; it is not required.

### Create a GanttDate

```typescript
import { GanttDate } from '@worktile/gantt';

// Current time
const now = new GanttDate();

// Create from Unix timestamp (seconds, 10 digits)
const date1 = new GanttDate(1627729997);

// Create from Unix timestamp (milliseconds, 13 digits)
const date2 = new GanttDate(1627729997000);

// Create from a Date object
const date3 = new GanttDate(new Date(1627729997 * 1000));

// Create from a string
const date4 = new GanttDate('2021-07-31');
```

### Time Operation Methods

```typescript
const date = new GanttDate(1627729997);

// Add/subtract time
date.addDays(7); // Add 7 days
date.addMonths(1); // Add 1 month
date.addYears(1); // Add 1 year
date.add(1, 'week'); // Add 1 week (generic method)

// Get time boundaries
date.startOfDay(); // Start of the day
date.endOfDay(); // End of the day
date.startOfWeek(); // Start of the week
date.endOfWeek(); // End of the week
date.startOfMonth(); // Start of the month
date.endOfMonth(); // End of the month
date.startOfQuarter(); // Start of the quarter
date.endOfQuarter(); // End of the quarter
date.startOfYear(); // Start of the year
date.endOfYear(); // End of the year

// Format (using date-fns format strings)
date.format('yyyy-MM-dd'); // '2021-07-31'
date.format('yyyy-MM-dd HH:mm:ss'); // '2021-07-31 12:00:00'

// Get Unix timestamp (seconds)
const timestamp = date.getUnixTime(); // 1627729997

// Check
date.isToday(); // Is today
date.isWeekend(); // Is weekend
```

## Timezone Configuration

Configure the global timezone and the week start day through `GANTT_GLOBAL_CONFIG`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateOptions: {
          timeZone: 'Asia/Shanghai', // Timezone
          weekStartsOn: 1 // Week starts on: 0=Sunday, 1=Monday
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```

### Timezone Notes

- `timeZone`: uses an IANA timezone identifier (e.g., `'Asia/Shanghai'`, `'America/New_York'`)
- All time calculations and displays are based on the configured timezone
- If not configured, the system default timezone is used

### Week Starts On

- `weekStartsOn`: 0-6 represent Sunday through Saturday
- Default value is `1` (Monday)
- Affects the display and calculation of the week view
