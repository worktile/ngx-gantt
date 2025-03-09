import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class GanttPrintService {
    constructor() { }
    setInlineStyles(targetElem) {
        const svgElements = Array.from(targetElem.getElementsByTagName('svg'));
        for (const svgElement of svgElements) {
            this.recursElementChildren(svgElement);
        }
    }
    recursElementChildren(node) {
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
            this.recursElementChildren(child);
        }
    }
    register(root) {
        this.root = root.nativeElement;
        this.mainContainer = this.root.getElementsByClassName('gantt-main-container')[0];
    }
    async print(name = 'download', ignoreElementClass) {
        const root = this.root;
        const mainContainer = this.mainContainer;
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
            onclone: (cloneDocument) => {
                const ganttClass = root.className;
                const cloneGanttDom = cloneDocument.querySelector(`.${ganttClass.replace(/\s+/g, '.')}`);
                const cloneGanttContainerDom = cloneDocument.querySelector('.gantt-container');
                const cloneCalendarOverlay = cloneDocument.querySelector('.gantt-calendar-grid-main');
                const cloneLinksOverlay = cloneDocument.querySelector('.gantt-links-overlay-main');
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
        }).then((canvas) => {
            const link = document.createElement('a');
            const dataUrl = canvas.toDataURL('image/png');
            link.download = `${name}.png`;
            link.href = dataUrl;
            link.click();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttPrintService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttPrintService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0", ngImport: i0, type: GanttPrintService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FudHQtcHJpbnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3BhY2thZ2VzL2dhbnR0L3NyYy9nYW50dC1wcmludC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxlQUFlLENBQUM7O0FBR3ZELE1BQU0sT0FBTyxpQkFBaUI7SUFLMUIsZ0JBQWUsQ0FBQztJQUVSLGVBQWUsQ0FBQyxVQUFtQjtRQUN2QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDO0lBRU8scUJBQXFCLENBQUMsSUFBaUM7UUFDM0QsTUFBTSxtQkFBbUIsR0FBRztZQUN4QixNQUFNO1lBQ04sT0FBTztZQUNQLFdBQVc7WUFDWCxRQUFRO1lBQ1IsTUFBTTtZQUNOLGFBQWE7WUFDYixrQkFBa0I7WUFDbEIsaUJBQWlCO1lBQ2pCLGNBQWM7U0FDakIsQ0FBQztRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZCxPQUFPO1FBQ1gsQ0FBQztRQUNELE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLEtBQUssTUFBTSxpQkFBaUIsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsS0FBSyxNQUFNLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFD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LFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxXQUFXLElBQUksQ0FBQyxDQUFDO2dCQUN4RSxDQUFDO2dCQUVELDBCQUEwQjtnQkFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4QyxDQUFDO1NBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQXlCLEVBQUUsRUFBRTtZQUNsQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OEdBcEdRLGlCQUFpQjtrSEFBakIsaUJBQWlCOzsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR2FudHRQcmludFNlcnZpY2Uge1xuICAgIHByaXZhdGUgcm9vdDogSFRNTEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIG1haW5Db250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHJpdmF0ZSBzZXRJbmxpbmVTdHlsZXModGFyZ2V0RWxlbTogRWxlbWVudCkge1xuICAgICAgICBjb25zdCBzdmdFbGVtZW50cyA9IEFycmF5LmZyb20odGFyZ2V0RWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3ZnJykpO1xuICAgICAgICBmb3IgKGNvbnN0IHN2Z0VsZW1lbnQgb2Ygc3ZnRWxlbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMucmVjdXJzRWxlbWVudENoaWxkcmVuKHN2Z0VsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWN1cnNFbGVtZW50Q2hpbGRyZW4obm9kZTogU1ZHU1ZHRWxlbWVudCB8IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybVByb3BlcnRpZXMgPSBbXG4gICAgICAgICAgICAnZmlsbCcsXG4gICAgICAgICAgICAnY29sb3InLFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZScsXG4gICAgICAgICAgICAnc3Ryb2tlJyxcbiAgICAgICAgICAgICdmb250JyxcbiAgICAgICAgICAgICd0ZXh0LWFuY2hvcicsXG4gICAgICAgICAgICAnc3Ryb2tlLWRhc2hhcnJheScsXG4gICAgICAgICAgICAnc2hhcGUtcmVuZGVyaW5nJyxcbiAgICAgICAgICAgICdzdHJva2Utd2lkdGgnXG4gICAgICAgIF07XG4gICAgICAgIGlmICghbm9kZS5zdHlsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGZvciAoY29uc3QgdHJhbnNmb3JtUHJvcGVydHkgb2YgdHJhbnNmb3JtUHJvcGVydGllcykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZVt0cmFuc2Zvcm1Qcm9wZXJ0eV0gPSBzdHlsZXNbdHJhbnNmb3JtUHJvcGVydHldO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpKSB7XG4gICAgICAgICAgICB0aGlzLnJlY3Vyc0VsZW1lbnRDaGlsZHJlbihjaGlsZCBhcyBTVkdTVkdFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyKHJvb3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3QubmF0aXZlRWxlbWVudDtcbiAgICAgICAgdGhpcy5tYWluQ29udGFpbmVyID0gdGhpcy5yb290LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dhbnR0LW1haW4tY29udGFpbmVyJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgYXN5bmMgcHJpbnQobmFtZTogc3RyaW5nID0gJ2Rvd25sb2FkJywgaWdub3JlRWxlbWVudENsYXNzPzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLnJvb3QgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgbWFpbkNvbnRhaW5lciA9IHRoaXMubWFpbkNvbnRhaW5lciBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgLy8gc2V0IHByaW50IHdpZHRoXG4gICAgICAgIGNvbnN0IHByaW50V2lkdGggPSByb290Lm9mZnNldFdpZHRoO1xuXG4gICAgICAgIC8vIHNldCBwcmludCBoZWlnaHRcbiAgICAgICAgY29uc3QgcHJpbnRIZWlnaHQgPSByb290Lm9mZnNldEhlaWdodCAtIG1haW5Db250YWluZXIub2Zmc2V0SGVpZ2h0ICsgbWFpbkNvbnRhaW5lci5zY3JvbGxIZWlnaHQ7XG5cbiAgICAgICAgY29uc3QgaHRtbDJjYW52YXMgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdodG1sMmNhbnZhcycgKi8gJ2h0bWwyY2FudmFzJykpLmRlZmF1bHQ7XG5cbiAgICAgICAgaHRtbDJjYW52YXMocm9vdCwge1xuICAgICAgICAgICAgbG9nZ2luZzogZmFsc2UsXG4gICAgICAgICAgICBhbGxvd1RhaW50OiB0cnVlLFxuICAgICAgICAgICAgdXNlQ09SUzogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiBwcmludFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBwcmludEhlaWdodCxcbiAgICAgICAgICAgIGlnbm9yZUVsZW1lbnRzOiAoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpZ25vcmVFbGVtZW50Q2xhc3MgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoaWdub3JlRWxlbWVudENsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdnYW50dC1jYWxlbmRhci10b2RheS1vdmVybGF5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25jbG9uZTogKGNsb25lRG9jdW1lbnQ6IERvY3VtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2FudHRDbGFzcyA9IHJvb3QuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lR2FudHREb20gPSBjbG9uZURvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2dhbnR0Q2xhc3MucmVwbGFjZSgvXFxzKy9nLCAnLicpfWApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lR2FudHRDb250YWluZXJEb20gPSBjbG9uZURvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW50dC1jb250YWluZXInKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZUNhbGVuZGFyT3ZlcmxheSA9IGNsb25lRG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbnR0LWNhbGVuZGFyLWdyaWQtbWFpbicpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lTGlua3NPdmVybGF5ID0gY2xvbmVEb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FudHQtbGlua3Mtb3ZlcmxheS1tYWluJykgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgdGFyZ2V0RG9tIHdpZHRoXG4gICAgICAgICAgICAgICAgY2xvbmVHYW50dERvbS5zdHlsZS53aWR0aCA9IGAke3ByaW50V2lkdGh9cHhgO1xuICAgICAgICAgICAgICAgIGNsb25lR2FudHREb20uc3R5bGUuaGVpZ2h0ID0gYCR7cHJpbnRIZWlnaHR9cHhgO1xuICAgICAgICAgICAgICAgIGNsb25lR2FudHREb20uc3R5bGUub3ZlcmZsb3cgPSBgdW5zZXRgO1xuICAgICAgICAgICAgICAgIGNsb25lR2FudHRDb250YWluZXJEb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZmYnO1xuICAgICAgICAgICAgICAgIGNsb25lQ2FsZW5kYXJPdmVybGF5LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgYCR7cHJpbnRIZWlnaHR9YCk7XG4gICAgICAgICAgICAgICAgY2xvbmVDYWxlbmRhck92ZXJsYXkuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudGApO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNsb25lTGlua3NPdmVybGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lTGlua3NPdmVybGF5LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgYCR7cHJpbnRIZWlnaHR9YCk7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lTGlua3NPdmVybGF5LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgaGVpZ2h0OiAke3ByaW50SGVpZ2h0fXB4YCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2V0SW5saW5lU3R5bGVzIGZvciBzdmdcbiAgICAgICAgICAgICAgICB0aGlzLnNldElubGluZVN0eWxlcyhjbG9uZUdhbnR0RG9tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFVcmwgPSBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbiAgICAgICAgICAgIGxpbmsuZG93bmxvYWQgPSBgJHtuYW1lfS5wbmdgO1xuICAgICAgICAgICAgbGluay5ocmVmID0gZGF0YVVybDtcbiAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19