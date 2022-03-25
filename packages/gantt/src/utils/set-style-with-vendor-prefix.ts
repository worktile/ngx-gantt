interface SetStyleWithVendorPrefixOptions {
    element: HTMLElement;
    // The name of the CSS property, e.g. `transform`.
    style: string;
    value: string;
}

const supports = (typeof window !== 'undefined' && !!window.CSS && CSS.supports) || (() => false);

/**
 * Note: we don't need to add vendor prefixes within `.scss` files since they're added automatically.
 * This function is necessary when the `element.style` is updated directly through the JavaScript.
 * This is not required to be used with CSS properties that don't require vendor prefixes (e.g. `opacity`).
 */
export function setStyleWithVendorPrefix({ element, style, value }: SetStyleWithVendorPrefixOptions): void {
    element.style[style] = value;

    if (supports(`-webkit-${style}: ${value}`)) {
        // Note: some browsers still require setting `-webkit` vendor prefix. E.g. Mozilla 49 has implemented
        // the 3D support for `transform`, but it requires setting `-webkit-` prefix.
        element.style[`-webkit-${style}`] = value;
    }
}
