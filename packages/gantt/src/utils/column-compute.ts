import { sideWidth, sideMiddleWidth, sideMaxWidth } from '../gantt.styles';

class ColumnWidthConfig {
    width: number;
    primaryWidth: number;
    secondaryWidth?: number;
}

const computeStrategiesMap = new Map<(c: number) => boolean, ColumnWidthConfig>([
    [
        (count: number) => count === 1,
        {
            width: sideWidth,
            primaryWidth: 1
        }
    ],
    [
        (count: number) => count === 2,
        {
            width: sideWidth,
            primaryWidth: 0.6
        }
    ],
    [
        (count: number) => count === 3,
        {
            width: sideMiddleWidth,
            primaryWidth: 0.5
        }
    ],
    [
        (count: number) => count > 3,
        {
            width: sideMaxWidth,
            primaryWidth: 0.5
        }
    ]
]);

export function getColumnWidthConfig(count: number, width?: number): ColumnWidthConfig {
    let config = null;
    computeStrategiesMap.forEach((value, condition) => {
        if (condition(count)) {
            config = value;
            return false;
        }
    });
    const configWidth = width || config.width;
    const primaryWidth = configWidth * config.primaryWidth;
    const secondaryWidth = (configWidth - primaryWidth) / (count - 1);
    return {
        width: configWidth,
        primaryWidth,
        secondaryWidth
    };
}
