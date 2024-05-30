---
title: 如何使用
subtitle: Usage
path: usage
order: 10
---

## 基本使用

一般情况下最基本的使用我们只需要定义 `items` 数据传入组件中（需要注意的是，目前时间格式仅支持 10 位时间戳），如需要左侧的表格展示，则还需要定义表格的 column

```html
<ngx-gantt #gantt [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="标题" width="300px">
      <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
    { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
    { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true }
  ];
}
```

## 视图配置

内置视图有一套默认的配置，如默认配置不满足需求时，可传入指定的 viewOptions 来进行自定义配置

```
<ngx-gantt #gantt [items]="items" [viewOptions]="viewOptions">
  ...
</ngx-gantt>
```

```javascript
  class GanttViewOptions {
        start?: GanttDate; // 视图开始时间
        end?: GanttDate;   // 视图结束时间
        min?: GanttDate;   // 视图最小时间
        max?: GanttDate;   // 视图最大时间
        cellWidth?: number;    // 视图最小单元宽度（小时视图，最小单元就是每小时的宽度，日视图，最新单元就是每日显示的宽度）
        addAmount?: number;    // 横向滚动加载时，每次加载的量
        addUnit?: GanttDateUtil; // 横向滚动加载时，每次加载的量的单位
        dateFormat?: GanttDateFormat; // 设置视图日期格式，可用于多语言
        datePrecisionUnit?: 'day' | 'hour' | 'minute'; // 日期精度单位，小时视图默认精度为分钟，其他视图默认精度为天
        dragPreviewDateFormat?: string; // 拖拽预览日期格式设置
  }
```

## 如何设置分组

分组模式下我们还需要传入一个 `groups` 的数组，并且保证我们传入的 `items` 数据中设置了每个数据项的 `group_id`

```html
<ngx-gantt #gantt [groups]="groups" [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="标题" width="300px">
      <ng-template #cell let-item="item"> {{ item.title }} </ng-template>
    </ngx-gantt-column>
  </ngx-gantt-table>
</ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  groups: GanttGroup[] = [
    { id: '000000', title: 'Group-0' },
    { id: '000001', title: 'Group-1' }
  ];
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, group_id: '000000' },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, group_id: '000001' }
  ];
}
```

## 树形结构展示

`GanttItem` 类型包含 `children` 属性，默认情况下只要我们传入了 `children` 属性则就就会展示为树形结构。

```javascript
export class AppGanttExampleComponent {
  items: GanttItem[] = [
    {
      id: '000000',
      title: 'Task 0',
      children: [
        { id: '000000-01', title: 'Task 0-1' },
        { id: '000000-02', title: 'Task 0-2' }
      ]
    }
  ];
}
```

如果需要异步加载子数据，我们需要设置将组件的 `async` 设置为 `true` 然后设置加载子数据的 Resolve 函数 `childrenResolve`，最后我们还需要指定哪些数据是可展开的。

```html
<ngx-gantt #gantt [items]="items" [async]="true" [childrenResolve]="childrenResolve"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  // 设置 expandable 为true 指定数据是可展开的
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, expandable: true }
  ];

  // 设置加载子数据的 Resolve 函数，返回值必须是一个可观察对象 Observable
  childrenResolve = (item: GanttItem) => {
    const children = randomItems(random(1, 5), item);
    return of(children).pipe(delay(1000));
  };
}
```

## 依赖

如果我们需要展示数据项的依赖关系，则需要设置 `GanttItem` 中的 `links` 属性，设置需要关联的 id，如果需要拖拽创建关联关系，则需要设置 `[linkable] = true`，在某些场景下可能我们需要设置某一条数据开启拖拽创建关联，我们也可以通过设置 item 数据的 `linkable` 来实现。

```html
<ngx-gantt #gantt [items]="items" [linkable]="true" (linkDragEnded)="linkDragEnded($event)"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, links: ['000001', '000002'] },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003'] },
    { id: '000002', title: 'Task 2', start: 1617361997, end: 1625483597, linkable: false }
  ];

  linkDragEnded($event: GanttLinkDragEvent) {
    this.http
      .post(`/api/item/deps`, {
        source: event.source,
        target: event.target
      })
      .subscribe((items) => {});
  }
}
```

## 滚动加载

为了保证组件的性能，默认情况下只会展示一定周期的时间（不同的视图周期不同），所以组件默认开启了滚动加载。如果不需要滚动加载可以通过设置 `[disabledLoadOnScroll]=true` 来禁用。

```html
<ngx-gantt #gantt [items]="items" (loadOnScroll)="loadOnScroll($event)"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197 },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597 },
    { id: '000002', title: 'Task 2', start: 1617361997, end: 1625483597 }
  ];

  loadOnScroll(event: GanttLoadOnScrollEvent) {
    this.http.get(`/api/items?start=${event.start}&end=${event.end}`).subscribe((items) => {
      this.items = [...this.items, ...items];
    });
  }
}
```

## 拖拽

通过设置 `[draggable]=true` 来启用拖拽功能，支持 `(dragStarted)`、`(dragEnded)` 事件。

```html
<ngx-gantt #gantt [items]="items" [draggable]="true" (dragEnded)="dragEnded($event)"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  dragEnded($event: GanttDragEvent) {
    this.http
      .put(`/api/item/${$event.item.id}`, {
        start: $event.item.start,
        end: $event.item.end
      })
      .subscribe((items) => {});
  }
}
```

## 选择整行

通过设置 `[selectable]=true` 来启用选择整行功能，同时也可使用 `[multiple]=true` 来启用多选模式。支持 `(selectedChange)` 事件。

```html
<ngx-gantt #gantt [items]="items" [selectable]="true" [multiple]="true" (selectedChange)="selectedChange($event)"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  selectedChange(event: GanttSelectedEvent) {}
}
```

## 导出为图片

如需要导出图片功能，我们需要在使用组件时注入图片打印服务 `GanttPrintService`

```javascript
@Component({
  selector: 'app-gantt-example',
  templateUrl: './gantt.component.html',
  providers: [GanttPrintService]
})
export class AppGanttExampleComponent {
  @ViewChild('gantt') ganttComponent: NgxGanttComponent;

  exportImage() {
    ganttComponent.print('image name');
  }
}
```
