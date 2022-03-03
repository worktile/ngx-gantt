import { GanttLinkPathType } from '../../../class/link';
import { GanttUpper } from '../../../gantt-upper';
import { GanttLinkPathCurve } from './curve';
import { GanttLinkPathLine } from './line';

export function generatePathFactory(type: GanttLinkPathType, ganttUpper?: GanttUpper) {
    switch (type) {
        case GanttLinkPathType.curve:
            return new GanttLinkPathCurve(ganttUpper);
        case GanttLinkPathType.line:
            return new GanttLinkPathLine();
        default:
            throw new Error('gantt link path type invalid');
    }
}
