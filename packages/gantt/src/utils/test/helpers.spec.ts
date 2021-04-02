import { GanttItemInternal } from '../../class';
import { isNumber, isString, isUndefined, hexToRgb, uniqBy, flatten, recursiveItems } from '../helpers';

describe('helpers', () => {
    it('isNumber', () => {
        const result = isNumber('111');
        const result1 = isNumber(111);

        expect(result).toBe(false);
        expect(result1).toBe(true);
    });

    it('isString', () => {
        const result = isString('111');
        const result1 = isString(111);

        expect(result).toBe(true);
        expect(result1).toBe(false);
    });

    it('isUndefined', () => {
        const result = isUndefined('111');
        const result1 = isUndefined(undefined);

        expect(result).toBe(false);
        expect(result1).toBe(true);
    });

    it('hexToRgb', () => {
        const result = hexToRgb('#cccccc');
        const result1 = hexToRgb('rgba(255,255,255)');

        expect(result).toBe('rgba(204,204,204,1)');
        expect(result1).toBe('rgba(255,255,255)');
    });

    it('uniqBy', () => {
        const result = uniqBy([{ id: '3333' }, { id: '2222' }, { id: '3333' }], 'id');

        expect(result.length).toBe(2);
    });

    it('flatten', () => {
        const result = flatten([[{ id: '3333' }], [{ id: '2222' }], { id: '3333' }]);
        result.forEach((value) => {
            expect(value.length).toBe(undefined);
        });
    });

    it('recursiveItems', () => {
        const result = recursiveItems([
            {
                id: '3333',
                expanded: true,
                children: [
                    {
                        id: '3333-1'
                    }
                ]
            } as GanttItemInternal,
            {
                id: '2222',
                expanded: false,
                children: [
                    {
                        id: '2222-1'
                    }
                ]
            } as GanttItemInternal
        ]);
        expect(result.length).toBe(3);
    });
});
