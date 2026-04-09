---
title: 公共方法
path: 'api-methods'
order: 240
---

ngx-gantt 组件实例提供了一些公开方法，用于程序化控制甘特图的行为。

## 方法列表

| 方法                   | 参数                                | 返回值                      | 说明                            |
| ---------------------- | ----------------------------------- | --------------------------- | ------------------------------- |
| `scrollToToday()`      | -                                   | `void`                      | 滚动到今天的位置                |
| `scrollToDate(date)`   | `date: number \| Date \| GanttDate` | `void`                      | 滚动到指定日期位置              |
| `expandAll()`          | -                                   | `void`                      | 展开所有分组和任务项            |
| `collapseAll()`        | -                                   | `void`                      | 收起所有分组和任务项            |
| `expandGroup(group)`   | `group: GanttGroupInternal`         | `void`                      | 展开或收起指定分组              |
| `expandChildren(item)` | `item: GanttItemInternal`           | `void`                      | 展开或收起指定任务项的子任务    |
| `getGanttItem(id)`     | `id: string`                        | `GanttItemInternal \| null` | 根据 ID 获取任务项              |
| `getGanttItems(ids)`   | `ids: string[]`                     | `GanttItemInternal[]`       | 根据 ID 数组获取多个任务项      |
| `isSelected(id)`       | `id: string`                        | `boolean`                   | 判断指定任务项是否被选中        |
| `rerenderView()`       | -                                   | `void`                      | 重新渲染视图（调用 changeView） |

## 使用示例

```typescript
import { Component, viewChild } from '@angular/core';
import { NgxGanttComponent, GanttItem, GanttViewType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt #gantt [items]="items" [viewType]="viewType">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>

    <button (click)="gantt()?.scrollToToday()">回到今天</button>
  `
})
export class GanttExampleComponent {
  gantt = viewChild<NgxGanttComponent>('gantt');

  viewType = GanttViewType.month;
  items: GanttItem[] = [{ id: '1', title: '任务 1', start: 1627729997, end: 1628421197 }];

  // 滚动到指定日期
  scrollToDate() {
    this.gantt()?.scrollToDate(1627729997);
  }

  // 获取任务项
  getTask() {
    const item = this.gantt()?.getGanttItem('1');
    if (item) {
      console.log(item.origin);
    }
  }

  // 判断是否选中
  checkSelected() {
    const selected = this.gantt()?.isSelected('1');
    console.log('是否选中:', selected);
  }

  // 展开/收起任务项的子任务
  toggleChildren(itemId: string) {
    const item = this.gantt()?.getGanttItem(itemId);
    if (item) {
      this.gantt()?.expandChildren(item);
    }
  }

  // 展开/收起分组
  toggleGroup(groupId: string) {
    const gantt = this.gantt();
    if (gantt) {
      const group = gantt.groups.find((g) => g.id === groupId);
      if (group) {
        gantt.expandGroup(group);
      }
    }
  }
}
```

## 相关链接

- [数据模型](guides/core-concepts/data-model) - 了解 GanttItem 和 GanttGroup 的结构
- [分组功能](guides/features/groups) - 了解分组的使用方法
