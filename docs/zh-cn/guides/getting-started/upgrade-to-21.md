---
title: v21 升级迁移指南（重要）
path: 'upgrade-to-21'
order: 120
---

## 升级前准备

在开始迁移之前，请确保完成以下准备工作：

1.  **环境要求**：确认宿主项目的 Angular 版本已升级至 **>= 21.0.0**。
2.  **分支管理**：建议在独立的 `feature/upgrade-to-v21` 分支进行操作。

---

## 1. 视图（View）配置迁移

视图配置项进行了语义化重命名，并整合了滚动加载相关的逻辑。

### 1.1 字段重命名

旧版中的部分字段已被标记为废弃或移除，请按以下对照表进行替换：

| 旧字段 (v20)            | 新字段 (v21)                         | 说明               |
| :---------------------- | :----------------------------------- | :----------------- |
| `min` / `max`           | **`minBoundary` / `maxBoundary`**    | 明确边界含义       |
| `cellWidth`             | **`unitWidth`**                      | 最小刻度单位宽度   |
| `addAmount` / `addUnit` | **`loadDuration: { amount, unit }`** | 滚动加载的步进配置 |
| `datePrecisionUnit`     | **`precisionUnit`**                  | 精度单位           |
| `dragPreviewDateFormat` | **`dragTooltipFormat`**              | 拖拽提示格式       |
| `hoilday`               | **`holiday`**                        | 修正拼写错误       |

### 1.2 迁移示例

```typescript
// ❌ 旧版 v20 配置
const viewOptions = {
  cellWidth: 40,
  addAmount: 1,
  addUnit: 'month',
  hoilday: { isHoliday: true },
  datePrecisionUnit: 'day'
};

// ✅ 新版 v21 配置
const viewOptions = {
  unitWidth: 40,
  loadDuration: { amount: 1, unit: 'month' }, // 结构化合并
  holiday: { isHoliday: true }, // 拼写修正
  precisionUnit: 'day'
};
```

> [!CAUTION]
> **运行时校验**：新版内部对 `loadDuration` 增加了非空断言。如果你定义了自定义 View，请务必提供该配置，否则在横向滚动触发 `extendStart/End` 时会抛出异常。

---

## 2. 自定义视图（Custom View）抽象类迁移

如果你通过继承 `GanttView` 实现过自定义视图，需要更新以下抽象方法：

| 旧版方法 (v20)                    | 新版方法 (v21)                        | 返回值变化                                  |
| :-------------------------------- | :------------------------------------ | :------------------------------------------ |
| `viewStartOf()` / `viewEndOf()`   | **`rangeStartOf()` / `rangeEndOf()`** | -                                           |
| `getPrimaryWidth()`               | **`getPeriodWidth()`**                | -                                           |
| `getDayOccupancyWidth()`          | **`getDayWidth()`**                   | -                                           |
| `getPrimaryDatePoints()`          | **`getPeriodTicks()`**                | `GanttDatePoint[]` -> **`GanttViewTick[]`** |
| `getSecondaryDatePoints()`        | **`getUnitTicks()`**                  | `GanttDatePoint[]` -> **`GanttViewTick[]`** |
| `addStartDate()` / `addEndDate()` | **`extendStart()` / `extendEnd()`**   | 逻辑重命名                                  |

---

## 3. 国际化（i18n）配置结构迁移

为了支持更灵活的刻度展示，时间轴文字格式从 `dateFormats` 迁移至 `tickFormats`。

- **旧结构**：`views[viewType].dateFormats: { primary, secondary }`
- **新结构**：`views[viewType].tickFormats: { period, unit }`

```typescript
// v21 i18n 示例
const localeConfig = {
  id: 'zh-cn',
  views: {
    day: {
      label: '天',
      tickFormats: {
        period: 'YYYY年MM月', // 对应原 primary
        unit: 'D' // 对应原 secondary
      }
    }
  }
};
```

---

## 4. 全局配置与主题系统

### 4.1 样式字段变更

旧版 `styleOptions.lineHeight` 现更名为 `rowHeight`，以更准确地描述甘特图的行高。

> **注意**：v21 目前对 `lineHeight` 保持向下兼容，但会在控制台打印弃用警告，建议立即替换。

### 4.2 全新主题配置

v21 引入了更加系统的主题配置，支持通过 `themes` 字段定义多套配色方案。

```typescript
styleOptions: {
  rowHeight: 44,
  defaultTheme: 'default',
  primaryColor: '#1890ff', // 快速覆盖主色调
  themes: {
    default: {
      primary: '#1890ff',
      background: '#ffffff',
      text: { main: '#333333' },
      gray: { 100: '#fafafa', 500: '#d9d9d9' }
    }
  }
}
```

---

## 5. 类型与常量替换清单

请全局搜索并替换以下已移除的公共导出项：

### 5.1 数据模型替换

- **`GanttDatePoint` (已删除)**：统一使用 **`GanttViewTick`**。
  - `point.leftX` -> `point.rect.x`
  - `point.start` -> `point.date`
- **`LinkColors` (已删除)**：现通过 `GanttLink` 对象直接配置颜色。

### 5.2 布局常量替换

如果你的组件逻辑中直接引用了布局常量，请更新 Import 路径：

| 旧常量名                | 新常量名                 |
| :---------------------- | :----------------------- |
| `primaryDatePointTop`   | **`PRIMARY_TICK_TOP`**   |
| `secondaryDatePointTop` | **`SECONDARY_TICK_TOP`** |

---

## 6. 验证清单（Checklist）

完成代码修改后，请务必覆盖以下测试场景：

- **编译检查**：确保无 `GanttDatePoint` 或旧字段相关的 TypeScript 报错。
- **渲染核对**：时间轴头部（Header）的主次文字是否显示正常。
- **滚动功能**：向左/右滚动到底时，是否能正常加载新范围的数据（Load Duration 测试）。
- **交互回归**：拖拽 Task 时的 Tooltip 格式是否正确，链接线颜色是否符合预期。
- **主题校验**：如果使用了自定义主题，检查背景色和文字颜色在暗色/亮色模式下的表现。

---

\_如在迁移过程中遇到任何问题，请在 GitHub Issue 中提交反馈。
