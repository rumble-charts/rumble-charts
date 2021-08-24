import {generateRandomSeries} from '../generateRandomSeries';
import {normalizeSeries} from '../normalizeSeries';

import {stack} from './stack';
import {unstack} from './unstack';

const seriesObject = generateRandomSeries(10, 5, {type: 'object'});

describe('Transform unstack', () => {

    it('should unstack series data', () => {
        const {series} = unstack(stack(normalizeSeries({series: seriesObject})));
        expect(series).toEqual(seriesObject);
    });

});
