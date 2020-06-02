export function isNumber(value: any) {
    return typeof value === 'number';
}

export function hexToRgb(color: string, opacity = 1) {
    if (/^#/g.test(color)) {
        return `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${opacity})`;
    } else {
        return null;
    }
}
