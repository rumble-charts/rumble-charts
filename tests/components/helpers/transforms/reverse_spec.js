import reverse from '../../../../src/helpers/transforms/reverse';

describe('Transform reverse', () => {

    it('should reverse series order', () => {
        const initSeries = [
            {data: [1, 2, 3, 4]},
            {data: [2, 3, 4, 1]},
            {data: [4, 3, 2, 1]}
        ];

        const {series} = reverse({series: initSeries});
        expect(series[0]).toEqual(initSeries[2]);
        expect(series[1]).toEqual(initSeries[1]);
        expect(series[2]).toEqual(initSeries[0]);
    });

    it('should ignore wrong series', () => {
        const {series} = reverse({series: {hello: 'world'}});
        expect(series).toEqual({hello: 'world'});
    });

});
