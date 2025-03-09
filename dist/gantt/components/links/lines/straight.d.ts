import { GanttLinkLine } from './line';
import { GanttLinkItem, GanttLinkType } from '../../../class/link';
export declare class GanttLinkLineStraight extends GanttLinkLine {
    private pathControl;
    constructor();
    generateSSPath(source: GanttLinkItem, target: GanttLinkItem): string;
    generateFFPath(source: GanttLinkItem, target: GanttLinkItem): string;
    generateFSAndSFPath(source: GanttLinkItem, target: GanttLinkItem, type?: GanttLinkType): string;
}
