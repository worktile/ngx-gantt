import { Pipe, PipeTransform } from '@angular/core';
import { GanttItemType } from './class';

@Pipe({
    name: 'isGanttRangeItem'
})
export class IsGanttRangeItemPipe implements PipeTransform {
    transform(value: GanttItemType) {
        return value === GanttItemType.range;
    }
}


@Pipe({
    name: 'isGanttBarItem'
})
export class IsGanttBarItemPipe implements PipeTransform {
    transform(value: GanttItemType) {
        return value === GanttItemType.bar;
    }
}


@Pipe({
    name: 'isGanttCustomItem'
})
export class IsGanttCustomItemPipe implements PipeTransform {
    transform(value: GanttItemType) {
        return value === GanttItemType.custom;
    }
}
