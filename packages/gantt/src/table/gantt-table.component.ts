import {
    Component,
    HostBinding,
    TemplateRef,
    QueryList,
    Input,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ContentChild,
    ViewChild,
    ElementRef
} from '@angular/core';
import { GanttItemInternal, GanttGroupInternal } from '../class';
import { GanttTableColumnComponent } from './column/column.component';
import { Subject, merge } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
    selector: 'gantt-table',
    templateUrl: './gantt-table.component.html'
})
export class GanttTableComponent implements OnInit, AfterViewInit {
    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input() columns: QueryList<GanttTableColumnComponent>;

    @Input() groupTemplate: TemplateRef<any>;

    @ViewChild('ganttSideHeaderTable', { static: false }) headerTableRef: ElementRef;

    @HostBinding('class.gantt-table') ganttTableClass = true;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {}

    ngAfterViewInit() {
        const columnsWidth = coerceCssPixelValue(this.headerTableRef.nativeElement.offsetWidth);
        this.elementRef.nativeElement.style.width = columnsWidth;
    }
}
