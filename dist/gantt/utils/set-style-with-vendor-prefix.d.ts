interface SetStyleWithVendorPrefixOptions {
    element: HTMLElement;
    style: string;
    value: string;
}
/**
 * Note: we don't need to add vendor prefixes within `.scss` files since they're added automatically.
 * This function is necessary when the `element.style` is updated directly through the JavaScript.
 * This is not required to be used with CSS properties that don't require vendor prefixes (e.g. `opacity`).
 */
export declare function setStyleWithVendorPrefix({ element, style, value }: SetStyleWithVendorPrefixOptions): void;
export {};
