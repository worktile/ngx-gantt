---
title: Getting Started
path: 'getting-started'
order: 110
---

This guide will help you get started with ngx-gantt in a few minutes.

## 📦 Install Dependencies

Install the core package with npm or yarn:

```bash
npm install @worktile/gantt --save
# or
yarn add @worktile/gantt
```

ngx-gantt requires the following **peerDependencies**. Please make sure they are installed:

- `@angular/common` >= 21.0.0
- `@angular/core` >= 21.0.0
- `@angular/cdk` >= 21.0.0
- `rxjs` ^6.5.0 || ^7.0.0
- `date-fns` >= 4.0.0
- `@date-fns/tz` >= 1.0.0

If you have not installed them yet, run:

```bash
npm install @angular/cdk date-fns @date-fns/tz --save
```

## 🎨 Import Styles

ngx-gantt needs you to import the styles so it renders correctly. There are two ways:

### Option 1: Configure in `angular.json` (recommended)

Add it to the `styles` array in your `angular.json`:

```json
{
  "styles": ["node_modules/@worktile/gantt/styles/index.scss"]
}
```

### Option 2: Import in your SCSS file

In your global styles file (e.g. `styles.scss`):

```scss
@use '@worktile/gantt/styles/index.scss';
```

> **💡 Tip**: If you use `@use`, make sure your project supports Sass (Dart Sass).

## 📥 Import the Component

ngx-gantt supports two import methods: **Standalone** and **NgModule**.

### Standalone (recommended)

Standalone is the modern import approach recommended by Angular:

```typescript
import { Component } from '@angular/core';
import { NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-example',
  standalone: true,
  imports: [NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent],
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task Name" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttExampleComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    {
      id: '1',
      title: 'Design Phase',
      start: 1627729997, // Unix timestamp (seconds)
      end: 1628421197
    },
    {
      id: '2',
      title: 'Development Phase',
      start: 1628507597,
      end: 1633345997
    },
    {
      id: '3',
      title: 'Testing Phase',
      start: 1633433997,
      end: 1636035597
    }
  ];
}
```

### NgModule

If you are still using the traditional NgModule architecture:

```typescript
import { NgModule } from '@angular/core';
import { NgxGanttModule } from '@worktile/gantt';

@NgModule({
  imports: [
    NgxGanttModule
    // ... other modules
  ]
  // ...
})
export class AppModule {}
```

## 🚀 Hello World

Here is a complete Gantt chart example, including the component class and template:

### Full Example

```typescript
import { Component } from '@angular/core';
import { NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-example',
  standalone: true,
  imports: [NgxGanttComponent, NgxGanttTableComponent, NgxGanttTableColumnComponent],
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task Name" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttExampleComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    {
      id: '1',
      title: 'Design Phase',
      start: 1627729997,
      end: 1628421197
    },
    {
      id: '2',
      title: 'Development Phase',
      start: 1628507597,
      end: 1633345997
    },
    {
      id: '3',
      title: 'Testing Phase',
      start: 1633433997,
      end: 1636035597
    }
  ];
}
```

### Key Concepts

| Concept            | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `items`            | Task data array; each task needs at least `id`, `title`, `start`, or `end` |
| `viewType`         | View type; supports `hour`, `day`, `week`, `month`, `quarter`, `year`      |
| `ngx-gantt-table`  | Table component for displaying task lists                                  |
| `ngx-gantt-column` | Table column definition; customize cell content via `#cell` template       |

### Time Formats

`start` and `end` support the following formats:

- **Unix timestamp (seconds)**: `1627729997` (recommended)
- **Date object**: `new Date(1627729997 * 1000)`
- **GanttDate object**: `new GanttDate(1627729997)`

> **💡 Tip**: If you provide only `start` or `end`, the component will automatically calculate the default width.

## ✅ Verify Installation

After running your app, you should see a Gantt chart with three tasks. If you run into issues, check the FAQ section below.

## 📚 Next Steps

You have successfully run your first Gantt chart! Next you can:

- 📖 [Data Model](guides/core-concepts/data-model) - Learn the structure of `GanttItem` and `GanttGroup`
- ⏰ [Date and Timezone](guides/core-concepts/date-timezone) - Understand time handling and timezone configuration
- 🎨 [Feature Guide](guides/features) - Learn advanced features like drag interactions and dependency links
- 🎯 [Full Example](https://github.com/worktile/ngx-gantt/tree/master/example/src/app/gantt) - Reference more real-world usage scenarios

## ❓ Common Questions

### Styles not working?

- Make sure you imported the styles correctly
- Check the browser console for style loading errors
- Confirm you are using Sass (Dart Sass) instead of Node Sass

### Time display is incorrect?

- Check whether the time format is correct, and ensure you are using Unix timestamp (seconds) or `Date`
- See [Date and Timezone](guides/core-concepts/date-timezone) for more details
- Confirm the timezone configuration is correct

### Component not displayed?

- Check whether you imported the component correctly
- Confirm the `items` array is not empty
- Check the browser console for error messages
- Confirm the styles have been imported correctly

### Import error?

- Make sure all peer dependencies are installed
- Check whether your Angular version meets the requirement (>= 21.0.0)
- Confirm you are using either the Standalone or NgModule approach
