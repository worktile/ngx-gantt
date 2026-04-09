---
title: Global Configuration
path: 'configuration'
order: 400
---

Global configuration is provided through the `GANTT_GLOBAL_CONFIG` token. It is used to set application-level defaults, including timezone, styling, and link options.

## Configuration Structure

`GanttGlobalConfig` configuration description:

```typescript
interface GanttGlobalConfig {
  locale?: GanttI18nLocale | string; // Default language ID (see internationalization documentation)
  dateOptions?: {
    timeZone?: string; // Timezone, e.g. 'Asia/Shanghai' or 'UTC'
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Week starts on: 0=Sunday, 1=Monday ...
  };
  linkOptions?: {
    dependencyTypes?: GanttLinkType[]; // Allowed dependency types
    showArrow?: boolean; // Whether to show arrows
    lineType?: 'curve' | 'straight'; // Link line type: curve/straight
  };
  styleOptions?: {
    primaryColor?: string; // Primary color
    headerHeight?: number; // Calendar header height (px)
    rowHeight?: number; // Row height (px)
    barHeight?: number; // Task bar height (px)
    defaultTheme?: string; // Default theme name
    themes?: Record<string, any>; // Theme configuration object (see theming documentation)
  };
}
```

### Default Configuration

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

## Register Global Configuration

### Standalone

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

### NgModule

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

## Related Links

- [Internationalization Configuration](guides/configuration/i18n) - built-in language packs, custom language packs, and language switching
- [Theming & Style Options](guides/configuration/theming) - base style settings, custom themes, and multi-theme support
