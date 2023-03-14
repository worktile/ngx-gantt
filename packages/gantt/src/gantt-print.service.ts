import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class GanttPrintService {
    private root: HTMLElement;

    private mainContainer: HTMLElement;

    constructor() {}

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

    register(root: ElementRef<HTMLElement>) {
        this.root = root.nativeElement;
        this.mainContainer = this.root.getElementsByClassName('gantt-main-container')[0] as HTMLElement;
    }

    async print(name: string = 'download', ignoreElementClass?: string) {
        const root = this.root as HTMLElement;

        const mainContainer = this.mainContainer as HTMLElement;
        // set print width
        const printWidth = root.offsetWidth;

        // set print height
        const printHeight = root.offsetHeight - mainContainer.offsetHeight + mainContainer.scrollHeight;

        const html2canvas = (await import(/* webpackChunkName: 'html2canvas' */ 'html2canvas')).default;

        html2canvas(root, {
            logging: false,
            allowTaint: true,
            useCORS: true,
            width: printWidth,
            height: printHeight,
            ignoreElements: (element) => {
                if (ignoreElementClass && element.classList.contains(ignoreElementClass)) {
                    return true;
                }
                if (element.classList.contains('gantt-calendar-today-overlay')) {
                    return true;
                }
            },

            onclone: (cloneDocument: Document) => {
                const ganttClass = root.className;
                const cloneGanttDom = cloneDocument.querySelector(`.${ganttClass.replace(/\s+/g, '.')}`) as HTMLElement;
                const cloneGanttContainerDom = cloneDocument.querySelector('.gantt-container') as HTMLElement;
                const cloneCalendarOverlay = cloneDocument.querySelector('.gantt-calendar-grid-main') as HTMLElement;
                const cloneLinksOverlay = cloneDocument.querySelector('.gantt-links-overlay-main') as HTMLElement;

                // change targetDom width
                cloneGanttDom.style.width = `${printWidth}px`;
                cloneGanttDom.style.height = `${printHeight}px`;
                cloneGanttDom.style.overflow = `unset`;
                cloneGanttContainerDom.style.backgroundColor = '#fff';
                cloneCalendarOverlay.setAttribute('height', `${printHeight}`);
                cloneCalendarOverlay.setAttribute('style', `background: transparent`);

                if (cloneLinksOverlay) {
                    cloneLinksOverlay.setAttribute('height', `${printHeight}`);
                    cloneLinksOverlay.setAttribute('style', `height: ${printHeight}px`);
                }

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
