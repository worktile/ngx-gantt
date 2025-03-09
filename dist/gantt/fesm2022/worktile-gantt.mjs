import * as i1 from '@angular/cdk/drag-drop';
import { CdkDrag, CdkDropList, CdkDragHandle, DragDropModule } from '@angular/cdk/drag-drop';
import * as i1$1 from '@angular/cdk/scrolling';
import { CdkScrollable, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, ScrollingModule } from '@angular/cdk/scrolling';
import { isPlatformServer, NgIf, NgTemplateOutlet, NgStyle, NgFor, NgClass, DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable, Inject, EventEmitter, Directive, Input, Output, ContentChild, HostBinding, signal, PLATFORM_ID, effect, Component, ViewChild, ViewChildren, Pipe, ElementRef, Optional, HostListener, forwardRef, ChangeDetectionStrategy, ContentChildren, NgModule } from '@angular/core';
import { fromUnixTime, getWeek, getDaysInMonth, differenceInCalendarDays, setDate, addSeconds, addMinutes, addHours, addDays, addWeeks, addMonths, addQuarters, addYears, startOfMinute, startOfHour, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfMinute, endOfHour, endOfDay, endOfWeek, endOfMonth, endOfQuarter, endOfYear, getUnixTime, format, isWeekend, isToday, differenceInHours, differenceInMinutes, differenceInDays, differenceInCalendarQuarters, eachMonthOfInterval, eachYearOfInterval, eachWeekOfInterval, eachDayOfInterval, differenceInCalendarYears, eachHourOfInterval, setDefaultOptions } from 'date-fns';
export { addDays, addHours, addMinutes, addMonths, addQuarters, addSeconds, addWeeks, addYears, differenceInCalendarDays, differenceInCalendarQuarters, differenceInDays, differenceInMinutes, eachDayOfInterval, eachHourOfInterval, eachMonthOfInterval, eachWeekOfInterval, endOfDay, endOfHour, endOfMinute, endOfMonth, endOfQuarter, endOfWeek, endOfYear, format, fromUnixTime, getDaysInMonth, getUnixTime, getWeek, isToday, isWeekend, setDate, startOfDay, startOfHour, startOfMinute, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from 'date-fns';
import { BehaviorSubject, Subject, from, fromEvent, merge, Observable, EMPTY, interval, animationFrameScheduler, take as take$1, takeUntil as takeUntil$1, combineLatest, startWith as startWith$1, auditTime as auditTime$1, filter } from 'rxjs';
import { take, takeUntil, skip, map, pairwise, auditTime, startWith, switchMap, debounceTime, finalize } from 'rxjs/operators';
import { TZDate } from '@date-fns/tz';
import { de, ru } from 'date-fns/locale';
import { SelectionModel } from '@angular/cdk/collections';
import { coerceBooleanProperty, coerceCssPixelValue } from '@angular/cdk/coercion';
import { __decorate, __param } from 'tslib';

class GanttDatePoint {
    constructor(start, text, x, y, additions, style) {
        this.start = start;
        this.text = text;
        this.x = x;
        this.y = y;
        this.additions = additions;
        this.style = style;
    }
}

class GanttDragEvent {
}
class GanttTableEvent {
}
class GanttLinkDragEvent {
}
class GanttLoadOnScrollEvent {
}
class GanttLineClickEvent {
}
class GanttBarClickEvent {
}
class GanttTableItemClickEvent {
}
class GanttSelectedEvent extends GanttTableItemClickEvent {
}
class GanttTableDragDroppedEvent {
}
class GanttTableDragStartedEvent {
}
class GanttTableDragEndedEvent {
}
class GanttTableDragEnterPredicateContext {
}
class GanttVirtualScrolledIndexChangeEvent {
}

let timeZone;
function setDefaultTimeZone(zone) {
    timeZone = zone ?? undefined;
}
function getDefaultTimeZone() {
    return timeZone;
}
class GanttDate {
    constructor(date) {
        if (date) {
            if (date instanceof Date) {
                this.value = date;
            }
            else if (typeof date === 'string' || typeof date === 'number') {
                if (date.toString().length < 13) {
                    this.value = new TZDate(fromUnixTime(+date), timeZone);
                }
                else {
                    this.value = new TZDate(date, timeZone);
                }
            }
            else {
                throw new Error(`The input date type is not supported expect Date | string
                     | number | { date: number; with_time: 0 | 1}, actual ${JSON.stringify(date)}`);
            }
        }
        else {
            this.value = new TZDate(new Date(), timeZone);
        }
    }
    getYear() {
        return this.value.getFullYear();
    }
    getMonth() {
        return this.value.getMonth();
    }
    getDay() {
        return this.value.getDay();
    }
    getTime() {
        return this.value.getTime();
    }
    getDate() {
        return this.value.getDate();
    }
    getHours() {
        return this.value.getHours();
    }
    getMinutes() {
        return this.value.getMinutes();
    }
    getSeconds() {
        return this.value.getSeconds();
    }
    getMilliseconds() {
        return this.value.getMilliseconds();
    }
    getWeek(options) {
        return getWeek(this.value, options);
    }
    getDaysInMonth() {
        return getDaysInMonth(this.value);
    }
    getDaysInQuarter() {
        return differenceInCalendarDays(this.endOfQuarter().addSeconds(1).value, this.startOfQuarter().value);
    }
    getDaysInYear() {
        return differenceInCalendarDays(this.endOfYear().addSeconds(1).value, this.startOfYear().value);
    }
    setDate(dayOfMonth) {
        return new GanttDate(setDate(this.value, dayOfMonth));
    }
    clone() {
        return new GanttDate(new Date(this.value));
    }
    add(amount, unit) {
        switch (unit) {
            case 'second':
                return new GanttDate(this.value).addSeconds(amount);
            case 'minute':
                return new GanttDate(this.value).addMinutes(amount);
            case 'hour':
                return new GanttDate(this.value).addHours(amount);
            case 'day':
                return new GanttDate(this.value).addDays(amount);
            case 'week':
                return new GanttDate(this.value).addWeeks(amount);
            case 'month':
                return new GanttDate(this.value).addMonths(amount);
            case 'quarter':
                return new GanttDate(this.value).addQuarters(amount);
            case 'year':
                return new GanttDate(this.value).addYears(amount);
            default:
                return new GanttDate(this.value).addSeconds(amount);
        }
    }
    addSeconds(amount) {
        return new GanttDate(addSeconds(this.value, amount));
    }
    addMinutes(amount) {
        return new GanttDate(addMinutes(this.value, amount));
    }
    addHours(amount) {
        return new GanttDate(addHours(this.value, amount));
    }
    addDays(amount) {
        return new GanttDate(addDays(this.value, amount));
    }
    addWeeks(amount) {
        return new GanttDate(addWeeks(this.value, amount));
    }
    addMonths(amount) {
        return new GanttDate(addMonths(this.value, amount));
    }
    addQuarters(amount) {
        return new GanttDate(addQuarters(this.value, amount));
    }
    addYears(amount) {
        return new GanttDate(addYears(this.value, amount));
    }
    startOfMinute() {
        return new GanttDate(startOfMinute(this.value));
    }
    startOfHour() {
        return new GanttDate(startOfHour(this.value));
    }
    startOfDay() {
        return new GanttDate(startOfDay(this.value));
    }
    startOfWeek(options) {
        return new GanttDate(startOfWeek(this.value, options));
    }
    startOfMonth() {
        return new GanttDate(startOfMonth(this.value));
    }
    startOfQuarter() {
        return new GanttDate(startOfQuarter(this.value));
    }
    startOfYear() {
        return new GanttDate(startOfYear(this.value));
    }
    endOfMinute() {
        return new GanttDate(endOfMinute(this.value));
    }
    endOfHour() {
        return new GanttDate(endOfHour(this.value));
    }
    endOfDay() {
        return new GanttDate(endOfDay(this.value));
    }
    endOfWeek(options) {
        return new GanttDate(endOfWeek(this.value, options));
    }
    endOfMonth() {
        return new GanttDate(endOfMonth(this.value));
    }
    endOfQuarter() {
        return new GanttDate(endOfQuarter(this.value));
    }
    endOfYear() {
        return new GanttDate(endOfYear(this.value));
    }
    getUnixTime() {
        return getUnixTime(this.value);
    }
    format(mat, options) {
        return format(this.value, mat, options);
    }
    isWeekend() {
        return isWeekend(this.value);
    }
    isToday() {
        return isToday(this.value);
    }
}

var GanttLinkType;
(function (GanttLinkType) {
    GanttLinkType[GanttLinkType["fs"] = 1] = "fs";
    GanttLinkType[GanttLinkType["ff"] = 2] = "ff";
    GanttLinkType[GanttLinkType["ss"] = 3] = "ss";
    GanttLinkType[GanttLinkType["sf"] = 4] = "sf";
})(GanttLinkType || (GanttLinkType = {}));
var GanttLinkLineType;
(function (GanttLinkLineType) {
    GanttLinkLineType["curve"] = "curve";
    GanttLinkLineType["straight"] = "straight";
})(GanttLinkLineType || (GanttLinkLineType = {}));
var LinkColors;
(function (LinkColors) {
    LinkColors["default"] = "#cacaca";
    LinkColors["blocked"] = "#FF7575";
    LinkColors["active"] = "#6698ff";
})(LinkColors || (LinkColors = {}));

const DEFAULT_FILL_INCREMENT_WIDTH = 120;
var GanttItemType;
(function (GanttItemType) {
    GanttItemType["bar"] = "bar";
    GanttItemType["range"] = "range";
    GanttItemType["custom"] = "custom";
})(GanttItemType || (GanttItemType = {}));
class GanttItemInternal {
    get refs() {
        return this.refs$.getValue();
    }
    constructor(item, level, view) {
        this.view = view;
        this.refs$ = new BehaviorSubject(null);
        this.origin = item;
        this.id = this.origin.id;
        this.links = (this.origin.links || []).map((link) => {
            if (typeof link === 'string') {
                return {
                    type: GanttLinkType.fs,
                    link
                };
            }
            else {
                return link;
            }
        });
        this.color = this.origin.color;
        this.barStyle = this.origin.barStyle;
        this.linkable = this.origin.linkable === undefined ? true : this.origin.linkable;
        this.draggable = this.origin.draggable === undefined ? true : this.origin.draggable;
        this.itemDraggable = this.origin.itemDraggable;
        this.expandable = this.origin.expandable || (this.origin.children || []).length > 0;
        this.expanded = this.origin.expanded === undefined ? false : this.origin.expanded;
        this.start = item.start ? new GanttDate(item.start) : null;
        this.end = item.end ? new GanttDate(item.end) : null;
        this.level = level;
        this.children = (item.children || []).map((subItem) => {
            return new GanttItemInternal(subItem, level + 1, view);
        });
        this.type = this.origin.type || GanttItemType.bar;
        this.progress = this.origin.progress;
        this.fillDateWhenStartOrEndIsNil(item);
    }
    fillDateWhenStartOrEndIsNil(item) {
        if (this.view) {
            if (item.start && !item.end) {
                this.end = this.view.getDateByXPoint(this.view.getXPointByDate(new GanttDate(item.start)) + DEFAULT_FILL_INCREMENT_WIDTH);
            }
            if (!item.start && item.end) {
                this.start = this.view.getDateByXPoint(this.view.getXPointByDate(new GanttDate(item.end)) - DEFAULT_FILL_INCREMENT_WIDTH);
            }
        }
    }
    updateRefs(refs) {
        this.refs$.next(refs);
    }
    updateDate(start, end) {
        this.start = start;
        this.end = end;
        this.origin.start = this.start.getUnixTime();
        this.origin.end = this.end.getUnixTime();
    }
    updateLevel(level) {
        this.level = level;
    }
    addChildren(items) {
        this.origin.children = items;
        this.children = (items || []).map((subItem) => {
            return new GanttItemInternal(subItem, this.level + 1, this.view);
        });
    }
    setExpand(expanded) {
        this.expanded = expanded;
        this.origin.expanded = expanded;
    }
    addLink(link) {
        this.links = [...this.links, link];
        this.origin.links = this.links;
    }
}

class GanttGroupInternal {
    constructor(group) {
        this.refs = {};
        this.id = group.id;
        this.origin = group;
        this.title = group.title;
        this.expanded = group.expanded === undefined ? true : group.expanded;
        this.items = [];
        this.mergedItems = [[]];
        this.class = group.class || '';
    }
    setExpand(expanded) {
        this.expanded = expanded;
        this.origin.expanded = expanded;
    }
}

var GanttViewType;
(function (GanttViewType) {
    GanttViewType["day"] = "day";
    GanttViewType["quarter"] = "quarter";
    GanttViewType["month"] = "month";
    GanttViewType["year"] = "year";
    GanttViewType["week"] = "week";
    GanttViewType["hour"] = "hour";
})(GanttViewType || (GanttViewType = {}));

class GanttBaselineItemInternal {
    get refs() {
        return this.refs$.getValue();
    }
    constructor(item) {
        this.refs$ = new BehaviorSubject(null);
        this.origin = item;
        this.id = this.origin.id;
        this.start = item.start ? new GanttDate(item.start) : null;
        this.end = item.end ? new GanttDate(item.end) : null;
    }
    updateRefs(refs) {
        this.refs$.next(refs);
    }
}

const primaryDatePointTop = '40%';
const secondaryDatePointTop = '80%';
const viewOptions$6 = {
    min: new GanttDate().addYears(-1).startOfYear(),
    max: new GanttDate().addYears(1).endOfYear(),
    datePrecisionUnit: 'day',
    dragPreviewDateFormat: 'MM-dd'
};
class GanttView {
    get start() {
        return this.start$.getValue();
    }
    get end() {
        return this.end$.getValue();
    }
    constructor(start, end, options) {
        this.showTimeline = true;
        this.dateFormats = {};
        this.options = Object.assign({}, viewOptions$6, options);
        const startDate = start.isCustom
            ? this.viewStartOf(start.date)
            : this.viewStartOf(start.date.value < this.options.start.value ? start.date : this.options.start);
        const endDate = end.isCustom
            ? this.viewEndOf(end.date)
            : this.viewEndOf(end.date.value > this.options.end.value ? end.date : this.options.end);
        this.start$ = new BehaviorSubject(startDate);
        this.end$ = new BehaviorSubject(endDate);
        this.initialize();
    }
    /**
     * deprecated, please use viewStartOf()
     * @deprecated
     */
    startOf(date) {
        return this.viewStartOf(date);
    }
    /**
     * deprecated, please use viewEndOf()
     * @deprecated
     */
    endOf(date) {
        return this.viewEndOf(date);
    }
    startOfPrecision(date) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return date.startOfMinute();
            case 'hour':
                return date.startOfHour();
            default:
                return date.startOfDay();
        }
    }
    endOfPrecision(date) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return date.endOfMinute();
            case 'hour':
                return date.endOfHour();
            default:
                return date.endOfDay();
        }
    }
    differenceByPrecisionUnit(dateLeft, dateRight) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return differenceInMinutes(dateLeft.value, dateRight.value);
            case 'hour':
                return differenceInHours(dateLeft.value, dateRight.value);
            default:
                return differenceInCalendarDays(dateLeft.value, dateRight.value);
        }
    }
    getDateIntervalWidth(start, end) {
        let result = 0;
        const days = differenceInDays(end.value, start.value);
        for (let i = 0; i < Math.abs(days); i++) {
            result += this.getDayOccupancyWidth(start.addDays(i));
        }
        result = days >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }
    initialize() {
        this.primaryDatePoints = this.getPrimaryDatePoints();
        this.secondaryDatePoints = this.getSecondaryDatePoints();
        this.width = this.getWidth();
        this.cellWidth = this.getCellWidth();
        this.primaryWidth = this.getPrimaryWidth();
    }
    addStartDate() {
        const start = this.viewStartOf(this.start.add(this.options.addAmount * -1, this.options.addUnit));
        if (start.value >= this.options.min.value) {
            const origin = this.start;
            this.start$.next(start);
            this.initialize();
            return { start: this.start, end: origin };
        }
        return null;
    }
    addEndDate() {
        const end = this.viewEndOf(this.end.add(this.options.addAmount, this.options.addUnit));
        if (end.value <= this.options.max.value) {
            const origin = this.end;
            this.end$.next(end);
            this.initialize();
            return { start: origin, end: this.end };
        }
        return null;
    }
    updateDate(start, end) {
        start = this.viewStartOf(start);
        end = this.viewEndOf(end);
        if (start.value < this.start.value) {
            this.start$.next(start);
        }
        if (end.value > this.end.value) {
            this.end$.next(end);
        }
        this.initialize();
    }
    // 获取View的宽度
    getWidth() {
        return this.getCellWidth() * this.secondaryDatePoints.length;
    }
    // 获取单个网格的宽度
    getCellWidth() {
        return this.options.cellWidth;
    }
    // 获取当前时间的X坐标
    getTodayXPoint() {
        const toady = new GanttDate().startOfDay();
        if (toady.value > this.start.value && toady.value < this.end.value) {
            const x = this.getXPointByDate(toady) + this.getDayOccupancyWidth(toady) / 2;
            return x;
        }
        else {
            return null;
        }
    }
    // 获取指定时间的X坐标
    getXPointByDate(date) {
        return this.getDateIntervalWidth(this.start, date);
    }
    // 根据X坐标获取对应时间
    getDateByXPoint(x) {
        const indexOfSecondaryDate = Math.max(Math.floor(x / this.getCellWidth()), 0);
        const matchDate = this.secondaryDatePoints[Math.min(this.secondaryDatePoints.length - 1, indexOfSecondaryDate)];
        const dayWidth = this.getDayOccupancyWidth(matchDate?.start);
        if (dayWidth === this.getCellWidth()) {
            return matchDate?.start;
        }
        else {
            const day = Math.floor((x % this.getCellWidth()) / dayWidth);
            return matchDate?.start.addDays(day);
        }
    }
    // 获取指定时间范围的宽度
    getDateRangeWidth(start, end) {
        // addSeconds(1) 是因为计算相差天会以一个整天来计算 end时间一般是59分59秒不是一个整天，所以需要加1
        return this.getDateIntervalWidth(this.startOfPrecision(start), this.endOfPrecision(end).addSeconds(1));
    }
    // 根据日期精度获取最小时间范围的宽度
    getMinRangeWidthByPrecisionUnit(date) {
        switch (this.options.datePrecisionUnit) {
            case 'minute':
                return this.getDayOccupancyWidth(date) / 24 / 60;
            case 'hour':
                return this.getDayOccupancyWidth(date) / 24;
            default:
                return this.getDayOccupancyWidth(date);
        }
    }
}

var GanttI18nLocale;
(function (GanttI18nLocale) {
    GanttI18nLocale["zhHans"] = "zh-hans";
    GanttI18nLocale["zhHant"] = "zh-hant";
    GanttI18nLocale["enUs"] = "en-us";
    GanttI18nLocale["deDe"] = "de-de";
    GanttI18nLocale["jaJp"] = "ja-jp";
    GanttI18nLocale["ruRu"] = "ru-ru";
})(GanttI18nLocale || (GanttI18nLocale = {}));
const GANTT_I18N_LOCALE_TOKEN = new InjectionToken('gantt-i18n-locale');

