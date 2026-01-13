---
title: 主题与样式
path: 'theming'
order: 430
---

# 主题化

ngx-gantt 支持通过 SCSS 变量和运行时主题配置两种方式实现主题定制。

## 前置阅读

在深入学习主题化之前，建议先了解：

- [全局配置](./global-config.md) - 了解样式配置
- [优先级原则](./priority.md) - 了解配置优先级

## 两种主题化方式

1. **SCSS 变量覆盖**：编译时定制，适合固定主题
2. **运行时主题切换**：通过 `styleOptions.themes` 动态切换，适合多主题场景

## SCSS 变量覆盖

### 变量文件位置

主要变量定义在 `packages/gantt/src/styles/variables.scss`。

### 覆盖方式

在您的样式文件中覆盖变量：

```scss
// styles.scss
@use '@worktile/gantt/styles/index.scss' with (
  $color-primary: #ff6b6b,
  $gantt-header-height: 50px,
  $gantt-row-height: 50px,
  $gantt-bar-height: 24px
);
```

### 主要变量

#### 主题色变量

```scss
$color-primary: #6698ff; // 主色调
$color-danger: #ff7575; // 危险色
$color-highlight: #ff9f73; // 高亮色
$color-background: #ffffff; // 背景色
```

#### 文本颜色

```scss
$color-text-main: #333333; // 主文本色
$color-text-muted: #888888; // 次要文本色
$color-text-light: #aaaaaa; // 浅文本色
$color-text-inverse: #ffffff; // 反色文本
```

#### 布局变量

```scss
$gantt-header-height: 44px; // 头部高度
$gantt-row-height: 44px; // 行高
$gantt-bar-height: 22px; // 任务条高度
```

#### 灰度色阶

```scss
$color-gray-100: #fafafa;
$color-gray-200: #f5f5f5;
$color-gray-300: #f3f3f3;
$color-gray-400: #eeeeee;
$color-gray-500: #dddddd;
$color-gray-600: #cacaca;
```

### 完整覆盖示例

```scss
// custom-theme.scss
@use '@worktile/gantt/styles/index.scss' with (
  // 主题色
  $color-primary: #ff6b6b,
  $color-danger: #ff4757,
  $color-highlight: #ffa502,

  // 布局
  $gantt-header-height: 50px,
  $gantt-row-height: 50px,
  $gantt-bar-height: 24px,

  // 文本
  $color-text-main: #2c3e50,
  $color-text-muted: #7f8c8d
);
```

## 运行时主题切换

### 主题配置结构

```typescript
interface Theme {
  primary?: string;
  danger?: string;
  highlight?: string;
  background?: string;
  text?: {
    main?: string;
    muted?: string;
    light?: string;
    inverse?: string;
  };
  gray?: {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
  };
}
```

### 定义多个主题

```typescript
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';

const globalConfig: GanttGlobalConfig = {
  styleOptions: {
    defaultTheme: 'light',
    themes: {
      light: {
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
      },
      custom: {
        primary: '#ff6b6b',
        background: '#f8f9fa',
        text: {
          main: '#2c3e50',
          muted: '#7f8c8d'
        }
      }
    }
  }
};

@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: globalConfig
    }
  ]
})
export class AppComponent {}
```

### 切换主题

```typescript
import { GanttConfigService } from '@worktile/gantt';

@Component({
  template: `
    <button (click)="switchTheme('light')">浅色主题</button>
    <button (click)="switchTheme('dark')">深色主题</button>

    <ngx-gantt [items]="items" [styles]="currentStyleOptions">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  constructor(private configService: GanttConfigService) {}

  currentStyleOptions = {
    defaultTheme: 'light'
  };

  switchTheme(themeName: string) {
    this.currentStyleOptions = {
      defaultTheme: themeName
    };
  }
}
```

### 组件级别主题

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [styles]="componentStyles">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  componentStyles = {
    defaultTheme: 'custom',
    themes: {
      custom: {
        primary: '#ff6b6b',
        background: '#f8f9fa'
      }
    }
  };
}
```

