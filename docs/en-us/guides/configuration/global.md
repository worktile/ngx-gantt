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
  locale: GanttI18nLocale; // i18n locale  zh-hans, zh-hant ,en-us, de-de, ja-jp, ru-ru
  dateOptions: {
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

  /** @deprecated dateFormat is deprecated, please configure through i18n. http://gantt.ngnice.com/guides/configuration/i18n */
  dateFormat?: {
    week?: string, // week w
    month?: string, // month M
    quarter?: string, // QQQ
    year?: string, // year yyyy
    yearMonth?: string, // yyyy年MM月
    yearQuarter?: string // yyyy年QQQ
  };
}
```

| Name                     | Type                                                     | Description                |
| ------------------------ | -------------------------------------------------------- | -------------------------- |
| locale                   | `zh-hans`, `zh-hant` ,`en-us`, `de-de`, `ja-jp`, `ru-ru` | global locale              |
| dateOptions              | `GanttDateOptions`                                       | Date configuration         |
| linkOptions              | `GanttLinkOptions`                                       | Relationship configuration |
| styleOptions             | `GanttStyles`                                            | Style configuration        |
| dateFormat `@deprecated` | `GanttDateFormat`                                        | Date format                |