var zhHans = {
    id: GanttI18nLocale.zhHans,
    views: {
        [GanttViewType.hour]: {
            label: '小时',
            dateFormats: {
                primary: 'M月d日',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '天',
            dateFormats: {
                primary: 'yyyy年MM月',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '周',
            dateFormats: {
                primary: 'yyyy年',
                secondary: '第w周'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            dateFormats: {
                primary: `yyyy年'Q'Q`,
                secondary: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '季',
            dateFormats: {
                primary: 'yyyy年',
                secondary: `yyyy年'Q'Q`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            dateFormats: {
                secondary: 'yyyy年'
            }
        }
    }
};

var zhHant = {
    id: GanttI18nLocale.zhHant,
    views: {
        [GanttViewType.hour]: {
            label: '小時',
            dateFormats: {
                primary: 'M月d日',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '天',
            dateFormats: {
                primary: 'yyyy年MM月',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '週',
            dateFormats: {
                primary: 'yyyy年',
                secondary: '第w週'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            dateFormats: {
                primary: `yyyy年'Q'Q`,
                secondary: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '季',
            dateFormats: {
                primary: 'yyyy年',
                secondary: `yyyy年'Q'Q`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            dateFormats: {
                secondary: 'yyyy年'
            }
        }
    }
};

var enUsLocale = {
    id: GanttI18nLocale.enUs,
    views: {
        [GanttViewType.hour]: {
            label: 'Hourly',
            dateFormats: {
                primary: 'MMM d',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Daily',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Weekly',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'wo'
            }
        },
        [GanttViewType.month]: {
            label: 'Monthly',
            dateFormats: {
                primary: "yyyy 'Q'Q",
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Quarterly',
            dateFormats: {
                primary: 'yyyy',
                secondary: "yyyy 'Q'Q"
            }
        },
        [GanttViewType.year]: {
            label: 'Yearly',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};

var jaJpLocale = {
    id: GanttI18nLocale.jaJp,
    views: {
        [GanttViewType.hour]: {
            label: '毎時',
            dateFormats: {
                primary: 'M月d日',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '日',
            dateFormats: {
                primary: 'yyyy年M月d日',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '週',
            dateFormats: {
                primary: 'yyyy年',
                secondary: '第w週'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            dateFormats: {
                primary: `yyyy年M月`,
                secondary: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '四半期',
            dateFormats: {
                primary: 'yyyy年',
                secondary: `yyyy年第Q四半期`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            dateFormats: {
                secondary: 'yyyy年'
            }
        }
    }
};

var deDeLocale = {
    id: GanttI18nLocale.deDe,
    dateLocale: de,
    views: {
        [GanttViewType.hour]: {
            label: 'Stündlich',
            dateFormats: {
                primary: 'dd. MMM',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Täglich',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Wöchentlich',
            dateFormats: {
                primary: 'yyyy',
                secondary: `w. 'Woche'`
            }
        },
        [GanttViewType.month]: {
            label: 'Monatlich',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Vierteljährlich',
            dateFormats: {
                primary: 'yyyy',
                secondary: `Q. 'Quartal' yyyy`
            }
        },
        [GanttViewType.year]: {
            label: 'Jährlich',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};

var ruRuLocale = {
    id: GanttI18nLocale.ruRu,
    dateLocale: ru,
    views: {
        [GanttViewType.hour]: {
            label: 'Ежечасно',
            dateFormats: {
                primary: 'd MMM',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Ежедневно',
            dateFormats: {
                primary: 'MMMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Еженедельно',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'Неделя w'
            }
        },
        [GanttViewType.month]: {
            label: 'Ежемесячно',
            dateFormats: {
                primary: 'MMMM yyyy',
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Ежеквартально',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'Квартал Q yyyy'
            }
        },
        [GanttViewType.year]: {
            label: 'Ежегодно',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};

const i18nLocaleProvides = [
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: zhHans, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: zhHant, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: enUsLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: jaJpLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: deDeLocale, multi: true },
    { provide: GANTT_I18N_LOCALE_TOKEN, useValue: ruRuLocale, multi: true }
];

const viewOptions$5 = {
    start: new GanttDate().startOfQuarter().addQuarters(-1),
    end: new GanttDate().endOfQuarter().addQuarters(2),
    cellWidth: 280,
    addAmount: 1,
    addUnit: 'quarter',
    dateDisplayFormats: zhHant.views.month.dateFormats
};
class GanttViewMonth extends GanttView {
    constructor(start, end, options) {
        super(start, end, Object.assign({}, viewOptions$5, options));
        this.viewType = GanttViewType.month;
    }
    viewStartOf(date) {
        return date.startOfQuarter();
    }
    viewEndOf(date) {
        return date.endOfQuarter();
    }
    getPrimaryWidth() {
        return this.getCellWidth() * 3;
    }
    getDayOccupancyWidth(date) {
        return this.cellWidth / date.getDaysInMonth();
    }
    getPrimaryDatePoints() {
        const quarters = differenceInCalendarQuarters(this.end.addSeconds(1).value, this.start.value);
        const points = [];
        for (let i = 0; i < quarters; i++) {
            const start = this.start.addQuarters(i);
            const point = new GanttDatePoint(start, start.format(this.options.dateFormat?.yearQuarter || this.options.dateDisplayFormats.primary), (this.getCellWidth() * 3) / 2 + i * (this.getCellWidth() * 3), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }
    getSecondaryDatePoints() {
        const months = eachMonthOfInterval({ start: this.start.value, end: this.end.value });
        const points = [];
        for (let i = 0; i < months.length; i++) {
            const start = new GanttDate(months[i]);
            const point = new GanttDatePoint(start, start.format(this.options.dateFormat?.month || this.options.dateDisplayFormats.secondary), i * this.getCellWidth() + this.getCellWidth() / 2, secondaryDatePointTop);
            points.push(point);
        }
        return points;
    }
}

const viewOptions$4 = {
    start: new GanttDate().addYears(-1).startOfYear(),
    end: new GanttDate().addYears(1).endOfYear(),
    min: new GanttDate().addYears(-2).startOfYear(),
    max: new GanttDate().addYears(2).endOfYear(),
    cellWidth: 500,
    addAmount: 1,
    addUnit: 'year',
    dateDisplayFormats: zhHant.views.quarter.dateFormats
};
class GanttViewQuarter extends GanttView {
    constructor(start, end, options) {
        super(start, end, Object.assign({}, viewOptions$4, options));
        this.viewType = GanttViewType.quarter;
    }
    viewStartOf(date) {
        return date.startOfYear();
    }
    viewEndOf(date) {
        return date.endOfYear();
    }
    getPrimaryWidth() {
        return this.getCellWidth() * 4;
    }
    getDayOccupancyWidth(date) {
        return this.cellWidth / date.getDaysInQuarter();
    }
    getPrimaryDatePoints() {
        const years = eachYearOfInterval({ start: this.start.value, end: this.end.value });
        const points = [];
        for (let i = 0; i < years.length; i++) {
            const start = new GanttDate(years[i]);
            const point = new GanttDatePoint(start, `${start.format(this.options.dateFormat?.year || this.options.dateDisplayFormats.primary)}`, (this.getCellWidth() * 4) / 2 + i * (this.getCellWidth() * 4), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }
    getSecondaryDatePoints() {
        const quarters = differenceInCalendarQuarters(this.end.value, this.start.value);
        const points = [];
        for (let i = 0; i <= quarters; i++) {
            const start = this.start.addQuarters(i);
            const point = new GanttDatePoint(start, start.format(this.options.dateFormat?.quarter || this.options.dateDisplayFormats.secondary), i * this.getCellWidth() + this.getCellWidth() / 2, secondaryDatePointTop);
            points.push(point);
        }
        return points;
    }
}

const viewOptions$3 = {
    cellWidth: 35,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month',
    dateDisplayFormats: zhHant.views.day.dateFormats
};
class GanttViewDay extends GanttView {
    constructor(start, end, options) {
        super(start, end, Object.assign({}, viewOptions$3, options));
        this.showWeekBackdrop = true;
        this.showTimeline = false;
        this.viewType = GanttViewType.day;
    }
    viewStartOf(date) {
        return date.startOfWeek();
    }
    viewEndOf(date) {
        return date.endOfWeek();
    }
    getPrimaryWidth() {
        return this.getCellWidth() * 7;
    }
    getDayOccupancyWidth() {
        return this.cellWidth;
    }
    getPrimaryDatePoints() {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const points = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const point = new GanttDatePoint(weekStart, weekStart.addWeeks(increaseWeek).format(this.options.dateFormat?.yearMonth || this.options.dateDisplayFormats.primary), (this.getCellWidth() * 7) / 2 + i * (this.getCellWidth() * 7), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }
    getSecondaryDatePoints() {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const point = new GanttDatePoint(start, start.format(this.options.dateDisplayFormats.secondary) || start.getDate().toString(), i * this.getCellWidth() + this.getCellWidth() / 2, secondaryDatePointTop, {
                isWeekend: start.isWeekend(),
                isToday: start.isToday()
            });
            points.push(point);
        }
        return points;
    }
}

const viewOptions$2 = {
    cellWidth: 280,
    start: new GanttDate().startOfYear().startOfWeek(),
    end: new GanttDate().endOfYear().endOfWeek(),
    addAmount: 1,
    addUnit: 'month',
    dateDisplayFormats: zhHant.views.week.dateFormats
};
class GanttViewWeek extends GanttView {
    constructor(start, end, options) {
        super(start, end, Object.assign({}, viewOptions$2, options));
        this.viewType = GanttViewType.week;
    }
    viewStartOf(date) {
        return date.startOfWeek();
    }
    viewEndOf(date) {
        return date.endOfWeek();
    }
    getPrimaryWidth() {
        return this.getCellWidth();
    }
    getDayOccupancyWidth() {
        return this.cellWidth / 7;
    }
    getPrimaryDatePoints() {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const points = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const point = new GanttDatePoint(weekStart, weekStart.addWeeks(increaseWeek).format(this.options.dateFormat?.year || this.options.dateDisplayFormats.primary), this.getCellWidth() / 2 + i * this.getCellWidth(), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }
    getSecondaryDatePoints() {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value });
        const points = [];
        for (let i = 0; i < weeks.length; i++) {
            const start = new GanttDate(weeks[i]);
            const point = new GanttDatePoint(start, `${start.format(this.options.dateFormat?.week || this.options.dateDisplayFormats.secondary)}`, i * this.getCellWidth() + this.getCellWidth() / 2, secondaryDatePointTop);
            points.push(point);
        }
        return points;
    }
}

const viewOptions$1 = {
    cellWidth: 480,
    start: new GanttDate().addYears(-2).startOfYear(),
    end: new GanttDate().addYears(2).endOfYear(),
    addAmount: 1,
    addUnit: 'year',
    dateDisplayFormats: zhHant.views.year.dateFormats
};
class GanttViewYear extends GanttView {
    constructor(start, end, options) {
        super(start, end, Object.assign({}, viewOptions$1, options));
        this.viewType = GanttViewType.year;
    }
    viewStartOf(date) {
        return date.startOfYear();
    }
    viewEndOf(date) {
        return date.endOfYear();
    }
    getPrimaryWidth() {
        return this.getCellWidth();
    }
    getDayOccupancyWidth(date) {
        return this.cellWidth / date.getDaysInYear();
    }
    getPrimaryDatePoints() {
        const years = eachYearOfInterval({ start: this.start.value, end: this.end.value });
        const points = [];
        for (let i = 0; i < years.length; i++) {
            const start = new GanttDate(years[i]);
            const point = new GanttDatePoint(start, ``, this.getCellWidth() / 2 + i * this.getCellWidth(), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }
    getSecondaryDatePoints() {
        const years = differenceInCalendarYears(this.end.value, this.start.value);
        const points = [];
        const pointTop = '60%';
        for (let i = 0; i <= years; i++) {
            const start = this.start.addYears(i);
            const point = new GanttDatePoint(start, `${start.format(this.options.dateFormat?.year || this.options.dateDisplayFormats.secondary || this.options.dateDisplayFormats.primary)}`, i * this.getCellWidth() + this.getCellWidth() / 2, pointTop);
            points.push(point);
        }
        return points;
    }
}

const viewOptions = {
    cellWidth: 80,
    start: new GanttDate().startOfMonth(),
    end: new GanttDate().endOfMonth(),
    datePrecisionUnit: 'minute',
    addAmount: 1,
    addUnit: 'week',
    dateDisplayFormats: zhHant.views.hour.dateFormats,
    dragPreviewDateFormat: 'HH:mm'
};
class GanttViewHour extends GanttView {
    constructor(start, end, options) {
        super(start, end, Object.assign({}, viewOptions, options));
        this.showWeekBackdrop = true;
        this.showTimeline = true;
        this.viewType = GanttViewType.hour;
    }
    viewStartOf(date) {
        return date.startOfWeek();
    }
    viewEndOf(date) {
        return date.endOfWeek();
    }
    getPrimaryWidth() {
        return this.getCellWidth() * 24;
    }
    getDayOccupancyWidth() {
        return this.cellWidth * 60;
    }
    getHourOccupancyWidth() {
        return this.getDayOccupancyWidth() / 60;
    }
    getPrimaryDatePoints() {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points = [];
        for (let i = 0; i < days.length; i++) {
            const start = this.start.addDays(i);
            const point = new GanttDatePoint(start, start.format(this.options.dateFormat?.day || this.options.dateDisplayFormats.primary), (this.getCellWidth() * 24) / 2 + i * (this.getCellWidth() * 24), primaryDatePointTop);
            points.push(point);
        }
        return points;
    }
    getSecondaryDatePoints() {
        const hours = eachHourOfInterval({ start: this.start.value, end: this.end.value });
        const points = [];
        for (let i = 0; i < hours.length; i++) {
            const start = new GanttDate(hours[i]);
            const point = new GanttDatePoint(start, start.format(this.options.dateFormat?.hour || this.options.dateDisplayFormats.secondary), i * this.getCellWidth() + this.getCellWidth() / 2, secondaryDatePointTop, {
                isWeekend: start.isWeekend(),
                isToday: start.isToday()
            });
            points.push(point);
        }
        return points;
    }
    getTodayXPoint() {
        const toady = new GanttDate().startOfMinute();
        if (toady.value > this.start.value && toady.value < this.end.value) {
            const x = this.getXPointByDate(toady);
            return x;
        }
        else {
            return null;
        }
    }
    getDateIntervalWidth(start, end) {
        let result = 0;
        const minutes = differenceInMinutes(end.value, start.value);
        for (let i = 0; i < minutes; i++) {
            result += this.getHourOccupancyWidth() / 60;
        }
        result = minutes >= 0 ? result : -result;
        return Number(result.toFixed(3));
    }
    getDateByXPoint(x) {
        const hourWidth = this.getHourOccupancyWidth();
        const indexOfSecondaryDate = Math.max(Math.floor(x / hourWidth), 0);
        const matchDate = this.secondaryDatePoints[Math.min(this.secondaryDatePoints.length - 1, indexOfSecondaryDate)];
        const minuteWidth = hourWidth / 60;
        const underOneHourMinutes = Math.floor((x % hourWidth) / minuteWidth);
        return matchDate?.start.addMinutes(underOneHourMinutes);
    }
}

const ganttViewsMap = {
    [GanttViewType.hour]: GanttViewHour,
    [GanttViewType.day]: GanttViewDay,
    [GanttViewType.week]: GanttViewWeek,
    [GanttViewType.month]: GanttViewMonth,
    [GanttViewType.quarter]: GanttViewQuarter,
    [GanttViewType.year]: GanttViewYear
};
function registerView(type, view) {
    ganttViewsMap[type] = view;
}
function createViewFactory(type, start, end, options) {
    return new ganttViewsMap[type](start, end, options);
}

function isNumber(value) {
    return typeof value === 'number';
}
function isString(value) {
    return typeof value === 'string';
}
function isUndefined(value) {
    return value === undefined;
}
function hexToRgb(color, opacity = 1) {
    if (/^#/g.test(color)) {
        return `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${opacity})`;
    }
    else {
        return color;
    }
}
function uniqBy(array, key) {
    const valuesMap = {};
    const result = [];
    (array || []).forEach((value) => {
        const _key = value[key];
        if (!valuesMap[_key]) {
            valuesMap[_key] = value;
            result.push(value);
        }
    });
    return result;
}
function flatten(array) {
    return array.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}
// export function recursiveItems(items: GanttItemInternal[]) {
//     const result = [];
//     (items || []).forEach((item) => {
//         result.push(item);
//         if (item.expanded && item.children) {
//             result.push(...recursiveItems(item.children));
//         }
//     });
//     return result;
// }
function recursiveItems(items) {
    const result = [];
    (items || []).forEach((item) => {
        result.push(item);
        if (item.expanded && item.children) {
            result.push(...recursiveItems(item.children));
        }
    });
    return result;
}
function getFlatItems(items) {
    const result = [];
    (items || []).forEach((item) => {
        result.push(item);
        if (item.children) {
            result.push(...getFlatItems(item.children));
        }
    });
    return result;
}
function keyBy(array, key) {
    const result = {};
    array.forEach((item) => {
        const keyValue = item[key];
        result[keyValue] = item;
    });
    return result;
}

const defaultConfig = {
    locale: GanttI18nLocale.zhHans,
    linkOptions: {
        dependencyTypes: [GanttLinkType.fs],
        showArrow: false,
        lineType: GanttLinkLineType.curve
    },
    styleOptions: {
        headerHeight: 44,
        lineHeight: 44,
        barHeight: 22
    },
    dateOptions: {
        weekStartsOn: 1
    }
};
const GANTT_GLOBAL_CONFIG = new InjectionToken('GANTT_GLOBAL_CONFIG');
class GanttConfigService {
    constructor(globalConfig) {
        const localeId = globalConfig.locale || defaultConfig.locale;
        this.config = {
            locale: localeId,
            dateFormat: Object.assign({}, defaultConfig.dateFormat, globalConfig.dateFormat),
            styleOptions: Object.assign({}, defaultConfig.styleOptions, globalConfig.styleOptions),
            linkOptions: Object.assign({}, defaultConfig.linkOptions, globalConfig.linkOptions),
            dateOptions: Object.assign({}, defaultConfig.dateOptions, globalConfig.dateOptions)
        };
        this.i18nLocales = inject(GANTT_I18N_LOCALE_TOKEN).reduce((result, localeConfig) => {
            result[localeConfig.id] = localeConfig; // 这里使用 `id` 作为 key
            return result;
        }, {
            ['zh-cn']: zhHans,
            ['zh-tw']: zhHant
        });
        if (this.config.dateOptions?.timeZone) {
            setDefaultTimeZone(this.config.dateOptions.timeZone);
        }
    }
    setLocale(locale) {
        this.config.locale = locale;
    }
    getLocaleConfig() {
        return this.i18nLocales[this.config.locale] ?? this.i18nLocales[this.config.locale.toLowerCase()] ?? zhHans;
    }
    getViewsLocale() {
        return this.getLocaleConfig().views;
    }
    getDateLocale() {
        return this.config.dateOptions?.locale ?? this.getLocaleConfig().dateLocale;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttConfigService, deps: [{ token: GANTT_GLOBAL_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttConfigService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttConfigService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [GANTT_GLOBAL_CONFIG]
                }] }] });

class GanttUpper {
    set linkOptions(options) {
        this._linkOptions = options;
    }
    get linkOptions() {
        return Object.assign({}, this.configService.config.linkOptions, this._linkOptions);
    }
    set selectable(value) {
        this._selectable = coerceBooleanProperty(value);
        if (this._selectable) {
            this.selectionModel = this.initSelectionModel();
        }
        else {
            this.selectionModel?.clear();
        }
    }
    get selectable() {
        return this._selectable;
    }
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
        if (this.selectable) {
            this.selectionModel = this.initSelectionModel();
        }
    }
    get multiple() {
        return this._multiple;
    }
    // public viewChange = new EventEmitter<GanttView>();
    get element() {
        return this.elementRef.nativeElement;
    }
    constructor(elementRef, cdr, ngZone, // @Inject(GANTT_GLOBAL_CONFIG) public config: GanttGlobalConfig
    config) {
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.ngZone = ngZone;
        this.config = config;
        // eslint-disable-next-line @angular-eslint/no-input-rename
        this.originItems = [];
        // eslint-disable-next-line @angular-eslint/no-input-rename
        this.originGroups = [];
        // eslint-disable-next-line @angular-eslint/no-input-rename
        this.originBaselineItems = [];
        this.viewType = GanttViewType.month;
        this.showTodayLine = true;
        this.showToolbar = false;
        this.toolbarOptions = {
            viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
        };
        this.viewOptions = {};
        this.quickTimeFocus = false;
        this.loadOnScroll = new EventEmitter();
        this.dragStarted = new EventEmitter();
        this.dragMoved = new EventEmitter();
        this.dragEnded = new EventEmitter();
        this.barClick = new EventEmitter();
        this.viewChange = new EventEmitter();
        this.expandChange = new EventEmitter();
        this.configService = inject(GanttConfigService);
        this.computeAllRefs = true;
        this.linkDragEnded = new EventEmitter();
        this.items = [];
        this.groups = [];
        this.baselineItems = [];
        this.baselineItemsMap = {};
        this.firstChange = true;
        this.unsubscribe$ = new Subject();
        this._selectable = false;
        this._multiple = false;
        this.ganttClass = true;
    }
    createView() {
        const viewDate = this.getViewDate();
        this.styles = Object.assign({}, this.configService.config.styleOptions, this.styles);
        this.viewOptions.dateFormat = Object.assign({}, this.configService.config.dateFormat, this.viewOptions.dateFormat);
        this.viewOptions.styleOptions = Object.assign({}, this.configService.config.styleOptions, this.viewOptions.styleOptions);
        this.viewOptions.dateDisplayFormats = this.configService.getViewsLocale()[this.viewType]?.dateFormats;
        this.view = createViewFactory(this.viewType, viewDate.start, viewDate.end, this.viewOptions);
    }
    setupGroups() {
        const collapsedIds = this.groups.filter((group) => group.expanded === false).map((group) => group.id);
        this.groupsMap = {};
        this.groups = [];
        this.originGroups.forEach((origin) => {
            const group = new GanttGroupInternal(origin);
            group.expanded = !collapsedIds.includes(group.id);
            this.groupsMap[group.id] = group;
            this.groups.push(group);
        });
    }
    setupItems() {
        this.originItems = uniqBy(this.originItems, 'id');
        this.items = [];
        if (this.groups.length > 0) {
            this.originItems.forEach((origin) => {
                const group = this.groupsMap[origin.group_id];
                if (group) {
                    const item = new GanttItemInternal(origin, 0, this.view);
                    group.items.push(item);
                }
            });
        }
        else {
            this.originItems.forEach((origin) => {
                const item = new GanttItemInternal(origin, 0, this.view);
                this.items.push(item);
            });
        }
    }
    setupBaselineItems() {
        this.originBaselineItems = uniqBy(this.originBaselineItems, 'id');
        this.baselineItems = [];
        this.originBaselineItems.forEach((origin) => {
            const item = new GanttBaselineItemInternal(origin);
            this.baselineItems.push(item);
        });
        this.baselineItemsMap = keyBy(this.baselineItems, 'id');
    }
    setupExpandedState() {
        this.originItems = uniqBy(this.originItems, 'id');
        let items = [];
        const flatOriginItems = getFlatItems(this.originItems);
        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        }
        else {
            items = flatten(this.groups.map((group) => recursiveItems(group.items)));
        }
        items.forEach((item) => {
            if (item.origin.expanded) {
                const newItem = flatOriginItems.find((originItem) => originItem.id === item.id);
                if (newItem) {
                    if (newItem.expanded === undefined) {
                        newItem.expanded = true;
                    }
                }
            }
        });
    }
    getViewDate() {
        let start = this.start;
        let end = this.end;
        if (!this.start || !this.end) {
            this.originItems.forEach((item) => {
                if (item.start && !this.start) {
                    const itemStart = item.start instanceof Date ? getUnixTime(item.start) : item.start;
                    start = start ? Math.min(start, itemStart) : itemStart;
                }
                if (item.end && !this.end) {
                    const itemEnd = item.start instanceof Date ? getUnixTime(item.start) : item.start;
                    end = end ? Math.max(end, itemEnd) : itemEnd;
                }
            });
        }
        return {
            start: {
                date: new GanttDate(start),
                isCustom: this.start ? true : false
            },
            end: {
                date: new GanttDate(end),
                isCustom: this.end ? true : false
            }
        };
    }
    computeRefs() {
        if (this.computeAllRefs) {
            this.groups.forEach((group) => {
                const groupItems = recursiveItems(group.items);
                this.computeItemsRefs(...groupItems);
            });
            const items = recursiveItems(this.items);
            this.computeItemsRefs(...items);
        }
    }
    initSelectionModel() {
        return new SelectionModel(this.multiple, []);
    }
    expandGroups(expanded) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.expandChange.next(null);
        this.cdr.detectChanges();
    }
    ngOnInit() {
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.setupBaselineItems();
        this.computeItemsRefs(...this.baselineItems);
        this.initSelectionModel();
        this.firstChange = false;
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.element.style.opacity = '1';
                const disabledLoadOnScroll = this.disabledLoadOnScroll;
                this.dragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.disabledLoadOnScroll = true;
                    this.dragStarted.emit(event);
                });
                this.dragContainer.dragMoved.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.dragMoved.emit(event);
                });
                this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.disabledLoadOnScroll = disabledLoadOnScroll;
                    this.dragEnded.emit(event);
                });
            });
        });
        this.view.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeRefs();
        });
    }
    ngOnChanges(changes) {
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue && changes.viewType.currentValue !== changes.viewType.previousValue) {
                this.changeView(changes.viewType.currentValue);
            }
            if (changes.viewOptions) {
                this.changeView(this.viewType);
            }
            if (changes.originItems || changes.originGroups) {
                this.setupExpandedState();
                this.setupGroups();
                this.setupItems();
                this.computeRefs();
            }
            if (changes.originBaselineItems) {
                this.setupBaselineItems();
                this.computeItemsRefs(...this.baselineItems);
            }
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    computeItemsRefs(...items) {
        items.forEach((item) => {
            item.updateRefs({
                width: item.start && item.end ? this.view.getDateRangeWidth(item.start, item.end) : 0,
                x: item.start ? this.view.getXPointByDate(item.start) : 0,
                y: (this.styles.lineHeight - this.styles.barHeight) / 2 - 1
            });
        });
    }
    trackBy(index, item) {
        return item.id || index;
    }
    detectChanges() {
        this.cdr.detectChanges();
    }
    // public functions
    expandGroup(group) {
        group.setExpand(!group.expanded);
        this.expandChange.emit(group);
        this.cdr.detectChanges();
    }
    expandAll() {
        this.expandGroups(true);
    }
    collapseAll() {
        this.expandGroups(false);
    }
    getGanttItem(id) {
        return this.getGanttItems([id])[0] || null;
    }
    getGanttItems(ids) {
        let items = [];
        if (this.items.length > 0) {
            items = recursiveItems(this.items);
        }
        else {
            items = flatten(this.groups.map((group) => recursiveItems(group.items)));
        }
        return items.filter((item) => ids.includes(item.id));
    }
    isSelected(id) {
        if (!this.selectable) {
            return false;
        }
        if (!this.selectionModel.hasValue()) {
            return false;
        }
        return this.selectionModel.isSelected(id);
    }
    changeView(type) {
        this.viewType = type;
        this.createView();
        this.setupGroups();
        this.setupItems();
        this.computeRefs();
        this.setupBaselineItems();
        this.computeItemsRefs(...this.baselineItems);
        this.viewChange.emit(this.view);
    }
    rerenderView() {
        this.changeView(this.viewType);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttUpper, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0", type: GanttUpper, inputs: { originItems: ["items", "originItems"], originGroups: ["groups", "originGroups"], originBaselineItems: ["baselineItems", "originBaselineItems"], viewType: "viewType", start: "start", end: "end", showTodayLine: "showTodayLine", draggable: "draggable", styles: "styles", showToolbar: "showToolbar", toolbarOptions: "toolbarOptions", viewOptions: "viewOptions", linkOptions: "linkOptions", disabledLoadOnScroll: "disabledLoadOnScroll", selectable: "selectable", multiple: "multiple", quickTimeFocus: "quickTimeFocus" }, outputs: { loadOnScroll: "loadOnScroll", dragStarted: "dragStarted", dragMoved: "dragMoved", dragEnded: "dragEnded", barClick: "barClick", viewChange: "viewChange", expandChange: "expandChange" }, host: { properties: { "class.gantt": "this.ganttClass" } }, queries: [{ propertyName: "barTemplate", first: true, predicate: ["bar"], descendants: true, static: true }, { propertyName: "rangeTemplate", first: true, predicate: ["range"], descendants: true, static: true }, { propertyName: "itemTemplate", first: true, predicate: ["item"], descendants: true, static: true }, { propertyName: "baselineTemplate", first: true, predicate: ["baseline"], descendants: true, static: true }, { propertyName: "groupTemplate", first: true, predicate: ["group"], descendants: true, static: true }, { propertyName: "groupHeaderTemplate", first: true, predicate: ["groupHeader"], descendants: true, static: true }, { propertyName: "toolbarTemplate", first: true, predicate: ["toolbar"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttUpper, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: undefined }], propDecorators: { originItems: [{
                type: Input,
                args: ['items']
            }], originGroups: [{
                type: Input,
                args: ['groups']
            }], originBaselineItems: [{
                type: Input,
                args: ['baselineItems']
            }], viewType: [{
                type: Input
            }], start: [{
                type: Input
            }], end: [{
                type: Input
            }], showTodayLine: [{
                type: Input
            }], draggable: [{
                type: Input
            }], styles: [{
                type: Input
            }], showToolbar: [{
                type: Input
            }], toolbarOptions: [{
                type: Input
            }], viewOptions: [{
                type: Input
            }], linkOptions: [{
                type: Input
            }], disabledLoadOnScroll: [{
                type: Input
            }], selectable: [{
                type: Input
            }], multiple: [{
                type: Input
            }], quickTimeFocus: [{
                type: Input
            }], loadOnScroll: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragMoved: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }], barClick: [{
                type: Output
            }], viewChange: [{
                type: Output
            }], expandChange: [{
                type: Output
            }], barTemplate: [{
                type: ContentChild,
                args: ['bar', { static: true }]
            }], rangeTemplate: [{
                type: ContentChild,
                args: ['range', { static: true }]
            }], itemTemplate: [{
                type: ContentChild,
                args: ['item', { static: true }]
            }], baselineTemplate: [{
                type: ContentChild,
                args: ['baseline', { static: true }]
            }], groupTemplate: [{
                type: ContentChild,
                args: ['group', { static: true }]
            }], groupHeaderTemplate: [{
                type: ContentChild,
                args: ['groupHeader', { static: true }]
            }], toolbarTemplate: [{
                type: ContentChild,
                args: ['toolbar', { static: true }]
            }], ganttClass: [{
                type: HostBinding,
                args: ['class.gantt']
            }] } });
const GANTT_UPPER_TOKEN = new InjectionToken('GANTT_UPPER_TOKEN');

function getDependencyType(path, dependencyTypes) {
    if (dependencyTypes.includes(GanttLinkType.ss) && path.from.pos === InBarPosition.start && path.to.pos === InBarPosition.start) {
        return GanttLinkType.ss;
    }
    if (dependencyTypes.includes(GanttLinkType.ff) && path.from.pos === InBarPosition.finish && path.to.pos === InBarPosition.finish) {
        return GanttLinkType.ff;
    }
    if (dependencyTypes.includes(GanttLinkType.sf) && path.from.pos === InBarPosition.start && path.to.pos === InBarPosition.finish) {
        return GanttLinkType.sf;
    }
    return GanttLinkType.fs;
}
var InBarPosition;
(function (InBarPosition) {
    InBarPosition["start"] = "start";
    InBarPosition["finish"] = "finish";
})(InBarPosition || (InBarPosition = {}));
class GanttDragContainer {
    constructor(ganttUpper) {
        this.ganttUpper = ganttUpper;
        this.dragStarted = new EventEmitter();
        this.dragMoved = new EventEmitter();
        this.dragEnded = new EventEmitter();
        this.linkDragStarted = new EventEmitter();
        this.linkDragEntered = new EventEmitter();
        this.linkDragEnded = new EventEmitter();
        this.linkDragPath = { from: null, to: null };
    }
    emitLinkDragStarted(from) {
        this.linkDraggingId = from.item.id;
        this.linkDragPath.from = from;
        this.linkDragStarted.emit({
            source: from.item.origin,
            target: null
        });
    }
    emitLinkDragEntered(to) {
        this.linkDragPath.to = to;
        this.linkDragEntered.emit({
            source: this.linkDragPath.from.item.origin,
            target: to.item.origin
        });
    }
    emitLinkDragLeaved() {
        this.linkDragPath.to = null;
    }
    emitLinkDragEnded(to) {
        if (to) {
            this.linkDragPath.to = to;
            const dependencyType = getDependencyType(this.linkDragPath, this.ganttUpper.linkOptions?.dependencyTypes);
            this.linkDragPath.from.item.addLink({
                link: this.linkDragPath.to.item.id,
                type: dependencyType
            });
            this.linkDragEnded.emit({
                source: this.linkDragPath.from.item.origin,
                target: this.linkDragPath.to.item.origin,
                type: dependencyType
            });
        }
        this.linkDraggingId = null;
        this.linkDragPath = { from: null, to: null };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragContainer, deps: [{ token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragContainer }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragContainer, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }] });

/**
 * Proximity, as a ratio to width/height at which to start auto-scrolling the drop list or the
 * viewport. The value comes from trying it out manually until it feels right.
 */
const SCROLL_PROXIMITY_THRESHOLD = 0.05;
/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
function getHorizontalScrollDirection(clientRect, pointerX) {
    const { left, right, width } = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;
    if (pointerX >= left - xThreshold && pointerX <= left + xThreshold) {
        return 1 /* AutoScrollHorizontalDirection.LEFT */;
    }
    else if (pointerX >= right - xThreshold && pointerX <= right + xThreshold) {
        return 2 /* AutoScrollHorizontalDirection.RIGHT */;
    }
    return 0 /* AutoScrollHorizontalDirection.NONE */;
}
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
function isPointerNearClientRect(rect, threshold, pointerX, pointerY) {
    const { top, right, bottom, left, width, height } = rect;
    const xThreshold = width * threshold;
    const yThreshold = height * threshold;
    return pointerY > top - yThreshold && pointerY < bottom + yThreshold && pointerX > left - xThreshold && pointerX < right + xThreshold;
}
/**
 * Gets the speed rate of auto scrolling
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 * @param horizontalScrollDirection The direction in which the mouse is dragged horizontally
 */
function getAutoScrollSpeedRates(clientRect, pointerX, horizontalScrollDirection) {
    let autoScrollSpeedRates = 4;
    const speedLevels = 4;
    const { left, right, width } = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;
    if (horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */) {
        autoScrollSpeedRates = Math.ceil((xThreshold - (pointerX > left ? pointerX - left : 0)) / (xThreshold / speedLevels));
    }
    if (horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */) {
        autoScrollSpeedRates = Math.ceil((xThreshold - (right > pointerX ? right - pointerX : 0)) / (xThreshold / speedLevels));
    }
    return autoScrollSpeedRates;
}

/** Cached result of whether the user's browser supports passive event listeners. */
let supportsPassiveEvents;
/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
function supportsPassiveEventListeners() {
    if (supportsPassiveEvents == null && typeof window !== 'undefined') {
        try {
            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                get: () => (supportsPassiveEvents = true)
            }));
        }
        finally {
            supportsPassiveEvents = supportsPassiveEvents || false;
        }
    }
    return supportsPassiveEvents;
}
/**
 * Normalizes an `AddEventListener` object to something that can be passed
 * to `addEventListener` on any browser, no matter whether it supports the
 * `options` parameter.
 */
function normalizePassiveListenerOptions(options) {
    return supportsPassiveEventListeners() ? options : !!options.capture;
}
/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });

