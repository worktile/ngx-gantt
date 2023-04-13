/** Horizontal direction in which we can auto-scroll. */
export const enum AutoScrollHorizontalDirection {
    NONE,
    LEFT,
    RIGHT
}

/**
 * Proximity, as a ratio to width/height at which to start auto-scrolling the drop list or the
 * viewport. The value comes from trying it out manually until it feels right.
 */
const SCROLL_PROXIMITY_THRESHOLD = 0.05;

/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
export function getHorizontalScrollDirection(clientRect: DOMRect, pointerX: number) {
    const { left, right, width } = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;

    if (pointerX >= left - xThreshold && pointerX <= left + xThreshold) {
        return AutoScrollHorizontalDirection.LEFT;
    } else if (pointerX >= right - xThreshold && pointerX <= right + xThreshold) {
        return AutoScrollHorizontalDirection.RIGHT;
    }

    return AutoScrollHorizontalDirection.NONE;
}

/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
export function isPointerNearClientRect(rect: DOMRect, threshold: number, pointerX: number, pointerY: number): boolean {
    const { top, right, bottom, left, width, height } = rect;
    const xThreshold = width * threshold;
    const yThreshold = height * threshold;

    return pointerY > top - yThreshold && pointerY < bottom + yThreshold && pointerX > left - xThreshold && pointerX < right + xThreshold;
}

/**
 * Gets the speed rate of auto scrolling
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 * @param horizontalScrollDirection The direction in which the mouse is dragged horizontally
 */
export function getAutoScrollSpeedRates(clientRect: DOMRect, pointerX: number, horizontalScrollDirection: AutoScrollHorizontalDirection) {
    let autoScrollSpeedRates = 4;
    const speedLevels = 4;
    const { left, right, width } = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;

    if (horizontalScrollDirection === AutoScrollHorizontalDirection.LEFT) {
        autoScrollSpeedRates = Math.ceil((xThreshold - (pointerX > left ? pointerX - left : 0)) / (xThreshold / speedLevels));
    }
    if (horizontalScrollDirection === AutoScrollHorizontalDirection.RIGHT) {
        autoScrollSpeedRates = Math.ceil((xThreshold - (right > pointerX ? right - pointerX : 0)) / (xThreshold / speedLevels));
    }

    return autoScrollSpeedRates;
}
