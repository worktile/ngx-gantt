import { GanttLinkItem, GanttLinkType } from '../../../class/link';
export declare abstract class GanttLinkLine {
    constructor();
    abstract generateSSPath(source: GanttLinkItem, target: GanttLinkItem): string;
    abstract generateFFPath(source: GanttLinkItem, target: GanttLinkItem): string;
    abstract generateFSAndSFPath(source: GanttLinkItem, target: GanttLinkItem, type?: GanttLinkType): string;
    generatePath(source: GanttLinkItem, target: GanttLinkItem, type: GanttLinkType): string;
}
