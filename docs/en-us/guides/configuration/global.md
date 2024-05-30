---
category: config
title: Global Config
---

`ngx-gantt` provides an injectable global configuration `GANTT_GLOBAL_CONFIG`. Users can inject custom formatted configurations into `Module` or `Component` to modify the global configuration.

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
},
linkOptions: {
...
},
styleOptions: {
...
},
}
},
...
]
...
})
export class AppModule {

}

```

`GANTT_GLOBAL_CONFIG` format is as follows:

```javascript
export interface GanttGlobalConfig {
  // dateFormat can be used to set the internationalization of the view, the format format is consistent with the date-fns format rule
  dateFormat?: {
    week?: string, // week w
    month?: string, // month M
    quarter?: string, // QQQ
    year?: string, // year yyyy
    yearMonth?: string, // yyyy年MM月
    yearQuarter?: string // yyyy年QQQ
  };
  dateOptions: {
    locale?: Locale, // time zone import { fr } from 'date-fns/locale';
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // set the week start value, the default is 1
  };
  linkOptions: {
    dependencyTypes?: GanttLinkType[], // fs | ff | ss | sf
    showArrow?: boolean, // whether the connecting line displays an arrow
    lineType?: GanttLinkLineType // connecting line type (curve or straight line)
  };
  styleOptions?: {
    headerHeight?: number, // custom header height
    lineHeight?: number, // custom line height
    barHeight?: number // custom Bar height
  };
}
```

| Name         | Type               | Description                                                       |
| ------------ | ------------------ | ----------------------------------------------------------------- |
| dateFormat   | `GanttDateFormat`  | Date format                                                       |
| dateOptions  | `GanttDateOptions` | Date configuration, can be used to configure the global time zone |
| linkOptions  | `GanttLinkOptions` | Relationship configuration                                        |
| styleOptions | `GanttStyles`      | Style configuration                                               |
