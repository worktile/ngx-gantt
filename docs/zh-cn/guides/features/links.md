---
title: 任务依赖
path: 'task-links'
order: 360
---

任务依赖关系是项目管理中的重要功能，ngx-gantt 支持通过拖拽创建任务间的依赖关系。

## 如何展示依赖数据？

在 `ngx-gantt` 组件中设置 `[linkable]="true"` 启用依赖功能，然后在任务的 `links` 字段中定义依赖关系：

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttLinkType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [linkable]="true">
      <!-- ... -->
    </ngx-gantt>
  `
})
export class MyComponent {
  items: GanttItem[] = [
    { id: 'A', title: '设计', start: 1627729997, end: 1628421197 },
    {
      id: 'B',
      title: '开发',
      start: 1628507597,
      end: 1633345997,
      links: [{ type: GanttLinkType.fs, link: 'A' }] // 任务 B 依赖任务 A
    }
  ];
}
```

## 构建依赖数据

### 数据格式

依赖数据支持两种格式：字符串格式（简化）和对象格式（完整）。

```typescript
const items: GanttItem[] = [
  {
    id: '1',
    title: '任务 1',
    // 字符串格式：默认为 fs 类型
    links: ['2', '3']
  },
  {
    id: '2',
    title: '任务 2',
    // 对象格式：可指定依赖类型和自定义样式
    links: [
      { type: GanttLinkType.fs, link: '3' },
      { type: GanttLinkType.ff, link: '4', color: '#ff6b6b' }
    ]
  }
];
```

### 依赖类型

ngx-gantt 支持 4 种依赖类型（GanttLinkType）：

| 类型                    | 说明      | 使用场景                                         |
| ----------------------- | --------- | ------------------------------------------------ |
| `fs` (Finish-to-Start)  | 完成-开始 | 前一个任务完成后，后一个任务才能开始（最常见）   |
| `ff` (Finish-to-Finish) | 完成-完成 | 前一个任务完成后，后一个任务才能完成             |
| `ss` (Start-to-Start)   | 开始-开始 | 前一个任务开始后，后一个任务才能开始             |
| `sf` (Start-to-Finish)  | 开始-完成 | 前一个任务开始后，后一个任务才能完成（较少使用） |

```typescript
const items: GanttItem[] = [
  { id: 'A', title: '设计', start: 1627729997, end: 1628421197 },
  {
    id: 'B',
    title: '开发',
    links: [
      { type: GanttLinkType.fs, link: 'A' } // FS：任务 A 完成后，任务 B 才能开始
      // { type: GanttLinkType.ff, link: 'A' }, // FF：任务 A 完成后，任务 B 才能完成
      // { type: GanttLinkType.ss, link: 'A' }, // SS：任务 A 开始后，任务 B 才能开始
      // { type: GanttLinkType.sf, link: 'A' }  // SF：任务 A 开始后，任务 B 才能完成
    ]
  }
];
```

## 拖拽创建依赖

除了在数据中直接定义依赖关系，还可以通过拖拽任务条来创建依赖关系。

### 拖拽操作

1. 从任务条的**左侧端点**（开始时间）或**右侧端点**（结束时间）开始拖拽
2. 拖拽到目标任务的任意位置
3. 释放鼠标完成依赖关系创建

组件会根据拖拽的起点和终点自动判断依赖类型：

- 从结束点拖到开始点 → `fs`（完成-开始）
- 从结束点拖到结束点 → `ff`（完成-完成）
- 从开始点拖到开始点 → `ss`（开始-开始）
- 从开始点拖到结束点 → `sf`（开始-完成）

### 事件处理

```typescript
@Component({
  template: `
    <ngx-gantt
      [items]="items"
      (linkDragStarted)="onLinkDragStarted($event)"
      (linkDragEnded)="onLinkDragEnded($event)"
      (lineClick)="onLineClick($event)"
    >
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
    console.log('开始创建依赖', event.source);
  }

  onLinkDragEnded(event: GanttLinkDragEvent) {
    // 更新依赖数据
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

  onLineClick(event: GanttLineClickEvent) {
    console.log('点击了连线', event.source, event.target);
    // 显示依赖详情或删除依赖
  }
}
```

## 连线样式定制

### 自定义连线颜色

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

### 连线样式配置

通过 `linkOptions` 配置连线类型和箭头显示：

```typescript
linkOptions: {
  lineType: 'straight', // 'curve'（默认，曲线）| 'straight'（直线）
  showArrow: true       // 是否在连线末端显示箭头
}
```

## 依赖配置

依赖配置支持全局配置和组件级别配置：

```typescript
// 全局配置
import { GANTT_GLOBAL_CONFIG } from '@worktile/gantt';

@Component({
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        linkOptions: {
          dependencyTypes: [GanttLinkType.fs], // 允许的依赖类型
          showArrow: false,
          lineType: 'curve'
        }
      }
    }
  ]
})
export class AppComponent {}

// 组件级别配置
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

## 完整示例

```typescript
import { Component } from '@angular/core';
import { GanttItem, GanttViewType, GanttLinkDragEvent, GanttLinkType } from '@worktile/gantt';

@Component({
  template: `
    <ngx-gantt [items]="items" [viewType]="viewType" [linkable]="true" (linkDragEnded)="onLinkDragEnded($event)">
      <ngx-gantt-table>
        <ngx-gantt-column name="任务" width="200px">
          <ng-template #cell let-item="item">{{ item.title }}</ng-template>
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

### Q: 如何删除依赖？

**A:** 从任务的 `links` 数组中移除对应的依赖：

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

### Q: 如何限制只能创建特定类型的依赖？

**A:** 在 `linkOptions.dependencyTypes` 中指定允许的类型：

```typescript
linkOptions: {
  dependencyTypes: [GanttLinkType.fs]; // 只允许 fs 类型
}
```

### Q: 依赖连线不显示？

**A:** 检查：

1. `linkable` 是否为 `true`
2. 任务的 `linkable` 属性是否为 `true`（默认值）
3. `links` 数组中的任务 ID 是否存在

## 相关链接

- [数据模型](guides/core-concepts/data-model) - 了解 links 字段的结构
- [Bar 显示与交互](guides/features/bar-interaction) - 了解任务条交互
- [全局配置](guides/configuration) - 了解依赖的全局配置
