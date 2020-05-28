import { Injectable } from '@angular/core';
import { GanttDomService } from './gantt-dom.service';
import html2canvas from 'html2canvas';

@Injectable()
export class GanttPrintService {
    constructor(private ganttDomService: GanttDomService) {}

    private root = this.ganttDomService.root as HTMLElement;

    private viewer = this.ganttDomService.viewer as HTMLElement;

    private calendarOverlay = this.ganttDomService.calendarOverlay as HTMLElement;

    private setInlineStyles(targetElem: Element) {
        const svgElements = Array.from(targetElem.getElementsByTagName('svg'));
        for (const svgElement of svgElements) {
            this.recursElementChildren(svgElement);
        }
    }

    private recursElementChildren(node: SVGSVGElement | HTMLElement) {
        const transformProperties = [
            'fill',
            'color',
            'font-size',
            'stroke',
            'font',
            'text-anchor',
            'stroke-dasharray',
            'shape-rendering',
            'stroke-width'
        ];
        if (!node.style) {
            return;
        }
        const styles = getComputedStyle(node);
        for (const transformProperty of transformProperties) {
            node.style[transformProperty] = styles[transformProperty];
        }
        for (const child of Array.from(node.childNodes)) {
            this.recursElementChildren(child as SVGSVGElement);
        }
    }

    print(name: string = 'download') {
        // set print width
        const printWidth = this.viewer.scrollWidth - this.viewer.offsetWidth + this.root.offsetWidth;

        // set print height
        const printHeight = this.viewer.scrollHeight + this.calendarOverlay.offsetHeight;

        html2canvas(this.root, {
            // scale: 2,
            logging: false,
            allowTaint: true,
            width: printWidth,
            height: printHeight,
            onclone: (cloneDocument: Document) => {
                const ganttClass = this.root.className;
                const cloneGanttDom = cloneDocument.querySelector(`.${ganttClass.replace(/\s+/g, '.')}`) as HTMLElement;

                // change targetDom width
                cloneGanttDom.style.width = `${printWidth}px`;
                cloneGanttDom.style.height = `${printHeight}px`;
                cloneGanttDom.style.overflow = 'unset';
                cloneGanttDom.style.flex = 'none';

                // setInlineStyles for svg
                this.setInlineStyles(cloneGanttDom);
            }
        }).then((canvas: HTMLCanvasElement) => {
            const link = document.createElement('a');
            const dataUrl = canvas.toDataURL('image/png');
            link.download = `${name}.png`;
            link.href = dataUrl;
            link.click();
        });
    }
}
