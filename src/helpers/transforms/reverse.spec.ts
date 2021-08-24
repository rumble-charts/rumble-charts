import {reverse} from './reverse';
import {normalizeSeries} from '../normalizeSeries';

describe('Transform reverse', () => {

    it('should reverse series order', () => {
        const initSeries = [
            {data: [1, 2, 3, 4]},
            {data: [2, 3, 4, 1]},
            {data: [4, 3, 2, 1]}
        ];
        const props = normalizeSeries({series: initSeries});

        const {series = []} = reverse(props);
        expect(series[0]).toEqual(props.series?.[2]);
        expect(series[1]).toEqual(props.series?.[1]);
        expect(series[2]).toEqual(props.series?.[0]);
    });

    it('should ignore wrong series', () => {
        // @ts-ignore
        const {series} = reverse({series: {hello: 'world'}});
        expect(series).toEqual({hello: 'world'});
    });

});
