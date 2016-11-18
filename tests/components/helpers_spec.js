'use strict';

const {mount}= require('enzyme');
const helpers = require('../../src/helpers');
const generateRandomSeries = require('../helpers/generateRandomSeries');

const seriesObject = generateRandomSeries(3, 5, {type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const Graphics = () => <g />;
Graphics.displayName = 'Graphics';

describe('helpers', () => {

    describe('normalizeSeries', () => {

        it('should be a function', () => {
            expect(helpers.normalizeSeries).toEqual(jasmine.any(Function));
        });

        it('should normalize number-based series data', () => {
            const {
                series, minX, minY, maxX, maxY, seriesNormalized
            } = helpers.normalizeSeries({series: seriesNumber});
            expect(series.length).toEqual(3);
            expect(series[0].data.length).toEqual(5);
            expect(series[1].data[2].x).toEqual(2);
            expect(series[1].data[2].y).toEqual(seriesNumber[1].data[2]);
            expect(series[2].data[4].x).toEqual(4);
            expect(series[2].data[4].y).toEqual(seriesNumber[2].data[4]);
            expect(minX).toEqual(0);
            expect(maxX).toEqual(4);
            expect(minY).not.toBeLessThan(0);
            expect(maxY).not.toBeGreaterThan(100);
            expect(seriesNormalized).toEqual(true);
        });

        it('should normalize array-based series data', () => {
            const {
                series, minX, minY, maxX, maxY, seriesNormalized
            } = helpers.normalizeSeries({series: seriesArray});
            expect(series.length).toEqual(3);
            expect(series[0].data.length).toEqual(5);
            expect(series[1].data[2].x).toEqual(seriesArray[1].data[2][0]);
            expect(series[1].data[2].y).toEqual(seriesArray[1].data[2][1]);
            expect(series[2].data[4].x).toEqual(seriesArray[2].data[4][0]);
            expect(series[2].data[4].y).toEqual(seriesArray[2].data[4][1]);
            expect(minX).toEqual(0);
            expect(maxX).toEqual(4);
            expect(minY).not.toBeLessThan(0);
            expect(maxY).not.toBeGreaterThan(100);
            expect(seriesNormalized).toEqual(true);
        });

        it('should normalize object-based series data', () => {
            const {
                series, minX, minY, maxX, maxY, seriesNormalized
            } = helpers.normalizeSeries({series: seriesObject});
            expect(series.length).toEqual(3);
            expect(series[0].data.length).toEqual(5);
            expect(series[1].data[2]).toEqual(seriesObject[1].data[2]);
            expect(series[2].data[4]).toEqual(seriesObject[2].data[4]);
            expect(minX).toEqual(0);
            expect(maxX).toEqual(4);
            expect(minY).not.toBeLessThan(0);
            expect(maxY).not.toBeGreaterThan(100);
            expect(seriesNormalized).toEqual(true);
        });

        it('should support axis limits', () => {
            const {
                series, minX, minY, maxX, maxY, seriesNormalized
            } = helpers.normalizeSeries({
                series: seriesObject,
                minX: 1, maxX: 3, minY: 5, maxY: 50
            });
            expect(series.length).toEqual(3);
            expect(series[0].data.length).toEqual(5);
            expect(minX).toEqual(1);
            expect(maxX).toEqual(3);
            expect(minY).toEqual(5);
            expect(maxY).toEqual(50);
            expect(seriesNormalized).toEqual(true);
        });

    });

    describe('normalizeNumber', () => {

        it('should handle percents', () => {
            expect(helpers.normalizeNumber('56.5%', 1000)).toEqual(565);
            expect(helpers.normalizeNumber('45%', 100)).toEqual(45);
            expect(helpers.normalizeNumber(0.45, 100)).toEqual(45);
        });

        it('should support keywords', () => {
            expect(helpers.normalizeNumber('top', 100)).toEqual(0);
            expect(helpers.normalizeNumber('left', 100)).toEqual(0);

            expect(helpers.normalizeNumber('middle', 100)).toEqual(50);
            expect(helpers.normalizeNumber('center', 100)).toEqual(50);

            expect(helpers.normalizeNumber('bottom', 100)).toEqual(100);
            expect(helpers.normalizeNumber('right', 100)).toEqual(100);
        });

        it('should support simple number', () => {
            expect(helpers.normalizeNumber(56)).toEqual(56);
            expect(helpers.normalizeNumber('56')).toEqual(56);
        });

    });

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
