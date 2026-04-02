---
title: v21 Upgrade Migration Guide (Important)
path: 'upgrade-to-21'
order: 120
---

## Upgrade Preparation

Before starting the migration, make sure you complete the following preparations:

1. **Environment requirements**: confirm that the host project's Angular version has been upgraded to **>= 21.0.0**
2. **Branch management**: it is recommended to perform the work on an independent `feature/upgrade-to-v21` branch

---

## 1. View (View) Configuration Migration

View configuration options have undergone semantic renaming and integrated scroll-loading related logic.

### 1.1 Field Renaming

Some fields in the previous version have been marked as deprecated or removed. Replace them according to the following mapping table:

| Old Field (v20)         | New Field (v21)                      | Description                           |
| :---------------------- | :----------------------------------- | :------------------------------------ |
| `min` / `max`           | **`minBoundary` / `maxBoundary`**    | Clarifies boundary semantics          |
| `cellWidth`             | **`unitWidth`**                      | Width of the minimum tick unit        |
| `addAmount` / `addUnit` | **`loadDuration: { amount, unit }`** | Step configuration for scroll loading |
| `datePrecisionUnit`     | **`precisionUnit`**                  | Precision unit                        |
| `dragPreviewDateFormat` | **`dragTooltipFormat`**              | Drag tooltip format                   |
| `hoilday`               | **`holiday`**                        | Fix spelling error                    |

### 1.2 Migration Example

```typescript
// ❌ Old v20 configuration
const viewOptions = {
  cellWidth: 40,
  addAmount: 1,
  addUnit: 'month',
  hoilday: { isHoliday: true },
  datePrecisionUnit: 'day'
};

// ✅ New v21 configuration
const viewOptions = {
  unitWidth: 40,
  loadDuration: { amount: 1, unit: 'month' }, // Structured merge
  holiday: { isHoliday: true }, // Spelling correction
  precisionUnit: 'day'
};
```

> [!CAUTION]
> **Runtime validation**: v21 adds a non-empty assertion to `loadDuration` internally. If you define a custom View, you must provide this configuration; otherwise, horizontal scrolling that triggers `extendStart/End` will throw an exception.

---

## 2. Custom View (Custom View) Abstract Class Migration

If you implemented a custom view by extending `GanttView`, update the following abstract methods:

| Old Method (v20)                  | New Method (v21)                      | Return Value Changes                        |
| :-------------------------------- | :------------------------------------ | :------------------------------------------ |
| `viewStartOf()` / `viewEndOf()`   | **`rangeStartOf()` / `rangeEndOf()`** | -                                           |
| `getPrimaryWidth()`               | **`getPeriodWidth()`**                | -                                           |
| `getDayOccupancyWidth()`          | **`getDayWidth()`**                   | -                                           |
| `getPrimaryDatePoints()`          | **`getPeriodTicks()`**                | `GanttDatePoint[]` -> **`GanttViewTick[]`** |
| `getSecondaryDatePoints()`        | **`getUnitTicks()`**                  | `GanttDatePoint[]` -> **`GanttViewTick[]`** |
| `addStartDate()` / `addEndDate()` | **`extendStart()` / `extendEnd()`**   | Logic renamed                               |

---

## 3. i18n Configuration Structure Migration

To support more flexible tick display, the time-axis text format has moved from `dateFormats` to `tickFormats`.

- **Old structure**: `views[viewType].dateFormats: { primary, secondary }`
- **New structure**: `views[viewType].tickFormats: { period, unit }`

```typescript
// v21 i18n example
const localeConfig = {
  id: 'zh-cn',
  views: {
    day: {
      label: 'Day',
      tickFormats: {
        period: 'YYYY-MM', // corresponds to original primary
        unit: 'D' // corresponds to original secondary
      }
    }
  }
};
```

---

## 4. Global Configuration & Theming System

### 4.1 Style Field Changes

The old `styleOptions.lineHeight` has been renamed to `rowHeight` to more accurately describe the Gantt row height.

> **Note**: v21 keeps backward compatibility for `lineHeight`, but it will print a deprecation warning in the console. It is recommended that you replace it immediately.

### 4.2 New Theme Configuration

v21 introduces a more systematic theme configuration and supports defining multiple color schemes through the `themes` field.

```typescript
styleOptions: {
  rowHeight: 44,
  defaultTheme: 'default',
  primaryColor: '#1890ff', // Quickly override the primary tone
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

## 5. Type & Constant Replacement Checklist

Please globally search and replace the following removed public exports:

### 5.1 Data Model Replacement

- **`GanttDatePoint` (deleted)**: use **`GanttViewTick`** uniformly.
  - `point.leftX` -> `point.rect.x`
  - `point.start` -> `point.date`
- **`LinkColors` (deleted)**: colors are now configured directly via the `GanttLink` object.

### 5.2 Layout Constant Replacement

If your component logic directly references layout constants, update the import paths:

| Old Constant Name       | New Constant Name        |
| :---------------------- | :----------------------- |
| `primaryDatePointTop`   | **`PRIMARY_TICK_TOP`**   |
| `secondaryDatePointTop` | **`SECONDARY_TICK_TOP`** |

---

## 6. Verification Checklist

After completing your code changes, make sure you cover the following testing scenarios:

- **Compilation check**: ensure there are no TypeScript errors related to `GanttDatePoint` or the old fields
- **Rendering verification**: confirm that the primary/secondary text in the time-axis header (Header) is displayed correctly
- **Scrolling functionality**: when scrolling fully left/right, can it load new-range data correctly? (Load Duration test)
- **Interaction regression**: when dragging a Task, verify that the Tooltip format is correct and that link line colors match expectations
- **Theme validation**: if you use a custom theme, check background and text colors in both dark/light modes

---

_If you encounter any issues during the migration process, please submit feedback via a GitHub Issue._