const scrollThreshold = 50;
var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["NONE"] = 0] = "NONE";
    ScrollDirection[ScrollDirection["LEFT"] = 1] = "LEFT";
    ScrollDirection[ScrollDirection["RIGHT"] = 2] = "RIGHT";
})(ScrollDirection || (ScrollDirection = {}));
class GanttDomService {
    constructor(ngZone, platformId) {
        this.ngZone = ngZone;
        this.platformId = platformId;
        this.visibleRangeX = signal({ min: 0, max: 0 });
        this.unsubscribe$ = new Subject();
    }
    monitorScrollChange() {
        const scrollObservers = [
            fromEvent(this.mainContainer, 'scroll', passiveListenerOptions),
            fromEvent(this.sideContainer, 'scroll', passiveListenerOptions)
        ];
        this.mainFooter && scrollObservers.push(fromEvent(this.mainFooter, 'scroll', passiveListenerOptions));
        this.mainScrollbar && scrollObservers.push(fromEvent(this.mainScrollbar, 'scroll', passiveListenerOptions));
        this.ngZone.runOutsideAngular(() => merge(...scrollObservers)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
            this.syncScroll(event);
        }));
    }
    syncScroll(event) {
        const target = event.currentTarget;
        const classList = target.classList;
        if (!classList.contains('gantt-side-container')) {
            this.mainContainer.scrollLeft = target.scrollLeft;
            this.calendarHeader.scrollLeft = target.scrollLeft;
            this.calendarOverlay.scrollLeft = target.scrollLeft;
            this.mainScrollbar && (this.mainScrollbar.scrollLeft = target.scrollLeft);
            this.mainFooter && (this.mainFooter.scrollLeft = target.scrollLeft);
            if (classList.contains('gantt-main-container')) {
                this.sideContainer.scrollTop = target.scrollTop;
                this.mainContainer.scrollTop = target.scrollTop;
            }
        }
        else {
            this.sideContainer.scrollTop = target.scrollTop;
            this.mainContainer.scrollTop = target.scrollTop;
        }
    }
    disableBrowserWheelEvent() {
        const container = this.mainContainer;
        this.ngZone.runOutsideAngular(() => fromEvent(container, 'wheel')
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
            const delta = event.deltaX;
            if (!delta) {
                return;
            }
            if ((container.scrollLeft + container.offsetWidth === container.scrollWidth && delta > 0) ||
                (container.scrollLeft === 0 && delta < 0)) {
                event.preventDefault();
            }
        }));
    }
    initialize(root) {
        this.root = root.nativeElement;
        this.side = this.root.getElementsByClassName('gantt-side')[0];
        this.container = this.root.getElementsByClassName('gantt-container')[0];
        this.sideContainer = this.root.getElementsByClassName('gantt-side-container')[0];
        this.mainContainer = this.root.getElementsByClassName('gantt-main-container')[0];
        this.mainScrollbar = this.root.getElementsByClassName('gantt-main-scrollbar')[0];
        this.mainFooter = this.root.getElementsByClassName('gantt-container-footer')[0];
        this.verticalScrollContainer = this.root.getElementsByClassName('gantt-scroll-container')[0];
        const mainItems = this.mainContainer.getElementsByClassName('gantt-main-items')[0];
        const mainGroups = this.mainContainer.getElementsByClassName('gantt-main-groups')[0];
        this.mainItems = mainItems || mainGroups;
        this.calendarHeader = this.root.getElementsByClassName('gantt-calendar-header')[0];
        this.calendarOverlay = this.root.getElementsByClassName('gantt-calendar-grid')[0];
        this.monitorScrollChange();
        this.disableBrowserWheelEvent();
    }
    /**
     * @returns An observable that will emit outside the Angular zone. Note, consumers should re-enter the Angular zone
     * to run the change detection if needed.
     */
    getViewerScroll(options) {
        const scrollObservers = [fromEvent(this.mainContainer, 'scroll', options)];
        this.mainFooter && scrollObservers.push(fromEvent(this.mainFooter, 'scroll', options));
        this.mainScrollbar && scrollObservers.push(fromEvent(this.mainScrollbar, 'scroll', options));
        return new Observable((subscriber) => this.ngZone.runOutsideAngular(() => merge(...scrollObservers)
            .pipe(map(() => this.mainContainer.scrollLeft), pairwise(), map(([previous, current]) => {
            this.setVisibleRangeX();
            const event = {
                target: this.mainContainer,
                direction: ScrollDirection.NONE
            };
            if (current - previous < 0) {
                if (this.mainContainer.scrollLeft < scrollThreshold && this.mainContainer.scrollLeft > 0) {
                    event.direction = ScrollDirection.LEFT;
                }
            }
            if (current - previous > 0) {
                if (this.mainContainer.scrollWidth - this.mainContainer.clientWidth - this.mainContainer.scrollLeft <
                    scrollThreshold) {
                    event.direction = ScrollDirection.RIGHT;
                }
            }
            return event;
        }))
            .subscribe(subscriber)));
    }
    getResize() {
        return isPlatformServer(this.platformId) ? EMPTY : fromEvent(window, 'resize').pipe(auditTime(150));
    }
    getResizeByElement(element) {
        return new Observable((observer) => {
            const resizeObserver = new ResizeObserver(() => {
                observer.next();
            });
            resizeObserver.observe(element);
        });
    }
    scrollMainContainer(left) {
        if (isNumber(left)) {
            const scrollLeft = left - this.mainContainer.clientWidth / 2;
            this.mainContainer.scrollLeft = scrollLeft > scrollThreshold ? scrollLeft : 0;
            this.calendarHeader.scrollLeft = this.mainContainer.scrollLeft;
            this.calendarOverlay.scrollLeft = this.mainContainer.scrollLeft;
            this.mainScrollbar && (this.mainScrollbar.scrollLeft = this.mainContainer.scrollLeft);
            this.mainFooter && (this.mainFooter.scrollLeft = this.mainContainer.scrollLeft);
        }
    }
    setVisibleRangeX() {
        this.visibleRangeX.set({
            min: this.mainContainer.scrollLeft,
            max: this.mainContainer.scrollLeft + this.mainContainer.clientWidth
        });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDomService, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDomService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDomService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

/**
 * Proximity, as a ratio to width/height, at which a
 * dragged item will affect the drop container.
 */
const DROP_PROXIMITY_THRESHOLD = 0.05;
const dragMinWidth = 10;
const autoScrollBaseStep = 2;
const activeClass = 'gantt-bar-active';
const dropActiveClass = 'gantt-bar-drop-active';
const singleDropActiveClass = 'gantt-bar-single-drop-active';
function createSvgElement(qualifiedName, className) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
    element.classList.add(className);
    return element;
}
class GanttBarDrag {
    get dragDisabled() {
        return !this.item().draggable || !this.ganttUpper.draggable;
    }
    get linkDragDisabled() {
        return !this.item().linkable || !this.ganttUpper.linkable;
    }
    get barHandleDragMoveAndScrollDistance() {
        return this.barHandleDragMoveDistance + this.dragScrollDistance;
    }
    get autoScrollStep() {
        return Math.pow(autoScrollBaseStep, this.autoScrollSpeedRates);
    }
    constructor(dragDrop, dom, dragContainer, _ngZone) {
        this.dragDrop = dragDrop;
        this.dom = dom;
        this.dragContainer = dragContainer;
        this._ngZone = _ngZone;
        this.item = signal(null);
        this.linkDragRefs = [];
        this.barHandleDragRefs = [];
        this.destroy$ = new Subject();
        /** Used to signal to the current auto-scroll sequence when to stop. */
        this.stopScrollTimers$ = new Subject();
        /** move distance when drag bar */
        this.barDragMoveDistance = 0;
        /** move distance when drag bar handle */
        this.barHandleDragMoveDistance = 0;
        /** scrolling state when drag */
        this.dragScrolling = false;
        /** dragScrollDistance */
        this.dragScrollDistance = 0;
        /** Horizontal direction in which the list is currently scrolling. */
        this._horizontalScrollDirection = 0 /* AutoScrollHorizontalDirection.NONE */;
        /** Speed ratio for auto scroll */
        this.autoScrollSpeedRates = 1;
        this.startScrollInterval = () => {
            this.stopScrolling();
            interval(0, animationFrameScheduler)
                .pipe(takeUntil(this.stopScrollTimers$))
                .subscribe(() => {
                const node = this.dom.mainContainer;
                const scrollStep = this.autoScrollStep;
                if (this._horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */) {
                    node.scrollBy(-scrollStep, 0);
                }
                else if (this._horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */) {
                    node.scrollBy(scrollStep, 0);
                }
            });
        };
        effect(() => {
            const item = this.item();
            if (item) {
                this.createDrags();
            }
        });
    }
    createDragRef(element) {
        const dragRef = this.dragDrop.createDrag(element);
        return dragRef;
    }
    createDragScrollEvent(dragRef) {
        return fromEvent(this.dom.mainContainer, 'scroll', passiveListenerOptions).pipe(takeUntil(dragRef.ended));
    }
    createMouseEvents() {
        if (!this.hasMonitorMouseEvent && (!this.dragDisabled || !this.linkDragDisabled)) {
            this.hasMonitorMouseEvent = true;
            const dropClass = this.ganttUpper.linkOptions?.dependencyTypes?.length === 1 &&
                this.ganttUpper.linkOptions?.dependencyTypes[0] === GanttLinkType.fs
                ? singleDropActiveClass
                : dropActiveClass;
            fromEvent(this.barElement, 'mouseenter', passiveListenerOptions)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                if (this.dragContainer.linkDraggingId && this.dragContainer.linkDraggingId !== this.item().id) {
                    if (!this.linkDragDisabled) {
                        this.barElement.classList.add(dropClass);
                        this.dragContainer.emitLinkDragEntered({
                            item: this.item(),
                            element: this.barElement
                        });
                    }
                }
                else {
                    if (!this.dragDisabled || !this.linkDragDisabled) {
                        this.barElement.classList.add(activeClass);
                    }
                }
            });
            fromEvent(this.barElement, 'mouseleave', passiveListenerOptions)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                if (!this.dragContainer.linkDraggingId) {
                    this.barElement.classList.remove(activeClass);
                }
                else {
                    this.dragContainer.emitLinkDragLeaved();
                }
                this.barElement.classList.remove(dropClass);
            });
        }
    }
    createBarDrag() {
        const dragRef = this.createDragRef(this.barElement);
        dragRef.disabled = this.dragDisabled;
        dragRef.lockAxis = 'x';
        dragRef.withBoundaryElement(this.dom.mainItems);
        dragRef.started.subscribe(() => {
            this.setDraggingStyles();
            this.containerScrollLeft = this.dom.mainContainer.scrollLeft;
            this.createDragScrollEvent(dragRef).subscribe(() => {
                if (dragRef.isDragging()) {
                    const dragScrollDistance = this.dom.mainContainer.scrollLeft - this.containerScrollLeft;
                    this.dragScrollDistance = dragScrollDistance;
                    dragRef['_boundaryRect'] = this.dom.mainItems.getBoundingClientRect();
                    this.barDragMove();
                }
            });
            this.dragContainer.dragStarted.emit({ item: this.item().origin });
        });
        dragRef.moved.subscribe((event) => {
            this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
            this.barDragMoveDistance = event.distance.x;
            if (!this.dragScrolling) {
                this.barDragMove();
            }
        });
        dragRef.ended.subscribe((event) => {
            this.clearDraggingStyles();
            this.closeDragBackdrop();
            event.source.reset();
            this.stopScrolling();
            this.dragScrolling = false;
            this.dragScrollDistance = 0;
            this.barDragMoveDistance = 0;
            this.item().updateRefs({
                width: this.ganttUpper.view.getDateRangeWidth(this.item().start, this.item().end),
                x: this.ganttUpper.view.getXPointByDate(this.item().start),
                y: (this.ganttUpper.styles.lineHeight - this.ganttUpper.styles.barHeight) / 2 - 1
            });
            this.dragContainer.dragEnded.emit({ item: this.item().origin });
        });
        return dragRef;
    }
    createBarHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll('.drag-handles .handle');
        handles.forEach((handle, index) => {
            const isBefore = index === 0;
            const dragRef = this.createDragRef(handle);
            dragRef.disabled = this.dragDisabled;
            dragRef.lockAxis = 'x';
            dragRef.withBoundaryElement(this.dom.mainItems);
            dragRef.started.subscribe(() => {
                this.setDraggingStyles();
                this.containerScrollLeft = this.dom.mainContainer.scrollLeft;
                this.createDragScrollEvent(dragRef).subscribe(() => {
                    if (dragRef.isDragging()) {
                        const dragScrollDistance = this.dom.mainContainer.scrollLeft - this.containerScrollLeft;
                        this.dragScrollDistance = dragScrollDistance;
                        dragRef['_boundaryRect'] = this.dom.mainItems.getBoundingClientRect();
                        if (this.dragScrolling && this.isStartGreaterThanEndWhenBarHandleDragMove(isBefore)) {
                            this.stopScrolling();
                            this.dragScrolling = false;
                        }
                        if (isBefore) {
                            this.barBeforeHandleDragMove();
                        }
                        else {
                            this.barAfterHandleDragMove();
                        }
                    }
                });
                this.dragContainer.dragStarted.emit({ item: this.item().origin });
            });
            dragRef.moved.subscribe((event) => {
                if (this.barHandleDragMoveRecordDiffs && this.barHandleDragMoveRecordDiffs > 0) {
                    this.startScrollingIfNecessary(event.pointerPosition.x, event.pointerPosition.y);
                }
                this.barHandleDragMoveDistance = event.distance.x;
                if (!this.dragScrolling) {
                    if (isBefore) {
                        this.barBeforeHandleDragMove();
                    }
                    else {
                        this.barAfterHandleDragMove();
                    }
                }
            });
            dragRef.ended.subscribe((event) => {
                this.clearDraggingStyles();
                this.closeDragBackdrop();
                event.source.reset();
                this.stopScrolling();
                this.dragScrolling = false;
                this.dragScrollDistance = 0;
                this.barHandleDragMoveDistance = 0;
                this.item().updateRefs({
                    width: this.ganttUpper.view.getDateRangeWidth(this.item().start, this.item().end),
                    x: this.ganttUpper.view.getXPointByDate(this.item().start),
                    y: (this.ganttUpper.styles.lineHeight - this.ganttUpper.styles.barHeight) / 2 - 1
                });
                this.dragContainer.dragEnded.emit({ item: this.item().origin });
            });
            dragRefs.push(dragRef);
        });
        return dragRefs;
    }
    createLinkHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll('.link-handles .handle');
        handles.forEach((handle, index) => {
            const isBegin = index === 0;
            const dragRef = this.dragDrop.createDrag(handle);
            dragRef.disabled = this.linkDragDisabled;
            dragRef.withBoundaryElement(this.dom.root);
            dragRef.beforeStarted.subscribe(() => {
                handle.style.pointerEvents = 'none';
                if (this.barDragRef) {
                    this.barDragRef.disabled = true;
                }
                this.createLinkDraggingLine();
                this.dragContainer.emitLinkDragStarted({
                    element: this.barElement,
                    item: this.item(),
                    pos: isBegin ? InBarPosition.start : InBarPosition.finish
                });
            });
            dragRef.moved.subscribe(() => {
                const positions = this.calcLinkLinePositions(handle, isBegin);
                this.linkDraggingLine.setAttribute('x1', positions.x1.toString());
                this.linkDraggingLine.setAttribute('y1', positions.y1.toString());
                this.linkDraggingLine.setAttribute('x2', positions.x2.toString());
                this.linkDraggingLine.setAttribute('y2', positions.y2.toString());
            });
            dragRef.ended.subscribe((event) => {
                handle.style.pointerEvents = '';
                if (this.barDragRef) {
                    this.barDragRef.disabled = false;
                }
                // 计算line拖动的落点位于目标Bar的值，如果值大于Bar宽度的一半，说明是拖动到Begin位置，否则则为拖动到End位置
                if (this.dragContainer.linkDragPath.to) {
                    const placePointX = event.source.getRootElement().getBoundingClientRect().x -
                        this.dragContainer.linkDragPath.to.element.getBoundingClientRect().x;
                    this.dragContainer.emitLinkDragEnded({
                        ...this.dragContainer.linkDragPath.to,
                        pos: placePointX < this.dragContainer.linkDragPath.to.item.refs.width / 2
                            ? InBarPosition.start
                            : InBarPosition.finish
                    });
                }
                else {
                    this.dragContainer.emitLinkDragEnded();
                }
                event.source.reset();
                this.barElement.classList.remove(activeClass);
                this.destroyLinkDraggingLine();
            });
            dragRefs.push(dragRef);
        });
        return dragRefs;
    }
    openDragBackdrop(dragElement, start, end) {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop');
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask');
        const rootRect = this.dom.root.getBoundingClientRect();
        const dragRect = dragElement.getBoundingClientRect();
        let left = dragRect.left - rootRect.left - (this.dom.side.clientWidth + 1);
        if (this.dragScrolling) {
            if (this._horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */) {
                left += this.autoScrollStep;
            }
            else if (this._horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */) {
                left -= this.autoScrollStep;
            }
        }
        const width = dragRect.right - dragRect.left;
        // Note: updating styles will cause re-layout so we have to place them consistently one by one.
        dragMaskElement.style.left = left + 'px';
        dragMaskElement.style.width = width + 'px';
        dragMaskElement.style.display = 'block';
        dragBackdropElement.style.display = 'block';
        // This will invalidate the layout, but we won't need re-layout, because we set styles previously.
        dragMaskElement.querySelector('.start').innerHTML = start.format(this.ganttUpper.view.options.dragPreviewDateFormat);
        dragMaskElement.querySelector('.end').innerHTML = end.format(this.ganttUpper.view.options.dragPreviewDateFormat);
    }
    closeDragBackdrop() {
        const dragBackdropElement = this.dom.root.querySelector('.gantt-drag-backdrop');
        const dragMaskElement = this.dom.root.querySelector('.gantt-drag-mask');
        dragMaskElement.style.display = 'none';
        dragBackdropElement.style.display = 'none';
    }
    setDraggingStyles() {
        this.barElement.classList.add('gantt-bar-draggable-drag');
    }
    clearDraggingStyles() {
        this.barElement.classList.remove('gantt-bar-draggable-drag');
    }
    barDragMove() {
        const currentX = this.item().refs.x + this.barDragMoveDistance + this.dragScrollDistance;
        const currentDate = this.ganttUpper.view.getDateByXPoint(currentX);
        const currentStartX = this.ganttUpper.view.getXPointByDate(currentDate);
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(this.item().end, this.item().start);
        let start = currentDate;
        let end = currentDate.add(diffs, this.ganttUpper.view?.options?.datePrecisionUnit);
        // 日视图特殊逻辑处理
        if (this.ganttUpper.view.viewType === GanttViewType.day) {
            const dayWidth = this.ganttUpper.view.getDayOccupancyWidth(currentDate);
            if (currentX > currentStartX + dayWidth / 2) {
                start = start.addDays(1);
                end = end.addDays(1);
            }
        }
        if (this.dragScrolling) {
            const left = currentX - this.barDragMoveDistance;
            this.barElement.style.left = left + 'px';
        }
        this.openDragBackdrop(this.barElement, this.ganttUpper.view.getDateByXPoint(currentX), this.ganttUpper.view.getDateByXPoint(currentX + this.item().refs.width));
        if (!this.isStartOrEndInsideView(start, end)) {
            return;
        }
        this.updateItemDate(start, end);
        this.dragContainer.dragMoved.emit({ item: this.item().origin });
    }
    barBeforeHandleDragMove() {
        const { x, start, minRangeWidthWidth } = this.startOfBarHandle();
        const width = this.item().refs.width + this.barHandleDragMoveAndScrollDistance * -1;
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(this.item().end, start);
        if (width > dragMinWidth && diffs > 0) {
            this.barElement.style.width = width + 'px';
            this.barElement.style.left = x + 'px';
            this.openDragBackdrop(this.barElement, start, this.item().end);
            if (!this.isStartOrEndInsideView(start, this.item().end)) {
                return;
            }
            this.updateItemDate(start, this.item().end);
        }
        else {
            if (this.barHandleDragMoveRecordDiffs > 0 && diffs <= 0) {
                this.barElement.style.width = minRangeWidthWidth + 'px';
                const x = this.ganttUpper.view.getXPointByDate(this.item().end);
                this.barElement.style.left = x + 'px';
            }
            this.openDragBackdrop(this.barElement, this.item().end, this.item().end);
            this.updateItemDate(this.item().end, this.item().end);
        }
        this.barHandleDragMoveRecordDiffs = diffs;
        this.dragContainer.dragMoved.emit({ item: this.item().origin });
    }
    barAfterHandleDragMove() {
        const { width, end } = this.endOfBarHandle();
        const diffs = this.ganttUpper.view.differenceByPrecisionUnit(end, this.item().start);
        if (width > dragMinWidth && diffs > 0) {
            this.barElement.style.width = width + 'px';
            this.openDragBackdrop(this.barElement, this.item().start, end);
            if (!this.isStartOrEndInsideView(this.item().start, end)) {
                return;
            }
            this.updateItemDate(this.item().start, end);
        }
        else {
            if (this.barHandleDragMoveRecordDiffs > 0 && diffs <= 0) {
                const minRangeWidth = this.ganttUpper.view.getMinRangeWidthByPrecisionUnit(this.item().start);
                this.barElement.style.width = minRangeWidth + 'px';
            }
            this.openDragBackdrop(this.barElement, this.item().start, this.item().start);
            this.updateItemDate(this.item().start, this.item().start);
        }
        this.barHandleDragMoveRecordDiffs = diffs;
        this.dragContainer.dragMoved.emit({ item: this.item().origin });
    }
    calcLinkLinePositions(target, isBefore) {
        const rootRect = this.dom.root.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const layerRect = target.parentElement.parentElement.getBoundingClientRect();
        return {
            x1: layerRect.left + (isBefore ? 0 : layerRect.width) - rootRect.left,
            y1: layerRect.top + layerRect.height / 2 - rootRect.top,
            x2: targetRect.left - rootRect.left + targetRect.width / 2,
            y2: targetRect.top - rootRect.top + targetRect.height / 2
        };
    }
    createLinkDraggingLine() {
        if (!this.linkDraggingLine) {
            const svgElement = createSvgElement('svg', 'gantt-link-drag-container');
            const linElement = createSvgElement('line', 'link-dragging-line');
            linElement.style.pointerEvents = 'none';
            svgElement.appendChild(linElement);
            this.dom.root.appendChild(svgElement);
            this.linkDraggingLine = linElement;
        }
    }
    destroyLinkDraggingLine() {
        if (this.linkDraggingLine) {
            this.linkDraggingLine.parentElement.remove();
            this.linkDraggingLine = null;
        }
    }
    startScrollingIfNecessary(pointerX, pointerY) {
        const clientRect = this.dom.mainContainer.getBoundingClientRect();
        const scrollLeft = this.dom.mainContainer.scrollLeft;
        if (isPointerNearClientRect(clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY)) {
            const horizontalScrollDirection = getHorizontalScrollDirection(clientRect, pointerX);
            if ((horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */ && scrollLeft > 0) ||
                (horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */ &&
                    scrollLeft < this.ganttUpper.view.width - clientRect.width)) {
                this._horizontalScrollDirection = horizontalScrollDirection;
                this.autoScrollSpeedRates = getAutoScrollSpeedRates(clientRect, pointerX, horizontalScrollDirection);
                this.dragScrolling = true;
                this._ngZone.runOutsideAngular(this.startScrollInterval);
            }
            else {
                this.dragScrolling = false;
                this.stopScrolling();
            }
        }
    }
    // Conditions to stop auto-scroll: when the start is greater than the end and the bar appears in the view
    isStartGreaterThanEndWhenBarHandleDragMove(isBefore) {
        let isStartGreaterThanEnd;
        let isBarAppearsInView;
        const scrollLeft = this.dom.mainContainer.scrollLeft;
        const clientWidth = this.dom.mainContainer.clientWidth;
        const xThreshold = clientWidth * DROP_PROXIMITY_THRESHOLD;
        if (isBefore) {
            const { start, minRangeWidthWidth } = this.startOfBarHandle();
            const xPointerByEndDate = this.ganttUpper.view.getXPointByDate(this.item().end);
            isStartGreaterThanEnd = start.value > this.item().end.value;
            isBarAppearsInView = xPointerByEndDate + minRangeWidthWidth + xThreshold <= scrollLeft + clientWidth;
        }
        else {
            const { end } = this.endOfBarHandle();
            const xPointerByStartDate = this.ganttUpper.view.getXPointByDate(this.item().start);
            isStartGreaterThanEnd = end.value < this.item().start.value;
            isBarAppearsInView = scrollLeft + xThreshold <= xPointerByStartDate;
        }
        return isStartGreaterThanEnd && isBarAppearsInView ? true : false;
    }
    // Some data information about dragging start until it is equal to or greater than end
    startOfBarHandle() {
        const x = this.item().refs.x + this.barHandleDragMoveAndScrollDistance;
        return {
            x,
            start: this.ganttUpper.view.getDateByXPoint(x),
            minRangeWidthWidth: this.ganttUpper.view.getMinRangeWidthByPrecisionUnit(this.item().end)
        };
    }
    // Some data information about dragging end of bar handle
    endOfBarHandle() {
        const width = this.item().refs.width + this.barHandleDragMoveAndScrollDistance;
        return {
            width,
            end: this.ganttUpper.view.getDateByXPoint(this.item().refs.x + width)
        };
    }
    stopScrolling() {
        this.stopScrollTimers$.next();
    }
    isStartOrEndInsideView(start, end) {
        const itemStart = start.getUnixTime();
        const itemEnd = end.getUnixTime();
        const viewStart = this.ganttUpper.view.start.getUnixTime();
        const viewEnd = this.ganttUpper.view.end.getUnixTime();
        if (itemStart < viewStart || itemEnd > viewEnd) {
            return false;
        }
        else {
            return true;
        }
    }
    updateItemDate(start, end) {
        this.item().updateDate(this.ganttUpper.view.startOfPrecision(start), this.ganttUpper.view.endOfPrecision(end));
    }
    initialize(elementRef, item, ganttUpper) {
        this.barElement = elementRef.nativeElement;
        this.ganttUpper = ganttUpper;
        this.item.set(item);
    }
    createBarDragRef() {
        if (this.barDragRef) {
            this.barDragRef.disabled = this.dragDisabled;
        }
        else if (!this.dragDisabled) {
            this.barDragRef = this.createBarDrag();
        }
    }
    createBarHandleDragRefs() {
        if (this.barHandleDragRefs.length > 0) {
            this.barHandleDragRefs.forEach((dragRef) => {
                dragRef.disabled = this.dragDisabled;
            });
        }
        else if (!this.dragDisabled) {
            this.barHandleDragRefs = this.createBarHandleDrags();
        }
    }
    createLinkDragRefs() {
        if (this.linkDragRefs.length > 0) {
            this.linkDragRefs.forEach((dragRef) => {
                dragRef.disabled = this.linkDragDisabled;
            });
        }
        else if (!this.linkDragDisabled) {
            this.linkDragRefs = this.createLinkHandleDrags();
        }
    }
    createDrags() {
        this.createMouseEvents();
        this.createBarDragRef();
        this.createBarHandleDragRefs();
        this.createLinkDragRefs();
    }
    updateItem(item) {
        this.item.set(item);
    }
    ngOnDestroy() {
        this.closeDragBackdrop();
        this.barDragRef?.dispose();
        this.linkDragRefs?.forEach((dragRef) => dragRef.dispose());
        this.barHandleDragRefs?.forEach((dragRef) => dragRef.dispose());
        this.destroy$.next();
        this.destroy$.complete();
        this.stopScrolling();
        this.stopScrollTimers$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttBarDrag, deps: [{ token: i1.DragDrop }, { token: GanttDomService }, { token: GanttDragContainer }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttBarDrag }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttBarDrag, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DragDrop }, { type: GanttDomService }, { type: GanttDragContainer }, { type: i0.NgZone }] });

