---
title: Advanced Layout
path: 'advanced-layout'
order: 520
---

If you only want to rely on ngx-gantt's view capabilities and customize your own layout and rendering logic based on ngx-gantt, you can use the `ngx-gantt-root` component to achieve fully customized layout.

## ⚠️ Important

**Implementing a custom layout requires a very deep understanding of the Gantt chart's internal implementation, and it has high requirements for users.**

Before using `ngx-gantt-root`, make sure:

- ✅ You have fully understood the core concepts and data structures of the Gantt chart
- ✅ You understand internal mechanisms such as the view system and task bar positioning
- ✅ You have read the source code and are familiar with the properties and methods provided by `GanttUpper`

## When Do You Need a Custom Layout?

`ngx-gantt-root` is suitable for scenarios like:

- **Want to use the Gantt chart’s view rendering capabilities** (time axis ticks, view calculations, etc.)
- **Need a fully custom left-side area** (not a table; could be any content like a list, cards, etc.)
- **Need a fully custom main area** (task bar display logic is completely custom)
- **Fully customize the bar display logic** (you can use the built-in `<ngx-gantt-bar>` component, or implement it entirely yourself)

## ngx-gantt-root Component

`ngx-gantt-root` provides fully custom layout capabilities. It is the underlying component used inside the `ngx-gantt` component.

### Component Properties

```typescript
interface NgxGanttRootComponent {
  sideWidth?: number; // Optional left-side area width (px)
  sideTemplate?: TemplateRef<any>; // Template reference for the left-side area
  mainTemplate?: TemplateRef<any>; // Template reference for the right-side area
}
```

### Template Structure

`ngx-gantt-root` defines the layout using two templates:

- **sideTemplate**: left-side area template, fully custom left-side content
- **mainTemplate**: right-side area template, fully custom right-side content (including task bar display)

### Minimal Example

The following example shows the basic usage structure of `ngx-gantt-root`:

```typescript
import { Component, OnInit } from '@angular/core';
import { GANTT_UPPER_TOKEN, GanttUpper, NgxGanttRootComponent, NgxGanttBarComponent, GanttItemInternal } from '@worktile/gantt';

@Component({
  selector: 'app-custom-gantt',
  template: `
    <ngx-gantt-root [sideWidth]="300">
      <ng-template #sideTemplate>
        <!-- Custom left area -->
        <div class="custom-side">
          @for (item of customItems; track item.id) {
            <div>{{ item.title }}</div>
          }
        </div>
      </ng-template>

      <ng-template #mainTemplate>
        <!-- Custom main area -->
        <div class="gantt-main" [style.width.px]="view.width">
          @for (item of customItems; track item.id) {
            <ngx-gantt-bar [item]="item"></ngx-gantt-bar>
          }
        </div>
      </ng-template>
    </ngx-gantt-root>
  `,
  providers: [
    {
      provide: GANTT_UPPER_TOKEN,
      useExisting: AppCustomGanttComponent
    }
  ],
  imports: [NgxGanttRootComponent, NgxGanttBarComponent]
})
export class AppCustomGanttComponent extends GanttUpper implements OnInit {
  customItems: GanttItemInternal[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.buildItems();
  }

  private buildItems() {
    // Custom data processing logic
  }
}
```

## Implementation Highlights

When implementing a custom layout with `ngx-gantt-root`, you need to:

1. **Understand the data structures**: understand data structures like `GanttItem`, `GanttItemInternal`, `GanttGroup`, etc.
2. **Understand the view system**: understand how the view calculates the time range and width
3. **Understand task bar positioning**: understand how to compute the bar's position and width based on a task's start/end time
4. **Handle interaction logic**: you need to implement drag/click interactions yourself (if you use built-in components, interactions are supported automatically)

### Example Code

- [example](https://github.com/worktile/ngx-gantt/tree/master/example/src/app/gantt-advanced) - View the full example code
