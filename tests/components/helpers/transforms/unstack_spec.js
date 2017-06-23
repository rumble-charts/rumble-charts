import unstack from '../../../../src/helpers/transforms/unstack';
import stack from '../../../../src/helpers/transforms/stack';

import generateRandomSeries from '../../../helpers/generateRandomSeries';

const seriesObject = generateRandomSeries(10, 5, {type: 'object'});

describe('Transform unstack', () => {

    it('should unstack series data', () => {
        const {series} = unstack(stack({series: seriesObject}));
        expect(series).toEqual(seriesObject);
    });


});
