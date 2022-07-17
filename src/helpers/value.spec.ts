import {value} from './value';

describe('Helper value', () => {

    it('should leave simple value as is', () => {
        expect(value(5)).toEqual(5);
        expect(value('string')).toEqual('string');
    });

    it('should support functions', () => {
        expect(value<number>(([a, b]: number[]) => a + b, [5, 3])).toEqual(8);
        expect(value<number>(({a, b}: Record<string, number>) => a * b, {a: 5, b: 3})).toEqual(15);
    });

    it('should support array of objects', () => {
        expect(value([{a: 2}, {b: 3}, {a: 5}])).toEqual({a: 2, b: 3});
        expect(value<Record<string, number>>([() => ({a: 2}), () => ({b: 3}), () => ({a: 5})])).toEqual({a: 2, b: 3});
        expect(value([undefined])).toEqual(undefined);
    });

    it('should support array of values', () => {
        expect(value([5, 4, 15])).toEqual(5);
        expect(value([() => 5, () => 4, () => 15])).toEqual(5);
        expect(value(['5', 4, 15])).toEqual('5');
        expect(value<string | number>([() => '5', () => 4, () => 15])).toEqual('5');
    });

});
