import { Component, Input, Output, EventEmitter, HostBinding, Inject } from '@angular/core';
import { EMPTY, merge, Subject } from 'rxjs';
import { takeUntil, skip, debounceTime, switchMap, take } from 'rxjs/operators';
import { GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { LinkColors, GanttLinkType } from '../../class/link';
import { createLineGenerator } from './lines/factory';
import { NgFor, NgIf } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../../gantt-drag-container";
import * as i2 from "../../gantt-upper";
export class GanttLinksComponent {
    constructor(ganttUpper, cdr, elementRef, ganttDragContainer, ngZone) {
        this.ganttUpper = ganttUpper;
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.ganttDragContainer = ganttDragContainer;
        this.ngZone = ngZone;
        // @Input() groups: GanttGroupInternal[] = [];
        // @Input() items: GanttItemInternal[] = [];
        this.flatItems = [];
        this.lineClick = new EventEmitter();
        this.links = [];
        this.ganttLinkTypes = GanttLinkType;
        this.showArrow = false;
        this.linkItems = [];
        this.firstChange = true;
        this.unsubscribe$ = new Subject();
        this.ganttLinksOverlay = true;
    }
    ngOnInit() {
        this.linkLine = createLineGenerator(this.ganttUpper.linkOptions.lineType, this.ganttUpper);
        this.showArrow = this.ganttUpper.linkOptions.showArrow;
        // this.buildLinks();
        this.firstChange = false;
        this.buildLinks();
        this.ganttDragContainer.dragStarted.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'hidden';
        });
        merge(this.ganttUpper.viewChange, this.ganttUpper.expandChange, this.ganttUpper.view.start$, this.ganttUpper.dragEnded, this.ganttUpper.linkDragEnded, this.ngZone.onStable.pipe(take(1)).pipe(switchMap(() => this.ganttUpper.table?.dragDropped || EMPTY)))
            .pipe(skip(1), debounceTime(0), takeUntil(this.unsubscribe$))
            .subscribe(() => {
            this.elementRef.nativeElement.style.visibility = 'visible';
            this.buildLinks();
            this.cdr.detectChanges();
        });
    }
    ngOnChanges() {
        if (!this.firstChange) {
            this.buildLinks();
        }
    }
    computeItemPosition() {
        const lineHeight = this.ganttUpper.styles.lineHeight;
        const barHeight = this.ganttUpper.styles.barHeight;
        this.linkItems = [];
        // if (this.groups.length > 0) {
        //     let itemNum = 0;
        //     let groupNum = 0;
        //     this.groups.forEach((group) => {
        //         groupNum++;
        //         if (group.expanded) {
        //             const items = recursiveItems(group.items);
        //             items.forEach((item, itemIndex) => {
        //                 const y = (groupNum + itemNum + itemIndex) * lineHeight + item.refs.y + barHeight / 2;
        //                 this.linkItems.push({
        //                     ...item,
        //                     before: {
        //                         x: item.refs.x,
        //                         y
        //                     },
        //                     after: {
        //                         x: item.refs.x + item.refs.width,
        //                         y
        //                     }
        //                 });
        //             });
        //             itemNum += items.length;
        //         }
        //     });
        // } else {
        //     const items = recursiveItems(this.items);
        //     items.forEach((item, itemIndex) => {
        //         const y = itemIndex * lineHeight + item.refs.y + barHeight / 2;
        //         this.linkItems.push({
        //             ...item,
        //             before: {
        //                 x: item.refs.x,
        //                 y
        //             },
        //             after: {
        //                 x: item.refs.x + item.refs.width,
        //                 y
        //             }
        //         });
        //     });
        // }
        this.flatItems.forEach((item, itemIndex) => {
            if (!item.hasOwnProperty('items')) {
                const ganttItem = item;
                if (ganttItem.refs) {
                    const y = itemIndex * lineHeight + ganttItem.refs.y + barHeight / 2;
                    this.linkItems.push({
                        ...ganttItem,
                        before: {
                            x: ganttItem.refs.x,
                            y
                        },
                        after: {
                            x: ganttItem.refs.x + ganttItem.refs.width,
                            y
                        }
                    });
                }
            }
        });
    }
    buildLinks() {
        this.computeItemPosition();
        this.links = [];
        this.linkItems.forEach((source) => {
            if (source.origin.start || source.origin.end) {
                source.links.forEach((link) => {
                    const target = this.linkItems.find((item) => item.id === link.link);
                    if (target && (target.origin.start || target.origin.end)) {
                        let defaultColor = LinkColors.default;
                        let activeColor = LinkColors.active;
                        if (link.type === GanttLinkType.fs && source.end.getTime() > target.start.getTime()) {
                            defaultColor = LinkColors.blocked;
                            activeColor = LinkColors.blocked;
                        }
                        if (link.color) {
                            if (typeof link.color === 'string') {
                                defaultColor = link.color;
                                activeColor = link.color;
                            }
                            else {
                                defaultColor = link.color.default;
                                activeColor = link.color.active;
                            }
                        }
                        this.links.push({
                            path: this.linkLine.generatePath(source, target, link.type),
                            source: source.origin,
                            target: target.origin,
                            type: link.type,
                            color: defaultColor,
                            defaultColor,
                            activeColor
                        });
                    }
                });
            }
        });
    }
    trackBy(index) {
        return index;
    }
    onLineClick(event, link) {
        this.lineClick.emit({
            event,
            source: link.source,
            target: link.target
        });
    }
    mouseEnterPath(link, index) {
        link.color = link.activeColor || link.defaultColor;
        if (index < this.links.length - 1) {
            this.links.splice(index, 1);
            this.links.push(link);
        }
    }
    mouseLeavePath(link) {
        link.color = link.defaultColor;
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttLinksComponent, deps: [{ token: GANTT_UPPER_TOKEN }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.GanttDragContainer }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0", type: GanttLinksComponent, isStandalone: true, selector: "gantt-links-overlay", inputs: { flatItems: "flatItems" }, outputs: { lineClick: "lineClick" }, host: { properties: { "class.gantt-links-overlay": "this.ganttLinksOverlay" } }, usesOnChanges: true, ngImport: i0, template: "<svg [attr.width]=\"ganttUpper.view.width\" class=\"gantt-links-overlay-main\">\n  <ng-container *ngFor=\"let link of links; let i = index; trackBy: trackBy\">\n    <path\n      [attr.d]=\"link.path\"\n      fill=\"transparent\"\n      stroke-width=\"2\"\n      [attr.stroke]=\"link.color\"\n      pointer-events=\"none\"\n      [attr.style]=\"link.type === ganttLinkTypes.sf ? 'marker-start: url(#triangle' + i + ')' : 'marker-end: url(#triangle' + i + ')'\"\n    ></path>\n\n    <g>\n      <path\n        class=\"link-line\"\n        (click)=\"onLineClick($event, link)\"\n        [attr.d]=\"link.path\"\n        (mouseenter)=\"mouseEnterPath(link, i)\"\n        (mouseleave)=\"mouseLeavePath(link)\"\n        stroke=\"transparent\"\n        stroke-width=\"9\"\n        fill=\"none\"\n        cursor=\"pointer\"\n      ></path>\n    </g>\n    <defs *ngIf=\"showArrow\">\n      <marker\n        *ngIf=\"link.type === ganttLinkTypes.sf; else markerEnd\"\n        [id]=\"'triangle' + i\"\n        markerUnits=\"strokeWidth\"\n        markerWidth=\"5\"\n        markerHeight=\"4\"\n        refX=\"5\"\n        refY=\"2\"\n        orient=\"180\"\n      >\n        <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n      </marker>\n\n      <ng-template #markerEnd>\n        <marker [id]=\"'triangle' + i\" markerUnits=\"strokeWidth\" markerWidth=\"5\" markerHeight=\"4\" refX=\"5\" refY=\"2\" orient=\"auto\">\n          <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n        </marker>\n      </ng-template>\n    </defs>\n  </ng-container>\n  <line class=\"link-dragging-line\"></line>\n</svg>\n", dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttLinksComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gantt-links-overlay', standalone: true, imports: [NgFor, NgIf], template: "<svg [attr.width]=\"ganttUpper.view.width\" class=\"gantt-links-overlay-main\">\n  <ng-container *ngFor=\"let link of links; let i = index; trackBy: trackBy\">\n    <path\n      [attr.d]=\"link.path\"\n      fill=\"transparent\"\n      stroke-width=\"2\"\n      [attr.stroke]=\"link.color\"\n      pointer-events=\"none\"\n      [attr.style]=\"link.type === ganttLinkTypes.sf ? 'marker-start: url(#triangle' + i + ')' : 'marker-end: url(#triangle' + i + ')'\"\n    ></path>\n\n    <g>\n      <path\n        class=\"link-line\"\n        (click)=\"onLineClick($event, link)\"\n        [attr.d]=\"link.path\"\n        (mouseenter)=\"mouseEnterPath(link, i)\"\n        (mouseleave)=\"mouseLeavePath(link)\"\n        stroke=\"transparent\"\n        stroke-width=\"9\"\n        fill=\"none\"\n        cursor=\"pointer\"\n      ></path>\n    </g>\n    <defs *ngIf=\"showArrow\">\n      <marker\n        *ngIf=\"link.type === ganttLinkTypes.sf; else markerEnd\"\n        [id]=\"'triangle' + i\"\n        markerUnits=\"strokeWidth\"\n        markerWidth=\"5\"\n        markerHeight=\"4\"\n        refX=\"5\"\n        refY=\"2\"\n        orient=\"180\"\n      >\n        <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n      </marker>\n\n      <ng-template #markerEnd>\n        <marker [id]=\"'triangle' + i\" markerUnits=\"strokeWidth\" markerWidth=\"5\" markerHeight=\"4\" refX=\"5\" refY=\"2\" orient=\"auto\">\n          <path [attr.fill]=\"link.color\" [attr.stroke]=\"link.color\" d=\"M 0 0 L 5 2 L 0 4 z\" />\n        </marker>\n      </ng-template>\n    </defs>\n  </ng-container>\n  <line class=\"link-dragging-line\"></line>\n</svg>\n" }]
        }], ctorParameters: () => [{ type: i2.GanttUpper, decorators: [{
                    type: Inject,
                    args: [GANTT_UPPER_TOKEN]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.GanttDragContainer }, { type: i0.NgZone }], propDecorators: { flatItems: [{
                type: Input
            }], lineClick: [{
                type: Output
            }], ganttLinksOverlay: [{
                type: HostBinding,
                args: ['class.gantt-links-overlay']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvbGlua3MvbGlua3MuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZ2FudHQvc3JjL2NvbXBvbmVudHMvbGlua3MvbGlua3MuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFFVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixXQUFXLEVBQ1gsTUFBTSxFQU1ULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBUyxLQUFLLEVBQUUsS0FBSyxFQUFhLE9BQU8sRUFBUyxNQUFNLE1BQU0sQ0FBQztBQUN0RSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBS2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xFLE9BQU8sRUFBK0IsVUFBVSxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTFGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFROUMsTUFBTSxPQUFPLG1CQUFtQjtJQXlCNUIsWUFDc0MsVUFBc0IsRUFDaEQsR0FBc0IsRUFDdEIsVUFBc0IsRUFDdEIsa0JBQXNDLEVBQ3RDLE1BQWM7UUFKWSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ2hELFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBN0IxQiw4Q0FBOEM7UUFFOUMsNENBQTRDO1FBRW5DLGNBQVMsR0FBK0MsRUFBRSxDQUFDO1FBRTFELGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUV2RCxVQUFLLEdBQW1CLEVBQUUsQ0FBQztRQUUzQixtQkFBYyxHQUFHLGFBQWEsQ0FBQztRQUUvQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWpCLGNBQVMsR0FBb0IsRUFBRSxDQUFDO1FBRWhDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBSW5CLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUVELHNCQUFpQixHQUFHLElBQUksQ0FBQztJQVFoRSxDQUFDO0lBRUosUUFBUTtRQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztRQUN2RCxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFFekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2xGLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUNELElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUN4RzthQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDNUQsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1lBQzNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN0QixDQUFDO0lBQ0wsQ0FBQztJQUVPLG1CQUFtQjtRQUN2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDckQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGdDQUFnQztRQUNoQyx1QkFBdUI7UUFDdkIsd0JBQXdCO1FBQ3hCLHVDQUF1QztRQUN2QyxzQkFBc0I7UUFDdEIsZ0NBQWdDO1FBQ2hDLHlEQUF5RDtRQUN6RCxtREFBbUQ7UUFDbkQseUdBQXlHO1FBQ3pHLHdDQUF3QztRQUN4QywrQkFBK0I7UUFDL0IsZ0NBQWdDO1FBQ2hDLDBDQUEwQztRQUMxQyw0QkFBNEI7UUFDNUIseUJBQXlCO1FBQ3pCLCtCQUErQjtRQUMvQiw0REFBNEQ7UUFDNUQsNEJBQTRCO1FBQzVCLHdCQUF3QjtRQUN4QixzQkFBc0I7UUFDdEIsa0JBQWtCO1FBQ2xCLHVDQUF1QztRQUN2QyxZQUFZO1FBQ1osVUFBVTtRQUNWLFdBQVc7UUFDWCxnREFBZ0Q7UUFDaEQsMkNBQTJDO1FBQzNDLDBFQUEwRTtRQUMxRSxnQ0FBZ0M7UUFDaEMsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4QixrQ0FBa0M7UUFDbEMsb0JBQW9CO1FBQ3BCLGlCQUFpQjtRQUNqQix1QkFBdUI7UUFDdkIsb0RBQW9EO1FBQ3BELG9CQUFvQjtRQUNwQixnQkFBZ0I7UUFDaEIsY0FBYztRQUNkLFVBQVU7UUFDVixJQUFJO1FBRUosSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUU7WUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDaEMsTUFBTSxTQUFTLEdBQUcsSUFBeUIsQ0FBQztnQkFDNUMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxHQUFHLFNBQVMsR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDcEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7d0JBQ2hCLEdBQUcsU0FBUzt3QkFDWixNQUFNLEVBQUU7NEJBQ0osQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDbkIsQ0FBQzt5QkFDSjt3QkFDRCxLQUFLLEVBQUU7NEJBQ0gsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSzs0QkFDMUMsQ0FBQzt5QkFDSjtxQkFDSixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM5QixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEUsSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7d0JBQ3ZELElBQUksWUFBWSxHQUFXLFVBQVUsQ0FBQyxPQUFPLENBQUM7d0JBQzlDLElBQUksV0FBVyxHQUFXLFVBQVUsQ0FBQyxNQUFNLENBQUM7d0JBRTVDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDOzRCQUNsRixZQUFZLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQzs0QkFDbEMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7d0JBQ3JDLENBQUM7d0JBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7NEJBQ2IsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7Z0NBQ2pDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dDQUMxQixXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs0QkFDN0IsQ0FBQztpQ0FBTSxDQUFDO2dDQUNKLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQ0FDbEMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDOzRCQUNwQyxDQUFDO3dCQUNMLENBQUM7d0JBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7NEJBQ1osSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQzs0QkFDM0QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNOzRCQUNyQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07NEJBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTs0QkFDZixLQUFLLEVBQUUsWUFBWTs0QkFDbkIsWUFBWTs0QkFDWixXQUFXO3lCQUNkLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFhO1FBQ2pCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBaUIsRUFBRSxJQUFrQjtRQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNoQixLQUFLO1lBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUN0QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsY0FBYyxDQUFDLElBQWtCLEVBQUUsS0FBYTtRQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNMLENBQUM7SUFFRCxjQUFjLENBQUMsSUFBa0I7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7OEdBMU1RLG1CQUFtQixrQkEwQmhCLGlCQUFpQjtrR0ExQnBCLG1CQUFtQiw4UENoQ2hDLGdwREErQ0EsNENEakJjLEtBQUssbUhBQUUsSUFBSTs7MkZBRVosbUJBQW1CO2tCQU4vQixTQUFTOytCQUNJLHFCQUFxQixjQUVuQixJQUFJLFdBQ1AsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDOzswQkE0QmpCLE1BQU07MkJBQUMsaUJBQWlCO3dKQXJCcEIsU0FBUztzQkFBakIsS0FBSztnQkFFSSxTQUFTO3NCQUFsQixNQUFNO2dCQWdCbUMsaUJBQWlCO3NCQUExRCxXQUFXO3VCQUFDLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIE9uSW5pdCxcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEluamVjdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBFbGVtZW50UmVmLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkNoYW5nZXMsXG4gICAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZW1wdHksIEVNUFRZLCBtZXJnZSwgTkVWRVIsIG9mLCBTdWJqZWN0LCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBza2lwLCBkZWJvdW5jZVRpbWUsIHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEdhbnR0R3JvdXBJbnRlcm5hbCB9IGZyb20gJy4uLy4uL2NsYXNzL2dyb3VwJztcbmltcG9ydCB7IEdhbnR0SXRlbUludGVybmFsIH0gZnJvbSAnLi8uLi8uLi9jbGFzcy9pdGVtJztcbmltcG9ydCB7IEdhbnR0TGluZUNsaWNrRXZlbnQgfSBmcm9tICcuLi8uLi9jbGFzcy9ldmVudCc7XG5pbXBvcnQgeyBHYW50dERyYWdDb250YWluZXIgfSBmcm9tICcuLi8uLi9nYW50dC1kcmFnLWNvbnRhaW5lcic7XG5pbXBvcnQgeyBHQU5UVF9VUFBFUl9UT0tFTiwgR2FudHRVcHBlciB9IGZyb20gJy4uLy4uL2dhbnR0LXVwcGVyJztcbmltcG9ydCB7IEdhbnR0TGlua0l0ZW0sIExpbmtJbnRlcm5hbCwgTGlua0NvbG9ycywgR2FudHRMaW5rVHlwZSB9IGZyb20gJy4uLy4uL2NsYXNzL2xpbmsnO1xuaW1wb3J0IHsgR2FudHRMaW5rTGluZSB9IGZyb20gJy4vbGluZXMvbGluZSc7XG5pbXBvcnQgeyBjcmVhdGVMaW5lR2VuZXJhdG9yIH0gZnJvbSAnLi9saW5lcy9mYWN0b3J5JztcbmltcG9ydCB7IE5nRm9yLCBOZ0lmIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdnYW50dC1saW5rcy1vdmVybGF5JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbGlua3MuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0YW5kYWxvbmU6IHRydWUsXG4gICAgaW1wb3J0czogW05nRm9yLCBOZ0lmXVxufSlcbmV4cG9ydCBjbGFzcyBHYW50dExpbmtzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gICAgLy8gQElucHV0KCkgZ3JvdXBzOiBHYW50dEdyb3VwSW50ZXJuYWxbXSA9IFtdO1xuXG4gICAgLy8gQElucHV0KCkgaXRlbXM6IEdhbnR0SXRlbUludGVybmFsW10gPSBbXTtcblxuICAgIEBJbnB1dCgpIGZsYXRJdGVtczogKEdhbnR0R3JvdXBJbnRlcm5hbCB8IEdhbnR0SXRlbUludGVybmFsKVtdID0gW107XG5cbiAgICBAT3V0cHV0KCkgbGluZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxHYW50dExpbmVDbGlja0V2ZW50PigpO1xuXG4gICAgcHVibGljIGxpbmtzOiBMaW5rSW50ZXJuYWxbXSA9IFtdO1xuXG4gICAgcHVibGljIGdhbnR0TGlua1R5cGVzID0gR2FudHRMaW5rVHlwZTtcblxuICAgIHB1YmxpYyBzaG93QXJyb3cgPSBmYWxzZTtcblxuICAgIHByaXZhdGUgbGlua0l0ZW1zOiBHYW50dExpbmtJdGVtW10gPSBbXTtcblxuICAgIHByaXZhdGUgZmlyc3RDaGFuZ2UgPSB0cnVlO1xuXG4gICAgcHJpdmF0ZSBsaW5rTGluZTogR2FudHRMaW5rTGluZTtcblxuICAgIHByaXZhdGUgdW5zdWJzY3JpYmUkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuZ2FudHQtbGlua3Mtb3ZlcmxheScpIGdhbnR0TGlua3NPdmVybGF5ID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KEdBTlRUX1VQUEVSX1RPS0VOKSBwdWJsaWMgZ2FudHRVcHBlcjogR2FudHRVcHBlcixcbiAgICAgICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgIHByaXZhdGUgZ2FudHREcmFnQ29udGFpbmVyOiBHYW50dERyYWdDb250YWluZXIsXG4gICAgICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmVcbiAgICApIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5saW5rTGluZSA9IGNyZWF0ZUxpbmVHZW5lcmF0b3IodGhpcy5nYW50dFVwcGVyLmxpbmtPcHRpb25zLmxpbmVUeXBlLCB0aGlzLmdhbnR0VXBwZXIpO1xuXG4gICAgICAgIHRoaXMuc2hvd0Fycm93ID0gdGhpcy5nYW50dFVwcGVyLmxpbmtPcHRpb25zLnNob3dBcnJvdztcbiAgICAgICAgLy8gdGhpcy5idWlsZExpbmtzKCk7XG4gICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJ1aWxkTGlua3MoKTtcblxuICAgICAgICB0aGlzLmdhbnR0RHJhZ0NvbnRhaW5lci5kcmFnU3RhcnRlZC5waXBlKHRha2VVbnRpbCh0aGlzLnVuc3Vic2NyaWJlJCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgICAgdGhpcy5nYW50dFVwcGVyLnZpZXdDaGFuZ2UsXG4gICAgICAgICAgICB0aGlzLmdhbnR0VXBwZXIuZXhwYW5kQ2hhbmdlLFxuICAgICAgICAgICAgdGhpcy5nYW50dFVwcGVyLnZpZXcuc3RhcnQkLFxuICAgICAgICAgICAgdGhpcy5nYW50dFVwcGVyLmRyYWdFbmRlZCxcbiAgICAgICAgICAgIHRoaXMuZ2FudHRVcHBlci5saW5rRHJhZ0VuZGVkLFxuICAgICAgICAgICAgdGhpcy5uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5waXBlKHN3aXRjaE1hcCgoKSA9PiB0aGlzLmdhbnR0VXBwZXIudGFibGU/LmRyYWdEcm9wcGVkIHx8IEVNUFRZKSlcbiAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoc2tpcCgxKSwgZGVib3VuY2VUaW1lKDApLCB0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkTGlua3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpcnN0Q2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkTGlua3MoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29tcHV0ZUl0ZW1Qb3NpdGlvbigpIHtcbiAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMuZ2FudHRVcHBlci5zdHlsZXMubGluZUhlaWdodDtcbiAgICAgICAgY29uc3QgYmFySGVpZ2h0ID0gdGhpcy5nYW50dFVwcGVyLnN0eWxlcy5iYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMubGlua0l0ZW1zID0gW107XG4gICAgICAgIC8vIGlmICh0aGlzLmdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICBsZXQgaXRlbU51bSA9IDA7XG4gICAgICAgIC8vICAgICBsZXQgZ3JvdXBOdW0gPSAwO1xuICAgICAgICAvLyAgICAgdGhpcy5ncm91cHMuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgICAgLy8gICAgICAgICBncm91cE51bSsrO1xuICAgICAgICAvLyAgICAgICAgIGlmIChncm91cC5leHBhbmRlZCkge1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHJlY3Vyc2l2ZUl0ZW1zKGdyb3VwLml0ZW1zKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSwgaXRlbUluZGV4KSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjb25zdCB5ID0gKGdyb3VwTnVtICsgaXRlbU51bSArIGl0ZW1JbmRleCkgKiBsaW5lSGVpZ2h0ICsgaXRlbS5yZWZzLnkgKyBiYXJIZWlnaHQgLyAyO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5saW5rSXRlbXMucHVzaCh7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBiZWZvcmU6IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgeDogaXRlbS5yZWZzLngsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGFmdGVyOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGl0ZW0ucmVmcy54ICsgaXRlbS5yZWZzLndpZHRoLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB5XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgICAgICBpdGVtTnVtICs9IGl0ZW1zLmxlbmd0aDtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IGl0ZW1zID0gcmVjdXJzaXZlSXRlbXModGhpcy5pdGVtcyk7XG4gICAgICAgIC8vICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpdGVtSW5kZXgpID0+IHtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCB5ID0gaXRlbUluZGV4ICogbGluZUhlaWdodCArIGl0ZW0ucmVmcy55ICsgYmFySGVpZ2h0IC8gMjtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmxpbmtJdGVtcy5wdXNoKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgLy8gICAgICAgICAgICAgYmVmb3JlOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB4OiBpdGVtLnJlZnMueCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHlcbiAgICAgICAgLy8gICAgICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICAgICAgYWZ0ZXI6IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHg6IGl0ZW0ucmVmcy54ICsgaXRlbS5yZWZzLndpZHRoLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgeVxuICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHRoaXMuZmxhdEl0ZW1zLmZvckVhY2goKGl0ZW0sIGl0ZW1JbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpdGVtLmhhc093blByb3BlcnR5KCdpdGVtcycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FudHRJdGVtID0gaXRlbSBhcyBHYW50dEl0ZW1JbnRlcm5hbDtcbiAgICAgICAgICAgICAgICBpZiAoZ2FudHRJdGVtLnJlZnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IGl0ZW1JbmRleCAqIGxpbmVIZWlnaHQgKyBnYW50dEl0ZW0ucmVmcy55ICsgYmFySGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rSXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5nYW50dEl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBnYW50dEl0ZW0ucmVmcy54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGdhbnR0SXRlbS5yZWZzLnggKyBnYW50dEl0ZW0ucmVmcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYnVpbGRMaW5rcygpIHtcbiAgICAgICAgdGhpcy5jb21wdXRlSXRlbVBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMubGlua3MgPSBbXTtcbiAgICAgICAgdGhpcy5saW5rSXRlbXMuZm9yRWFjaCgoc291cmNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc291cmNlLm9yaWdpbi5zdGFydCB8fCBzb3VyY2Uub3JpZ2luLmVuZCkge1xuICAgICAgICAgICAgICAgIHNvdXJjZS5saW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMubGlua0l0ZW1zLmZpbmQoKGl0ZW0pID0+IGl0ZW0uaWQgPT09IGxpbmsubGluayk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgKHRhcmdldC5vcmlnaW4uc3RhcnQgfHwgdGFyZ2V0Lm9yaWdpbi5lbmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVmYXVsdENvbG9yOiBzdHJpbmcgPSBMaW5rQ29sb3JzLmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aXZlQ29sb3I6IHN0cmluZyA9IExpbmtDb2xvcnMuYWN0aXZlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluay50eXBlID09PSBHYW50dExpbmtUeXBlLmZzICYmIHNvdXJjZS5lbmQuZ2V0VGltZSgpID4gdGFyZ2V0LnN0YXJ0LmdldFRpbWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDb2xvciA9IExpbmtDb2xvcnMuYmxvY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb2xvciA9IExpbmtDb2xvcnMuYmxvY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rLmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsaW5rLmNvbG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29sb3IgPSBsaW5rLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb2xvciA9IGxpbmsuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENvbG9yID0gbGluay5jb2xvci5kZWZhdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb2xvciA9IGxpbmsuY29sb3IuYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB0aGlzLmxpbmtMaW5lLmdlbmVyYXRlUGF0aChzb3VyY2UsIHRhcmdldCwgbGluay50eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZS5vcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQub3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGxpbmsudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogZGVmYXVsdENvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhY2tCeShpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICBvbkxpbmVDbGljayhldmVudDogTW91c2VFdmVudCwgbGluazogTGlua0ludGVybmFsKSB7XG4gICAgICAgIHRoaXMubGluZUNsaWNrLmVtaXQoe1xuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICBzb3VyY2U6IGxpbmsuc291cmNlLFxuICAgICAgICAgICAgdGFyZ2V0OiBsaW5rLnRhcmdldFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtb3VzZUVudGVyUGF0aChsaW5rOiBMaW5rSW50ZXJuYWwsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgbGluay5jb2xvciA9IGxpbmsuYWN0aXZlQ29sb3IgfHwgbGluay5kZWZhdWx0Q29sb3I7XG4gICAgICAgIGlmIChpbmRleCA8IHRoaXMubGlua3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgdGhpcy5saW5rcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5saW5rcy5wdXNoKGxpbmspO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW91c2VMZWF2ZVBhdGgobGluazogTGlua0ludGVybmFsKSB7XG4gICAgICAgIGxpbmsuY29sb3IgPSBsaW5rLmRlZmF1bHRDb2xvcjtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSQubmV4dCgpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlJC5jb21wbGV0ZSgpO1xuICAgIH1cbn1cbiIsIjxzdmcgW2F0dHIud2lkdGhdPVwiZ2FudHRVcHBlci52aWV3LndpZHRoXCIgY2xhc3M9XCJnYW50dC1saW5rcy1vdmVybGF5LW1haW5cIj5cbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbGluayBvZiBsaW5rczsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogdHJhY2tCeVwiPlxuICAgIDxwYXRoXG4gICAgICBbYXR0ci5kXT1cImxpbmsucGF0aFwiXG4gICAgICBmaWxsPVwidHJhbnNwYXJlbnRcIlxuICAgICAgc3Ryb2tlLXdpZHRoPVwiMlwiXG4gICAgICBbYXR0ci5zdHJva2VdPVwibGluay5jb2xvclwiXG4gICAgICBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIlxuICAgICAgW2F0dHIuc3R5bGVdPVwibGluay50eXBlID09PSBnYW50dExpbmtUeXBlcy5zZiA/ICdtYXJrZXItc3RhcnQ6IHVybCgjdHJpYW5nbGUnICsgaSArICcpJyA6ICdtYXJrZXItZW5kOiB1cmwoI3RyaWFuZ2xlJyArIGkgKyAnKSdcIlxuICAgID48L3BhdGg+XG5cbiAgICA8Zz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGNsYXNzPVwibGluay1saW5lXCJcbiAgICAgICAgKGNsaWNrKT1cIm9uTGluZUNsaWNrKCRldmVudCwgbGluaylcIlxuICAgICAgICBbYXR0ci5kXT1cImxpbmsucGF0aFwiXG4gICAgICAgIChtb3VzZWVudGVyKT1cIm1vdXNlRW50ZXJQYXRoKGxpbmssIGkpXCJcbiAgICAgICAgKG1vdXNlbGVhdmUpPVwibW91c2VMZWF2ZVBhdGgobGluaylcIlxuICAgICAgICBzdHJva2U9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgIHN0cm9rZS13aWR0aD1cIjlcIlxuICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgIGN1cnNvcj1cInBvaW50ZXJcIlxuICAgICAgPjwvcGF0aD5cbiAgICA8L2c+XG4gICAgPGRlZnMgKm5nSWY9XCJzaG93QXJyb3dcIj5cbiAgICAgIDxtYXJrZXJcbiAgICAgICAgKm5nSWY9XCJsaW5rLnR5cGUgPT09IGdhbnR0TGlua1R5cGVzLnNmOyBlbHNlIG1hcmtlckVuZFwiXG4gICAgICAgIFtpZF09XCIndHJpYW5nbGUnICsgaVwiXG4gICAgICAgIG1hcmtlclVuaXRzPVwic3Ryb2tlV2lkdGhcIlxuICAgICAgICBtYXJrZXJXaWR0aD1cIjVcIlxuICAgICAgICBtYXJrZXJIZWlnaHQ9XCI0XCJcbiAgICAgICAgcmVmWD1cIjVcIlxuICAgICAgICByZWZZPVwiMlwiXG4gICAgICAgIG9yaWVudD1cIjE4MFwiXG4gICAgICA+XG4gICAgICAgIDxwYXRoIFthdHRyLmZpbGxdPVwibGluay5jb2xvclwiIFthdHRyLnN0cm9rZV09XCJsaW5rLmNvbG9yXCIgZD1cIk0gMCAwIEwgNSAyIEwgMCA0IHpcIiAvPlxuICAgICAgPC9tYXJrZXI+XG5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjbWFya2VyRW5kPlxuICAgICAgICA8bWFya2VyIFtpZF09XCIndHJpYW5nbGUnICsgaVwiIG1hcmtlclVuaXRzPVwic3Ryb2tlV2lkdGhcIiBtYXJrZXJXaWR0aD1cIjVcIiBtYXJrZXJIZWlnaHQ9XCI0XCIgcmVmWD1cIjVcIiByZWZZPVwiMlwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBbYXR0ci5maWxsXT1cImxpbmsuY29sb3JcIiBbYXR0ci5zdHJva2VdPVwibGluay5jb2xvclwiIGQ9XCJNIDAgMCBMIDUgMiBMIDAgNCB6XCIgLz5cbiAgICAgICAgPC9tYXJrZXI+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGVmcz5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxsaW5lIGNsYXNzPVwibGluay1kcmFnZ2luZy1saW5lXCI+PC9saW5lPlxuPC9zdmc+XG4iXX0=