const sideWidth = 400;
const sideMiddleWidth = 500;
const sideMaxWidth = 600;
const sideMinWidth = 400;
const barBackground = '#6698ff';
const rangeHeight = 17;
const todayHeight = 24;
const todayWidth = 35;
const todayBorderRadius = 4;

class GanttItemUpper {
    constructor(elementRef, ganttUpper) {
        this.elementRef = elementRef;
        this.ganttUpper = ganttUpper;
        this.firstChange = true;
        this.unsubscribe$ = new Subject();
        this.refsUnsubscribe$ = new Subject();
    }
    ngOnInit() {
        this.firstChange = false;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    ngOnChanges(changes) {
        if (!this.firstChange) {
            this.itemChange(changes.item.currentValue);
        }
    }
    itemChange(item) {
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
        this.item = item;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.item.refs?.x + 'px';
        itemElement.style.top = this.item.refs?.y + 'px';
        itemElement.style.width = this.item.refs?.width + 'px';
        if (this.item.type === GanttItemType.bar) {
            itemElement.style.height = this.ganttUpper.styles.barHeight + 'px';
        }
        else if (this.item.type === GanttItemType.range) {
            itemElement.style.height = rangeHeight + 'px';
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttItemUpper, deps: [{ token: i0.ElementRef }, { token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0", type: GanttItemUpper, inputs: { template: "template", item: "item" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttItemUpper, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { template: [{
                type: Input
            }], item: [{
                type: Input
            }] } });

function linearGradient(sideOrCorner, color, stop) {
    return `linear-gradient(${sideOrCorner},${color} 0%,${stop} 40%)`;
}
class NgxGanttBarComponent extends GanttItemUpper {
    constructor(dragContainer, drag, elementRef, ganttUpper, ngZone) {
        super(elementRef, ganttUpper);
        this.dragContainer = dragContainer;
        this.drag = drag;
        this.ganttUpper = ganttUpper;
        this.ngZone = ngZone;
        this.barClick = new EventEmitter();
        this.ganttItemClass = true;
    }
    ngOnInit() {
        super.ngOnInit();
        this.dragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.pointerEvents = 'none';
        });
        this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.pointerEvents = '';
            this.setContentBackground();
        });
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
        if (!this.firstChange) {
            this.drag.updateItem(this.item);
            if (changes.item.currentValue.refs?.width !== changes.item.previousValue.refs?.width ||
                changes.item.currentValue.color !== changes.item.previousValue.color ||
                changes.item.currentValue.start?.value !== changes.item.previousValue.start?.value ||
                changes.item.currentValue.end?.value !== changes.item.previousValue.end?.value) {
                this.setContentBackground();
            }
        }
    }
    ngAfterViewInit() {
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.drag.initialize(this.elementRef, this.item, this.ganttUpper);
            });
        });
        this.setContentBackground();
        this.handles.changes
            .pipe(startWith(this.handles), switchMap(() => 
        // Note: we need to explicitly subscribe outside of the Angular zone since `addEventListener`
        // is called when the `fromEvent` is subscribed.
        new Observable((subscriber) => this.ngZone.runOutsideAngular(() => merge(...this.handles.toArray().map((handle) => fromEvent(handle.nativeElement, 'mousedown'))).subscribe(subscriber)))), takeUntil(this.unsubscribe$))
            .subscribe((event) => {
            event.stopPropagation();
        });
    }
    onBarClick(event) {
        this.barClick.emit({ event, item: this.item.origin });
    }
    setContentBackground() {
        if (this.item.refs?.width) {
            const contentElement = this.contentElementRef.nativeElement;
            const color = this.item.color || barBackground;
            const style = this.item.barStyle || {};
            const barElement = this.elementRef.nativeElement;
            if (this.item.origin.start && this.item.origin.end) {
                style.background = color;
                style.borderRadius = '';
            }
            if (this.item.origin.start && !this.item.origin.end) {
                style.background = linearGradient('to left', hexToRgb(color, 0.55), hexToRgb(color, 1));
                const borderRadius = '4px 12.5px 12.5px 4px';
                style.borderRadius = borderRadius;
                barElement.style.borderRadius = borderRadius;
            }
            if (!this.item.origin.start && this.item.origin.end) {
                style.background = linearGradient('to right', hexToRgb(color, 0.55), hexToRgb(color, 1));
                const borderRadius = '12.5px 4px 4px 12.5px';
                style.borderRadius = borderRadius;
                barElement.style.borderRadius = borderRadius;
            }
            if (this.item.progress >= 0) {
                const contentProgressElement = contentElement.querySelector('.gantt-bar-content-progress');
                style.background = hexToRgb(color, 0.3);
                style.borderRadius = '';
                contentProgressElement.style.background = color;
            }
            for (const key in style) {
                if (style.hasOwnProperty(key)) {
                    contentElement.style[key] = style[key];
                }
            }
        }
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttBarComponent, deps: [{ token: GanttDragContainer }, { token: GanttBarDrag }, { token: i0.ElementRef }, { token: GANTT_UPPER_TOKEN }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttBarComponent, isStandalone: true, selector: "ngx-gantt-bar,gantt-bar", outputs: { barClick: "barClick" }, host: { properties: { "class.gantt-bar": "this.ganttItemClass" } }, providers: [GanttBarDrag], viewQueries: [{ propertyName: "contentElementRef", first: true, predicate: ["content"], descendants: true }, { propertyName: "handles", predicate: ["handle"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"gantt-bar-layer\">\n  <div class=\"drag-handles\">\n    <ng-container *ngIf=\"item.draggable && ganttUpper.draggable\">\n      <span class=\"handle\" #handle></span>\n      <span class=\"handle\" #handle></span>\n    </ng-container>\n  </div>\n  <div *ngIf=\"item.linkable && ganttUpper.linkable\" class=\"link-handles\">\n    <span class=\"handle\"><span class=\"point\"></span></span>\n    <span class=\"handle\"> <span class=\"point\"></span></span>\n  </div>\n</div>\n<div class=\"gantt-bar-border\"></div>\n<div #content class=\"gantt-bar-content\" (click)=\"onBarClick($event)\">\n  <div class=\"gantt-bar-content-progress\" *ngIf=\"item.progress >= 0\" [style.width.%]=\"item.progress * 100\"></div>\n  <ng-template [ngTemplateOutlet]=\"template\" [ngTemplateOutletContext]=\"{ item: item.origin, refs: item.refs }\"> </ng-template>\n</div>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-bar,gantt-bar', providers: [GanttBarDrag], standalone: true, imports: [NgIf, NgTemplateOutlet], template: "<div class=\"gantt-bar-layer\">\n  <div class=\"drag-handles\">\n    <ng-container *ngIf=\"item.draggable && ganttUpper.draggable\">\n      <span class=\"handle\" #handle></span>\n      <span class=\"handle\" #handle></span>\n    </ng-container>\n  </div>\n  <div *ngIf=\"item.linkable && ganttUpper.linkable\" class=\"link-handles\">\n    <span class=\"handle\"><span class=\"point\"></span></span>\n    <span class=\"handle\"> <span class=\"point\"></span></span>\n  </div>\n</div>\n<div class=\"gantt-bar-border\"></div>\n<div #content class=\"gantt-bar-content\" (click)=\"onBarClick($event)\">\n  <div class=\"gantt-bar-content-progress\" *ngIf=\"item.progress >= 0\" [style.width.%]=\"item.progress * 100\"></div>\n  <ng-template [ngTemplateOutlet]=\"template\" [ngTemplateOutletContext]=\"{ item: item.origin, refs: item.refs }\"> </ng-template>\n</div>\n" }]
        }], ctorParameters: () => [{ type: GanttDragContainer }, { type: GanttBarDrag }, { type: i0.ElementRef }, { type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.NgZone }], propDecorators: { barClick: [{
                type: Output
            }], contentElementRef: [{
                type: ViewChild,
                args: ['content']
            }], ganttItemClass: [{
                type: HostBinding,
                args: ['class.gantt-bar']
            }], handles: [{
                type: ViewChildren,
                args: ['handle']
            }] } });

class NgxGanttBaselineComponent {
    constructor(elementRef, ganttUpper) {
        this.elementRef = elementRef;
        this.ganttUpper = ganttUpper;
        this.unsubscribe$ = new Subject();
        this.ganttBaselineClass = true;
    }
    ngOnInit() {
        this.baselineItem.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.baselineItem.refs.x + 'px';
        itemElement.style.bottom = '2px';
        itemElement.style.width = this.baselineItem.refs.width + 'px';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttBaselineComponent, deps: [{ token: i0.ElementRef }, { token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttBaselineComponent, isStandalone: true, selector: "ngx-gantt-baseline,gantt-baseline", inputs: { baselineItem: "baselineItem", template: "template" }, host: { properties: { "class.gantt-baseline": "this.ganttBaselineClass" } }, ngImport: i0, template: "<div #content *ngIf=\"baselineItem\" class=\"baseline-content\">\n  <ng-template\n    [ngTemplateOutlet]=\"template\"\n    [ngTemplateOutletContext]=\"{ item: baselineItem.origin, refs: baselineItem.refs }\"\n  ></ng-template>\n</div>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttBaselineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-baseline,gantt-baseline', standalone: true, imports: [NgIf, NgTemplateOutlet], template: "<div #content *ngIf=\"baselineItem\" class=\"baseline-content\">\n  <ng-template\n    [ngTemplateOutlet]=\"template\"\n    [ngTemplateOutletContext]=\"{ item: baselineItem.origin, refs: baselineItem.refs }\"\n  ></ng-template>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { baselineItem: [{
                type: Input
            }], template: [{
                type: Input
            }], ganttBaselineClass: [{
                type: HostBinding,
                args: ['class.gantt-baseline']
            }] } });

const mainHeight = 5000;
class GanttCalendarGridComponent {
    get view() {
        return this.ganttUpper.view;
    }
    constructor(ganttUpper, ngZone, elementRef) {
        this.ganttUpper = ganttUpper;
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.unsubscribe$ = new Subject();
        this.mainHeight = mainHeight;
        this.todayBorderRadius = todayBorderRadius;
        this.viewTypes = GanttViewType;
        this.className = `gantt-calendar gantt-calendar-grid`;
    }
    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const todayEle = this.elementRef.nativeElement.getElementsByClassName('gantt-calendar-today-overlay')[0];
        const line = this.elementRef.nativeElement.getElementsByClassName('today-line')[0];
        if (isNumber(x)) {
            if (line) {
                line.style.left = `${x}px`;
                line.style.top = `0px`;
                line.style.bottom = `${-mainHeight}px`;
            }
        }
        else {
            todayEle.style.display = 'none';
        }
    }
    ngOnInit() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            merge(this.ganttUpper.viewChange, this.ganttUpper.view.start$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                this.setTodayPoint();
            });
        });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttCalendarGridComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.0", type: GanttCalendarGridComponent, isStandalone: true, selector: "gantt-calendar-grid", host: { properties: { "class": "this.className" } }, ngImport: i0, template: "<div class=\"gantt-calendar-today-overlay\" [style.width.px]=\"view.width\">\n  @if (ganttUpper.showTodayLine) {\n  <span class=\"today-line\"> </span>\n  }\n</div>\n\n<svg class=\"gantt-calendar-grid-main\" [attr.width]=\"view.width\" [attr.height]=\"ganttUpper.styles.headerHeight - 1\">\n  <g>\n    @if (view.showTimeline) {\n    <g>\n      @for (point of view.secondaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.cellWidth\"\n        [attr.x2]=\"($index + 1) * view.cellWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"secondary-line\"\n      ></line>\n      }\n    </g>\n    }\n    <g>\n      @for (point of view.primaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.primaryWidth\"\n        [attr.x2]=\"($index + 1) * view.primaryWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"primary-line\"\n      ></line>\n      }\n    </g>\n  </g>\n</svg>\n" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttCalendarGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-calendar-grid', standalone: true, template: "<div class=\"gantt-calendar-today-overlay\" [style.width.px]=\"view.width\">\n  @if (ganttUpper.showTodayLine) {\n  <span class=\"today-line\"> </span>\n  }\n</div>\n\n<svg class=\"gantt-calendar-grid-main\" [attr.width]=\"view.width\" [attr.height]=\"ganttUpper.styles.headerHeight - 1\">\n  <g>\n    @if (view.showTimeline) {\n    <g>\n      @for (point of view.secondaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.cellWidth\"\n        [attr.x2]=\"($index + 1) * view.cellWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"secondary-line\"\n      ></line>\n      }\n    </g>\n    }\n    <g>\n      @for (point of view.primaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.primaryWidth\"\n        [attr.x2]=\"($index + 1) * view.primaryWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"mainHeight\"\n        class=\"primary-line\"\n      ></line>\n      }\n    </g>\n  </g>\n</svg>\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.NgZone }, { type: i0.ElementRef }], propDecorators: { className: [{
                type: HostBinding,
                args: ['class']
            }] } });

class GanttCalendarHeaderComponent {
    get view() {
        return this.ganttUpper.view;
    }
    get height() {
        return this.ganttUpper.styles.headerHeight + 'px';
    }
    constructor(ganttUpper, ngZone, elementRef) {
        this.ganttUpper = ganttUpper;
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.unsubscribe$ = new Subject();
        this.viewTypes = GanttViewType;
        this.className = `gantt-calendar gantt-calendar-header`;
    }
    ngOnInit() {
        // 头部日期定位
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            merge(this.ganttUpper.viewChange, this.ganttUpper.view.start$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                if (this.ganttUpper.viewType === GanttViewType.day)
                    this.setTodayPoint();
            });
        });
    }
    setTodayPoint() {
        const x = this.view.getTodayXPoint();
        const today = new GanttDate().getDate();
        const todayEle = this.elementRef.nativeElement.getElementsByClassName('gantt-calendar-today-overlay')[0];
        const rect = this.elementRef.nativeElement.getElementsByClassName('today-rect')[0];
        if (isNumber(x)) {
            if (rect) {
                rect.style.left = `${x - todayWidth / 2}px`;
                rect.style.top = `${this.ganttUpper.styles.headerHeight - todayHeight}px`;
                rect.innerHTML = today.toString();
            }
        }
        else {
            todayEle.style.display = 'none';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttCalendarHeaderComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.0", type: GanttCalendarHeaderComponent, isStandalone: true, selector: "gantt-calendar-header", host: { properties: { "class": "this.className", "style.height": "this.height" } }, ngImport: i0, template: "<div class=\"gantt-calendar-today-overlay\" [style.width.px]=\"view.width\">\n  <span class=\"today-rect\" [hidden]=\"ganttUpper.viewType !== viewTypes.day\"> </span>\n</div>\n<svg [attr.width]=\"view.width\" [attr.height]=\"ganttUpper.styles.headerHeight\">\n  <g>\n    @for (point of view.primaryDatePoints; track point.x) {\n    <text\n      class=\"primary-text\"\n      [ngStyle]=\"point.style\"\n      [class.today]=\"point.additions?.isToday\"\n      [class.weekend]=\"point.additions?.isWeekend\"\n      [attr.x]=\"point.x\"\n      [attr.y]=\"point.y\"\n    >\n      {{ point.text }}\n    </text>\n    } @for (point of view.secondaryDatePoints; track point.x) {\n    <text\n      class=\"secondary-text\"\n      [ngStyle]=\"point.style\"\n      [class.today]=\"point.additions?.isToday\"\n      [class.weekend]=\"point.additions?.isWeekend\"\n      [attr.x]=\"point.x\"\n      [attr.y]=\"point.y\"\n    >\n      {{ point.text }}\n    </text>\n    }\n\n    <g>\n      @for (point of view.primaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.primaryWidth\"\n        [attr.x2]=\"($index + 1) * view.primaryWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"ganttUpper.styles.headerHeight\"\n        class=\"primary-line\"\n      ></line>\n      }\n    </g>\n\n    <g>\n      <line\n        [attr.x1]=\"0\"\n        [attr.x2]=\"view.width\"\n        [attr.y1]=\"ganttUpper.styles.headerHeight\"\n        [attr.y2]=\"ganttUpper.styles.headerHeight\"\n        class=\"header-line\"\n      ></line>\n    </g>\n  </g>\n</svg>\n", dependencies: [{ kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttCalendarHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-calendar-header', standalone: true, imports: [NgStyle], template: "<div class=\"gantt-calendar-today-overlay\" [style.width.px]=\"view.width\">\n  <span class=\"today-rect\" [hidden]=\"ganttUpper.viewType !== viewTypes.day\"> </span>\n</div>\n<svg [attr.width]=\"view.width\" [attr.height]=\"ganttUpper.styles.headerHeight\">\n  <g>\n    @for (point of view.primaryDatePoints; track point.x) {\n    <text\n      class=\"primary-text\"\n      [ngStyle]=\"point.style\"\n      [class.today]=\"point.additions?.isToday\"\n      [class.weekend]=\"point.additions?.isWeekend\"\n      [attr.x]=\"point.x\"\n      [attr.y]=\"point.y\"\n    >\n      {{ point.text }}\n    </text>\n    } @for (point of view.secondaryDatePoints; track point.x) {\n    <text\n      class=\"secondary-text\"\n      [ngStyle]=\"point.style\"\n      [class.today]=\"point.additions?.isToday\"\n      [class.weekend]=\"point.additions?.isWeekend\"\n      [attr.x]=\"point.x\"\n      [attr.y]=\"point.y\"\n    >\n      {{ point.text }}\n    </text>\n    }\n\n    <g>\n      @for (point of view.primaryDatePoints; track point.x) {\n      <line\n        [attr.x1]=\"($index + 1) * view.primaryWidth\"\n        [attr.x2]=\"($index + 1) * view.primaryWidth\"\n        [attr.y1]=\"0\"\n        [attr.y2]=\"ganttUpper.styles.headerHeight\"\n        class=\"primary-line\"\n      ></line>\n      }\n    </g>\n\n    <g>\n      <line\n        [attr.x1]=\"0\"\n        [attr.x2]=\"view.width\"\n        [attr.y1]=\"ganttUpper.styles.headerHeight\"\n        [attr.y2]=\"ganttUpper.styles.headerHeight\"\n        class=\"header-line\"\n      ></line>\n    </g>\n  </g>\n</svg>\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.NgZone }, { type: i0.ElementRef }], propDecorators: { className: [{
                type: HostBinding,
                args: ['class']
            }], height: [{
                type: HostBinding,
                args: ['style.height']
            }] } });

