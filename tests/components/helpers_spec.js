import {mount} from 'enzyme';
import helpers from '../../src/helpers';
import generateRandomSeries from '../helpers/generateRandomSeries';

const seriesObject = generateRandomSeries(3, 5, {type: 'object'});

const Graphics = () => <g />;
Graphics.displayName = 'Graphics';

describe('helpers', () => {

    describe('getCoords', () => {

        it('should get a position for a point', () => {
            expect(helpers.getCoords('top left', 1000, 1000)).toEqual({x: 0, y: 0});
            expect(helpers.getCoords('middle center', 1000, 1000)).toEqual({x: 500, y: 500});
            expect(helpers.getCoords('bottom right', 1000, 1000)).toEqual({x: 1000, y: 1000});
            expect(helpers.getCoords('right bottom', 1000, 1000)).toEqual({x: 1000, y: 1000});
            expect(helpers.getCoords('5% 25%', 1000, 1000)).toEqual({x: 50, y: 250});
            expect(helpers.getCoords(['5%', '25%'], 1000, 1000)).toEqual({x: 50, y: 250});
        });

        it('should get a position for a layer', () => {
            expect(helpers.getCoords('top left', 1000, 1000, 100, 100)).toEqual({x: 0, y: 0});
            expect(helpers.getCoords('middle center', 1000, 1000, 100, 100)).toEqual({x: 450, y: 450});
            expect(helpers.getCoords('bottom right', 1000, 1000, 100, 100)).toEqual({x: 900, y: 900});
            expect(helpers.getCoords('right bottom', 1000, 1000, 100, 100)).toEqual({x: 900, y: 900});
            expect(helpers.getCoords('5% 25%', 1000, 1000, 100, 100)).toEqual({x: 50, y: 250});
            expect(helpers.getCoords(['right', 'bottom'], 1000, 1000, 100, 100)).toEqual({x: 900, y: 900});
        });

    });

    it('proxyChildren', () => {
        const parentProps = {
            series: seriesObject,
            scaleX: {},
            scaleY: {}
        };
        const wrapper = mount(<g>
            {helpers.proxyChildren(<Graphics classname='chart'/>, parentProps, {
                layerWidth: 100,
                layerHeight: 100,
                scaleX: parentProps.scaleX,
                scaleY: parentProps.scaleY
            })}
        </g>);
        const {series, minX, minY, maxX, maxY} = wrapper.find(Graphics).props();
        expect(series.length).toEqual(3);
        expect(minX).toEqual(0);
        expect(maxX).toEqual(4);
        expect(minY).not.toBeLessThan(0);
        expect(maxY).not.toBeGreaterThan(100);
    });

    describe('transforms', () => {

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

        it('stack', () => {
            const {series, minY, maxY} = helpers.transforms.stack(helpers.normalizeSeries({
                series: initSeries
            }));
            expect(series).toEqual(stackedSeries);
            expect(minY).toEqual(0);
            expect(maxY).toEqual(9);
        });

        it('stack normalized', () => {
            const {series, minY, maxY} = helpers.transforms.stackNormalized(helpers.normalizeSeries({
                series: initSeries
            }));
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

        xit('unstack', () => {
            const {series, minY, maxY} = helpers.transforms.unstack({
                series: stackedSeries
            });
            expect(series).toEqual(helpers.normalizeSeries({
                series: initSeries
            }).series);
            expect(minY).toEqual(0);
            expect(maxY).toEqual(9);
        });


    });

});
