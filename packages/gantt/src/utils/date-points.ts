import { GanttDatePoint } from '../class/date-point';
import { GanttViewType } from '../class/view-type';
import { GanttDate } from './date';

/**
 * 判断给定的日期是否在 secondaryDatePoints 数据中包含
 * @param date 要检查的日期，可以是 Date、string 或 number 类型
 * @param secondaryDatePoints 次要日期点数组
 * @param viewType 视图类型
 * @returns 如果日期在 secondaryDatePoints 中包含则返回 true，否则返回 false
 */
export function isDateInSecondaryDatePoints(
    date: Date | string | number,
    secondaryDatePoints: GanttDatePoint[],
    viewType: GanttViewType | string
): boolean {
    if (!secondaryDatePoints || secondaryDatePoints.length === 0) {
        return false;
    }
    const targetDate = new GanttDate(date);
    switch (viewType) {
        case GanttViewType.hour:
            return isHourInPoints(secondaryDatePoints, targetDate);
        case GanttViewType.day:
            return isDayInPoints(secondaryDatePoints, targetDate);
        case GanttViewType.week:
            return isWeekInPoints(secondaryDatePoints, targetDate);
        case GanttViewType.month:
            return isMonthInPoints(secondaryDatePoints, targetDate);
        case GanttViewType.quarter:
            return isQuarterInPoints(secondaryDatePoints, targetDate);
        case GanttViewType.year:
            return isYearInPoints(secondaryDatePoints, targetDate);
        default:
            return secondaryDatePoints.some((point) => point.start && point.start.value?.getTime() === targetDate.value?.getTime());
    }
}

export function isHourInPoints(secondaryDatePoints: GanttDatePoint[], targetDate: GanttDate): boolean {
    return !!secondaryDatePoints.some(
        (point) =>
            point.start &&
            point.start.getYear() === targetDate.getYear() &&
            point.start.getMonth() === targetDate.getMonth() &&
            point.start.getDate() === targetDate.getDate() &&
            point.start.getHours() === targetDate.getHours()
    );
}

export function isDayInPoints(secondaryDatePoints: GanttDatePoint[], targetDate: GanttDate): boolean {
    return !!secondaryDatePoints.some(
        (point) =>
            point.start &&
            point.start.getYear() === targetDate.getYear() &&
            point.start.getMonth() === targetDate.getMonth() &&
            point.start.getDate() === targetDate.getDate()
    );
}

export function isWeekInPoints(secondaryDatePoints: GanttDatePoint[], targetDate: GanttDate): boolean {
    return !!secondaryDatePoints.some(
        (point) => point.start && point.start.getYear() === targetDate.getYear() && point.start.getWeek() === targetDate.getWeek()
    );
}

export function isMonthInPoints(secondaryDatePoints: GanttDatePoint[], targetDate: GanttDate): boolean {
    return !!secondaryDatePoints.some(
        (point) => point.start && point.start.getYear() === targetDate.getYear() && point.start.getMonth() === targetDate.getMonth()
    );
}

export function isQuarterInPoints(secondaryDatePoints: GanttDatePoint[], targetDate: GanttDate): boolean {
    return !!secondaryDatePoints.some(
        (point) =>
            point.start &&
            point.start.getYear() === targetDate.getYear() &&
            Math.floor(point.start.getMonth() / 3) === Math.floor(targetDate.getMonth() / 3)
    );
}

export function isYearInPoints(secondaryDatePoints: GanttDatePoint[], targetDate: GanttDate): boolean {
    return !!secondaryDatePoints.some((point) => point.start && point.start.getYear() === targetDate.getYear());
}
