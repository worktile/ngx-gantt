---
title: 主题与样式
path: 'theming'
order: 430
---

ngx-gantt 支持通过全局配置的 `styleOptions` 定义主题与样式，使用者可根据自身项目的品牌/设计风格调整配色与主题。

## 基础样式配置

对于基本样式配置（布局尺寸）和 Bar 颜色，可以直接通过 `styleOptions` 的顶层属性实现：

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        styleOptions: {
          primaryColor: '#ff6b6b', // Bar 颜色，优先级高于主题配置 primary 颜色
          headerHeight: 50, // 日历头部高度（px）
          rowHeight: 50, // 任务行高度（px）
          barHeight: 24 // 任务条高度（px）
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```

## 自定义主题

如果需要更细致的颜色控制（如背景色、文本色、灰阶等），可以通过修改默认主题或定义多个主题来实现。

### 如何修改默认主题

在全局配置中通过 `styleOptions.themes` 修改默认主题，可以只定义需要修改的颜色，未定义的颜色会使用默认值：

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        styleOptions: {
          defaultTheme: 'default', // 指定默认主题
          themes: {
            default: {
              primary: '#6698ff',
              background: '#ffffff',
              text: {
                main: '#333333',
                muted: '#888888'
              }
            }
          }
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```

### 定义多个主题

可以定义多套主题，通过 `defaultTheme` 指定当前使用的主题：

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        styleOptions: {
          defaultTheme: 'dark',
          themes: {
            default: {
              primary: '#6698ff',
              background: '#ffffff',
              text: {
                main: '#333333',
                muted: '#888888'
              }
            },
            dark: {
              primary: '#4a90e2',
              background: '#1a1a1a',
              text: {
                main: '#ffffff',
                muted: '#aaaaaa'
              }
            }
          }
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```

### 主题配置说明

```typescript
interface Theme {
  primary?: string; // 主色：Bar、选中高亮等
  danger?: string; // 危险色：关联关系冲突
  highlight?: string; // 高亮色：今日高亮显示
  background?: string; // 背景色：甘特主区域、表格背景
  text?: {
    main?: string; // 主要文本（表格、时间刻度）
    muted?: string; // 次要文本（辅助信息、弱化文字）
    light?: string; // 浅色文本（禁用/弱提示）
    inverse?: string; // 反色文本（彩色背景/深色背景上的文字）
  };
  gray?: {
    100?: string; // 灰阶 100：行/背景浅分隔
    200?: string; // 灰阶 200：网格/边框浅色
    300?: string; // 灰阶 300：弱分隔线
    400?: string; // 灰阶 400：常规分隔线
    500?: string; // 灰阶 500：强调分隔/边框
    600?: string; // 灰阶 600：更深的强调元素
  };
}
```

- 所有颜色属性均为可选，可根据需要部分修改
- 未提供的颜色属性会与默认值进行深度合并，保留默认配置
- 颜色值支持 CSS 颜色格式：十六进制（`#6698ff`）

## 常见问题

### Q: 我只需要修改 Bar 颜色，最简单的方式？

**A:** 直接在全局 `styleOptions.primaryColor` 设置即可，无需改主题或 Sass：

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        styleOptions: {
          primaryColor: '#ff6b6b' // 全局 Bar 主色
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```
