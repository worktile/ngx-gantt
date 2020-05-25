export const primaryDatePointTop = 18;

export const secondaryDatePointTop = 38;

export const defaultOptions = {
    sideWidth: 200,
    barHeight: 25,
    barPadding: 20,
    groupPadding: 20,
    useDefaultDate: true,
};

export type GanttOptions = Partial<typeof defaultOptions>;

export function getCellHeight(options: GanttOptions) {
    return options.barHeight + options.barPadding * 2;
}

export function getGroupHeight(rows: number, options: GanttOptions) {
    return Math.max(rows, 1) * getCellHeight(options) + options.groupPadding * 2;
}
