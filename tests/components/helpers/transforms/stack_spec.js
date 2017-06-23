import stack from '../../../../src/helpers/transforms/stack';
import normalizeSeries from '../../../../src/helpers/normalizeSeries';

const initSeries = [
    {data: [1, 2, 3, 4]},
    {data: [2, 3, 4, 1]},
    {data: [4, 3, 2, 1]}
];

const stackedSeries = [
    {data: [{x: 0, y0: 0, y: 1}, {x: 1, y0: 0, y: 2}, {x: 2, y0: 0, y: 3}, {x: 3, y0: 0, y: 4}]},
    {data: [{x: 0, y0: 1, y: 3}, {x: 1, y0: 2, y: 5}, {x: 2, y0: 3, y: 7}, {x: 3, y0: 4, y: 5}]},
    {data: [{x: 0, y0: 3, y: 7}, {x: 1, y0: 5, y: 8}, {x: 2, y0: 7, y: 9}, {x: 3, y0: 5, y: 6}]}
];

describe('Transform stack', () => {

    it('should transform series', () => {
        const {series, minY, maxY} = stack(normalizeSeries({
            series: initSeries
        }));
        expect(series).toEqual(stackedSeries);
        expect(minY).toEqual(0);
        expect(maxY).toEqual(9);
    });

    it('should support normalization', () => {
        const {series, minY, maxY} = stack(normalizeSeries({
            series: initSeries
        }), {normalize: true});

        expect(series).toEqual([
            {
                data: [
                    {x: 0, y0: 0, y: 1.2857142857142858},
                    {x: 1, y0: 0, y: 2.25},
                    {x: 2, y0: 0, y: 3},
                    {x: 3, y0: 0, y: 6}
                ]
            },
            {
                data: [
                    {x: 0, y0: 1.2857142857142858, y: 3.8571428571428577},
                    {x: 1, y0: 2.25, y: 5.625},
                    {x: 2, y0: 3, y: 7},
                    {x: 3, y0: 6, y: 7.5}
                ]
            },
            {
                data: [
                    {x: 0, y0: 3.8571428571428577, y: 9},
                    {x: 1, y0: 5.625, y: 9},
                    {x: 2, y0: 7, y: 9},
                    {x: 3, y0: 7.5, y: 9}
                ]
            }
        ]);
        expect(minY).toEqual(0);
        expect(maxY).toEqual(9);
    });
});
