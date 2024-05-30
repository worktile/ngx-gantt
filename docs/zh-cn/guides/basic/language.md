---
title: 多语言
subtitle: I18n
order: 60
---

`ngx-gantt` 中的文案都是视图日历中的日期展示，我们提供了自定义这些日期格式的两种方式。

第一种是注入[全局配置](/guides/configuration/global)，这种方式可以全局修改甘特图日历中的日期格式，注入全局配置方式如下：

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

另一种方式则是通过 `viewOptions` 传参进行局部甘特图日期格式修改，实现方式如下：

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

`ngx-gantt` 创建视图时会根据这些配置或参数基于 [date-fns](https://date-fns.org/v2.28.0/docs/format) 的 `format` 方法得出日历中的日期格式，更多格式请参考 [date-fns](https://date-fns.org/v2.28.0/docs/format) 官方文档。
