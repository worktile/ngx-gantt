---
title: 全局配置
path: 'configuration'
order: 400
---

全局配置通过 `GANTT_GLOBAL_CONFIG` Token 提供，用于设置应用级别的默认配置，包括时区、样式和链接选项。

## 配置结构

`GanttGlobalConfig` 配置说明：

```typescript
interface GanttGlobalConfig {
  locale?: GanttI18nLocale | string; // 默认语言 ID（详见国际化文档）
  dateOptions?: {
    timeZone?: string; // 时区，如 'Asia/Shanghai'、'UTC'
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 周起始日：0=周日，1=周一 ...
  };
  linkOptions?: {
    dependencyTypes?: GanttLinkType[]; // 允许的依赖类型
    showArrow?: boolean; // 是否显示箭头
    lineType?: 'curve' | 'straight'; // 连线类型：曲线/直线
  };
  styleOptions?: {
    primaryColor?: string; // 主色调
    headerHeight?: number; // 日历头部高度（px）
    rowHeight?: number; // 行高（px）
    barHeight?: number; // 任务条高度（px）
    defaultTheme?: string; // 默认主题名称
    themes?: Record<string, any>; // 主题配置对象，详见主题化文档
  };
}
```

### 默认配置

```typescript
const defaultConfig: GanttGlobalConfig = {
  locale: 'zh-hans',
  linkOptions: {
    dependencyTypes: [GanttLinkType.fs],
    showArrow: false,
    lineType: 'curve'
  },
  styleOptions: {
    primaryColor: '#6698ff',
    headerHeight: 44,
    rowHeight: 44,
    barHeight: 22,
    defaultTheme: 'default',
    themes: {
      default: {
        primary: '#6698ff',
        danger: '#FF7575',
        highlight: '#ff9f73',
        background: '#ffffff',
        text: {
          main: '#333333',
          muted: '#888888',
          light: '#aaaaaa',
          inverse: '#ffffff'
        },
        gray: {
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#f3f3f3',
          400: '#eeeeee',
          500: '#dddddd',
          600: '#cacaca'
        }
      }
    }
  },
  dateOptions: {
    weekStartsOn: 1
  }
};
```

## 注册全局配置

### Standalone 方式

```typescript
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';

bootstrapApplication(AppComponent, {
  providers: [
    ...,
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
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
  ]
}).catch(err => console.error(err));
```

### NgModule 方式

```typescript
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';

@NgModule({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
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

## 相关链接

- [国际化配置](guides/configuration/i18n) - 内置语言包、自定义语言包、语言切换
- [主题样式配置](guides/configuration/theming) - 基础样式配置、自定义主题、多主题支持
