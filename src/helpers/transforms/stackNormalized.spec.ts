import {normalizeSeries} from '../normalizeSeries';
import {stackNormalized} from './stackNormalized';
import {stack} from './stack';

const series = [
    {data: [1, 2, 3, 4]},
    {data: [2, 3, 4, 1]},
    {data: [4, 3, 2, 1]}
];

describe('Transform stackNormalized', () => {

    it('should be just a shortcut for stack transform', () => {
        expect(stackNormalized(normalizeSeries({series}))).toEqual(stack(normalizeSeries({series}), {normalize: true}));
    });

});
