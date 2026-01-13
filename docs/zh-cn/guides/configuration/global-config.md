---
title: 全局配置
path: 'global-config'
order: 410
---

# 全局配置

全局配置通过 `GANTT_GLOBAL_CONFIG` Token 提供，用于设置应用级别的默认配置，包括语言、时区、样式和链接选项。

## 前置阅读

在深入学习全局配置之前，建议先了解：

- [时间与时区](../core/date-timezone.md) - 理解时区配置
- [优先级原则](./priority.md) - 理解配置优先级

## 配置结构

`GanttGlobalConfig` 接口定义：

```typescript
interface GanttGlobalConfig {
  locale?: GanttI18nLocale | string; // 默认语言
  dateOptions?: GanttDateOptions; // 日期选项（时区、周起始日）
  linkOptions?: GanttLinkOptions; // 链接选项
  styleOptions?: GanttStyleOptions; // 样式选项
}
```

## 提供全局配置

### Standalone 方式

```typescript
import { Component } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig, GanttI18nLocale, GanttLinkType } from '@worktile/gantt';

@Component({
  selector: 'app-root',
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        locale: GanttI18nLocale.zhHans,
        dateOptions: {
          timeZone: 'Asia/Shanghai',
          weekStartsOn: 1
        },
        linkOptions: {
          dependencyTypes: [GanttLinkType.fs],
          showArrow: false,
          lineType: 'curve'
        },
        styleOptions: {
          primaryColor: '#6698ff',
          headerHeight: 44,
          rowHeight: 44,
          barHeight: 22
        }
      } as GanttGlobalConfig
    }
  ],
  template: `<ngx-gantt [items]="items"></ngx-gantt>`
})
export class AppComponent {}
```

### NgModule 方式

```typescript
import { NgModule } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';

@NgModule({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        locale: 'zh-hans',
        dateOptions: {
          timeZone: 'Asia/Shanghai',
          weekStartsOn: 1
        }
      } as GanttGlobalConfig
    }
  ]
})
export class AppModule {}
```

### 使用 Factory

如果需要动态配置，可以使用 `useFactory`：

```typescript
@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useFactory: () => {
        const userLocale = localStorage.getItem('locale') || 'zh-hans';
        return {
          locale: userLocale,
          dateOptions: {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            weekStartsOn: 1
          }
        } as GanttGlobalConfig;
      }
    }
  ]
})
export class AppComponent {}
```

## 配置项说明

### locale（语言）

设置默认语言：

```typescript
{
  locale: GanttI18nLocale.zhHans; // 或 'zh-hans'
}
```

支持的语言：

- `GanttI18nLocale.zhHans` / `'zh-hans'` - 简体中文
- `GanttI18nLocale.zhHant` / `'zh-hant'` - 繁体中文
- `GanttI18nLocale.enUs` / `'en-us'` - 英文
- `GanttI18nLocale.jaJp` / `'ja-jp'` - 日文
- `GanttI18nLocale.deDe` / `'de-de'` - 德文
- `GanttI18nLocale.ruRu` / `'ru-ru'` - 俄文

### dateOptions（日期选项）

```typescript
{
  dateOptions: {
    timeZone: 'Asia/Shanghai',  // 时区
    weekStartsOn: 1              // 周起始日：0=周日, 1=周一
  }
}
```

### linkOptions（链接选项）

```typescript
{
  linkOptions: {
    dependencyTypes: [GanttLinkType.fs],  // 允许的依赖类型
    showArrow: false,                      // 是否显示箭头
    lineType: 'curve'                      // 'curve' | 'straight'
  }
}
```

### styleOptions（样式选项）

```typescript
{
  styleOptions: {
    primaryColor: '#6698ff',    // 主色调
    headerHeight: 44,           // 头部高度
    rowHeight: 44,              // 行高
    barHeight: 22,              // 任务条高度
    defaultTheme: 'default',    // 默认主题
    themes: {                   // 主题配置
      default: {
        primary: '#6698ff',
        danger: '#FF7575',
        // ...
      }
    }
  }
}
```

## 合并策略

全局配置会与默认配置合并：

1. **浅合并**：`linkOptions` 和 `dateOptions` 使用 `Object.assign` 浅合并
2. **深度合并**：`styleOptions` 使用深度合并，特别是 `themes` 对象
3. **默认值**：未提供的配置项使用默认值

### 合并示例

```typescript
// 默认配置
defaultConfig = {
  locale: 'zh-hans',
  linkOptions: {
    dependencyTypes: [GanttLinkType.fs],
    showArrow: false
  }
};

// 全局配置
globalConfig = {
  linkOptions: {
    showArrow: true // 只覆盖 showArrow
  }
};

// 合并结果
mergedConfig = {
  locale: 'zh-hans',
  linkOptions: {
    dependencyTypes: [GanttLinkType.fs], // 保留默认值
    showArrow: true // 使用全局配置
  }
};
```

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig, GanttI18nLocale, GanttItem } from '@worktile/gantt';

@Component({
  selector: 'app-root',
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        locale: GanttI18nLocale.zhHans,
        dateOptions: {
          timeZone: 'Asia/Shanghai',
          weekStartsOn: 1
        }
      } as GanttGlobalConfig
    }
  ],
  template: `
    <ngx-gantt [items]="items">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class AppComponent {
  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];
}
```

## 常见问题

### Q: 全局配置不生效？

**A:** 检查：

1. 是否在应用启动时提供配置（AppComponent 或 AppModule）
2. Provider 是否正确注入
3. 配置对象结构是否正确

### Q: 如何动态修改配置？

**A:** 使用 `GanttConfigService`：

```typescript
import { GanttConfigService } from '@worktile/gantt';

constructor(private configService: GanttConfigService) {}

changeLocale(locale: string) {
  this.configService.setLocale(locale);
}
```

### Q: 组件级别配置会覆盖全局配置吗？

**A:** 会，组件级别的配置优先级更高。详见 [优先级原则](./priority.md)。

## 相关链接

- [优先级原则](./priority.md) - 了解配置优先级
- [国际化](./i18n.md) - 了解语言配置
- [主题化](./theming.md) - 了解样式配置
- [时间与时区](../core/date-timezone.md) - 了解时区配置
