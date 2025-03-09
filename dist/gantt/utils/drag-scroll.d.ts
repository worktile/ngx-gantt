/** Horizontal direction in which we can auto-scroll. */
export declare const enum AutoScrollHorizontalDirection {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2
}
/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
export declare function getHorizontalScrollDirection(clientRect: DOMRect, pointerX: number): AutoScrollHorizontalDirection;
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
export declare function isPointerNearClientRect(rect: DOMRect, threshold: number, pointerX: number, pointerY: number): boolean;
/**
 * Gets the speed rate of auto scrolling
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 * @param horizontalScrollDirection The direction in which the mouse is dragged horizontally
 */
export declare function getAutoScrollSpeedRates(clientRect: DOMRect, pointerX: number, horizontalScrollDirection: AutoScrollHorizontalDirection): number;
