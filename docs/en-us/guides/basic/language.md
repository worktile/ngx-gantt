---
title: I18n
order: 60
---

The text in `ngx-gantt` is the date display in the view calendar. We provide two ways to customize these date formats.

The first is to inject [global configuration](/guides/configuration/global), which can globally modify the date format in the Gantt chart calendar. The method of injecting global configuration is as follows:

```javascript
import { GANTT_GLOBAL_CONFIG } from 'ngx-gantt';

@NgModule({
...
providers: [
{
provide: GANTT_GLOBAL_CONFIG,
useValue: {
dateFormat: {
...
}
}
},
...
]
...
})
export class AppModule {

}

```

Another method is to modify the local Gantt chart date format through `viewOptions` parameter passing, which is implemented as follows:

```html
<ngx-gantt [viewOptions]="viewOptions"> ... </ngx-gantt>
```

```javascript
@Component({
  selector: 'app-gantt-example',
  templateUrl: './gantt.component.html'
})
export class AppGanttExampleComponent {
  viewOptions: GanttViewOptions = {
    dateFormat: {
      yearQuarter: `QQQ 'of' yyyy`,
      month: 'LLLL',
      yearMonth: `LLLL yyyy'(week' w ')'`
    }
  };

  constructor() {}
}
```

`ngx-gantt` creates a view based on these configurations or parameters based on the `format` method of [date-fns](https://date-fns.org/v2.28.0/docs/format) to get the date format in the calendar. For more formats, please refer to the official documentation of [date-fns](https://date-fns.org/v2.28.0/docs/format).
