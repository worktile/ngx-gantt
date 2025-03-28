import { Pipe, PipeTransform } from '@angular/core';
import { GanttDate } from 'ngx-gantt';

@Pipe({
    name: 'dateFormat',
    standalone: false
})
export class GanttDateFormatPipe implements PipeTransform {
    transform(value: number | string, format: string) {
        return new GanttDate(value).format(format);
    }
}
