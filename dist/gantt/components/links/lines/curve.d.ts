import { GanttLinkItem, GanttLinkType } from '../../../class/link';
import { GanttUpper } from '../../../gantt-upper';
import { GanttLinkLine } from './line';
export declare class GanttLinkLineCurve extends GanttLinkLine {
    private ganttUpper;
    constructor(ganttUpper: GanttUpper);
    generateSSPath(source: GanttLinkItem, target: GanttLinkItem): string;
    generateFFPath(source: GanttLinkItem, target: GanttLinkItem): string;
    generateFSAndSFPath(source: GanttLinkItem, target: GanttLinkItem, type?: GanttLinkType): string;
}
