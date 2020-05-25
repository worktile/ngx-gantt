import { helpers } from '@worktile/ngx-styx';
import { GanttItemInternal } from './item';
import { GanttOptions, getGroupHeight } from '../gantt.options';

export interface GanttGroupInfo {
    _id: string;
    [key: string]: any;
}

export class GanttGroupInternal {
    _id: string;
    origin: GanttGroupInfo;
    items: GanttItemInternal[][];
    refs?: {
        x: number;
        y: number;
        height: number;
        line: {
            y1: number;
            y2: number;
        };
    };

    constructor(group: GanttGroupInfo, private previous: GanttGroupInternal, private options: GanttOptions) {
        this._id = group._id;
        this.origin = group;
        this.items = [[]];
    }

    private buildMergeItems(flatItems: GanttItemInternal[]) {
        const items = [];
        flatItems.forEach((item) => {
            let indexOfGroupItems = -1;
            for (let i = 0; i < items.length; i++) {
                const subItems = items[i];
                if (item.start.value > subItems[subItems.length - 1].end.value) {
                    subItems.push(item);
                    indexOfGroupItems = i;
                    break;
                }
            }
            // 如果没有合适的位置插入，则插入到最后一行
            if (indexOfGroupItems === -1) {
                items.push([item]);
                indexOfGroupItems = items.length - 1;
            }
        });
        this.items = items;
    }

    buildItems(merge?: boolean) {
        const flatItems = helpers.flatten(this.items).sort((a, b) => a.start.getUnixTime() - b.start.getUnixTime());
        this.items = [];
        if (!merge) {
            flatItems.forEach((item) => {
                this.items.push([item]);
            });
        } else {
            this.buildMergeItems(flatItems);
        }
    }

    computeItemsRef() {
        this.items.forEach((subItems, index) => {
            subItems.forEach((item) => item.computeRefs({ x: this.refs.x, y: this.refs.y }, index));
        });
    }

    computeRefs() {
        const height = getGroupHeight(this.items.length, this.options);
        const y = this.previous ? this.previous.refs.y + this.previous.refs.height : 0;
        this.refs = {
            x: 0,
            y,
            height,
            line: {
                y1: y,
                y2: y,
            },
        };
        this.computeItemsRef();
    }
}
