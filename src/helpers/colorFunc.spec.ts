import {scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';

import {colorFunc, defaultScheme} from './colorFunc';
import {range} from './range';

describe('Helper colorFunc', () => {

    it('should return function as is', () => {
        const colors = () => '#333';
        expect(colorFunc(colors)).toEqual(colors);
    });

    it('should return a default palette in case of empty value', () => {
        const defaultPalette = scaleOrdinal(defaultScheme);
        const palette = colorFunc();
        range(10).forEach(index => {
            expect(defaultPalette(String(index))).toEqual(palette(index));
        });
    });

    it('should return predefined palette from d3 in case of string value', () => {
        const defaultPalette = scaleOrdinal(schemeCategory10);
        const palette = colorFunc('category10');
        range(10).forEach(index => {
            expect(defaultPalette(String(index))).toEqual(palette(index));
        });
    });

    it('should return a new palette in case of array of values', () => {
        const colors = ['#111', '#222', '#333'];
        const palette = colorFunc(colors);
        range(10).forEach(index => {
            expect(palette(index)).toEqual(colors[index % 3]);
        });
    });
});
