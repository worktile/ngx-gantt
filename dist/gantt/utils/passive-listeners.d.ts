/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export declare function supportsPassiveEventListeners(): boolean;
/**
 * Normalizes an `AddEventListener` object to something that can be passed
 * to `addEventListener` on any browser, no matter whether it supports the
 * `options` parameter.
 */
export declare function normalizePassiveListenerOptions(options: AddEventListenerOptions): AddEventListenerOptions | boolean;
/** Options used to bind passive event listeners. */
export declare const passiveListenerOptions: AddEventListenerOptions;
