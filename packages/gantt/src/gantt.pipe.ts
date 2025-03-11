import { Pipe, PipeTransform } from '@angular/core';
import { GanttGroupInternal, GanttItemInternal, GanttItemType } from './class';
import { GanttDate } from './utils/date';

@Pipe({
    name: 'isGanttRangeItem',
    standalone: true
})
export class IsGanttRangeItemPipe implements PipeTransform {
    transform(value: GanttItemType) {
        return value === GanttItemType.range;
    }
}

@Pipe({
    name: 'isGanttBarItem',
    standalone: true
})
export class IsGanttBarItemPipe implements PipeTransform {
    transform(value: GanttItemType) {
        return value === GanttItemType.bar;
    }
}

@Pipe({
    name: 'isGanttCustomItem',
    standalone: true
})
export class IsGanttCustomItemPipe implements PipeTransform {
    transform(value: GanttItemType) {
        return value === GanttItemType.custom;
    }
}

@Pipe({
    name: 'isGanttGroup',
    standalone: true
})
export class IsGanttGroupPipe implements PipeTransform {
    transform(data: GanttItemInternal | GanttGroupInternal): data is GanttGroupInternal {
        return !!(data as GanttGroupInternal).items;
    }
}

@Pipe({
    name: 'dateFormat',
    standalone: true
})
export class GanttDateFormatPipe implements PipeTransform {
    transform(value: number | string, format: string) {
        return new GanttDate(value).format(format);
    }
}