## 主题合并策略

主题配置使用深度合并：

```typescript
// 默认主题
defaultTheme = {
  primary: '#6698ff',
  text: {
    main: '#333333',
    muted: '#888888'
  }
};

// 自定义主题
customTheme = {
  primary: '#ff6b6b',
  text: {
    main: '#2c3e50'
    // muted 使用默认值
  }
};

// 合并结果
mergedTheme = {
  primary: '#ff6b6b', // 使用自定义值
  text: {
    main: '#2c3e50', // 使用自定义值
    muted: '#888888' // 使用默认值
  }
};
```

## CSS 变量方式

ngx-gantt 支持通过 CSS 变量动态切换主题：

```scss
// 使用 CSS 变量
.gantt-container {
  --gantt-color-primary: #ff6b6b;
  --gantt-header-height: 50px;
  --gantt-row-height: 50px;
}
```

### CSS 变量列表

```scss
--gantt-color-primary
--gantt-color-danger
--gantt-color-highlight
--gantt-color-background
--gantt-color-text-main
--gantt-color-text-muted
--gantt-color-text-light
--gantt-color-text-inverse
--gantt-color-gray-100
--gantt-color-gray-200
--gantt-color-gray-300
--gantt-color-gray-400
--gantt-color-gray-500
--gantt-color-gray-600
--gantt-header-height
--gantt-row-height
--gantt-bar-height
```

### 动态切换示例

```typescript
@Component({
  template: `
    <div [class]="themeClass">
      <ngx-gantt [items]="items"></ngx-gantt>
    </div>
  `,
  styles: [
    `
      .light-theme {
        --gantt-color-primary: #6698ff;
        --gantt-color-background: #ffffff;
      }

      .dark-theme {
        --gantt-color-primary: #4a90e2;
        --gantt-color-background: #1a1a1a;
      }
    `
  ]
})
export class MyComponent {
  themeClass = 'light-theme';

  switchTheme(theme: string) {
    this.themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }
}
```

## 最小示例

### SCSS 变量覆盖

```scss
// styles.scss
@use '@worktile/gantt/styles/index.scss' with (
  $color-primary: #ff6b6b,
  $gantt-header-height: 50px
);
```

### 运行时主题

```typescript
import { Component } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GanttGlobalConfig, GanttItem } from '@worktile/gantt';

@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        styleOptions: {
          defaultTheme: 'custom',
          themes: {
            custom: {
              primary: '#ff6b6b',
              background: '#f8f9fa'
            }
          }
        }
      } as GanttGlobalConfig
    }
  ],
  template: `<ngx-gantt [items]="items"></ngx-gantt>`
})
export class AppComponent {
  items: GanttItem[] = [];
}
```

## 最佳实践

### 1. 选择合适的方式

- **固定主题**：使用 SCSS 变量覆盖
- **多主题切换**：使用运行时主题配置
- **动态切换**：使用 CSS 变量

### 2. 主题命名规范

```typescript
themes: {
  'light': { /* 浅色主题 */ },
  'dark': { /* 深色主题 */ },
  'brand': { /* 品牌主题 */ }
}
```

### 3. 保持颜色一致性

确保主题内的颜色搭配协调，遵循设计规范。

## 常见问题

### Q: SCSS 变量覆盖不生效？

**A:** 检查：

1. 是否使用 `@use ... with` 语法
2. 变量名是否正确
3. 样式文件是否被正确引入

### Q: 运行时主题切换不生效？

**A:** 检查：

1. `defaultTheme` 是否在 `themes` 中存在
2. 主题对象结构是否正确
3. 是否在组件级别覆盖了样式

### Q: 如何同时使用 SCSS 变量和运行时主题？

**A:** 可以同时使用，运行时主题会覆盖 SCSS 变量。

## 相关链接

- [全局配置](./global-config.md) - 了解样式配置
- [优先级原则](./priority.md) - 了解配置优先级
- [SCSS 变量文件](https://github.com/worktile/ngx-gantt/blob/master/packages/gantt/src/styles/variables.scss) - 查看所有变量
