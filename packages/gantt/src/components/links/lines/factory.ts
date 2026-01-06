import { GanttLinkLineType } from '../../../class/link';
import { GanttLinkLineCurve } from './curve';
import { GanttLinkLineStraight } from './straight';

export function createLineGenerator(type: GanttLinkLineType) {
    switch (type) {
        case GanttLinkLineType.curve:
            return new GanttLinkLineCurve();
        case GanttLinkLineType.straight:
            return new GanttLinkLineStraight();
        default:
            throw new Error('gantt link path type invalid');
    }
}
