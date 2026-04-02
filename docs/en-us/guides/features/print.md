---
title: Export & Print
path: 'export-print'
order: 391
---

# Export & Print

ngx-gantt supports exporting the Gantt chart as a PNG image, which is convenient for reports, sharing, and archiving.

## GanttPrintService

`GanttPrintService` is the core service for export & print. It uses the `html2canvas` library to convert the Gantt chart into an image.

### Inject the Service

```typescript
import { GanttPrintService } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-print',
  providers: [GanttPrintService]
})
export class GanttPrintComponent {
  constructor(private printService: GanttPrintService) {}
}
```

## Export to an Image

### Basic Export

```typescript
@Component({
  template: `
    <ngx-gantt #gantt [items]="items">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="exportImage()">Export as PNG</button>
  `,
  providers: [GanttPrintService]
})
export class GanttPrintComponent {
  constructor(private printService: GanttPrintService) {}

  exportImage() {
    // Export as PNG; file name is 'gantt-chart.png'
    this.printService.print('gantt-chart');
  }
}
```

### Ignore Specific Elements

When exporting, you can ignore certain elements (such as the toolbar, action buttons, etc.):

```typescript
exportImage() {
  // Ignore elements with class 'toolbar'
  this.printService.print('gantt-chart', 'toolbar');
}
```

## Get the Canvas Object

If you need to customize the processing of the exported image, you can use the `html2canvas` method to get the `Canvas` object:

```typescript
async exportToCanvas() {
  const canvas = await this.printService.html2canvas();

  // Custom handling
  const dataUrl = canvas.toDataURL('image/png');

  // You can upload it to your server
  this.uploadImage(dataUrl);

  // Or show a preview
  this.showPreview(dataUrl);
}
```

### Custom Handling Example

```typescript
import { HttpClient } from '@angular/common/http';

@Component({
  providers: [GanttPrintService]
})
export class GanttPrintComponent {
  constructor(
    private printService: GanttPrintService,
    private http: HttpClient
  ) {}

  async exportAndUpload() {
    try {
      const canvas = await this.printService.html2canvas('toolbar');
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      // Upload to the server
      const formData = new FormData();
      formData.append('image', blob, 'gantt-chart.png');

      this.http.post('/api/upload', formData).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
        },
        error: (error) => {
          console.error('Upload failed', error);
        }
      });
    } catch (error) {
      console.error('Export failed', error);
    }
  }
}
```

## Missing Styles Issue

### Cause

Styles might be lost during export. Common causes include:

1. SVG element styles are not inlined
2. External stylesheets are not loaded
3. Fonts are not loaded completely

### Solutions

`GanttPrintService` automatically inlines SVG styles, but please note:

1. **Ensure styles are loaded**: wait for styles to finish loading before exporting
2. **Use inline styles**: for critical styles, use inline styles
3. **Check SVG element styles**: make sure styles for SVG elements are correct

## Minimal Example

```typescript
import { Component, viewChild, afterNextRender } from '@angular/core';
import { GanttItem, GanttViewType, NgxGanttComponent, GanttPrintService } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-print',
  template: `
    <div class="toolbar">
      <button (click)="exportImage()">Export as image</button>
    </div>

    <ngx-gantt #gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="Task" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `,
  providers: [GanttPrintService]
})
export class GanttPrintComponent {
  gantt = viewChild<NgxGanttComponent>('gantt');

  viewType = GanttViewType.day;

  items: GanttItem[] = [{ id: '1', title: 'Task 1', start: 1627729997, end: 1628421197 }];

  constructor(private printService: GanttPrintService) {
    afterNextRender(() => {
      // Register the Gantt chart root element
      const gantt = this.gantt();
      if (gantt) {
        const ganttRoot = gantt.ganttRoot();
        if (ganttRoot) {
          this.printService.register(ganttRoot.elementRef);
        }
      }
    });
  }

  exportImage() {
    // Ignore the toolbar
    this.printService.print('gantt-chart', 'toolbar');
  }
}
```

## Best Practices

### 1. Wait until the rendering is completed

```typescript
exportImage() {
  const gantt = this.gantt();
  if (gantt) {
    // Update the view
    gantt.changeView();

    // Wait a little while to ensure rendering is completed
    setTimeout(() => {
      this.printService.print('gantt-chart');
    }, 500);
  }
}
```

### 2. Handle large chart exports

For large Gantt charts, export may take a longer time:

```typescript
async exportImage() {
  this.loading = true;
  try {
    await this.printService.print('gantt-chart');
    this.notify.success('Export successful');
  } catch (error) {
    this.notify.error('Export failed');
  } finally {
    this.loading = false;
  }
}
```

### 3. Optimize export quality

```typescript
// html2canvas will process automatically, but you can adjust the view for the best result
exportImage() {
  const gantt = this.gantt();
  if (gantt) {
    // Ensure the view is fully loaded
    gantt.rerenderView();

    // Export
    setTimeout(() => {
      this.printService.print('gantt-chart');
    }, 300);
  }
}
```

## Common Questions

### Q: Export fails or the image is blank?

**A:** Check:

1. Whether you have called `register` to register the root element
2. Whether the Gantt chart is fully rendered
3. Whether there are errors in the browser console

### Q: The exported image styles are incorrect?

**A:**

1. Ensure styles are fully loaded
2. Check styles for SVG elements
3. Use inline styles instead of external stylesheets

### Q: How do I export a specific area?

**A:** Exporting a specific area is not supported currently. You can hide the parts you don’t need with CSS and then export.

### Q: Export performance issues?

**A:**

1. For large Gantt charts, export may take a long time
2. Consider hiding unnecessary elements before exporting
3. Use `ignoreElementClass` to ignore elements you don’t need
