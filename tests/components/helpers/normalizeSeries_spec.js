import normalizeSeries from '../../../src/helpers/normalizeSeries';
import generateRandomSeries from '../../helpers/generateRandomSeries';

const seriesObject = generateRandomSeries(3, 5, {type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

describe('Helper normalizeSeries', () => {

    it('should be a function', () => {
        expect(normalizeSeries).toEqual(jasmine.any(Function));
    });

    it('should normalize number-based series data', () => {
        const {
            series, minX, minY, maxX, maxY, seriesNormalized
        } = normalizeSeries({series: seriesNumber});
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
        } = normalizeSeries({series: seriesArray});
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
        } = normalizeSeries({series: seriesObject});
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

    it('should detect axis limits', () => {
        const {
            series, minX, minY, maxX, maxY, seriesNormalized
        } =
            normalizeSeries({
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

    it('should handle empty series', () => {
        const {series} = normalizeSeries({series: []});
        expect(series).toEqual(undefined);
    });

    it('should handle broken series', () => {
        const {series} = normalizeSeries({series: [{data: [null, undefined]}]});
        expect(series[0].data).toEqual([{x: 0}, {x: 1}]);
    });

    it('should normalize object-based series data with missed x values', () => {
        const {series} = normalizeSeries({series: [{data: [{y: 2}, {y: 3}, {y: 5}]}]});
        expect(series.length).toEqual(1);
        expect(series[0].data.length).toEqual(3);
        expect(series[0].data[0]).toEqual({x: 0, y: 2});
        expect(series[0].data[1]).toEqual({x: 1, y: 3});
        expect(series[0].data[2]).toEqual({x: 2, y: 5});
    });

    it('should pass series as is in case of normalized series', () => {
        const {series, seriesNormalized, minX, minY, maxX, maxY} = normalizeSeries({
            series: seriesObject,
            seriesNormalized: true
        });
        expect(series[1]).toEqual(seriesObject[1]);
        expect(minX).toEqual(0);
        expect(maxX).toEqual(4);
        expect(minY).not.toBeLessThan(0);
        expect(maxY).not.toBeGreaterThan(100);
        expect(seriesNormalized).toEqual(true);
    });

});
