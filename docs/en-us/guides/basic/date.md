---
title: Date
order: 25
---

## Time format

`ngx-gantt` uniformly uses the 10-digit UnixTime format. The user needs to ensure that the date value passed in is UnixTime

## GanttDate

`ngx-gantt` provides the `GanttDate` class to handle time. The example is as follows:

```javascript
import { GanttDate } from 'ngx-gantt';

new GanttDate(new Date('2022-01-01 12:00:00')).getUnixTime(); //
new GanttDate(1617275597).addDays(1);
new GanttDate(1617275597).addHours(24).getDay();
new GanttDate(1617275597).format("yyyy年MM月");
...

```

For more information, please refer to [GanttDate](https://github.com/worktile/ngx-gantt/blob/master/packages/gantt/src/utils/date.ts)