class GanttDragBackdropComponent {
    constructor(ganttUpper) {
        this.ganttUpper = ganttUpper;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragBackdropComponent, deps: [{ token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttDragBackdropComponent, isStandalone: true, selector: "gantt-drag-backdrop", host: { classAttribute: "gantt-drag-backdrop" }, ngImport: i0, template: "<div class=\"gantt-drag-mask\" [style.top.px]=\"ganttUpper.styles.headerHeight\">\n  <div class=\"date-range\">\n    <span class=\"start\"></span>\n    <span class=\"end\"></span>\n  </div>\n</div>\n" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDragBackdropComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-drag-backdrop', host: {
                        class: 'gantt-drag-backdrop'
                    }, standalone: true, template: "<div class=\"gantt-drag-mask\" [style.top.px]=\"ganttUpper.styles.headerHeight\">\n  <div class=\"date-range\">\n    <span class=\"start\"></span>\n    <span class=\"end\"></span>\n  </div>\n</div>\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }] });

const angleRight = `<svg xmlns="http://www.w3.org/2000/svg" fit=""  preserveAspectRatio="xMidYMid meet" focusable="false"><g id="amnavigation/angle-right" stroke-width="1" fill-rule="evenodd"><path d="M7.978 11.498l-.005.005L2.3 5.831 3.13 5l4.848 4.848L12.826 5l.83.831-5.673 5.672-.005-.005z"   transform="rotate(-90 7.978 8.252)"></path></g></svg>`;
const angleDown = `<svg xmlns="http://www.w3.org/2000/svg" fit=""  preserveAspectRatio="xMidYMid meet" focusable="false"><g id="aknavigation/angle-down" stroke-width="1" fill-rule="evenodd"><path d="M7.978 11.997l-.005.006L2.3 6.33l.83-.831 4.848 4.848L12.826 5.5l.83.83-5.673 5.673-.005-.006z" ></path></g></svg>`;
const plusSquare = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit=""   preserveAspectRatio="xMidYMid meet" focusable="false"><g id="kxaction/plus-square" stroke-width="1" fill-rule="evenodd"><path d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1.2a.8.8 0 0 0-.8.8v12a.8.8 0 0 0 .8.8h12a.8.8 0 0 0 .8-.8V2a.8.8 0 0 0-.8-.8H2zm5.45 6.2V4.75h1.2V7.4h2.65v1.2H8.65v2.65h-1.2V8.6H4.8V7.4h2.65z"></path></g></svg>`;
const minusSquare = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="jnaction/minus-square" stroke-width="1" fill-rule="evenodd"><path d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1.2a.8.8 0 0 0-.8.8v12a.8.8 0 0 0 .8.8h12a.8.8 0 0 0 .8-.8V2a.8.8 0 0 0-.8-.8H2zm2.8 6.2h6.5v1.2H4.8V7.4z"></path></g></svg>`;
const loadingIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 50 50" style="enable-background:new 0 0 50 50" xml:space="preserve">
<path fill="#aaa" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" transform="rotate(275.098 25 25)">
    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
</path>
</svg>`;
const emptyIcon = `<svg
width="148px"
height="134px"
viewBox="0 0 148 134"
version="1.1"
xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
>
<defs>
  <filter x="0.0%" y="0.0%" width="100.0%" height="100.0%" filterUnits="objectBoundingBox" id="filter-1">
    <feGaussianBlur stdDeviation="0" in="SourceGraphic"></feGaussianBlur>
  </filter>
</defs>
<g id="148x134" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
  <g id="编组-6" transform="translate(1.000000, 1.000000)">
    <ellipse
      id="椭圆形"
      fill="#EDEEF2"
      opacity="0.3"
      filter="url(#filter-1)"
      cx="73.0800017"
      cy="115.920003"
      rx="73.0800017"
      ry="16.8000004"
    ></ellipse>
    <g id="编组-5" transform="translate(15.120000, 0.000000)">
      <polygon
        id="矩形"
        fill="#E2E4E9"
        points="19.2789848 49.5600011 99.1200023 48.7200011 117.600003 75.9297673 117.600003 92.313049 0 92.313049 0 75.0356267"
      ></polygon>
      <path
        d="M23.5200005,0 L94.0800002,0 C97.7913538,2.06413823e-16 100.8,3.00864655 100.8,6.72000015 L100.8,99.1200023 L100.8,99.1200023 L16.8000004,99.1200023 L16.8000004,6.72000015 C16.8000004,3.00864655 19.8086469,1.56994302e-15 23.5200005,0 Z"
        id="矩形"
        fill="#F9FAFB"
      ></path>
      <path
        d="M30.9200007,12.4400003 L86.6800019,12.4400003 C88.5356787,12.4400003 90.040002,13.9443236 90.040002,15.8000004 L90.040002,42.000001 C90.040002,43.8556778 88.5356787,45.360001 86.6800019,45.360001 L30.9200007,45.360001 C29.0643239,45.360001 27.5600006,43.8556778 27.5600006,42.000001 L27.5600006,15.8000004 C27.5600006,13.9443236 29.0643239,12.4400003 30.9200007,12.4400003 Z"
        id="矩形"
        fill="#E8EAEE"
      ></path>
      <text
        id="&lt;/null&gt;"
        font-family="PingFangSC-Medium, PingFang SC"
        font-size="15.1200003"
        font-weight="400"
        fill="#BCBECD"
      >
        <tspan x="33.6000008" y="32.8000004">&lt;/null&gt;</tspan>
      </text>
      <rect id="矩形" fill="#E8EAEE" x="27.5600006" y="52.0800012" width="61.4800014" height="5.04000011" rx="2.52000006"></rect>
      <rect
        id="矩形备份"
        fill="#E8EAEE"
        x="27.5600006"
        y="63.8400014"
        width="61.4800014"
        height="5.04000011"
        rx="2.52000006"
      ></rect>
      <path
        d="M0,75.6000017 L29.280235,75.6000017 C32.0637502,75.6000017 34.3202352,77.8564866 34.3202352,80.6400018 L34.3202352,86.2591426 C34.3202352,89.0426578 36.5767201,91.2991427 39.3602353,91.2991427 L78.4136737,91.2991427 C81.1971889,91.2991427 83.4536738,89.0426578 83.4536738,86.2591426 L83.4536738,80.6400018 C83.4536738,77.8564866 85.7101587,75.6000017 88.4936739,75.6000017 L117.600003,75.6000017 L117.600003,75.6000017 L117.600003,110.880003 C117.600003,115.519195 113.839194,119.280003 109.200002,119.280003 L8.40000019,119.280003 C3.76080819,119.280003 -6.53729019e-15,115.519195 0,110.880003 L0,75.6000017 L0,75.6000017 Z"
        id="矩形"
        fill="#EDEFF2"
      ></path>
    </g>
  </g>
</g>
</svg>`;
const dragIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="aijaction/drag--" stroke-width="1" fill-rule="evenodd"><g id="aij拖动" transform="translate(5 1)" fill-rule="nonzero"><path d="M1 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM1 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" id="aij形状结合"></path></g></g></svg>`;
const arrowLeftIcon = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="adinavigation/arrow-left" stroke-width="1" fill-rule="evenodd"><path d="M7.4 4.15L4.438 7.315a.6.6 0 0 1-.876-.82l3.97-4.243a.598.598 0 0 1 .93-.057l3.97 4.323a.6.6 0 1 1-.885.812L8.6 4.118v9.149c0 .404-.269.733-.6.733-.332 0-.6-.329-.6-.733V4.15z" id="adi形状结合" transform="rotate(-90 7.995 8)"></path></g></svg>`;
const arrowRightIcon = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="adlnavigation/arrow-right" stroke-width="1" fill-rule="evenodd"><path d="M7.4 4.15L4.438 7.315a.6.6 0 0 1-.876-.82l3.97-4.243a.598.598 0 0 1 .93-.057l3.97 4.323a.6.6 0 1 1-.885.812L8.6 4.118v9.149c0 .404-.269.733-.6.733-.332 0-.6-.329-.6-.733V4.15z" id="adl形状结合" transform="rotate(90 7.995 8)"></path></g></svg>`;
const icons = {
    'angle-right': angleRight,
    'angle-down': angleDown,
    'plus-square': plusSquare,
    'minus-square': minusSquare,
    loading: loadingIcon,
    empty: emptyIcon,
    drag: dragIcon,
    'arrow-left': arrowLeftIcon,
    'arrow-right': arrowRightIcon
};

class GanttIconComponent {
    set iconName(name) {
        this.setSvg(name);
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.isIcon = true;
    }
    setSvg(name) {
        const iconSvg = icons[name];
        if (iconSvg) {
            this.elementRef.nativeElement.innerHTML = iconSvg;
        }
        else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttIconComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttIconComponent, isStandalone: true, selector: "gantt-icon", inputs: { iconName: "iconName" }, host: { properties: { "class.gantt-icon": "this.isIcon" } }, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttIconComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'gantt-icon',
                    template: '',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { isIcon: [{
                type: HostBinding,
                args: ['class.gantt-icon']
            }], iconName: [{
                type: Input
            }] } });

class GanttLinkLine {
    constructor() { }
    generatePath(source, target, type) {
        if (source.before && source.after && target.before && target.after) {
            let path = '';
            switch (type) {
                case GanttLinkType.ss:
                    path = this.generateSSPath(source, target);
                    break;
                case GanttLinkType.ff:
                    path = this.generateFFPath(source, target);
                    break;
                case GanttLinkType.sf:
                    path = this.generateFSAndSFPath(source, target, type);
                    break;
                default:
                    path = this.generateFSAndSFPath(source, target);
            }
            return path;
        }
    }
}

let GanttLinkLineCurve = class GanttLinkLineCurve extends GanttLinkLine {
    constructor(ganttUpper) {
        super();
        this.ganttUpper = ganttUpper;
    }
    generateSSPath(source, target) {
        const x1 = source.before.x;
        const y1 = source.before.y;
        const x4 = target.before.x;
        const y4 = target.before.y;
        const isMirror = y4 > y1 ? 0 : 1;
        const radius = Math.abs(y4 - y1) / 2;
        if (x4 > x1) {
            return `M ${x1} ${y1}
                    A ${radius} ${radius} 0 1 ${isMirror} ${x1} ${y4}
                    L ${x4} ${y4}`;
        }
        else {
            return `M ${x1} ${y1}
                    L ${x4} ${y1}
                    A ${radius} ${radius} 0 1 ${isMirror} ${x4} ${y4}`;
        }
    }
    generateFFPath(source, target) {
        const x1 = source.after.x;
        const y1 = source.after.y;
        const x4 = target.after.x;
        const y4 = target.after.y;
        const isMirror = y4 > y1 ? 1 : 0;
        const radius = Math.abs(y4 - y1) / 2;
        if (x4 > x1) {
            return `M ${x1} ${y1}
                    L ${x4} ${y1}
                    A ${radius} ${radius} 0 1 ${isMirror} ${x4} ${y4}`;
        }
        else {
            return `M ${x1} ${y1}
                    A ${radius} ${radius} 0 1 ${isMirror} ${x1} ${y4}
                    L ${x4} ${y4}`;
        }
    }
    generateFSAndSFPath(source, target, type) {
        let x1 = source.after.x;
        let y1 = source.after.y;
        let x4 = target.before.x;
        let y4 = target.before.y;
        const bezierWeight = 0.5;
        if (type === GanttLinkType.sf) {
            x1 = target.after.x;
            y1 = target.after.y;
            x4 = source.before.x;
            y4 = source.before.y;
        }
        let dx = Math.abs(x4 - x1) * bezierWeight;
        let x2 = x1 + dx;
        let x3 = x4 - dx;
        const centerX = (x1 + x4) / 2;
        const centerY = (y1 + y4) / 2;
        let controlX = this.ganttUpper.styles.lineHeight / 2;
        const controlY = this.ganttUpper.styles.lineHeight / 2;
        if (x1 >= x4) {
            if (Math.abs(y4 - y1) <= this.ganttUpper.styles.lineHeight) {
                return `M ${x1} ${y1}
                    C ${x1 + controlX} ${y1} ${x1 + controlX} ${y4 > y1 ? y1 + controlX : y1 - controlX} ${x1} ${y4 > y1 ? y1 + controlY : y1 - controlY}
                    L ${x4} ${y4 > y1 ? y4 - controlY : y4 + controlY}
                    C ${x4 - controlY} ${y4 > y1 ? y4 - controlY : y4 + controlY}  ${x4 - controlX} ${y4} ${x4} ${y4}
                    `;
            }
            else {
                controlX = this.ganttUpper.styles.lineHeight;
                return `M ${x1} ${y1}
                    C ${x1 + controlX} ${y1} ${x1 + controlX} ${y4 > y1 ? y1 + controlX : y1 - controlX} ${centerX} ${centerY}
                    C ${x4 - controlX} ${y4 > y1 ? y4 - controlX : y4 + controlX} ${x4 - controlX} ${y4} ${x4} ${y4}
                    `;
            }
        }
        else if (this.ganttUpper.linkOptions?.showArrow && x4 - x1 < 200) {
            dx = Math.max(Math.abs(y4 - y1) * bezierWeight, 60);
            x2 = x1 + dx;
            x3 = x4 - dx;
            return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
        }
        return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    }
};
GanttLinkLineCurve = __decorate([
    __param(0, Inject(GANTT_UPPER_TOKEN))
], GanttLinkLineCurve);

class GanttLinkLineStraight extends GanttLinkLine {
    constructor() {
        super();
        this.pathControl = 20;
    }
    generateSSPath(source, target) {
        const x1 = source.before.x;
        const y1 = source.before.y;
        const x4 = target.before.x;
        const y4 = target.before.y;
        const control = this.pathControl;
        return `M ${x1} ${y1}
                        L ${x4 > x1 ? x1 - control : x4 - control} ${y1}
                        L ${x4 > x1 ? x1 - control : x4 - control} ${y4}
                        L ${x4} ${y4}`;
    }
    generateFFPath(source, target) {
        const x1 = source.after.x;
        const y1 = source.after.y;
        const x4 = target.after.x;
        const y4 = target.after.y;
        const control = this.pathControl;
        return `M ${x1} ${y1}
                        L ${x4 > x1 ? x4 + control : x1 + control} ${y1}
                        L ${x4 > x1 ? x4 + control : x1 + control} ${y4}
                        L ${x4} ${y4}`;
    }
    generateFSAndSFPath(source, target, type) {
        let x1 = source.after.x;
        let y1 = source.after.y;
        let x4 = target.before.x;
        let y4 = target.before.y;
        const control = this.pathControl;
        if (type === GanttLinkType.sf) {
            x1 = target.after.x;
            y1 = target.after.y;
            x4 = source.before.x;
            y4 = source.before.y;
        }
        if (x4 - x1 >= 40) {
            return `M ${x1} ${y1}
                        L ${x1 + control} ${y1}
                        L ${x1 + control} ${y4}
                        L ${x4} ${y4}`;
        }
        else {
            return `M ${x1} ${y1}
                        L ${x1 + control} ${y1}
                        L ${x1 + control} ${y4 > y1 ? y1 + control : y1 - control}
                        L ${x4 - control} ${y4 > y1 ? y1 + control : y1 - control}
                        L ${x4 - control} ${y4}
                        L ${x4} ${y4}`;
        }
    }
}

function createLineGenerator(type, ganttUpper) {
    switch (type) {
        case GanttLinkLineType.curve:
            return new GanttLinkLineCurve(ganttUpper);
        case GanttLinkLineType.straight:
            return new GanttLinkLineStraight();
        default:
            throw new Error('gantt link path type invalid');
    }
}

class GanttLinksComponent {
    constructor(ganttUpper, cdr, elementRef, ganttDragContainer, ngZone) {
        this.ganttUpper = ganttUpper;
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.ganttDragContainer = ganttDragContainer;
        this.ngZone = ngZone;
        // @Input() groups: GanttGroupInternal[] = [];
        // @Input() items: GanttItemInternal[] = [];
        this.flatItems = [];
        this.lineClick = new EventEmitter();
        this.links = [];
        this.ganttLinkTypes = GanttLinkType;
        this.showArrow = false;
        this.linkItems = [];
        this.firstChange = true;
        this.unsubscribe$ = new Subject();
        this.ganttLinksOverlay = true;
    }
    ngOnInit() {
        this.linkLine = createLineGenerator(this.ganttUpper.linkOptions.lineType, this.ganttUpper);
        this.showArrow = this.ganttUpper.linkOptions.showArrow;
        // this.buildLinks();
        this.firstChange = false;
        this.buildLinks();
        this.ganttDragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'hidden';
        });
        merge(this.ganttUpper.viewChange, this.ganttUpper.expandChange, this.ganttUpper.view.start$, this.ganttUpper.dragEnded, this.ganttUpper.linkDragEnded, this.ngZone.onStable.pipe(take(1)).pipe(switchMap(() => this.ganttUpper.table?.dragDropped || EMPTY)))
            .pipe(skip(1), debounceTime(0), takeUntil(this.unsubscribe$))
            .subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'visible';
            this.buildLinks();
            this.cdr.detectChanges();
        });
    }
    ngOnChanges() {
        if (!this.firstChange) {
            this.buildLinks();
        }
    }
    computeItemPosition() {
        const lineHeight = this.ganttUpper.styles.lineHeight;
        const barHeight = this.ganttUpper.styles.barHeight;
        this.linkItems = [];
        // if (this.groups.length > 0) {
        //     let itemNum = 0;
        //     let groupNum = 0;
        //     this.groups.forEach((group) => {
        //         groupNum++;
        //         if (group.expanded) {
        //             const items = recursiveItems(group.items);
        //             items.forEach((item, itemIndex) => {
        //                 const y = (groupNum + itemNum + itemIndex) * lineHeight + item.refs.y + barHeight / 2;
        //                 this.linkItems.push({
        //                     ...item,
        //                     before: {
        //                         x: item.refs.x,
        //                         y
        //                     },
        //                     after: {
        //                         x: item.refs.x + item.refs.width,
        //                         y
        //                     }
        //                 });
        //             });
        //             itemNum += items.length;
        //         }
        //     });
        // } else {
        //     const items = recursiveItems(this.items);
        //     items.forEach((item, itemIndex) => {
        //         const y = itemIndex * lineHeight + item.refs.y + barHeight / 2;
        //         this.linkItems.push({
        //             ...item,
        //             before: {
        //                 x: item.refs.x,
        //                 y
        //             },
        //             after: {
        //                 x: item.refs.x + item.refs.width,
        //                 y
        //             }
        //         });
        //     });
        // }
        this.flatItems.forEach((item, itemIndex) => {
            if (!item.hasOwnProperty('items')) {
                const ganttItem = item;
                if (ganttItem.refs) {
                    const y = itemIndex * lineHeight + ganttItem.refs.y + barHeight / 2;
                    this.linkItems.push({
                        ...ganttItem,
                        before: {
                            x: ganttItem.refs.x,
                            y
                        },
                        after: {
                            x: ganttItem.refs.x + ganttItem.refs.width,
                            y
                        }
                    });
                }
            }
        });
    }
    buildLinks() {
        this.computeItemPosition();
        this.links = [];
        this.linkItems.forEach((source) => {
            if (source.origin.start || source.origin.end) {
                source.links.forEach((link) => {
                    const target = this.linkItems.find((item) => item.id === link.link);
                    if (target && (target.origin.start || target.origin.end)) {
                        let defaultColor = LinkColors.default;
                        let activeColor = LinkColors.active;
                        if (link.type === GanttLinkType.fs && source.end.getTime() > target.start.getTime()) {
                            defaultColor = LinkColors.blocked;
                            activeColor = LinkColors.blocked;
                        }
                        if (link.color) {
                            if (typeof link.color === 'string') {
                                defaultColor = link.color;
                                activeColor = link.color;
                            }
                            else {
                                defaultColor = link.color.default;
                                activeColor = link.color.active;
                            }
                        }
                        this.links.push({
                            path: this.linkLine.generatePath(source, target, link.type),
                            source: source.origin,
                            target: target.origin,
                            type: link.type,
                            color: defaultColor,
                            defaultColor,
                            activeColor
                        });
                    }
                });
            }
        });
    }
    trackBy(index) {
        return index;
    }
    onLineClick(event, link) {
        this.lineClick.emit({
            event,
            source: link.source,
            target: link.target
        });
    }
    mouseEnterPath(link, index) {
        link.color = link.activeColor || link.defaultColor;
        if (index < this.links.length - 1) {
            this.links.splice(index, 1);
            this.links.push(link);
        }
    }
    mouseLeavePath(link) {
        link.color = link.defaultColor;
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttLinksComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: GanttDragContainer }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttLinksComponent, isStandalone: true, selector: "gantt-links-overlay", inputs: { flatItems: "flatItems" }, outputs: { lineClick: "lineClick" }, host: { properties: { "class.gantt-links-overlay": "this.ganttLinksOverlay" } }, usesOnChanges: true, ngImport: i0, template: "<svg [attr.width]=\"ganttUpper.view.width\" class=\"gantt-links-overlay-main\">\n  <ng-container *ngFor=\"let link of links; let i = index; trackBy: trackBy\">\n    <path\n      [attr.d]=\"link.path\"\n      fill=\"transparent\"\n      stroke-width=\"2\"\n      [attr.stroke]=\"link.color\"\n      pointer-events=\"none\"\n      [attr.style]=\"link.type === ganttLinkTypes.sf ? 'marker-start: url(#triangle' + i + ')' : 'marker-end: url(#triangle' + i + ')'\"\n    ></path>\n\n    <g>\n      <path\n        class=\"link-line\"\n        (click)=\"onLineClick($event, link)\"\n        [attr.d]=\"link.path\"\n        (mouseenter)=\"mouseEnterPath(link, i)\"\n        (mouseleave)=\"mouseLeavePath(link)\"\n        stroke=\"transparent\"\n        stroke-width=\"9\"\n        fill=\"none\"\n        cursor=\"pointer\"\n      ></path>\n    </g>\n    <defs *ngIf=\"showArrow\">\n      <marker\n        *ngIf=\"link.type === ganttLinkTypes.sf; else markerEnd\"\n        [id]=\"'triangle' + i\"\n        markerUnits=\"strokeWidth\"\n        markerWidth=\"5\"\n        markerHeight=\"4\"\n        refX=\"5\"\n        refY=\"2\"\n        orient=\"180\"\n      >\n        <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n      </marker>\n\n      <ng-template #markerEnd>\n        <marker [id]=\"'triangle' + i\" markerUnits=\"strokeWidth\" markerWidth=\"5\" markerHeight=\"4\" refX=\"5\" refY=\"2\" orient=\"auto\">\n          <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n        </marker>\n      </ng-template>\n    </defs>\n  </ng-container>\n  <line class=\"link-dragging-line\"></line>\n</svg>\n", dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttLinksComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-links-overlay', standalone: true, imports: [NgFor, NgIf], template: "<svg [attr.width]=\"ganttUpper.view.width\" class=\"gantt-links-overlay-main\">\n  <ng-container *ngFor=\"let link of links; let i = index; trackBy: trackBy\">\n    <path\n      [attr.d]=\"link.path\"\n      fill=\"transparent\"\n      stroke-width=\"2\"\n      [attr.stroke]=\"link.color\"\n      pointer-events=\"none\"\n      [attr.style]=\"link.type === ganttLinkTypes.sf ? 'marker-start: url(#triangle' + i + ')' : 'marker-end: url(#triangle' + i + ')'\"\n    ></path>\n\n    <g>\n      <path\n        class=\"link-line\"\n        (click)=\"onLineClick($event, link)\"\n        [attr.d]=\"link.path\"\n        (mouseenter)=\"mouseEnterPath(link, i)\"\n        (mouseleave)=\"mouseLeavePath(link)\"\n        stroke=\"transparent\"\n        stroke-width=\"9\"\n        fill=\"none\"\n        cursor=\"pointer\"\n      ></path>\n    </g>\n    <defs *ngIf=\"showArrow\">\n      <marker\n        *ngIf=\"link.type === ganttLinkTypes.sf; else markerEnd\"\n        [id]=\"'triangle' + i\"\n        markerUnits=\"strokeWidth\"\n        markerWidth=\"5\"\n        markerHeight=\"4\"\n        refX=\"5\"\n        refY=\"2\"\n        orient=\"180\"\n      >\n        <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n      </marker>\n\n      <ng-template #markerEnd>\n        <marker [id]=\"'triangle' + i\" markerUnits=\"strokeWidth\" markerWidth=\"5\" markerHeight=\"4\" refX=\"5\" refY=\"2\" orient=\"auto\">\n          <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n        </marker>\n      </ng-template>\n    </defs>\n  </ng-container>\n  <line class=\"link-dragging-line\"></line>\n</svg>\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: GanttDragContainer }, { type: i0.NgZone }], propDecorators: { flatItems: [{
                type: Input
            }], lineClick: [{
                type: Output
            }], ganttLinksOverlay: [{
                type: HostBinding,
                args: ['class.gantt-links-overlay']
            }] } });

class GanttLoaderComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttLoaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttLoaderComponent, isStandalone: true, selector: "gantt-loader", host: { classAttribute: "gantt-loader gantt-loader-overlay" }, ngImport: i0, template: `
        <div class="gantt-loader-wrapper">
            <div class="gantt-loader-loading">
                <span class="gantt-loader-loading-spot"></span>
            </div>
        </div>
    `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttLoaderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'gantt-loader',
                    template: `
        <div class="gantt-loader-wrapper">
            <div class="gantt-loader-loading">
                <span class="gantt-loader-loading-spot"></span>
            </div>
        </div>
    `,
                    host: {
                        class: 'gantt-loader gantt-loader-overlay'
                    },
                    standalone: true
                }]
        }] });

class IsGanttRangeItemPipe {
    transform(value) {
        return value === GanttItemType.range;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttRangeItemPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: IsGanttRangeItemPipe, isStandalone: true, name: "isGanttRangeItem" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttRangeItemPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isGanttRangeItem',
                    standalone: true
                }]
        }] });
class IsGanttBarItemPipe {
    transform(value) {
        return value === GanttItemType.bar;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttBarItemPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: IsGanttBarItemPipe, isStandalone: true, name: "isGanttBarItem" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttBarItemPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isGanttBarItem',
                    standalone: true
                }]
        }] });
class IsGanttCustomItemPipe {
    transform(value) {
        return value === GanttItemType.custom;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttCustomItemPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: IsGanttCustomItemPipe, isStandalone: true, name: "isGanttCustomItem" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: IsGanttCustomItemPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isGanttCustomItem',
                    standalone: true
                }]
        }] });
class GanttDateFormatPipe {
    transform(value, format) {
        return new GanttDate(value).format(format);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDateFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: GanttDateFormatPipe, isStandalone: true, name: "dateFormat" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttDateFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'dateFormat',
                    standalone: true
                }]
        }] });

class NgxGanttRangeComponent extends GanttItemUpper {
    constructor(elementRef, ganttUpper) {
        super(elementRef, ganttUpper);
        this.ganttRangeClass = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttRangeComponent, deps: [{ token: i0.ElementRef }, { token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttRangeComponent, isStandalone: true, selector: "ngx-gantt-range,gantt-range", host: { properties: { "class.gantt-range": "this.ganttRangeClass" } }, usesInheritance: true, ngImport: i0, template: "<ng-container *ngIf=\"item.start && item.end\">\n  <div class=\"gantt-range-main\">\n    <div class=\"gantt-range-main-progress\" *ngIf=\"item.progress >= 0\" [style.width.%]=\"item.progress * 100\"></div>\n  </div>\n  <div class=\"gantt-range-triangle left\"></div>\n  <div class=\"gantt-range-triangle right\"></div>\n  <ng-template [ngTemplateOutlet]=\"template\" [ngTemplateOutletContext]=\"{ item: item.origin, refs: item.refs }\"></ng-template>\n</ng-container>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttRangeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-range,gantt-range', standalone: true, imports: [NgIf, NgTemplateOutlet], template: "<ng-container *ngIf=\"item.start && item.end\">\n  <div class=\"gantt-range-main\">\n    <div class=\"gantt-range-main-progress\" *ngIf=\"item.progress >= 0\" [style.width.%]=\"item.progress * 100\"></div>\n  </div>\n  <div class=\"gantt-range-triangle left\"></div>\n  <div class=\"gantt-range-triangle right\"></div>\n  <ng-template [ngTemplateOutlet]=\"template\" [ngTemplateOutletContext]=\"{ item: item.origin, refs: item.refs }\"></ng-template>\n</ng-container>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { ganttRangeClass: [{
                type: HostBinding,
                args: ['class.gantt-range']
            }] } });

class GanttMainComponent {
    constructor(ganttUpper, dom, ngZone) {
        this.ganttUpper = ganttUpper;
        this.dom = dom;
        this.ngZone = ngZone;
        this.barClick = new EventEmitter();
        this.lineClick = new EventEmitter();
        this.ganttMainClass = true;
        this.unsubscribe$ = new Subject();
    }
    ngOnInit() {
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take$1(1));
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil$1(this.unsubscribe$)).subscribe(() => {
                this.setupResize();
            });
        });
    }
    trackBy(index, item) {
        return item.id || index;
    }
    setupResize() {
        combineLatest([this.dom.getResize(), this.dom.getResizeByElement(this.dom.mainContainer)])
            .pipe(takeUntil$1(this.unsubscribe$))
            .subscribe(() => {
            this.dom.setVisibleRangeX();
        });
    }
    quickTime(item, type) {
        const date = type === 'left' ? item.start || item.end : item.end || item.start;
        this.ganttRoot.scrollToDate(date);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttMainComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: GanttDomService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.0", type: GanttMainComponent, isStandalone: true, selector: "gantt-main", inputs: { viewportItems: "viewportItems", flatItems: "flatItems", groupHeaderTemplate: "groupHeaderTemplate", itemTemplate: "itemTemplate", barTemplate: "barTemplate", rangeTemplate: "rangeTemplate", baselineTemplate: "baselineTemplate", ganttRoot: "ganttRoot", quickTimeFocus: "quickTimeFocus" }, outputs: { barClick: "barClick", lineClick: "lineClick" }, host: { properties: { "class.gantt-main-container": "this.ganttMainClass" } }, ngImport: i0, template: "<gantt-links-overlay [flatItems]=\"flatItems\" (lineClick)=\"lineClick.emit($event)\"></gantt-links-overlay>\n<div class=\"gantt-main-groups\" [style.width.px]=\"ganttUpper.view.width\">\n  <ng-container *ngFor=\"let data of viewportItems; trackBy: trackBy\">\n    <div class=\"gantt-group\" [style.height.px]=\"ganttUpper.styles.lineHeight\" [ngClass]=\"data.class\" *ngIf=\"data.items\">\n      <ng-template [ngTemplateOutlet]=\"groupHeaderTemplate\" [ngTemplateOutletContext]=\"{ group: data }\"></ng-template>\n    </div>\n    <div\n      *ngIf=\"!data.items\"\n      class=\"gantt-item\"\n      [style.height.px]=\"ganttUpper.styles.lineHeight\"\n      [class.gantt-main-item-active]=\"ganttUpper.isSelected(data.id)\"\n    >\n      <ng-container *ngIf=\"data.type | isGanttCustomItem\">\n        <ng-template\n          [ngTemplateOutlet]=\"itemTemplate\"\n          [ngTemplateOutletContext]=\"{\n            item: data.origin,\n            refs: data.refs,\n            baseline: ganttUpper.baselineItemsMap[data.id]?.origin,\n            baselineRefs: ganttUpper.baselineItemsMap[data.id]?.refs\n          }\"\n        >\n        </ng-template>\n      </ng-container>\n\n      <ng-container *ngIf=\"(data.type | isGanttRangeItem) || (data.type | isGanttBarItem)\">\n        <gantt-range *ngIf=\"data.type | isGanttRangeItem\" [template]=\"rangeTemplate\" [item]=\"data\"></gantt-range>\n        <gantt-bar *ngIf=\"data.type | isGanttBarItem\" [item]=\"data\" [template]=\"barTemplate\" (barClick)=\"barClick.emit($event)\"></gantt-bar>\n        <gantt-baseline\n          *ngIf=\"ganttUpper.baselineItemsMap[data.id]\"\n          [baselineItem]=\"ganttUpper.baselineItemsMap[data.id]\"\n          [template]=\"baselineTemplate\"\n        ></gantt-baseline>\n      </ng-container>\n    </div>\n  </ng-container>\n</div>\n\n@if (quickTimeFocus) {\n<div class=\"gantt-quick-time-focus-container\" [style.width.px]=\"ganttUpper.view.width\">\n  <div class=\"gantt-quick-time-focus\" [style.width.px]=\"dom.visibleRangeX().max - dom.visibleRangeX().min\">\n    <ng-container *ngFor=\"let data of viewportItems; let i = index; trackBy: trackBy\">\n      <div class=\"gantt-quick-time-focus-item\" [style.height.px]=\"ganttUpper.styles.lineHeight\">\n        <span class=\"ml-2\">\n          @if ((data.refs.x < dom.visibleRangeX().min ) && data.refs.width ) {\n          <a class=\"gantt-quick-time-focus-item-arrow link-secondary\" href=\"javascript:;\" (click)=\"quickTime(data.origin, 'left')\">\n            <gantt-icon iconName=\"arrow-left\"></gantt-icon>\n          </a>\n          }\n        </span>\n\n        <span class=\"mr-2\">\n          @if((data.refs.x + data.refs.width > dom.visibleRangeX().max) && data.refs.width) {\n          <a class=\"gantt-quick-time-focus-item-arrow link-secondary\" href=\"javascript:;\" (click)=\"quickTime(data.origin, 'right')\">\n            <gantt-icon iconName=\"arrow-right\"></gantt-icon>\n          </a>\n          }\n        </span>\n      </div>\n    </ng-container>\n  </div>\n</div>\n}\n", dependencies: [{ kind: "component", type: GanttLinksComponent, selector: "gantt-links-overlay", inputs: ["flatItems"], outputs: ["lineClick"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: NgxGanttRangeComponent, selector: "ngx-gantt-range,gantt-range" }, { kind: "component", type: NgxGanttBarComponent, selector: "ngx-gantt-bar,gantt-bar", outputs: ["barClick"] }, { kind: "component", type: NgxGanttBaselineComponent, selector: "ngx-gantt-baseline,gantt-baseline", inputs: ["baselineItem", "template"] }, { kind: "pipe", type: IsGanttRangeItemPipe, name: "isGanttRangeItem" }, { kind: "pipe", type: IsGanttBarItemPipe, name: "isGanttBarItem" }, { kind: "pipe", type: IsGanttCustomItemPipe, name: "isGanttCustomItem" }, { kind: "component", type: GanttIconComponent, selector: "gantt-icon", inputs: ["iconName"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttMainComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-main', standalone: true, imports: [
                        GanttLinksComponent,
                        NgFor,
                        NgIf,
                        NgClass,
                        NgTemplateOutlet,
                        NgxGanttRangeComponent,
                        NgxGanttBarComponent,
                        NgxGanttBaselineComponent,
                        IsGanttRangeItemPipe,
                        IsGanttBarItemPipe,
                        IsGanttCustomItemPipe,
                        GanttIconComponent
                    ], template: "<gantt-links-overlay [flatItems]=\"flatItems\" (lineClick)=\"lineClick.emit($event)\"></gantt-links-overlay>\n<div class=\"gantt-main-groups\" [style.width.px]=\"ganttUpper.view.width\">\n  <ng-container *ngFor=\"let data of viewportItems; trackBy: trackBy\">\n    <div class=\"gantt-group\" [style.height.px]=\"ganttUpper.styles.lineHeight\" [ngClass]=\"data.class\" *ngIf=\"data.items\">\n      <ng-template [ngTemplateOutlet]=\"groupHeaderTemplate\" [ngTemplateOutletContext]=\"{ group: data }\"></ng-template>\n    </div>\n    <div\n      *ngIf=\"!data.items\"\n      class=\"gantt-item\"\n      [style.height.px]=\"ganttUpper.styles.lineHeight\"\n      [class.gantt-main-item-active]=\"ganttUpper.isSelected(data.id)\"\n    >\n      <ng-container *ngIf=\"data.type | isGanttCustomItem\">\n        <ng-template\n          [ngTemplateOutlet]=\"itemTemplate\"\n          [ngTemplateOutletContext]=\"{\n            item: data.origin,\n            refs: data.refs,\n            baseline: ganttUpper.baselineItemsMap[data.id]?.origin,\n            baselineRefs: ganttUpper.baselineItemsMap[data.id]?.refs\n          }\"\n        >\n        </ng-template>\n      </ng-container>\n\n      <ng-container *ngIf=\"(data.type | isGanttRangeItem) || (data.type | isGanttBarItem)\">\n        <gantt-range *ngIf=\"data.type | isGanttRangeItem\" [template]=\"rangeTemplate\" [item]=\"data\"></gantt-range>\n        <gantt-bar *ngIf=\"data.type | isGanttBarItem\" [item]=\"data\" [template]=\"barTemplate\" (barClick)=\"barClick.emit($event)\"></gantt-bar>\n        <gantt-baseline\n          *ngIf=\"ganttUpper.baselineItemsMap[data.id]\"\n          [baselineItem]=\"ganttUpper.baselineItemsMap[data.id]\"\n          [template]=\"baselineTemplate\"\n        ></gantt-baseline>\n      </ng-container>\n    </div>\n  </ng-container>\n</div>\n\n@if (quickTimeFocus) {\n<div class=\"gantt-quick-time-focus-container\" [style.width.px]=\"ganttUpper.view.width\">\n  <div class=\"gantt-quick-time-focus\" [style.width.px]=\"dom.visibleRangeX().max - dom.visibleRangeX().min\">\n    <ng-container *ngFor=\"let data of viewportItems; let i = index; trackBy: trackBy\">\n      <div class=\"gantt-quick-time-focus-item\" [style.height.px]=\"ganttUpper.styles.lineHeight\">\n        <span class=\"ml-2\">\n          @if ((data.refs.x < dom.visibleRangeX().min ) && data.refs.width ) {\n          <a class=\"gantt-quick-time-focus-item-arrow link-secondary\" href=\"javascript:;\" (click)=\"quickTime(data.origin, 'left')\">\n            <gantt-icon iconName=\"arrow-left\"></gantt-icon>\n          </a>\n          }\n        </span>\n\n        <span class=\"mr-2\">\n          @if((data.refs.x + data.refs.width > dom.visibleRangeX().max) && data.refs.width) {\n          <a class=\"gantt-quick-time-focus-item-arrow link-secondary\" href=\"javascript:;\" (click)=\"quickTime(data.origin, 'right')\">\n            <gantt-icon iconName=\"arrow-right\"></gantt-icon>\n          </a>\n          }\n        </span>\n      </div>\n    </ng-container>\n  </div>\n</div>\n}\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: GanttDomService }, { type: i0.NgZone }], propDecorators: { viewportItems: [{
                type: Input
            }], flatItems: [{
                type: Input
            }], groupHeaderTemplate: [{
                type: Input
            }], itemTemplate: [{
                type: Input
            }], barTemplate: [{
                type: Input
            }], rangeTemplate: [{
                type: Input
            }], baselineTemplate: [{
                type: Input
            }], ganttRoot: [{
                type: Input
            }], quickTimeFocus: [{
                type: Input
            }], barClick: [{
                type: Output
            }], lineClick: [{
                type: Output
            }], ganttMainClass: [{
                type: HostBinding,
                args: ['class.gantt-main-container']
            }] } });

