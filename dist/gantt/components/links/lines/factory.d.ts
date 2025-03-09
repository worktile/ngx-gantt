import { GanttLinkLineType } from '../../../class/link';
import { GanttUpper } from '../../../gantt-upper';
import { GanttLinkLineCurve } from './curve';
import { GanttLinkLineStraight } from './straight';
export declare function createLineGenerator(type: GanttLinkLineType, ganttUpper?: GanttUpper): GanttLinkLineCurve | GanttLinkLineStraight;
