import sort from '../../../../src/helpers/transforms/sort';

const initSeries = [
    {data: [{x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 4}]},
    {data: [{x: 0, y: 2}, {x: 1, y: 3}, {x: 2, y: 4}, {x: 3, y: 1}]},
    {data: [{x: 0, y: 4}, {x: 1, y: 3}, {x: 2, y: 2}, {x: 3, y: 1}]}
];

describe('Transform sort', () => {

    it('should sort by y values', () => {
        const {series} = sort({series: initSeries});
        expect(series[1].data).toEqual([
            {realX: 0, y: 2, x: 1},
            {realX: 1, y: 3, x: 2},
            {realX: 2, y: 4, x: 3},
            {realX: 3, y: 1, x: 0}
        ]);
    });

    it('should support descending direction', () => {
        const {series} = sort({series: initSeries}, {direction: 'desc'});
        expect(series[1].data).toEqual([
            {realX: 0, y: 2, x: 2},
            {realX: 1, y: 3, x: 1},
            {realX: 2, y: 4, x: 0},
            {realX: 3, y: 1, x: 3}
        ]);
    });

    it('should ignore wrong direction', () => {
        const {series} = sort({series: initSeries}, {direction: 123});
        expect(series[1].data).toEqual([
            {realX: 0, y: 2, x: 1},
            {realX: 1, y: 3, x: 2},
            {realX: 2, y: 4, x: 3},
            {realX: 3, y: 1, x: 0}
        ]);
    });

});