const GANTT_ABSTRACT_TOKEN = new InjectionToken('gantt-abstract-token');

const supports = (typeof window !== 'undefined' && !!window.CSS && CSS.supports) || (() => false);
/**
 * Note: we don't need to add vendor prefixes within `.scss` files since they're added automatically.
 * This function is necessary when the `element.style` is updated directly through the JavaScript.
 * This is not required to be used with CSS properties that don't require vendor prefixes (e.g. `opacity`).
 */
function setStyleWithVendorPrefix({ element, style, value }) {
    element.style[style] = value;
    if (supports(`-webkit-${style}: ${value}`)) {
        // Note: some browsers still require setting `-webkit` vendor prefix. E.g. Mozilla 49 has implemented
        // the 3D support for `transform`, but it requires setting `-webkit-` prefix.
        element.style[`-webkit-${style}`] = value;
    }
}

const defaultColumnWidth = 100;
const minColumnWidth = 80;
class GanttTableHeaderComponent {
    get height() {
        return this.gantt.styles.headerHeight + 'px';
    }
    get lineHeight() {
        return this.gantt.styles.headerHeight + 'px';
    }
    constructor(elementRef, gantt, cdr) {
        this.elementRef = elementRef;
        this.gantt = gantt;
        this.cdr = cdr;
        this.tableWidth = 0;
        this.unsubscribe$ = new Subject();
        this.className = `gantt-table-header `;
    }
    ngOnInit() {
        this.columnsChange();
        this.columns.changes.pipe(takeUntil$1(this.unsubscribe$)).subscribe(() => {
            this.columnsChange();
            this.gantt.cdr.detectChanges();
        });
    }
    columnsChange() {
        let tableWidth = 0;
        this.columns.forEach((column) => {
            if (!column.columnWidth) {
                column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
            }
            tableWidth += Number(column.columnWidth.replace('px', ''));
        });
        this.tableWidth = tableWidth;
    }
    dragFixed(config) {
        if (config.movedWidth < config.minWidth) {
            setStyleWithVendorPrefix({
                element: config.target,
                style: 'transform',
                value: `translate3d(${config.minWidth - config.originWidth}px, 0, 0)`
            });
        }
    }
    onResizeStarted(event) {
        const target = event.source.element.nativeElement;
        this.dragStartLeft = target.getBoundingClientRect().left;
    }
    onResizeMoved(event, column) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        let originWidth;
        let movedWidth;
        let minWidth;
        if (column) {
            originWidth = parseInt(column.columnWidth, 10);
            movedWidth = originWidth + (left - this.dragStartLeft);
            minWidth = minColumnWidth;
        }
        else {
            originWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
            movedWidth = originWidth + (left - this.dragStartLeft);
            minWidth = minColumnWidth * this.columns.length;
        }
        this.dragFixed({
            target,
            originWidth,
            movedWidth,
            minWidth
        });
        this.showAuxiliaryLine(event);
    }
    onResizeEnded(event, column) {
        const beforeWidth = parseInt(column.columnWidth, 10);
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const width = parseInt(column.columnWidth, 10) + (left - this.dragStartLeft);
        const columnWidth = Math.max(width || 0, minColumnWidth);
        column.columnWidth = coerceCssPixelValue(columnWidth);
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columns });
        }
        this.tableWidth = this.tableWidth - beforeWidth + columnWidth;
        this.hideAuxiliaryLine();
        event.source.reset();
    }
    onOverallResizeEnded(event) {
        const target = event.source.element.nativeElement;
        const left = target.getBoundingClientRect().left;
        const tableWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        const dragWidth = left - this.dragStartLeft;
        let tempWidth = 0;
        this.columns.forEach((column) => {
            const lastColumnWidth = parseInt(column.columnWidth, 10);
            const distributeWidth = parseInt(String(dragWidth * (lastColumnWidth / tableWidth)), 10);
            const columnWidth = Math.max(lastColumnWidth + distributeWidth || 0, minColumnWidth);
            column.columnWidth = coerceCssPixelValue(columnWidth);
            tempWidth += columnWidth;
        });
        this.tableWidth = tempWidth;
        if (this.gantt.table) {
            this.gantt.table.columnChanges.emit({ columns: this.columns });
        }
        this.hideAuxiliaryLine();
        event.source.reset();
    }
    showAuxiliaryLine(event) {
        const tableRect = this.elementRef.nativeElement.getBoundingClientRect();
        const targetRect = event.source.element.nativeElement.getBoundingClientRect();
        const distance = { x: targetRect.left - tableRect.left, y: targetRect.top - tableRect.top };
        this.resizeLineElementRef.nativeElement.style.left = `${distance.x}px`;
        this.resizeLineElementRef.nativeElement.style.display = 'block';
    }
    hideAuxiliaryLine() {
        this.resizeLineElementRef.nativeElement.style.display = 'none';
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttTableHeaderComponent, deps: [{ token: i0.ElementRef }, { token: GANTT_ABSTRACT_TOKEN }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttTableHeaderComponent, isStandalone: true, selector: "gantt-table-header", inputs: { columns: "columns" }, host: { properties: { "class": "this.className", "style.height": "this.height", "style.line-height": "this.lineHeight" } }, viewQueries: [{ propertyName: "resizeLineElementRef", first: true, predicate: ["resizeLine"], descendants: true, static: true }], ngImport: i0, template: "<div class=\"gantt-table-header-container\">\n  <div class=\"gantt-table-column\" *ngFor=\"let column of columns; let i = index\" [style.width]=\"column.columnWidth\">\n    <ng-container *ngIf=\"column.headerTemplateRef; else default\" [ngTemplateOutlet]=\"column.headerTemplateRef\"> </ng-container>\n    <ng-template #default>\n      {{ column.name }}\n    </ng-template>\n    <div\n      class=\"column-resize-handle\"\n      cdkDrag\n      cdkDragLockAxis=\"x\"\n      cdkDragBoundary=\".gantt\"\n      (cdkDragMoved)=\"onResizeMoved($event, column)\"\n      (cdkDragStarted)=\"onResizeStarted($event)\"\n      (cdkDragEnded)=\"onResizeEnded($event, column)\"\n    ></div>\n  </div>\n</div>\n\n<div\n  class=\"table-resize-handle\"\n  cdkDrag\n  cdkDragLockAxis=\"x\"\n  cdkDragBoundary=\".gantt\"\n  (cdkDragMoved)=\"onResizeMoved($event)\"\n  (cdkDragStarted)=\"onResizeStarted($event)\"\n  (cdkDragEnded)=\"onOverallResizeEnded($event)\"\n></div>\n\n<div #resizeLine class=\"table-resize-auxiliary-line\"></div>\n", dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttTableHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-table-header', standalone: true, imports: [NgFor, NgIf, NgTemplateOutlet, CdkDrag], template: "<div class=\"gantt-table-header-container\">\n  <div class=\"gantt-table-column\" *ngFor=\"let column of columns; let i = index\" [style.width]=\"column.columnWidth\">\n    <ng-container *ngIf=\"column.headerTemplateRef; else default\" [ngTemplateOutlet]=\"column.headerTemplateRef\"> </ng-container>\n    <ng-template #default>\n      {{ column.name }}\n    </ng-template>\n    <div\n      class=\"column-resize-handle\"\n      cdkDrag\n      cdkDragLockAxis=\"x\"\n      cdkDragBoundary=\".gantt\"\n      (cdkDragMoved)=\"onResizeMoved($event, column)\"\n      (cdkDragStarted)=\"onResizeStarted($event)\"\n      (cdkDragEnded)=\"onResizeEnded($event, column)\"\n    ></div>\n  </div>\n</div>\n\n<div\n  class=\"table-resize-handle\"\n  cdkDrag\n  cdkDragLockAxis=\"x\"\n  cdkDragBoundary=\".gantt\"\n  (cdkDragMoved)=\"onResizeMoved($event)\"\n  (cdkDragStarted)=\"onResizeStarted($event)\"\n  (cdkDragEnded)=\"onOverallResizeEnded($event)\"\n></div>\n\n<div #resizeLine class=\"table-resize-auxiliary-line\"></div>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [GANTT_ABSTRACT_TOKEN]
                }] }, { type: i0.ChangeDetectorRef }], propDecorators: { columns: [{
                type: Input
            }], resizeLineElementRef: [{
                type: ViewChild,
                args: ['resizeLine', { static: true }]
            }], className: [{
                type: HostBinding,
                args: ['class']
            }], height: [{
                type: HostBinding,
                args: ['style.height']
            }], lineHeight: [{
                type: HostBinding,
                args: ['style.line-height']
            }] } });

