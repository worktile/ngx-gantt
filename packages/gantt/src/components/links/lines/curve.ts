import { Inject } from '@angular/core';
import { GanttLinkItem, GanttLinkType } from '../../../class/link';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../../gantt-upper';
import { GanttLinkLine } from './line';

export class GanttLinkLineCurve extends GanttLinkLine {
    constructor(@Inject(GANTT_UPPER_TOKEN) private ganttUpper: GanttUpper) {
        super();
    }

    generateSSPath(source: GanttLinkItem, target: GanttLinkItem) {
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
        } else {
            return `M ${x1} ${y1}
                    L ${x4} ${y1}
                    A ${radius} ${radius} 0 1 ${isMirror} ${x4} ${y4}`;
        }
    }
    generateFFPath(source: GanttLinkItem, target: GanttLinkItem) {
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
        } else {
            return `M ${x1} ${y1}
                    A ${radius} ${radius} 0 1 ${isMirror} ${x1} ${y4}
                    L ${x4} ${y4}`;
        }
    }

    generateFSAndSFPath(source: GanttLinkItem, target: GanttLinkItem, type?: GanttLinkType) {
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
                    C ${x1 + controlX} ${y1} ${x1 + controlX} ${y4 > y1 ? y1 + controlX : y1 - controlX} ${x1} ${
                    y4 > y1 ? y1 + controlY : y1 - controlY
                }
                    L ${x4} ${y4 > y1 ? y4 - controlY : y4 + controlY}
                    C ${x4 - controlY} ${y4 > y1 ? y4 - controlY : y4 + controlY}  ${x4 - controlX} ${y4} ${x4} ${y4}
                    `;
            } else {
                controlX = this.ganttUpper.styles.lineHeight;
                return `M ${x1} ${y1}
                    C ${x1 + controlX} ${y1} ${x1 + controlX} ${y4 > y1 ? y1 + controlX : y1 - controlX} ${centerX} ${centerY}
                    C ${x4 - controlX} ${y4 > y1 ? y4 - controlX : y4 + controlX} ${x4 - controlX} ${y4} ${x4} ${y4}
                    `;
            }
        } else if (this.ganttUpper.linkOptions?.showArrow && x4 - x1 < 200) {
            dx = Math.max(Math.abs(y4 - y1) * bezierWeight, 60);
            x2 = x1 + dx;
            x3 = x4 - dx;
            return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
        }

        return `M ${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    }
}
