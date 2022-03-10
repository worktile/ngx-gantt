import { GanttLinkItem, GanttLinkType } from '../../../class/link';

export abstract class GanttLinkLine {
    constructor() {}

    abstract generateSSPath(source: GanttLinkItem, target: GanttLinkItem): string;

    abstract generateFFPath(source: GanttLinkItem, target: GanttLinkItem): string;

    abstract generateFSAndSFPath(source: GanttLinkItem, target: GanttLinkItem, type?: GanttLinkType): string;

    generatePath(source: GanttLinkItem, target: GanttLinkItem, type: GanttLinkType) {
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