class GanttTableBodyComponent {
    set viewportItems(data) {
        const firstData = data[0];
        if (firstData && firstData.hasOwnProperty('items')) {
            this.hasGroup = true;
        }
        this.ganttTableEmptyClass = data?.length ? false : true;
        this._viewportItems = data;
    }
    get viewportItems() {
        return this._viewportItems;
    }
    constructor(gantt, ganttUpper, cdr, document) {
        this.gantt = gantt;
        this.ganttUpper = ganttUpper;
        this.cdr = cdr;
        this.document = document;
        this.draggable = false;
        this.dragDropped = new EventEmitter();
        this.dragStarted = new EventEmitter();
        this.dragEnded = new EventEmitter();
        this.itemClick = new EventEmitter();
        this.ganttTableClass = true;
        this.ganttTableEmptyClass = false;
        this.ganttTableDragging = false;
        this.hasExpandIcon = false;
        // 缓存 Element 和 DragRef 的关系，方便在 Item 拖动时查找
        this.itemDragsMap = new Map();
        this.itemDragMoved = new Subject();
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.columns.changes.pipe(startWith$1(this.columns), takeUntil$1(this.destroy$)).subscribe(() => {
            this.hasExpandIcon = false;
            this.columns.forEach((column) => {
                if (!column.columnWidth) {
                    column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
                }
                if (column.showExpandIcon) {
                    this.hasExpandIcon = true;
                }
            });
            this.cdr.detectChanges();
        });
    }
    ngAfterViewInit() {
        this.cdkDrags.changes
            .pipe(startWith$1(this.cdkDrags), takeUntil$1(this.destroy$))
            .subscribe((drags) => {
            this.itemDragsMap.clear();
            drags.forEach((drag) => {
                if (drag.data) {
                    // cdkDrag 变化时，缓存 Element 与 DragRef 的关系，方便 Drag Move 时查找
                    this.itemDragsMap.set(drag.element.nativeElement, drag);
                }
            });
        });
        this.itemDragMoved
            .pipe(auditTime$1(30), 
        //  auditTime 可能会导致拖动结束后仍然执行 moved ，所以通过判断 dragging 状态来过滤无效 moved
        filter((event) => event.source._dragRef.isDragging()), takeUntil$1(this.destroy$))
            .subscribe((event) => {
            this.onItemDragMoved(event);
        });
    }
    expandGroup(group) {
        this.gantt.expandGroup(group);
    }
    expandChildren(event, item) {
        event.stopPropagation();
        this.gantt.expandChildren(item);
    }
    onItemDragStarted(event) {
        this.ganttTableDragging = true;
        // 拖动开始时隐藏所有的子项
        const children = this.getChildrenElementsByElement(event.source.element.nativeElement);
        children.forEach((element) => {
            element.classList.add('drag-item-hide');
        });
        this.dragStarted.emit({
            source: event.source.data?.origin,
            sourceParent: this.getParentByItem(event.source.data)?.origin
        });
    }
    emitItemDragMoved(event) {
        this.itemDragMoved.next(event);
    }
    onItemDragMoved(event) {
        // 通过鼠标位置查找对应的目标 Item 元素
        let currentPointElement = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
        if (!currentPointElement) {
            this.cleanupDragArtifacts();
            return;
        }
        let targetElement = currentPointElement.classList.contains('gantt-table-item')
            ? currentPointElement
            : currentPointElement.closest('.gantt-table-item');
        if (!targetElement) {
            this.cleanupDragArtifacts();
            return;
        }
        // 缓存放置目标Id 并计算鼠标相对应的位置
        this.itemDropTarget = {
            id: this.itemDragsMap.get(targetElement)?.data.id,
            position: this.getTargetPosition(targetElement, event)
        };
        // 执行外部传入的 dropEnterPredicate 判断是否允许拖入目标项
        if (this.dropEnterPredicate) {
            const targetDragRef = this.itemDragsMap.get(targetElement);
            if (this.dropEnterPredicate({
                source: event.source.data.origin,
                target: targetDragRef.data.origin,
                dropPosition: this.itemDropTarget.position
            })) {
                this.showDropPositionPlaceholder(targetElement);
            }
            else {
                this.itemDropTarget = null;
                this.cleanupDragArtifacts(false);
            }
        }
        else {
            this.showDropPositionPlaceholder(targetElement);
        }
    }
    onItemDragEnded(event) {
        this.ganttTableDragging = false;
        this.dragEnded.emit({
            source: event.source.data?.origin,
            sourceParent: this.getParentByItem(event.source.data)?.origin
        });
        // dropEnterPredicate 方法返回值为 false 时，始终未执行 onListDropped，所以只能在 dragEnded 中移除 drag-item-hide
        const children = this.getChildrenElementsByElement(event.source.element.nativeElement);
        children.forEach((element) => {
            element.classList.remove('drag-item-hide');
        });
    }
    onListDropped(event) {
        if (!this.itemDropTarget) {
            return;
        }
        const sourceItem = event.item.data;
        const sourceParent = this.getParentByItem(sourceItem);
        const sourceChildren = this.getExpandChildrenByDrag(event.item);
        const targetDragRef = this.cdkDrags.find((item) => item.data?.id === this.itemDropTarget.id);
        const targetItem = targetDragRef?.data;
        const targetParent = this.getParentByItem(targetItem);
        this.removeItem(sourceItem, sourceChildren);
        switch (this.itemDropTarget.position) {
            case 'before':
            case 'after':
                this.insertItem(targetItem, sourceItem, sourceChildren, this.itemDropTarget.position);
                sourceItem.updateLevel(targetItem.level);
                break;
            case 'inside':
                this.insertChildrenItem(targetItem, sourceItem, sourceChildren);
                sourceItem.updateLevel(targetItem.level + 1);
                break;
        }
        this.dragDropped.emit({
            source: sourceItem.origin,
            sourceParent: sourceParent?.origin,
            target: targetItem.origin,
            targetParent: targetParent?.origin,
            dropPosition: this.itemDropTarget.position
        });
        this.cleanupDragArtifacts(true);
    }
    trackBy(index, item) {
        return item.id || index;
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    removeItem(item, children) {
        this.viewportItems.splice(this.viewportItems.indexOf(item), 1 + children.length);
        this.flatItems.splice(this.flatItems.indexOf(item), 1 + children.length);
    }
    insertItem(target, inserted, children, position) {
        if (position === 'before') {
            this.viewportItems.splice(this.viewportItems.indexOf(target), 0, inserted, ...children);
            this.flatItems.splice(this.flatItems.indexOf(target), 0, inserted, ...children);
        }
        else {
            const dragRef = this.cdkDrags.find((drag) => drag.data === target);
            // 如果目标项是展开的，插入的 index 位置需要考虑子项的数量
            let childrenCount = 0;
            if (target.expanded) {
                childrenCount = this.getChildrenElementsByElement(dragRef.element.nativeElement)?.length || 0;
            }
            this.viewportItems.splice(this.viewportItems.indexOf(target) + 1 + childrenCount, 0, inserted, ...children);
            this.flatItems.splice(this.flatItems.indexOf(target) + 1 + childrenCount, 0, inserted, ...children);
        }
    }
    insertChildrenItem(target, inserted, children) {
        if (target.expanded) {
            this.viewportItems.splice(this.viewportItems.indexOf(target) + target.children.length + 1, 0, inserted, ...children);
            this.flatItems.splice(this.flatItems.indexOf(target) + target.children.length + 1, 0, inserted, ...children);
        }
        target.children.push(inserted);
    }
    getParentByItem(item) {
        return (this.flatItems || []).find((n) => {
            return n.children?.includes(item);
        });
    }
    getExpandChildrenByDrag(dragRef) {
        if (!dragRef.data.expanded) {
            return [];
        }
        else {
            const childrenElements = this.getChildrenElementsByElement(dragRef.element.nativeElement);
            return childrenElements.map((element) => this.itemDragsMap.get(element).data);
        }
    }
    getChildrenElementsByElement(dragElement) {
        // 通过循环持续查找 next element，如果 element 的 level 小于当前 item 的 level，则为它的 children
        const children = [];
        const dragRef = this.itemDragsMap.get(dragElement);
        // 如果当前的 Drag 正在拖拽，会创建 PlaceholderElement 占位，所以以 PlaceholderElement 向下查找
        let nextElement = (dragRef.getPlaceholderElement() || dragElement).nextElementSibling;
        let nextDragRef = this.itemDragsMap.get(nextElement);
        while (nextDragRef && nextDragRef.data.level > dragRef.data.level) {
            children.push(nextElement);
            nextElement = nextElement.nextElementSibling;
            nextDragRef = this.itemDragsMap.get(nextElement);
        }
        return children;
    }
    getTargetPosition(target, event) {
        const targetRect = target.getBoundingClientRect();
        const beforeOrAfterGap = targetRect.height * 0.3;
        // 将 Item 高度分为上中下三段，其中上下的 Gap 为 height 的 30%，通过判断鼠标位置在哪一段 gap 来计算对应的位置
        if (event.pointerPosition.y - targetRect.top < beforeOrAfterGap) {
            return 'before';
        }
        else if (event.pointerPosition.y >= targetRect.bottom - beforeOrAfterGap) {
            return 'after';
        }
        else {
            return 'inside';
        }
    }
    showDropPositionPlaceholder(targetElement) {
        this.cleanupDragArtifacts();
        if (this.itemDropTarget && targetElement) {
            targetElement.classList.add(`drop-position-${this.itemDropTarget.position}`);
        }
    }
    cleanupDragArtifacts(dropped = false) {
        if (dropped) {
            this.itemDropTarget = null;
            this.document.querySelectorAll('.drag-item-hide').forEach((element) => element.classList.remove('drag-item-hide'));
        }
        this.document.querySelectorAll('.drop-position-before').forEach((element) => element.classList.remove('drop-position-before'));
        this.document.querySelectorAll('.drop-position-after').forEach((element) => element.classList.remove('drop-position-after'));
        this.document.querySelectorAll('.drop-position-inside').forEach((element) => element.classList.remove('drop-position-inside'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttTableBodyComponent, deps: [{ token: GANTT_ABSTRACT_TOKEN }, { token: GANTT_UPPER_TOKEN }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttTableBodyComponent, isStandalone: true, selector: "gantt-table-body", inputs: { viewportItems: "viewportItems", flatItems: "flatItems", columns: "columns", groupTemplate: "groupTemplate", emptyTemplate: "emptyTemplate", rowBeforeTemplate: "rowBeforeTemplate", rowAfterTemplate: "rowAfterTemplate", draggable: "draggable", dropEnterPredicate: "dropEnterPredicate" }, outputs: { dragDropped: "dragDropped", dragStarted: "dragStarted", dragEnded: "dragEnded", itemClick: "itemClick" }, host: { properties: { "class.gantt-table-draggable": "this.draggable", "class.gantt-table-body": "this.ganttTableClass", "class.gantt-table-empty": "this.ganttTableEmptyClass", "class.gantt-table-dragging": "this.ganttTableDragging" } }, viewQueries: [{ propertyName: "cdkDrags", predicate: (CdkDrag), descendants: true }], ngImport: i0, template: "<div\n  class=\"gantt-table-body-container\"\n  cdkDropList\n  [cdkDropListAutoScrollStep]=\"6\"\n  [cdkDropListData]=\"viewportItems\"\n  [cdkDropListSortingDisabled]=\"true\"\n  (cdkDropListDropped)=\"onListDropped($event)\"\n>\n  <ng-container *ngIf=\"!viewportItems?.length\">\n    <ng-container *ngIf=\"!emptyTemplate\">\n      <gantt-icon class=\"empty-icon\" iconName=\"empty\"></gantt-icon>\n      <div class=\"empty-text\">\u6CA1\u6709\u6570\u636E</div>\n    </ng-container>\n    <ng-template [ngTemplateOutlet]=\"emptyTemplate\"></ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"viewportItems && viewportItems.length > 0\">\n    <ng-container *ngFor=\"let item of viewportItems; trackBy: trackBy\">\n      <div class=\"gantt-table-group\" [style.height.px]=\"gantt.styles.lineHeight\" [ngClass]=\"item.class\" *ngIf=\"item.items\">\n        <div class=\"gantt-table-group-title\" [class.expanded]=\"item.expanded\" (click)=\"expandGroup(item)\">\n          <gantt-icon class=\"expand-icon\" [iconName]=\"item.expanded ? 'angle-down' : 'angle-right'\"></gantt-icon>\n          <ng-container *ngIf=\"groupTemplate; else default\">\n            <ng-template\n              [ngTemplateOutlet]=\"groupTemplate\"\n              [ngTemplateOutletContext]=\"{ $implicit: item.origin, group: item.origin }\"\n            ></ng-template>\n          </ng-container>\n          <ng-template #default>\n            <span class=\"group-title\">{{ item.title }}</span>\n          </ng-template>\n        </div>\n      </div>\n\n      <div\n        *ngIf=\"!item.items\"\n        (click)=\"itemClick.emit({ event: $event, current: item.origin, selectedValue: item.origin })\"\n        cdkDrag\n        [cdkDragData]=\"item\"\n        [cdkDragDisabled]=\"(draggable && item.itemDraggable === false) || !draggable\"\n        (cdkDragStarted)=\"onItemDragStarted($event)\"\n        (cdkDragEnded)=\"onItemDragEnded($event)\"\n        (cdkDragMoved)=\"emitItemDragMoved($event)\"\n        class=\"gantt-table-item\"\n        [class.gantt-table-item-with-group]=\"hasGroup\"\n        [class.gantt-table-item-first-level-group]=\"item.level === 0 && (item.type | isGanttRangeItem)\"\n        [style.height.px]=\"gantt.styles.lineHeight\"\n        [style.lineHeight.px]=\"gantt.styles.lineHeight\"\n        [class.gantt-table-item-active]=\"ganttUpper.isSelected(item.id)\"\n      >\n        <ng-template\n          [ngTemplateOutlet]=\"rowBeforeTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: item.origin, item: item.origin }\"\n        ></ng-template>\n\n        <div [classList]=\"column.classList\" *ngFor=\"let column of columns; let first = first\" [style.width]=\"column.columnWidth\">\n          <!-- drag icon -->\n          <gantt-icon\n            *ngIf=\"first && draggable\"\n            class=\"gantt-drag-handle\"\n            iconName=\"drag\"\n            cdkDragHandle\n            [cdkDragHandleDisabled]=\"(draggable && item.itemDraggable === false) || !draggable\"\n          ></gantt-icon>\n          <!-- expand icon -->\n          <div\n            *ngIf=\"column?.showExpandIcon || (!hasExpandIcon && first)\"\n            class=\"gantt-expand-icon\"\n            [style.marginLeft.px]=\"item.level * 20\"\n          >\n            <ng-container *ngIf=\"item.level < gantt.maxLevel - 1 && ((gantt.async && item.expandable) || item.children?.length > 0)\">\n              <gantt-icon\n                *ngIf=\"!item.loading\"\n                class=\"expand-icon\"\n                [iconName]=\"item.expanded ? 'angle-down' : 'angle-right'\"\n                (click)=\"expandChildren($event, item)\"\n              >\n              </gantt-icon>\n              <gantt-icon *ngIf=\"item.loading\" [iconName]=\"'loading'\"></gantt-icon>\n            </ng-container>\n          </div>\n          <!-- column content -->\n          <div class=\"gantt-table-column-content\">\n            <ng-template\n              [ngTemplateOutlet]=\"column.templateRef\"\n              [ngTemplateOutletContext]=\"{ $implicit: item.origin, item: item.origin }\"\n            ></ng-template>\n          </div>\n        </div>\n        <ng-template\n          [ngTemplateOutlet]=\"rowAfterTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: item.origin, item: item.origin }\"\n        ></ng-template>\n      </div>\n    </ng-container>\n  </ng-container>\n</div>\n", dependencies: [{ kind: "directive", type: CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep", "cdkDropListElementContainer"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: GanttIconComponent, selector: "gantt-icon", inputs: ["iconName"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: CdkDragHandle, selector: "[cdkDragHandle]", inputs: ["cdkDragHandleDisabled"] }, { kind: "pipe", type: IsGanttRangeItemPipe, name: "isGanttRangeItem" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttTableBodyComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-table-body', standalone: true, imports: [CdkDropList, NgIf, GanttIconComponent, NgTemplateOutlet, NgFor, NgClass, CdkDrag, CdkDragHandle, IsGanttRangeItemPipe], template: "<div\n  class=\"gantt-table-body-container\"\n  cdkDropList\n  [cdkDropListAutoScrollStep]=\"6\"\n  [cdkDropListData]=\"viewportItems\"\n  [cdkDropListSortingDisabled]=\"true\"\n  (cdkDropListDropped)=\"onListDropped($event)\"\n>\n  <ng-container *ngIf=\"!viewportItems?.length\">\n    <ng-container *ngIf=\"!emptyTemplate\">\n      <gantt-icon class=\"empty-icon\" iconName=\"empty\"></gantt-icon>\n      <div class=\"empty-text\">\u6CA1\u6709\u6570\u636E</div>\n    </ng-container>\n    <ng-template [ngTemplateOutlet]=\"emptyTemplate\"></ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"viewportItems && viewportItems.length > 0\">\n    <ng-container *ngFor=\"let item of viewportItems; trackBy: trackBy\">\n      <div class=\"gantt-table-group\" [style.height.px]=\"gantt.styles.lineHeight\" [ngClass]=\"item.class\" *ngIf=\"item.items\">\n        <div class=\"gantt-table-group-title\" [class.expanded]=\"item.expanded\" (click)=\"expandGroup(item)\">\n          <gantt-icon class=\"expand-icon\" [iconName]=\"item.expanded ? 'angle-down' : 'angle-right'\"></gantt-icon>\n          <ng-container *ngIf=\"groupTemplate; else default\">\n            <ng-template\n              [ngTemplateOutlet]=\"groupTemplate\"\n              [ngTemplateOutletContext]=\"{ $implicit: item.origin, group: item.origin }\"\n            ></ng-template>\n          </ng-container>\n          <ng-template #default>\n            <span class=\"group-title\">{{ item.title }}</span>\n          </ng-template>\n        </div>\n      </div>\n\n      <div\n        *ngIf=\"!item.items\"\n        (click)=\"itemClick.emit({ event: $event, current: item.origin, selectedValue: item.origin })\"\n        cdkDrag\n        [cdkDragData]=\"item\"\n        [cdkDragDisabled]=\"(draggable && item.itemDraggable === false) || !draggable\"\n        (cdkDragStarted)=\"onItemDragStarted($event)\"\n        (cdkDragEnded)=\"onItemDragEnded($event)\"\n        (cdkDragMoved)=\"emitItemDragMoved($event)\"\n        class=\"gantt-table-item\"\n        [class.gantt-table-item-with-group]=\"hasGroup\"\n        [class.gantt-table-item-first-level-group]=\"item.level === 0 && (item.type | isGanttRangeItem)\"\n        [style.height.px]=\"gantt.styles.lineHeight\"\n        [style.lineHeight.px]=\"gantt.styles.lineHeight\"\n        [class.gantt-table-item-active]=\"ganttUpper.isSelected(item.id)\"\n      >\n        <ng-template\n          [ngTemplateOutlet]=\"rowBeforeTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: item.origin, item: item.origin }\"\n        ></ng-template>\n\n        <div [classList]=\"column.classList\" *ngFor=\"let column of columns; let first = first\" [style.width]=\"column.columnWidth\">\n          <!-- drag icon -->\n          <gantt-icon\n            *ngIf=\"first && draggable\"\n            class=\"gantt-drag-handle\"\n            iconName=\"drag\"\n            cdkDragHandle\n            [cdkDragHandleDisabled]=\"(draggable && item.itemDraggable === false) || !draggable\"\n          ></gantt-icon>\n          <!-- expand icon -->\n          <div\n            *ngIf=\"column?.showExpandIcon || (!hasExpandIcon && first)\"\n            class=\"gantt-expand-icon\"\n            [style.marginLeft.px]=\"item.level * 20\"\n          >\n            <ng-container *ngIf=\"item.level < gantt.maxLevel - 1 && ((gantt.async && item.expandable) || item.children?.length > 0)\">\n              <gantt-icon\n                *ngIf=\"!item.loading\"\n                class=\"expand-icon\"\n                [iconName]=\"item.expanded ? 'angle-down' : 'angle-right'\"\n                (click)=\"expandChildren($event, item)\"\n              >\n              </gantt-icon>\n              <gantt-icon *ngIf=\"item.loading\" [iconName]=\"'loading'\"></gantt-icon>\n            </ng-container>\n          </div>\n          <!-- column content -->\n          <div class=\"gantt-table-column-content\">\n            <ng-template\n              [ngTemplateOutlet]=\"column.templateRef\"\n              [ngTemplateOutletContext]=\"{ $implicit: item.origin, item: item.origin }\"\n            ></ng-template>\n          </div>\n        </div>\n        <ng-template\n          [ngTemplateOutlet]=\"rowAfterTemplate\"\n          [ngTemplateOutletContext]=\"{ $implicit: item.origin, item: item.origin }\"\n        ></ng-template>\n      </div>\n    </ng-container>\n  </ng-container>\n</div>\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [GANTT_ABSTRACT_TOKEN]
                }] }, { type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.ChangeDetectorRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { viewportItems: [{
                type: Input
            }], flatItems: [{
                type: Input
            }], columns: [{
                type: Input
            }], groupTemplate: [{
                type: Input
            }], emptyTemplate: [{
                type: Input
            }], rowBeforeTemplate: [{
                type: Input
            }], rowAfterTemplate: [{
                type: Input
            }], draggable: [{
                type: HostBinding,
                args: ['class.gantt-table-draggable']
            }, {
                type: Input
            }], dropEnterPredicate: [{
                type: Input
            }], dragDropped: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }], itemClick: [{
                type: Output
            }], ganttTableClass: [{
                type: HostBinding,
                args: ['class.gantt-table-body']
            }], ganttTableEmptyClass: [{
                type: HostBinding,
                args: ['class.gantt-table-empty']
            }], ganttTableDragging: [{
                type: HostBinding,
                args: ['class.gantt-table-dragging']
            }], cdkDrags: [{
                type: ViewChildren,
                args: [(CdkDrag)]
            }] } });

class NgxGanttToolbarComponent {
    get top() {
        return this.ganttUpper.styles.headerHeight + 16 + 'px';
    }
    constructor(ganttUpper) {
        this.ganttUpper = ganttUpper;
        this.ganttItemClass = true;
        this.views = inject(GanttConfigService).getViewsLocale();
    }
    selectView(view) {
        this.ganttUpper.changeView(view);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttToolbarComponent, deps: [{ token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttToolbarComponent, isStandalone: true, selector: "ngx-gantt-toolbar,gantt-toolbar", inputs: { template: "template" }, host: { properties: { "class.gantt-toolbar": "this.ganttItemClass", "style.top": "this.top" } }, ngImport: i0, template: "<div class=\"toolbar-container\">\n  <ng-container *ngIf=\"!template\">\n    <div class=\"toolbar-views\" *ngIf=\"this.ganttUpper.toolbarOptions?.viewTypes?.length\">\n      <ng-container *ngFor=\"let viewType of this.ganttUpper.toolbarOptions?.viewTypes\">\n        <div\n          class=\"toolbar-view\"\n          *ngIf=\"views[viewType]\"\n          [class.active]=\"viewType === this.ganttUpper.viewType\"\n          (click)=\"selectView(viewType)\"\n        >\n          {{ views[viewType].label }}\n        </div>\n      </ng-container>\n    </div>\n  </ng-container>\n  <ng-template [ngTemplateOutlet]=\"template\"></ng-template>\n</div>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-toolbar,gantt-toolbar', standalone: true, imports: [NgIf, NgFor, NgTemplateOutlet], template: "<div class=\"toolbar-container\">\n  <ng-container *ngIf=\"!template\">\n    <div class=\"toolbar-views\" *ngIf=\"this.ganttUpper.toolbarOptions?.viewTypes?.length\">\n      <ng-container *ngFor=\"let viewType of this.ganttUpper.toolbarOptions?.viewTypes\">\n        <div\n          class=\"toolbar-view\"\n          *ngIf=\"views[viewType]\"\n          [class.active]=\"viewType === this.ganttUpper.viewType\"\n          (click)=\"selectView(viewType)\"\n        >\n          {{ views[viewType].label }}\n        </div>\n      </ng-container>\n    </div>\n  </ng-container>\n  <ng-template [ngTemplateOutlet]=\"template\"></ng-template>\n</div>\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { template: [{
                type: Input
            }], ganttItemClass: [{
                type: HostBinding,
                args: ['class.gantt-toolbar']
            }], top: [{
                type: HostBinding,
                args: ['style.top']
            }] } });

class GanttPrintService {
    constructor() { }
    setInlineStyles(targetElem) {
        const svgElements = Array.from(targetElem.getElementsByTagName('svg'));
        for (const svgElement of svgElements) {
            this.recursElementChildren(svgElement);
        }
    }
    recursElementChildren(node) {
        const transformProperties = [
            'fill',
            'color',
            'font-size',
            'stroke',
            'font',
            'text-anchor',
            'stroke-dasharray',
            'shape-rendering',
            'stroke-width'
        ];
        if (!node.style) {
            return;
        }
        const styles = getComputedStyle(node);
        for (const transformProperty of transformProperties) {
            node.style[transformProperty] = styles[transformProperty];
        }
        for (const child of Array.from(node.childNodes)) {
            this.recursElementChildren(child);
        }
    }
    register(root) {
        this.root = root.nativeElement;
        this.mainContainer = this.root.getElementsByClassName('gantt-main-container')[0];
    }
    async print(name = 'download', ignoreElementClass) {
        const root = this.root;
        const mainContainer = this.mainContainer;
        // set print width
        const printWidth = root.offsetWidth;
        // set print height
        const printHeight = root.offsetHeight - mainContainer.offsetHeight + mainContainer.scrollHeight;
        const html2canvas = (await import(/* webpackChunkName: 'html2canvas' */ 'html2canvas')).default;
        html2canvas(root, {
            logging: false,
            allowTaint: true,
            useCORS: true,
            width: printWidth,
            height: printHeight,
            ignoreElements: (element) => {
                if (ignoreElementClass && element.classList.contains(ignoreElementClass)) {
                    return true;
                }
                if (element.classList.contains('gantt-calendar-today-overlay')) {
                    return true;
                }
            },
            onclone: (cloneDocument) => {
                const ganttClass = root.className;
                const cloneGanttDom = cloneDocument.querySelector(`.${ganttClass.replace(/\s+/g, '.')}`);
                const cloneGanttContainerDom = cloneDocument.querySelector('.gantt-container');
                const cloneCalendarOverlay = cloneDocument.querySelector('.gantt-calendar-grid-main');
                const cloneLinksOverlay = cloneDocument.querySelector('.gantt-links-overlay-main');
                // change targetDom width
                cloneGanttDom.style.width = `${printWidth}px`;
                cloneGanttDom.style.height = `${printHeight}px`;
                cloneGanttDom.style.overflow = `unset`;
                cloneGanttContainerDom.style.backgroundColor = '#fff';
                cloneCalendarOverlay.setAttribute('height', `${printHeight}`);
                cloneCalendarOverlay.setAttribute('style', `background: transparent`);
                if (cloneLinksOverlay) {
                    cloneLinksOverlay.setAttribute('height', `${printHeight}`);
                    cloneLinksOverlay.setAttribute('style', `height: ${printHeight}px`);
                }
                // setInlineStyles for svg
                this.setInlineStyles(cloneGanttDom);
            }
        }).then((canvas) => {
            const link = document.createElement('a');
            const dataUrl = canvas.toDataURL('image/png');
            link.download = `${name}.png`;
            link.href = dataUrl;
            link.click();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttPrintService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttPrintService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttPrintService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

class NgxGanttRootComponent {
    get view() {
        return this.ganttUpper.view;
    }
    onWindowResize() {
        this.computeScrollBarOffset();
    }
    constructor(elementRef, ngZone, dom, dragContainer, ganttUpper, printService) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.dom = dom;
        this.dragContainer = dragContainer;
        this.ganttUpper = ganttUpper;
        this.printService = printService;
        this.verticalScrollbarWidth = 0;
        this.horizontalScrollbarHeight = 0;
        this.unsubscribe$ = new Subject();
        this.ganttUpper.dragContainer = dragContainer;
    }
    ngOnInit() {
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.dom.initialize(this.elementRef);
                if (this.printService) {
                    this.printService.register(this.elementRef);
                }
                this.setupScrollClass();
                this.setupResize();
                this.setupViewScroll();
                // 优化初始化时Scroll滚动体验问题，通过透明度解决，默认透明度为0，滚动结束后恢复
                this.elementRef.nativeElement.style.opacity = '1';
                this.ganttUpper.viewChange.pipe(startWith(null), takeUntil(this.unsubscribe$)).subscribe(() => {
                    this.scrollToToday();
                });
                this.computeScrollBarOffset();
            });
        });
    }
    computeScrollBarOffset() {
        const ganttMainContainer = this.dom.mainContainer;
        const ganttVerticalScrollContainer = this.dom.verticalScrollContainer;
        let verticalScrollbarWidth = 0;
        if (ganttVerticalScrollContainer) {
            verticalScrollbarWidth = ganttVerticalScrollContainer.offsetWidth - ganttVerticalScrollContainer.clientWidth;
        }
        else {
            verticalScrollbarWidth = ganttMainContainer?.offsetWidth - ganttMainContainer?.clientWidth;
        }
        const horizontalScrollbarHeight = ganttMainContainer?.offsetHeight - ganttMainContainer?.clientHeight;
        this.verticalScrollbarWidth = verticalScrollbarWidth;
        this.horizontalScrollbarHeight = horizontalScrollbarHeight;
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
    }
    setupViewScroll() {
        if (this.ganttUpper.disabledLoadOnScroll && !this.ganttUpper.quickTimeFocus) {
            return;
        }
        this.dom
            .getViewerScroll(passiveListenerOptions)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event) => {
            if (event.direction === ScrollDirection.LEFT) {
                const dates = this.view.addStartDate();
                if (dates) {
                    event.target.scrollLeft += this.view.getDateRangeWidth(dates.start, dates.end);
                    if (this.ganttUpper.loadOnScroll.observers) {
                        this.ngZone.run(() => this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() }));
                    }
                }
            }
            if (event.direction === ScrollDirection.RIGHT) {
                const dates = this.view.addEndDate();
                if (dates && this.ganttUpper.loadOnScroll.observers) {
                    this.ngZone.run(() => this.ganttUpper.loadOnScroll.emit({ start: dates.start.getUnixTime(), end: dates.end.getUnixTime() }));
                }
            }
        });
    }
    setupResize() {
        this.dom
            .getResize()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
            this.setupScrollClass();
        });
    }
    setupScrollClass() {
        const mainContainer = this.dom.mainContainer;
        const height = mainContainer.offsetHeight;
        const scrollHeight = mainContainer.scrollHeight;
        if (scrollHeight > height) {
            this.elementRef.nativeElement.className = 'gantt gantt-scroll';
        }
        else {
            this.elementRef.nativeElement.className = 'gantt';
        }
    }
    scrollToToday() {
        const x = this.view.getTodayXPoint();
        this.dom.scrollMainContainer(x);
    }
    scrollToDate(date) {
        let x;
        if (typeof date === 'number' || date instanceof Date) {
            x = this.view.getXPointByDate(new GanttDate(date));
        }
        else {
            x = this.view.getXPointByDate(date);
        }
        this.dom.scrollMainContainer(x);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttRootComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: GanttDomService }, { token: GanttDragContainer }, { token: GANTT_UPPER_TOKEN }, { token: GanttPrintService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttRootComponent, isStandalone: true, selector: "ngx-gantt-root", inputs: { sideWidth: "sideWidth" }, host: { listeners: { "window:resize": "onWindowResize()" }, classAttribute: "gantt" }, providers: [GanttDomService, GanttDragContainer], queries: [{ propertyName: "sideTemplate", first: true, predicate: ["sideTemplate"], descendants: true, static: true }, { propertyName: "mainTemplate", first: true, predicate: ["mainTemplate"], descendants: true, static: true }], viewQueries: [{ propertyName: "backdrop", first: true, predicate: GanttDragBackdropComponent, descendants: true, read: ElementRef, static: true }], ngImport: i0, template: "<div class=\"gantt-side\" *ngIf=\"sideTemplate\" [style.width.px]=\"sideWidth\" [style.padding-bottom.px]=\"horizontalScrollbarHeight\">\n  <div class=\"gantt-side-container\" cdkScrollable>\n    <ng-template [ngTemplateOutlet]=\"sideTemplate\"></ng-template>\n  </div>\n</div>\n<div class=\"gantt-container\" *ngIf=\"mainTemplate\">\n  <gantt-calendar-header [style.padding-right.px]=\"verticalScrollbarWidth\"></gantt-calendar-header>\n  <gantt-calendar-grid\n    [style.padding-right.px]=\"verticalScrollbarWidth\"\n    [style.padding-bottom.px]=\"horizontalScrollbarHeight\"\n  ></gantt-calendar-grid>\n  <gantt-drag-backdrop></gantt-drag-backdrop>\n  <div class=\"gantt-main\">\n    <ng-template [ngTemplateOutlet]=\"mainTemplate\"></ng-template>\n  </div>\n</div>\n<ng-content></ng-content>\n<gantt-toolbar *ngIf=\"ganttUpper.showToolbar || ganttUpper.toolbarTemplate\" [template]=\"ganttUpper.toolbarTemplate\"> </gantt-toolbar>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: GanttCalendarHeaderComponent, selector: "gantt-calendar-header" }, { kind: "component", type: GanttCalendarGridComponent, selector: "gantt-calendar-grid" }, { kind: "component", type: GanttDragBackdropComponent, selector: "gantt-drag-backdrop" }, { kind: "component", type: NgxGanttToolbarComponent, selector: "ngx-gantt-toolbar,gantt-toolbar", inputs: ["template"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttRootComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt-root', providers: [GanttDomService, GanttDragContainer], host: {
                        class: 'gantt'
                    }, standalone: true, imports: [
                        NgIf,
                        CdkScrollable,
                        NgTemplateOutlet,
                        GanttCalendarHeaderComponent,
                        GanttCalendarGridComponent,
                        GanttDragBackdropComponent,
                        NgxGanttToolbarComponent
                    ], template: "<div class=\"gantt-side\" *ngIf=\"sideTemplate\" [style.width.px]=\"sideWidth\" [style.padding-bottom.px]=\"horizontalScrollbarHeight\">\n  <div class=\"gantt-side-container\" cdkScrollable>\n    <ng-template [ngTemplateOutlet]=\"sideTemplate\"></ng-template>\n  </div>\n</div>\n<div class=\"gantt-container\" *ngIf=\"mainTemplate\">\n  <gantt-calendar-header [style.padding-right.px]=\"verticalScrollbarWidth\"></gantt-calendar-header>\n  <gantt-calendar-grid\n    [style.padding-right.px]=\"verticalScrollbarWidth\"\n    [style.padding-bottom.px]=\"horizontalScrollbarHeight\"\n  ></gantt-calendar-grid>\n  <gantt-drag-backdrop></gantt-drag-backdrop>\n  <div class=\"gantt-main\">\n    <ng-template [ngTemplateOutlet]=\"mainTemplate\"></ng-template>\n  </div>\n</div>\n<ng-content></ng-content>\n<gantt-toolbar *ngIf=\"ganttUpper.showToolbar || ganttUpper.toolbarTemplate\" [template]=\"ganttUpper.toolbarTemplate\"> </gantt-toolbar>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: GanttDomService }, { type: GanttDragContainer }, { type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: GanttPrintService, decorators: [{
                    type: Optional
                }] }], propDecorators: { sideWidth: [{
                type: Input
            }], sideTemplate: [{
                type: ContentChild,
                args: ['sideTemplate', { static: true }]
            }], mainTemplate: [{
                type: ContentChild,
                args: ['mainTemplate', { static: true }]
            }], backdrop: [{
                type: ViewChild,
                args: [GanttDragBackdropComponent, { static: true, read: ElementRef }]
            }], onWindowResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });

class NgxGanttTableColumnComponent {
    set width(width) {
        this.columnWidth = coerceCssPixelValue(width);
    }
    constructor(ganttUpper, elementRef) {
        this.ganttUpper = ganttUpper;
        this.elementRef = elementRef;
    }
    get classList() {
        return this.elementRef.nativeElement.classList;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableColumnComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttTableColumnComponent, isStandalone: true, selector: "ngx-gantt-column", inputs: { width: "width", name: "name", showExpandIcon: "showExpandIcon" }, host: { classAttribute: "gantt-table-column" }, queries: [{ propertyName: "templateRef", first: true, predicate: ["cell"], descendants: true, static: true }, { propertyName: "headerTemplateRef", first: true, predicate: ["header"], descendants: true, static: true }], ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableColumnComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-gantt-column',
                    template: '',
                    host: {
                        class: 'gantt-table-column'
                    },
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.ElementRef }], propDecorators: { width: [{
                type: Input
            }], name: [{
                type: Input
            }], showExpandIcon: [{
                type: Input
            }], templateRef: [{
                type: ContentChild,
                args: ['cell', { static: true }]
            }], headerTemplateRef: [{
                type: ContentChild,
                args: ['header', { static: true }]
            }] } });

class NgxGanttTableComponent {
    constructor() {
        this.draggable = false;
        this.dragDropped = new EventEmitter();
        this.dragStarted = new EventEmitter();
        this.dragEnded = new EventEmitter();
        this.columnChanges = new EventEmitter();
        this.itemClick = new EventEmitter();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttTableComponent, isStandalone: true, selector: "ngx-gantt-table", inputs: { draggable: "draggable", dropEnterPredicate: "dropEnterPredicate" }, outputs: { dragDropped: "dragDropped", dragStarted: "dragStarted", dragEnded: "dragEnded", columnChanges: "columnChanges", itemClick: "itemClick" }, queries: [{ propertyName: "rowBeforeTemplate", first: true, predicate: ["rowBeforeSlot"], descendants: true, static: true }, { propertyName: "rowAfterTemplate", first: true, predicate: ["rowAfterSlot"], descendants: true, static: true }, { propertyName: "tableEmptyTemplate", first: true, predicate: ["tableEmpty"], descendants: true, static: true }, { propertyName: "tableFooterTemplate", first: true, predicate: ["tableFooter"], descendants: true, static: true }], ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttTableComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-gantt-table',
                    template: '',
                    standalone: true
                }]
        }], propDecorators: { draggable: [{
                type: Input
            }], dropEnterPredicate: [{
                type: Input
            }], dragDropped: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }], columnChanges: [{
                type: Output
            }], itemClick: [{
                type: Output
            }], rowBeforeTemplate: [{
                type: ContentChild,
                args: ['rowBeforeSlot', { static: true }]
            }], rowAfterTemplate: [{
                type: ContentChild,
                args: ['rowAfterSlot', { static: true }]
            }], tableEmptyTemplate: [{
                type: ContentChild,
                args: ['tableEmpty', { static: true }]
            }], tableFooterTemplate: [{
                type: ContentChild,
                args: ['tableFooter', { static: true }]
            }] } });

class GanttScrollbarComponent {
    constructor(ganttUpper) {
        this.ganttUpper = ganttUpper;
        this.hasFooter = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttScrollbarComponent, deps: [{ token: GANTT_UPPER_TOKEN }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttScrollbarComponent, isStandalone: true, selector: "gantt-scrollbar", inputs: { hasFooter: "hasFooter", tableWidth: "tableWidth", ganttRoot: "ganttRoot" }, ngImport: i0, template: "<div\n  class=\"gantt-scrollbar\"\n  [ngClass]=\"{ 'gantt-scrollbar-bg': hasFooter }\"\n  [style.height.px]=\"ganttRoot?.horizontalScrollbarHeight + 1\"\n  [style.right.px]=\"ganttRoot?.verticalScrollbarWidth\"\n>\n  <div class=\"gantt-table-scrollbar\" [class.with-scrollbar]=\"ganttRoot?.horizontalScrollbarHeight\" [style.width.px]=\"tableWidth\"></div>\n  <div class=\"gantt-main-scrollbar\">\n    <div class=\"h-100\" [style.width.px]=\"ganttRoot['view']?.width\"></div>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttScrollbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-scrollbar', imports: [NgClass], standalone: true, template: "<div\n  class=\"gantt-scrollbar\"\n  [ngClass]=\"{ 'gantt-scrollbar-bg': hasFooter }\"\n  [style.height.px]=\"ganttRoot?.horizontalScrollbarHeight + 1\"\n  [style.right.px]=\"ganttRoot?.verticalScrollbarWidth\"\n>\n  <div class=\"gantt-table-scrollbar\" [class.with-scrollbar]=\"ganttRoot?.horizontalScrollbarHeight\" [style.width.px]=\"tableWidth\"></div>\n  <div class=\"gantt-main-scrollbar\">\n    <div class=\"h-100\" [style.width.px]=\"ganttRoot['view']?.width\"></div>\n  </div>\n</div>\n" }]
        }], ctorParameters: () => [{ type: GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }], propDecorators: { hasFooter: [{
                type: Input
            }], tableWidth: [{
                type: Input
            }], ganttRoot: [{
                type: Input
            }] } });

