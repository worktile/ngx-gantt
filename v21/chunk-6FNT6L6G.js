import {
  Component,
  GanttItemUpper,
  HostBinding,
  NgTemplateOutlet,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵstyleProp,
  ɵɵtemplate
} from "./chunk-EBMWQTJP.js";

// packages/gantt/src/components/range/range.component.ts
var _c0 = (a0, a1) => ({ item: a0, refs: a1 });
function NgxGanttRangeComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("width", ctx_r0.item().progress * 100, "%");
  }
}
function NgxGanttRangeComponent_Conditional_0_ng_template_4_Template(rf, ctx) {
}
function NgxGanttRangeComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275conditionalCreate(1, NgxGanttRangeComponent_Conditional_0_Conditional_1_Template, 1, 2, "div", 1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "div", 2)(3, "div", 3);
    \u0275\u0275template(4, NgxGanttRangeComponent_Conditional_0_ng_template_4_Template, 0, 0, "ng-template", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.item().progress >= 0 ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.template())("ngTemplateOutletContext", \u0275\u0275pureFunction2(3, _c0, ctx_r0.item().origin, ctx_r0.item().refs));
  }
}
var NgxGanttRangeComponent = class _NgxGanttRangeComponent extends GanttItemUpper {
  constructor() {
    super();
    this.ganttRangeClass = true;
  }
  static {
    this.\u0275fac = function NgxGanttRangeComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgxGanttRangeComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NgxGanttRangeComponent, selectors: [["ngx-gantt-range"], ["gantt-range"]], hostVars: 2, hostBindings: function NgxGanttRangeComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("gantt-range", ctx.ganttRangeClass);
      }
    }, features: [\u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: [[1, "gantt-range-main"], [1, "gantt-range-main-progress", 3, "width"], [1, "gantt-range-triangle", "left"], [1, "gantt-range-triangle", "right"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "gantt-range-main-progress"]], template: function NgxGanttRangeComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, NgxGanttRangeComponent_Conditional_0_Template, 5, 6);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.item().start && ctx.item().end ? 0 : -1);
      }
    }, dependencies: [NgTemplateOutlet], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxGanttRangeComponent, [{
    type: Component,
    args: [{ selector: "ngx-gantt-range,gantt-range", imports: [NgTemplateOutlet], template: '@if (item().start && item().end) {\n  <div class="gantt-range-main">\n    @if (item().progress >= 0) {\n      <div class="gantt-range-main-progress" [style.width.%]="item().progress * 100"></div>\n    }\n  </div>\n  <div class="gantt-range-triangle left"></div>\n  <div class="gantt-range-triangle right"></div>\n  <ng-template [ngTemplateOutlet]="template()" [ngTemplateOutletContext]="{ item: item().origin, refs: item().refs }"></ng-template>\n}\n' }]
  }], () => [], { ganttRangeClass: [{
    type: HostBinding,
    args: ["class.gantt-range"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NgxGanttRangeComponent, { className: "NgxGanttRangeComponent", filePath: "packages/gantt/src/components/range/range.component.ts", lineNumber: 10 });
})();

export {
  NgxGanttRangeComponent
};
//# sourceMappingURL=chunk-6FNT6L6G.js.map
