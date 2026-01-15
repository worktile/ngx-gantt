---
title: 任务关联
path: 'task-links'
order: 330
---

# 任务关联

任务关联（依赖关系）是项目管理中的重要功能，ngx-gantt 支持通过拖拽创建任务间的依赖链接。

## 依赖类型

ngx-gantt 支持 4 种依赖类型（GanttLinkType）：

| 类型                    | 说明      | 使用场景                                         |
| ----------------------- | --------- | ------------------------------------------------ |
| `fs` (Finish-to-Start)  | 完成-开始 | 前一个任务完成后，后一个任务才能开始（最常见）   |
| `ff` (Finish-to-Finish) | 完成-完成 | 前一个任务完成后，后一个任务才能完成             |
| `ss` (Start-to-Start)   | 开始-开始 | 前一个任务开始后，后一个任务才能开始             |
| `sf` (Start-to-Finish)  | 开始-完成 | 前一个任务开始后，后一个任务才能完成（较少使用） |

### 依赖类型示例

```typescript
// FS：任务 B 必须在任务 A 完成后才能开始
const items: GanttItem[] = [
  { id: 'A', title: '设计', start: 1627729997, end: 1628421197 },
  {
    id: 'B',
    title: '开发',
    start: 1628507597,
    end: 1633345997,
    links: [{ type: GanttLinkType.fs, link: 'A' }]  // 依赖任务 A
  }
];

// FF：任务 B 必须在任务 A 完成后才能完成
{
  id: 'B',
  links: [{ type: GanttLinkType.ff, link: 'A' }]
}

// SS：任务 B 必须在任务 A 开始后才能开始
{
  id: 'B',
  links: [{ type: GanttLinkType.ss, link: 'A' }]
}
```

## 链接数据格式

### 字符串格式（简化）

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '任务 1',
    links: ['2', '3'] // 简写，默认为 fs 类型
  }
];
```

### 对象格式（完整）

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '任务 1',
    links: [
      { type: GanttLinkType.fs, link: '2' },
      { type: GanttLinkType.ff, link: '3', color: '#ff6b6b' } // 自定义颜色
    ]
  }
];
```

## 拖拽创建链接

### 启用链接功能

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [linkable]="true">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];
}
```

### 拖拽操作

1. 从任务条的**左侧端点**（开始时间）或**右侧端点**（结束时间）开始拖拽
2. 拖拽到目标任务的任意位置
3. 释放鼠标完成链接创建

组件会根据拖拽的起点和终点自动判断依赖类型：

- 从结束点拖到开始点 → `fs`（完成-开始）
- 从结束点拖到结束点 → `ff`（完成-完成）
- 从开始点拖到开始点 → `ss`（开始-开始）
- 从开始点拖到结束点 → `sf`（开始-完成）

### 事件处理

#### 拖拽创建链接事件

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" (linkDragStarted)="onLinkDragStarted($event)" (linkDragEnded)="onLinkDragEnded($event)">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];

  onLinkDragStarted(event: GanttLinkDragEvent) {
    console.log('开始创建链接', event.source);
  }

  onLinkDragEnded(event: GanttLinkDragEvent) {
    console.log('链接创建完成', event.source, event.target, event.type);
    // 更新数据
    this.updateLinks(event);
  }
}
```

#### 链接点击事件

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" (lineClick)="onLineClick($event)">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  onLineClick(event: GanttLineClickEvent) {
    console.log('点击了链接', event.source, event.target);
    // 显示链接详情或删除链接
  }
}
```

## 链接样式定制

### 自定义链接颜色

```typescript
links: [
  {
    type: GanttLinkType.fs,
    link: '2',
    color: {
      default: '#6698ff', // 默认颜色
      active: '#ff6b6b' // 激活/悬停颜色
    }
  }
];
```

### 连线类型

- **`curve`**（默认）：曲线连接，更美观
- **`straight`**：直线连接，更简洁

```typescript
linkOptions: {
  lineType: 'straight'; // 或 'curve'
}
```

### 显示箭头

```typescript
linkOptions: {
  showArrow: true; // 在连线末端显示箭头
}
```

## 链接配置

### 全局配置

```typescript
import { GANTT_GLOBAL_CONFIG } from '@worktile/gantt';

@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        linkOptions: {
          dependencyTypes: [GanttLinkType.fs], // 允许的依赖类型
          showArrow: false, // 是否显示箭头
          lineType: 'curve' // 'curve' | 'straight'
        }
      }
    }
  ]
})
export class AppComponent {}
```

### 组件级别配置

```typescript
@Component({
  template: `
    <ngx-gantt [items]="items" [linkOptions]="linkOptions">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  linkOptions: GanttLinkOptions = {
    dependencyTypes: [GanttLinkType.fs, GanttLinkType.ff],
    showArrow: true,
    lineType: 'straight'
  };
}
```

## 最小示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttLinkDragEvent, GanttLinkType } from '@worktile/gantt';

@Component({
  selector: 'app-gantt-links',
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [linkable]="true" (linkDragEnded)="onLinkDragEnded($event)">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">
            {{ item.title }}
          </ng-template>
        </ngx-gantt-column>
      </ngx-gantt-table>
    </ngx-gantt>
  `
})
export class GanttLinksComponent {
  viewType = GanttViewType.day;

  items: GanttItem[] = [
    { id: '1', title: '任务 1', start: 1627729997, end: 1628421197 },
    { id: '2', title: '任务 2', start: 1628507597, end: 1633345997 }
  ];

  onLinkDragEnded(event: GanttLinkDragEvent) {
    // 更新链接
    this.items = this.items.map((item) => {
      if (item.id === event.source.id) {
        return {
          ...item,
          links: [...(item.links || []), { type: event.type, link: event.target.id }]
        };
      }
      return item;
    });
  }
}
```

## 常见问题

### Q: 如何删除链接？

**A:** 从任务的 `links` 数组中移除对应的链接：

```typescript
removeLink(itemId: string, targetId: string) {
  this.items = this.items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        links: item.links?.filter(link => {
          const linkId = typeof link === 'string' ? link : link.link;
          return linkId !== targetId;
        })
      };
    }
    return item;
  });
}
```

### Q: 如何限制只能创建特定类型的链接？

**A:** 在 `linkOptions.dependencyTypes` 中指定允许的类型：

```typescript
linkOptions: {
  dependencyTypes: [GanttLinkType.fs]; // 只允许 fs 类型
}
```

### Q: 链接不显示？

**A:** 检查：

1. `linkable` 是否为 `true`
2. 任务的 `linkable` 属性是否为 `true`（默认值）
3. `links` 数组中的任务 ID 是否存在

## 相关链接

- [数据模型](guides/core-concepts/data-model) - 了解 links 字段的结构
- [Bar 交互](guides/features/bar-interaction) - 了解任务条交互
- [全局配置](guides/configuration) - 了解链接的全局配置