class NgxGanttComponent extends GanttUpper {
    set loading(loading) {
        if (loading) {
            if (this.loadingDelay > 0) {
                this.loadingTimer = setTimeout(() => {
                    this._loading = loading;
                    this.cdr.markForCheck();
                }, this.loadingDelay);
            }
            else {
                this._loading = loading;
            }
        }
        else {
            clearTimeout(this.loadingTimer);
            this._loading = loading;
        }
    }
    get loading() {
        return this._loading;
    }
    constructor(elementRef, cdr, ngZone, viewportRuler, config) {
        super(elementRef, cdr, ngZone, config);
        this.viewportRuler = viewportRuler;
        this.maxLevel = 2;
        this.virtualScrollEnabled = true;
        this.loadingDelay = 0;
        this.linkDragStarted = new EventEmitter();
        this.linkDragEnded = new EventEmitter();
        this.lineClick = new EventEmitter();
        this.selectedChange = new EventEmitter();
        this.virtualScrolledIndexChange = new EventEmitter();
        this.flatItems = [];
        this.viewportItems = [];
        this._loading = false;
        this.rangeStart = 0;
        this.rangeEnd = 0;
        this.computeAllRefs = false;
    }
    ngOnInit() {
        super.ngOnInit();
        this.buildFlatItems();
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        // Normally this isn't in the zone, but it can cause performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this.ngZone.runOutsideAngular(() => {
            onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.dragContainer.linkDragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.linkDragStarted.emit(event);
                });
                this.dragContainer.linkDragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                    this.linkDragEnded.emit(event);
                });
            });
        });
        this.view.start$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(() => {
            this.computeTempDataRefs();
        });
        if (!this.virtualScrollEnabled) {
            this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
            this.computeTempDataRefs();
        }
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
        if (!this.firstChange) {
            if (changes.viewType && changes.viewType.currentValue) {
                this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
                this.computeTempDataRefs();
            }
            if (changes.originItems || changes.originGroups) {
                this.buildFlatItems();
                this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
                this.computeTempDataRefs();
            }
        }
    }
    ngAfterViewInit() {
        if (this.virtualScrollEnabled) {
            this.virtualScroll.renderedRangeStream.pipe(takeUntil(this.unsubscribe$)).subscribe((range) => {
                const linksElement = this.elementRef.nativeElement.querySelector('.gantt-links-overlay');
                linksElement.style.top = `${-(this.styles.lineHeight * range.start)}px`;
                this.rangeStart = range.start;
                this.rangeEnd = range.end;
                this.viewportItems = this.flatItems.slice(range.start, range.end);
                this.appendDraggingItemToViewportItems();
                this.computeTempDataRefs();
            });
        }
    }
    ngAfterViewChecked() {
        if (this.virtualScrollEnabled && this.viewportRuler && this.virtualScroll.getRenderedRange().end > 0) {
            const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
            this.ngZone.runOutsideAngular(() => {
                onStable$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                    if (!this.ganttRoot.verticalScrollbarWidth) {
                        this.ganttRoot.computeScrollBarOffset();
                        this.cdr.markForCheck();
                    }
                });
            });
        }
    }
    buildFlatItems() {
        const virtualData = [];
        if (this.groups.length) {
            this.groups.forEach((group) => {
                virtualData.push(group);
                if (group.expanded) {
                    const items = recursiveItems(group.items);
                    virtualData.push(...items);
                }
            });
        }
        if (this.items.length) {
            virtualData.push(...recursiveItems(this.items));
        }
        this.flatItems = [...virtualData];
        this.flatItemsMap = keyBy(this.flatItems, 'id');
        if (!this.virtualScrollEnabled) {
            this.rangeStart = 0;
            this.rangeEnd = this.flatItems.length;
        }
    }
    afterExpand() {
        this.buildFlatItems();
        this.viewportItems = this.flatItems.slice(this.rangeStart, this.rangeEnd);
    }
    computeTempDataRefs() {
        const tempItemData = [];
        this.viewportItems.forEach((data) => {
            if (!data.hasOwnProperty('items')) {
                const item = data;
                if (item.links) {
                    item.links.forEach((link) => {
                        if (this.flatItemsMap[link.link]) {
                            tempItemData.push(this.flatItemsMap[link.link]);
                        }
                    });
                }
                tempItemData.push(data);
            }
        });
        this.computeItemsRefs(...uniqBy(tempItemData, 'id'));
        this.flatItems = [...this.flatItems];
        this.viewportItems = [...this.viewportItems];
    }
    appendDraggingItemToViewportItems() {
        if (this.draggingItem) {
            let flatItem = this.viewportItems.find((item) => {
                return item.id === this.draggingItem.id;
            });
            if (!flatItem) {
                flatItem = this.flatItems.find((item) => {
                    return item.id === this.draggingItem.id;
                });
                if (flatItem) {
                    this.viewportItems.push(flatItem);
                }
            }
        }
    }
    expandChildren(item) {
        if (!item.expanded) {
            item.setExpand(true);
            if (this.async && this.childrenResolve && item.children.length === 0) {
                item.loading = true;
                this.childrenResolve(item.origin)
                    .pipe(take(1), finalize(() => {
                    item.loading = false;
                    this.afterExpand();
                    this.expandChange.emit(item);
                    this.cdr.detectChanges();
                }))
                    .subscribe((items) => {
                    item.addChildren(items);
                    this.computeItemsRefs(...item.children);
                });
            }
            else {
                this.computeItemsRefs(...item.children);
                this.afterExpand();
                this.expandChange.emit(item);
            }
        }
        else {
            item.setExpand(false);
            this.afterExpand();
            this.expandChange.emit(item);
        }
    }
    selectItem(selectEvent) {
        this.table.itemClick.emit({
            event: selectEvent.event,
            current: selectEvent.current
        });
        if (!this.selectable) {
            return;
        }
        const { event, selectedValue } = selectEvent;
        this.selectionModel.toggle(selectedValue.id);
        const selectedIds = this.selectionModel.selected;
        if (this.multiple) {
            const _selectedValue = this.getGanttItems(selectedIds).map((item) => item.origin);
            this.selectedChange.emit({ event, current: selectedValue, selectedValue: _selectedValue });
        }
        else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, current: selectedValue, selectedValue: _selectedValue });
        }
    }
    scrollToToday() {
        this.ganttRoot.scrollToToday();
    }
    scrollToDate(date) {
        this.ganttRoot.scrollToDate(date);
    }
    scrolledIndexChange(index) {
        this.virtualScrolledIndexChange.emit({
            index,
            renderedRange: {
                start: this.rangeStart,
                end: this.rangeEnd
            },
            count: this.flatItems.length
        });
    }
    expandGroups(expanded) {
        this.groups.forEach((group) => {
            group.setExpand(expanded);
        });
        this.afterExpand();
        this.expandChange.next(null);
        this.cdr.detectChanges();
    }
    expandGroup(group) {
        group.setExpand(!group.expanded);
        this.afterExpand();
        this.expandChange.emit();
        this.cdr.detectChanges();
    }
    itemDragStarted(event) {
        this.table.dragStarted.emit(event);
        this.draggingItem = event.source;
    }
    itemDragEnded(event) {
        this.table.dragEnded.emit(event);
        this.draggingItem = null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i1$1.ViewportRuler }, { token: GANTT_GLOBAL_CONFIG }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: NgxGanttComponent, isStandalone: true, selector: "ngx-gantt", inputs: { maxLevel: "maxLevel", async: "async", childrenResolve: "childrenResolve", linkable: "linkable", loading: "loading", virtualScrollEnabled: "virtualScrollEnabled", loadingDelay: "loadingDelay" }, outputs: { linkDragStarted: "linkDragStarted", linkDragEnded: "linkDragEnded", lineClick: "lineClick", selectedChange: "selectedChange", virtualScrolledIndexChange: "virtualScrolledIndexChange" }, providers: [
            {
                provide: GANTT_UPPER_TOKEN,
                useExisting: NgxGanttComponent
            },
            {
                provide: GANTT_ABSTRACT_TOKEN,
                useExisting: forwardRef(() => NgxGanttComponent)
            }
        ], queries: [{ propertyName: "table", first: true, predicate: NgxGanttTableComponent, descendants: true }, { propertyName: "tableEmptyTemplate", first: true, predicate: ["tableEmpty"], descendants: true, static: true }, { propertyName: "footerTemplate", first: true, predicate: ["footer"], descendants: true, static: true }, { propertyName: "columns", predicate: NgxGanttTableColumnComponent, descendants: true }], viewQueries: [{ propertyName: "ganttRoot", first: true, predicate: ["ganttRoot"], descendants: true }, { propertyName: "virtualScroll", first: true, predicate: CdkVirtualScrollViewport, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<ngx-gantt-root #ganttRoot>\n  <div class=\"gantt-header\">\n    <gantt-table-header #tableHeader [columns]=\"columns\"></gantt-table-header>\n    <div class=\"gantt-container-header\">\n      <gantt-calendar-header [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"></gantt-calendar-header>\n    </div>\n  </div>\n  <gantt-loader *ngIf=\"loading\"></gantt-loader>\n\n  <cdk-virtual-scroll-viewport\n    class=\"gantt-virtual-scroll-viewport\"\n    [ngClass]=\"{\n      'gantt-normal-viewport': !virtualScrollEnabled,\n      'gantt-scroll-container': virtualScrollEnabled,\n      'with-footer': table?.tableFooterTemplate || footerTemplate\n    }\"\n    [style.top.px]=\"styles.headerHeight\"\n    [itemSize]=\"styles.lineHeight\"\n    [minBufferPx]=\"styles.lineHeight * 10\"\n    [maxBufferPx]=\"styles.lineHeight * 20\"\n    (scrolledIndexChange)=\"scrolledIndexChange($event)\"\n  >\n    <ng-container *cdkVirtualFor=\"let item of flatItems; trackBy: trackBy\"></ng-container>\n    <div class=\"gantt-side\" [style.width.px]=\"tableHeader.tableWidth + 1\" [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\">\n      <div class=\"gantt-side-container\">\n        <div class=\"gantt-table\">\n          <gantt-table-body\n            [flatItems]=\"flatItems\"\n            [viewportItems]=\"viewportItems\"\n            [columns]=\"columns\"\n            [groupTemplate]=\"groupTemplate\"\n            [emptyTemplate]=\"table.tableEmptyTemplate || tableEmptyTemplate\"\n            [rowBeforeTemplate]=\"table?.rowBeforeTemplate\"\n            [rowAfterTemplate]=\"table?.rowAfterTemplate\"\n            [draggable]=\"table.draggable\"\n            [dropEnterPredicate]=\"table.dropEnterPredicate\"\n            (dragDropped)=\"table.dragDropped.emit($event)\"\n            (dragStarted)=\"itemDragStarted($event)\"\n            (dragEnded)=\"itemDragEnded($event)\"\n            (itemClick)=\"selectItem($event)\"\n          >\n          </gantt-table-body>\n        </div>\n      </div>\n    </div>\n    <div class=\"gantt-container\">\n      <gantt-calendar-grid\n        [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"\n        [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n      ></gantt-calendar-grid>\n      <div class=\"gantt-main\">\n        <gantt-main\n          [ganttRoot]=\"ganttRoot\"\n          [flatItems]=\"flatItems\"\n          [viewportItems]=\"viewportItems\"\n          [groupHeaderTemplate]=\"groupHeaderTemplate\"\n          [itemTemplate]=\"itemTemplate\"\n          [barTemplate]=\"barTemplate\"\n          [rangeTemplate]=\"rangeTemplate\"\n          [baselineTemplate]=\"baselineTemplate\"\n          [quickTimeFocus]=\"quickTimeFocus\"\n          (barClick)=\"barClick.emit($event)\"\n          (lineClick)=\"lineClick.emit($event)\"\n        >\n        </gantt-main>\n      </div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n\n  <gantt-drag-backdrop [style.left.px]=\"tableHeader.tableWidth + 1\"></gantt-drag-backdrop>\n\n  <gantt-scrollbar\n    [ganttRoot]=\"ganttRoot\"\n    [hasFooter]=\"!!table?.tableFooterTemplate\"\n    [tableWidth]=\"tableHeader.tableWidth\"\n  ></gantt-scrollbar>\n\n  <div\n    class=\"gantt-footer\"\n    *ngIf=\"table?.tableFooterTemplate || footerTemplate\"\n    [style.right.px]=\"ganttRoot.verticalScrollbarWidth\"\n    [style.bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n  >\n    <div class=\"gantt-table-footer\" [style.width.px]=\"tableHeader.tableWidth + 1\" *ngIf=\"table?.tableFooterTemplate\">\n      <ng-template [ngTemplateOutlet]=\"table?.tableFooterTemplate\" [ngTemplateOutletContext]=\"{ columns: columns }\"> </ng-template>\n    </div>\n    <div class=\"gantt-container-footer\" *ngIf=\"footerTemplate\">\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\"> </ng-template>\n    </div>\n  </div>\n</ngx-gantt-root>\n", dependencies: [{ kind: "component", type: NgxGanttRootComponent, selector: "ngx-gantt-root", inputs: ["sideWidth"] }, { kind: "component", type: GanttTableHeaderComponent, selector: "gantt-table-header", inputs: ["columns"] }, { kind: "component", type: GanttCalendarHeaderComponent, selector: "gantt-calendar-header" }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: GanttLoaderComponent, selector: "gantt-loader" }, { kind: "component", type: CdkVirtualScrollViewport, selector: "cdk-virtual-scroll-viewport", inputs: ["orientation", "appendOnly"], outputs: ["scrolledIndexChange"] }, { kind: "directive", type: CdkFixedSizeVirtualScroll, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: ["itemSize", "minBufferPx", "maxBufferPx"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: CdkVirtualForOf, selector: "[cdkVirtualFor][cdkVirtualForOf]", inputs: ["cdkVirtualForOf", "cdkVirtualForTrackBy", "cdkVirtualForTemplate", "cdkVirtualForTemplateCacheSize"] }, { kind: "component", type: GanttTableBodyComponent, selector: "gantt-table-body", inputs: ["viewportItems", "flatItems", "columns", "groupTemplate", "emptyTemplate", "rowBeforeTemplate", "rowAfterTemplate", "draggable", "dropEnterPredicate"], outputs: ["dragDropped", "dragStarted", "dragEnded", "itemClick"] }, { kind: "component", type: GanttCalendarGridComponent, selector: "gantt-calendar-grid" }, { kind: "component", type: GanttMainComponent, selector: "gantt-main", inputs: ["viewportItems", "flatItems", "groupHeaderTemplate", "itemTemplate", "barTemplate", "rangeTemplate", "baselineTemplate", "ganttRoot", "quickTimeFocus"], outputs: ["barClick", "lineClick"] }, { kind: "component", type: GanttDragBackdropComponent, selector: "gantt-drag-backdrop" }, { kind: "component", type: GanttScrollbarComponent, selector: "gantt-scrollbar", inputs: ["hasFooter", "tableWidth", "ganttRoot"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gantt', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: GANTT_UPPER_TOKEN,
                            useExisting: NgxGanttComponent
                        },
                        {
                            provide: GANTT_ABSTRACT_TOKEN,
                            useExisting: forwardRef(() => NgxGanttComponent)
                        }
                    ], standalone: true, imports: [
                        NgxGanttRootComponent,
                        GanttTableHeaderComponent,
                        GanttCalendarHeaderComponent,
                        NgIf,
                        GanttLoaderComponent,
                        CdkVirtualScrollViewport,
                        CdkFixedSizeVirtualScroll,
                        NgClass,
                        CdkVirtualForOf,
                        GanttTableBodyComponent,
                        GanttCalendarGridComponent,
                        GanttMainComponent,
                        GanttDragBackdropComponent,
                        GanttScrollbarComponent,
                        NgTemplateOutlet,
                        NgFor
                    ], template: "<ngx-gantt-root #ganttRoot>\n  <div class=\"gantt-header\">\n    <gantt-table-header #tableHeader [columns]=\"columns\"></gantt-table-header>\n    <div class=\"gantt-container-header\">\n      <gantt-calendar-header [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"></gantt-calendar-header>\n    </div>\n  </div>\n  <gantt-loader *ngIf=\"loading\"></gantt-loader>\n\n  <cdk-virtual-scroll-viewport\n    class=\"gantt-virtual-scroll-viewport\"\n    [ngClass]=\"{\n      'gantt-normal-viewport': !virtualScrollEnabled,\n      'gantt-scroll-container': virtualScrollEnabled,\n      'with-footer': table?.tableFooterTemplate || footerTemplate\n    }\"\n    [style.top.px]=\"styles.headerHeight\"\n    [itemSize]=\"styles.lineHeight\"\n    [minBufferPx]=\"styles.lineHeight * 10\"\n    [maxBufferPx]=\"styles.lineHeight * 20\"\n    (scrolledIndexChange)=\"scrolledIndexChange($event)\"\n  >\n    <ng-container *cdkVirtualFor=\"let item of flatItems; trackBy: trackBy\"></ng-container>\n    <div class=\"gantt-side\" [style.width.px]=\"tableHeader.tableWidth + 1\" [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\">\n      <div class=\"gantt-side-container\">\n        <div class=\"gantt-table\">\n          <gantt-table-body\n            [flatItems]=\"flatItems\"\n            [viewportItems]=\"viewportItems\"\n            [columns]=\"columns\"\n            [groupTemplate]=\"groupTemplate\"\n            [emptyTemplate]=\"table.tableEmptyTemplate || tableEmptyTemplate\"\n            [rowBeforeTemplate]=\"table?.rowBeforeTemplate\"\n            [rowAfterTemplate]=\"table?.rowAfterTemplate\"\n            [draggable]=\"table.draggable\"\n            [dropEnterPredicate]=\"table.dropEnterPredicate\"\n            (dragDropped)=\"table.dragDropped.emit($event)\"\n            (dragStarted)=\"itemDragStarted($event)\"\n            (dragEnded)=\"itemDragEnded($event)\"\n            (itemClick)=\"selectItem($event)\"\n          >\n          </gantt-table-body>\n        </div>\n      </div>\n    </div>\n    <div class=\"gantt-container\">\n      <gantt-calendar-grid\n        [style.padding-right.px]=\"ganttRoot.verticalScrollbarWidth\"\n        [style.padding-bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n      ></gantt-calendar-grid>\n      <div class=\"gantt-main\">\n        <gantt-main\n          [ganttRoot]=\"ganttRoot\"\n          [flatItems]=\"flatItems\"\n          [viewportItems]=\"viewportItems\"\n          [groupHeaderTemplate]=\"groupHeaderTemplate\"\n          [itemTemplate]=\"itemTemplate\"\n          [barTemplate]=\"barTemplate\"\n          [rangeTemplate]=\"rangeTemplate\"\n          [baselineTemplate]=\"baselineTemplate\"\n          [quickTimeFocus]=\"quickTimeFocus\"\n          (barClick)=\"barClick.emit($event)\"\n          (lineClick)=\"lineClick.emit($event)\"\n        >\n        </gantt-main>\n      </div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n\n  <gantt-drag-backdrop [style.left.px]=\"tableHeader.tableWidth + 1\"></gantt-drag-backdrop>\n\n  <gantt-scrollbar\n    [ganttRoot]=\"ganttRoot\"\n    [hasFooter]=\"!!table?.tableFooterTemplate\"\n    [tableWidth]=\"tableHeader.tableWidth\"\n  ></gantt-scrollbar>\n\n  <div\n    class=\"gantt-footer\"\n    *ngIf=\"table?.tableFooterTemplate || footerTemplate\"\n    [style.right.px]=\"ganttRoot.verticalScrollbarWidth\"\n    [style.bottom.px]=\"ganttRoot.horizontalScrollbarHeight\"\n  >\n    <div class=\"gantt-table-footer\" [style.width.px]=\"tableHeader.tableWidth + 1\" *ngIf=\"table?.tableFooterTemplate\">\n      <ng-template [ngTemplateOutlet]=\"table?.tableFooterTemplate\" [ngTemplateOutletContext]=\"{ columns: columns }\"> </ng-template>\n    </div>\n    <div class=\"gantt-container-footer\" *ngIf=\"footerTemplate\">\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\"> </ng-template>\n    </div>\n  </div>\n</ngx-gantt-root>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i1$1.ViewportRuler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [GANTT_GLOBAL_CONFIG]
                }] }], propDecorators: { maxLevel: [{
                type: Input
            }], async: [{
                type: Input
            }], childrenResolve: [{
                type: Input
            }], linkable: [{
                type: Input
            }], loading: [{
                type: Input
            }], virtualScrollEnabled: [{
                type: Input
            }], loadingDelay: [{
                type: Input
            }], linkDragStarted: [{
                type: Output
            }], linkDragEnded: [{
                type: Output
            }], lineClick: [{
                type: Output
            }], selectedChange: [{
                type: Output
            }], virtualScrolledIndexChange: [{
                type: Output
            }], table: [{
                type: ContentChild,
                args: [NgxGanttTableComponent]
            }], columns: [{
                type: ContentChildren,
                args: [NgxGanttTableColumnComponent, { descendants: true }]
            }], tableEmptyTemplate: [{
                type: ContentChild,
                args: ['tableEmpty', { static: true }]
            }], ganttRoot: [{
                type: ViewChild,
                args: ['ganttRoot']
            }], footerTemplate: [{
                type: ContentChild,
                args: ['footer', { static: true }]
            }], virtualScroll: [{
                type: ViewChild,
                args: [CdkVirtualScrollViewport]
            }] } });

class NgxGanttModule {
    constructor() {
        const configService = inject(GanttConfigService);
        setDefaultOptions({
            locale: configService.getDateLocale(),
            weekStartsOn: configService.config?.dateOptions?.weekStartsOn
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, imports: [CommonModule,
            DragDropModule,
            ScrollingModule,
            NgxGanttComponent,
            NgxGanttTableComponent,
            NgxGanttTableColumnComponent,
            GanttTableHeaderComponent,
            GanttTableBodyComponent,
            GanttMainComponent,
            GanttCalendarHeaderComponent,
            GanttCalendarGridComponent,
            GanttLinksComponent,
            GanttLoaderComponent,
            NgxGanttBarComponent,
            GanttIconComponent,
            GanttDragBackdropComponent,
            NgxGanttRangeComponent,
            NgxGanttRootComponent,
            NgxGanttBaselineComponent,
            NgxGanttToolbarComponent,
            GanttScrollbarComponent,
            IsGanttRangeItemPipe,
            IsGanttBarItemPipe,
            IsGanttCustomItemPipe,
            GanttDateFormatPipe], exports: [NgxGanttComponent,
            NgxGanttTableComponent,
            NgxGanttTableColumnComponent,
            NgxGanttRootComponent,
            NgxGanttBarComponent,
            NgxGanttRangeComponent,
            NgxGanttBaselineComponent,
            NgxGanttToolbarComponent,
            GanttCalendarHeaderComponent,
            GanttCalendarGridComponent,
            GanttDragBackdropComponent,
            GanttScrollbarComponent,
            GanttDateFormatPipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, providers: [
            CdkVirtualScrollViewport,
            {
                provide: GANTT_GLOBAL_CONFIG,
                useValue: defaultConfig
            },
            ...i18nLocaleProvides
        ], imports: [CommonModule,
            DragDropModule,
            ScrollingModule,
            NgxGanttComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: NgxGanttModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        DragDropModule,
                        ScrollingModule,
                        NgxGanttComponent,
                        NgxGanttTableComponent,
                        NgxGanttTableColumnComponent,
                        GanttTableHeaderComponent,
                        GanttTableBodyComponent,
                        GanttMainComponent,
                        GanttCalendarHeaderComponent,
                        GanttCalendarGridComponent,
                        GanttLinksComponent,
                        GanttLoaderComponent,
                        NgxGanttBarComponent,
                        GanttIconComponent,
                        GanttDragBackdropComponent,
                        NgxGanttRangeComponent,
                        NgxGanttRootComponent,
                        NgxGanttBaselineComponent,
                        NgxGanttToolbarComponent,
                        GanttScrollbarComponent,
                        IsGanttRangeItemPipe,
                        IsGanttBarItemPipe,
                        IsGanttCustomItemPipe,
                        GanttDateFormatPipe
                    ],
                    exports: [
                        NgxGanttComponent,
                        NgxGanttTableComponent,
                        NgxGanttTableColumnComponent,
                        NgxGanttRootComponent,
                        NgxGanttBarComponent,
                        NgxGanttRangeComponent,
                        NgxGanttBaselineComponent,
                        NgxGanttToolbarComponent,
                        GanttCalendarHeaderComponent,
                        GanttCalendarGridComponent,
                        GanttDragBackdropComponent,
                        GanttScrollbarComponent,
                        GanttDateFormatPipe
                    ],
                    providers: [
                        CdkVirtualScrollViewport,
                        {
                            provide: GANTT_GLOBAL_CONFIG,
                            useValue: defaultConfig
                        },
                        ...i18nLocaleProvides
                    ]
                }]
        }], ctorParameters: () => [] });

/*
 * Public API Surface of gantt
 */

/**
 * Generated bundle index. Do not edit.
 */

export { GANTT_GLOBAL_CONFIG, GANTT_I18N_LOCALE_TOKEN, GANTT_UPPER_TOKEN, GanttBarClickEvent, GanttBaselineItemInternal, GanttCalendarGridComponent, GanttCalendarHeaderComponent, GanttConfigService, GanttDate, GanttDateFormatPipe, GanttDatePoint, GanttDragBackdropComponent, GanttDragEvent, GanttGroupInternal, GanttI18nLocale, GanttItemInternal, GanttItemType, GanttItemUpper, GanttLineClickEvent, GanttLinkDragEvent, GanttLinkLineType, GanttLinkType, GanttLoadOnScrollEvent, GanttLoaderComponent, GanttPrintService, GanttScrollbarComponent, GanttSelectedEvent, GanttTableDragDroppedEvent, GanttTableDragEndedEvent, GanttTableDragEnterPredicateContext, GanttTableDragStartedEvent, GanttTableEvent, GanttTableItemClickEvent, GanttUpper, GanttView, GanttViewType, GanttVirtualScrolledIndexChangeEvent, IsGanttBarItemPipe, IsGanttCustomItemPipe, IsGanttRangeItemPipe, LinkColors, NgxGanttBarComponent, NgxGanttBaselineComponent, NgxGanttComponent, NgxGanttModule, NgxGanttRangeComponent, NgxGanttRootComponent, NgxGanttTableColumnComponent, NgxGanttTableComponent, NgxGanttToolbarComponent, deDeLocale, defaultConfig, enUsLocale, getDefaultTimeZone, jaJpLocale, primaryDatePointTop, registerView, ruRuLocale, secondaryDatePointTop, setDefaultTimeZone, zhHans as zhHansLocale, zhHant as zhHantLocale };
//# sourceMappingURL=worktile-gantt.mjs.map
