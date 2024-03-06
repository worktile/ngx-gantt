import { ModifierKeys } from '@angular/cdk/testing';

// function createMouseEvent(type: string, clientX = 0, clientY = 0, button = 0, modifiers: ModifierKeys = {}, relatedTarget?: Element) {
//     const event = document.createEvent('MouseEvent');
//     const originalPreventDefault = event.preventDefault.bind(event);

//     // Note: We cannot determine the position of the mouse event based on the screen
//     // because the dimensions and position of the browser window are not available
//     // To provide reasonable `screenX` and `screenY` coordinates, we simply use the
//     // client coordinates as if the browser is opened in fullscreen.
//     const screenX = clientX;
//     const screenY = clientY;

//     event.initMouseEvent(
//         type,
//         /* canBubble */ true,
//         /* cancelable */ true,
//         /* view */ window,
//         /* detail */ 1,
//         /* screenX */ screenX,
//         /* screenY */ screenY,
//         /* clientX */ clientX,
//         /* clientY */ clientY,
//         /* ctrlKey */ !!modifiers.control,
//         /* altKey */ !!modifiers.alt,
//         /* shiftKey */ !!modifiers.shift,
//         /* metaKey */ !!modifiers.meta,
//         /* button */ button,
//         /* relatedTarget */ relatedTarget
//     );

//     // `initMouseEvent` doesn't allow us to pass the `buttons` and
//     // defaults it to 0 which looks like a fake event.
//     defineReadonlyEventProperty(event, 'buttons', 1);

//     // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
//     event.preventDefault = function () {
//         defineReadonlyEventProperty(event, 'defaultPrevented', true);
//         return originalPreventDefault();
//     };

//     return event;
// }

function createMouseEvent(
    type: string,
    clientX = 0,
    clientY = 0,
    button = 0,
    buttons = 1,
    detail = 1,
    modifiers: ModifierKeys = {},
    relatedTarget?: Element
) {
    // Note: We cannot determine the position of the mouse event based on the screen
    // because the dimensions and position of the browser window are not available
    // To provide reasonable `screenX` and `screenY` coordinates, we simply use the
    // client coordinates as if the browser is opened in fullscreen.
    const screenX = clientX;
    const screenY = clientY;

    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        screenX,
        screenY,
        clientX,
        clientY,
        button,
        buttons,
        detail,
        relatedTarget,
        ctrlKey: !!modifiers.control,
        altKey: !!modifiers.alt,
        shiftKey: !!modifiers.shift,
        metaKey: !!modifiers.meta
    });

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    const originalPreventDefault = event.preventDefault.bind(event);
    event.preventDefault = function () {
        defineReadonlyEventProperty(event, 'defaultPrevented', true);
        return originalPreventDefault();
    };

    return event;
}

function defineReadonlyEventProperty(event: Event, propertyName: string, value: any) {
    Object.defineProperty(event, propertyName, { get: () => value, configurable: true });
}

export function dispatchEvent<T extends Event>(node: Node | Window, event: T): T {
    node.dispatchEvent(event);
    return event;
}

export function dispatchMouseEvent(
    node: Node,
    type: string,
    clientX = 0,
    clientY = 0,
    button?: number,
    buttons?: number,
    detail?: number,
    modifiers?: ModifierKeys,
    relatedTarget?: Element
): MouseEvent {
    return dispatchEvent(node, createMouseEvent(type, clientX, clientY, button, buttons, detail, modifiers, relatedTarget));
}
