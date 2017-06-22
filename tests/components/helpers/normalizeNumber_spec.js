import normalizeNumber from '../../../src/helpers/normalizeNumber';

describe('Helper normalizeNumber', () => {

    it('should convert percents', () => {
        expect(normalizeNumber('50%', 1000)).toEqual(500);
        expect(normalizeNumber('56.5%', 1000)).toEqual(565);
        expect(normalizeNumber('-25%', 1000)).toEqual(-250);
        expect(normalizeNumber('0%', 1000)).toEqual(0);
        expect(normalizeNumber('15%')).toEqual(0);
        expect(normalizeNumber('-15%')).toEqual(-0);
    });

    it('should not convert integer numbers', () => {
        expect(normalizeNumber(456, 1000)).toEqual(456);
        expect(normalizeNumber(-456, 1000)).toEqual(-456);
        expect(normalizeNumber('456', 1000)).toEqual(456);
        expect(normalizeNumber('-456', 1000)).toEqual(-456);
        expect(normalizeNumber(0)).toEqual(0);
        expect(normalizeNumber('0')).toEqual(0);
        expect(normalizeNumber(456)).toEqual(456);
        expect(normalizeNumber(-456)).toEqual(-456);
        expect(normalizeNumber('456')).toEqual(456);
        expect(normalizeNumber('-456')).toEqual(-456);
    });

    it('should convert float numbers', () => {
        expect(normalizeNumber(0.55, 1000)).toEqual(550);
        expect(normalizeNumber(-0.55, 1000)).toEqual(-550);
        expect(normalizeNumber('0.55', 1000)).toEqual(550);
        expect(normalizeNumber('-0.55', 1000)).toEqual(-550);
        expect(normalizeNumber(0.55)).toEqual(0);
        expect(normalizeNumber(-0.55)).toEqual(-0);
        expect(normalizeNumber('0.55')).toEqual(0);
        expect(normalizeNumber('-0.55')).toEqual(-0);
    });

    it('should support keywords', () => {
        expect(normalizeNumber('top', 1000)).toEqual(0);
        expect(normalizeNumber('bottom', 1000)).toEqual(1000);
        expect(normalizeNumber('middle', 1000)).toEqual(500);
        expect(normalizeNumber('left', 1000)).toEqual(0);
        expect(normalizeNumber('right', 1000)).toEqual(1000);
        expect(normalizeNumber('center', 1000)).toEqual(500);

        expect(normalizeNumber('top')).toEqual(0);
        expect(normalizeNumber('bottom')).toEqual(0);
        expect(normalizeNumber('middle')).toEqual(0);
        expect(normalizeNumber('left')).toEqual(0);
        expect(normalizeNumber('right')).toEqual(0);
        expect(normalizeNumber('center')).toEqual(0);
    });

});
