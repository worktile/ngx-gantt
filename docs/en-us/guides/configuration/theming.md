---
title: Theme & Style
path: 'theming'
order: 430
---

ngx-gantt supports defining themes and styles via the global configuration `styleOptions`. Users can adjust color schemes and themes based on their own project brand/design style.

## Basic Style Configuration

For basic style configuration (layout sizes) and Bar colors, you can directly set them through the top-level properties of `styleOptions`:

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
          primaryColor: '#ff6b6b', // Bar color; higher priority than the theme's primary color
          headerHeight: 50, // Calendar header height (px)
          rowHeight: 50, // Task row height (px)
          barHeight: 24 // Task bar height (px)
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```

## Custom Themes

If you need finer control over colors (such as background, text color, grayscale, etc.), you can modify the default theme or define multiple themes.

### How to Modify the Default Theme

In the global configuration, modify the default theme via `styleOptions.themes`. You can define only the colors you need to change; unspecified colors will fall back to defaults:

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
          defaultTheme: 'default', // Specify the default theme
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

### Define Multiple Themes

You can define multiple themes and use `defaultTheme` to choose which theme is currently active:

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

### Theme Configuration Reference

```typescript
interface Theme {
  primary?: string; // Primary color: Bar, selection highlight, etc.
  danger?: string; // Danger color: dependency relationship conflicts
  highlight?: string; // Highlight color: today highlight display
  background?: string; // Background: gantt main area, table background
  text?: {
    main?: string; // Main text (table, time axis ticks)
    muted?: string; // Secondary text (helper info, muted text)
    light?: string; // Light text (disabled / weak hints)
    inverse?: string; // Inverse text (text on colored background / dark background)
  };
  gray?: {
    100?: string; // Grayscale 100: subtle line separators for rows/background
    200?: string; // Grayscale 200: light grid/border colors
    300?: string; // Grayscale 300: weak separators
    400?: string; // Grayscale 400: standard separators
    500?: string; // Grayscale 500: emphasized separators/borders
    600?: string; // Grayscale 600: deeper emphasized elements
  };
}
```

- All color properties are optional. Modify only what you need
- Unspecified color properties will be deeply merged with defaults, keeping the default configuration
- Color values support CSS color formats: hexadecimal (`#6698ff`)

## Common Questions

### Q: What’s the easiest way to change only the Bar color?

**A:** Set `styleOptions.primaryColor` globally directly. You don’t need to change themes or Sass:

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
          primaryColor: '#ff6b6b' // Global Bar primary color
        }
      } as GanttGlobalConfig
    }
  ]
}).catch((err) => console.error(err));
```
