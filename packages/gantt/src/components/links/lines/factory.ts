import { GanttLinkLineType } from '../../../class/link';
import { GanttUpper } from '../../../gantt-upper';
import { GanttLinkLineCurve } from './curve';
import { GanttLinkLineStraight } from './straight';

export function createLineGenerator(type: GanttLinkLineType, ganttUpper?: GanttUpper) {
    switch (type) {
        case GanttLinkLineType.curve:
            return new GanttLinkLineCurve(ganttUpper);
        case GanttLinkLineType.straight:
            return new GanttLinkLineStraight();
        default:
            throw new Error('gantt link path type invalid');
    }
}
