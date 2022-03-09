import { GanttLinkLine } from './line';
import { GanttLinkItem, GanttLinkType } from '../../../class/link';

export class GanttLinkLineStraight extends GanttLinkLine {
    private pathControl = 20;

    constructor() {
        super();
    }

    generateSSPath(source: GanttLinkItem, target: GanttLinkItem) {
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

    generateFFPath(source: GanttLinkItem, target: GanttLinkItem) {
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

    generateFSAndSFPath(source: GanttLinkItem, target: GanttLinkItem, type?: GanttLinkType) {
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
        } else {
            return `M ${x1} ${y1}
                        L ${x1 + control} ${y1}
                        L ${x1 + control} ${y4 > y1 ? y1 + control : y1 - control}
                        L ${x4 - control} ${y4 > y1 ? y1 + control : y1 - control}
                        L ${x4 - control} ${y4}
                        L ${x4} ${y4}`;
        }
    }
}
