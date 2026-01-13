---
title: 导出打印
path: 'export-print'
order: 370
---

# 导出打印

ngx-gantt 支持将甘特图导出为 PNG 图片，方便用于报告、分享和存档。

## 前置阅读

在深入学习导出打印之前，建议先了解：

- [视图体系](../core/views.md) - 理解视图的显示

## GanttPrintService

`GanttPrintService` 是导出打印的核心服务，使用 `html2canvas` 库将甘特图转换为图片。

### 注入服务

```typescript
import { GanttPrintService } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-print',
  providers: [GanttPrintService],
  template: `
    <ngx-gantt #gantt [items]="items">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="exportImage()">导出为图片</button>
  `
})
export class GanttPrintComponent {
  @ViewChild('gantt') gantt: NgxGanttComponent;

  constructor(private printService: GanttPrintService) {
    // 注册甘特图根元素
    this.printService.register(this.gantt.elementRef);
  }

  exportImage() {
    this.printService.print('gantt-chart');
  }
}
```

### 注册甘特图组件

在使用打印服务前，需要先注册甘特图的根元素：

```typescript
ngAfterViewInit() {
  // 获取甘特图根元素
  const ganttRoot = this.gantt.ganttRoot();
  if (ganttRoot) {
    this.printService.register(ganttRoot.elementRef);
  }
}
```

## 导出为图片

### 基础导出

```typescript
@Component({
  template: `
    <ngx-gantt #gantt [items]="items">
      <!-- ... -->
    </ngx-gantt>
    <button (click)="exportImage()">导出为 PNG</button>
  `,
  providers: [GanttPrintService]
})
export class GanttPrintComponent {
  @ViewChild('gantt') gantt: NgxGanttComponent;

  constructor(private printService: GanttPrintService) {}

  ngAfterViewInit() {
    const ganttRoot = this.gantt.ganttRoot();
    if (ganttRoot) {
      this.printService.register(ganttRoot.elementRef);
    }
  }

  exportImage() {
    // 导出为 PNG，文件名为 'gantt-chart.png'
    this.printService.print('gantt-chart');
  }
}
```

### 自定义文件名

```typescript
exportImage() {
  const fileName = `项目甘特图-${new Date().toISOString().split('T')[0]}`;
  this.printService.print(fileName);
}
```

### 忽略特定元素

在导出时可以忽略某些元素（如工具栏、操作按钮等）：

```typescript
exportImage() {
  // 忽略 class 为 'toolbar' 的元素
  this.printService.print('gantt-chart', 'toolbar');
}
```

## 获取 Canvas 对象

如果需要自定义处理导出的图片，可以使用 `html2canvas` 方法获取 Canvas 对象：

```typescript
async exportToCanvas() {
  const canvas = await this.printService.html2canvas();

  // 自定义处理
  const dataUrl = canvas.toDataURL('image/png');

  // 可以上传到服务器
  this.uploadImage(dataUrl);

  // 或者显示预览
  this.showPreview(dataUrl);
}
```

### 自定义处理示例

```typescript
async exportAndUpload() {
  try {
    const canvas = await this.printService.html2canvas('toolbar');
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });

    // 上传到服务器
    const formData = new FormData();
    formData.append('image', blob, 'gantt-chart.png');

    this.http.post('/api/upload', formData).subscribe({
      next: (response) => {
        console.log('上传成功', response);
      },
      error: (error) => {
        console.error('上传失败', error);
      }
    });
  } catch (error) {
    console.error('导出失败', error);
  }
}
```

## 样式丢失问题

### 问题原因

导出时可能出现样式丢失，常见原因：

1. SVG 元素的样式未内联
2. 外部样式表未加载
3. 字体未加载完成

### 解决方案

`GanttPrintService` 会自动处理 SVG 样式内联，但需要注意：

1. **确保样式已加载**：等待样式加载完成后再导出

```typescript
async exportImage() {
  // 等待样式加载
  await this.waitForStyles();

  // 导出
  this.printService.print('gantt-chart');
}

private waitForStyles(): Promise<void> {
  return new Promise((resolve) => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => resolve());
    } else {
      setTimeout(() => resolve(), 1000);
    }
  });
}
```

2. **使用内联样式**：对于关键样式，使用内联样式

```html
<div style="color: #333; font-size: 14px;">内容</div>
```

3. **检查 SVG 元素**：确保 SVG 元素的样式正确

## 最小示例

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { GanttItem, GanttViewType, NgxGanttComponent, GanttPrintService } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-print',
  template: `
    <div class="toolbar">
      <button (click)="exportImage()">导出为图片</button>
    </div>

    <ngx-gantt #gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `,
  providers: [GanttPrintService]
})
export class GanttPrintComponent implements AfterViewInit {
  @ViewChild('gantt') gantt: NgxGanttComponent;

  viewType = GanttViewType.day;

  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];

  constructor(private printService: GanttPrintService) {}

  ngAfterViewInit() {
    // 注册甘特图根元素
    const ganttRoot = this.gantt.ganttRoot();
    if (ganttRoot) {
      this.printService.register(ganttRoot.elementRef);
    }
  }

  exportImage() {
    // 忽略工具栏
    this.printService.print('gantt-chart', 'toolbar');
  }
}
```

## 最佳实践

### 1. 等待渲染完成

```typescript
async exportImage() {
  // 等待视图更新完成
  await this.gantt.changeView();

  // 等待一小段时间确保渲染完成
  await new Promise(resolve => setTimeout(resolve, 500));

  // 导出
  this.printService.print('gantt-chart');
}
```

### 2. 处理大图导出

对于大型甘特图，导出可能需要较长时间：

```typescript
async exportImage() {
  this.loading = true;
  try {
    await this.printService.print('gantt-chart');
    this.notify.success('导出成功');
  } catch (error) {
    this.notify.error('导出失败');
  } finally {
    this.loading = false;
  }
}
```

### 3. 优化导出质量

```typescript
// html2canvas 会自动处理，但可以调整视图以确保最佳效果
exportImage() {
  // 确保视图已完全加载
  this.gantt.rerenderView();

  // 导出
  setTimeout(() => {
    this.printService.print('gantt-chart');
  }, 300);
}
```

## 常见问题

### Q: 导出失败或图片空白？

**A:** 检查：

1. 是否已调用 `register` 方法注册根元素
2. 甘特图是否已完全渲染
3. 浏览器控制台是否有错误信息

### Q: 导出的图片样式不正确？

**A:**

1. 确保样式已加载完成
2. 检查 SVG 元素的样式是否正确
3. 使用内联样式替代外部样式表

### Q: 如何导出特定区域？

**A:** 目前不支持导出特定区域，但可以通过 CSS 隐藏不需要的部分，然后导出。

### Q: 导出性能问题？

**A:**

1. 对于大型甘特图，导出可能需要较长时间
2. 考虑在导出前隐藏不必要的元素
3. 使用 `ignoreElementClass` 忽略不需要的元素

## 相关链接

- [视图体系](../core/views.md) - 了解视图显示
- [工具栏](./toolbar.md) - 了解工具栏功能
