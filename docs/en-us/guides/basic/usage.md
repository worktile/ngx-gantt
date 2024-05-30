---
title: Usage
path: usage
order: 10
---

## Basic usage

In general, for the most basic usage, we only need to define the `items` data to pass into the component (note that the current time format only supports 10-digit timestamps). If you need to display the table on the left, you also need to define the table column

```html
<ngx-gantt #gantt [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="Title" width="300px">
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

## View configuration

The built-in view has a set of default configurations. If the default configuration does not meet the requirements, you can pass in the specified viewOptions for custom configuration

```
<ngx-gantt #gantt [items]="items" [viewOptions]="viewOptions">
...
</ngx-gantt>

```

```javascript
class GanttViewOptions {
start?: GanttDate; // View start time
end?: GanttDate; // View end time
min?: GanttDate; // View minimum time
max?: GanttDate; // View maximum time
cellWidth?: number; // View minimum unit width (hourly view, the minimum unit is the width of each hour, daily view, the latest unit is the width of the daily display)
addAmount?: number; // Horizontal scroll loading, the amount loaded each time
addUnit?: GanttDateUtil; // The unit of the amount loaded each time when scrolling horizontally
dateFormat?: GanttDateFormat; // Set the view date format, which can be used in multiple languages
datePrecisionUnit?: 'day' | 'hour' | 'minute'; // Date precision unit, the default precision of the hour view is minute, and the default precision of other views is day
dragPreviewDateFormat?: string; // Drag preview date format setting
}
```

## How to set groups

In group mode, we also need to pass in an array of `groups` and ensure that the `group_id` of each data item is set in the `items` data we pass in

```html
<ngx-gantt #gantt [groups]="groups" [items]="items">
  <ngx-gantt-table>
    <ngx-gantt-column name="Title" width="300px">
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

## Tree structure display

The `GanttItem` type contains the `children` attribute. By default, as long as we pass in the `children` attribute, it will be displayed as a tree structure.

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

If you need to load child data asynchronously, we need to set the component's `async` to `true` and then set the Resolve function `childrenResolve` to load child data. Finally, we also need to specify which data is expandable.

```html
<ngx-gantt #gantt [items]="items" [async]="true" [childrenResolve]="childrenResolve"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  // Set expandable to true to specify that the data is expandable
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, expandable: true }
  ];

  // Set the Resolve function for loading child data. The return value must be an observable object Observable
  childrenResolve = (item: GanttItem) => {
    const children = randomItems(random(1, 5), item);
    return of(children).pipe(delay(1000));
  };
}
```

## Dependency

If we need to display the dependency of data items, we need to set the `links` property in `GanttItem` and set the id to be associated. If we need to drag and drop to create an association, we need to set `[linkable] = true`. In some scenarios, we may need to set a certain data to enable drag and drop to create an association. We can also achieve this by setting the `linkable` of the item data.

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

## Scrolling Loading

In order to ensure the performance of the component, by default, it will only be displayed for a certain period of time (different view periods are different), so the component has scrolling loading enabled by default. If scrolling loading is not required, it can be disabled by setting `[disabledLoadOnScroll]=true`.

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

## Drag and drop

Enable the drag and drop function by setting `[draggable]=true`, and support `(dragStarted)` and `(dragEnded)` events.

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

## Select the entire row

Enable the entire row selection function by setting `[selectable]=true`, and you can also use `[multiple]=true` to enable multiple selection mode. Supports `(selectedChange)` event.

```html
<ngx-gantt #gantt [items]="items" [selectable]="true" [multiple]="true" (selectedChange)="selectedChange($event)"> ... </ngx-gantt>
```

```javascript
export class AppGanttExampleComponent {
  selectedChange(event: GanttSelectedEvent) {}
}
```

## Export as image

If you need to export the image function, we need to inject the image printing service `GanttPrintService` when using the component

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
