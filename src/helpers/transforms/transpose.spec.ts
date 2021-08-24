import type {NormalizedSeries} from '../../types';

import {generateRandomSeries} from '../generateRandomSeries';
import {normalizeSeries} from '../normalizeSeries';

import {transpose} from './transpose';


const seriesObject = generateRandomSeries(10, 5, {type: 'object'}) as NormalizedSeries[];

describe('Transform transpose', () => {

    it('should transpose the matrix of points', () => {
        const {series, maxX} = transpose(normalizeSeries({series: seriesObject}));
        expect(series?.[3].data[0]).toEqual({
            realX: seriesObject[0].data[3].x,
            y: seriesObject[0].data[3].y,
            x: 0
        });
        expect(series?.[2].data[8]).toEqual({
            realX: seriesObject[8].data[2].x,
            y: seriesObject[8].data[2].y,
            x: 8
        });
        expect(maxX).toEqual(9);
    });

});
