import {scaleOrdinal, schemeCategory10, schemeCategory20} from 'd3-scale';
import _ from 'lodash';

import colorFunc from '../../../src/helpers/colorFunc';

describe('Helper colorFunc', () => {

    it('should return function as is', () => {
        const colors = () => '#333';
        expect(colorFunc(colors)).toEqual(colors);
    });

    it('should return a default palette in case of empty value', () => {
        const defaultPalette = scaleOrdinal(schemeCategory20);
        const palette = colorFunc();
        _.forEach(_.range(0, 10), index => {
            expect(defaultPalette(index)).toEqual(palette(index));
        });
    });

    it('should return predefined palette from d3 in case of string value', () => {
        const defaultPalette = scaleOrdinal(schemeCategory10);
        const palette = colorFunc('category10');
        _.forEach(_.range(0, 10), index => {
            expect(defaultPalette(index)).toEqual(palette(index));
        });
    });

    it('should return a new palette in case of array of values', () => {
        const colors = ['#111', '#222', '#333'];
        const palette = colorFunc(colors);
        _.forEach(_.range(0, 10), index => {
            expect(palette(index)).toEqual(colors[index % 3]);
        });
    });
});
