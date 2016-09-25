'use strict';

const {shallow, mount} = require('enzyme');
const Chart = require('../../src/Chart');
const generateRandomSeries = require('../helpers/generateRandomSeries');

const series1 = generateRandomSeries(3, 5, {type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const chartWidth = 1000;
const chartHeight = 1000;

const Graphics = () => <span />;
Graphics.displayName = 'Graphics';

describe('Chart', () => {

    it('should render svg element and takes a series object', () => {
        const wrapper = shallow(<Chart
            width={chartWidth} height={chartHeight}
            series={series1} className='chart'>
            <Graphics />
        </Chart>);
        const svg = wrapper.find('svg');
        expect(svg.length).toEqual(1);
        expect(svg.prop('className')).toEqual('chart');
        const expectedSeries = wrapper.find('Graphics').prop('series');
        expect(expectedSeries).toEqual(series1);
    });

    it('should render any element', () => {
        const wrapper = shallow(<Chart
            width={chartWidth} height={chartHeight}
            tag='g'
            series={series1} className='chart'>
            <Graphics />
        </Chart>);
        const g = wrapper.find('g');
        expect(g.length).toEqual(1);
        expect(g.prop('className')).toEqual('chart');
    });

    it('should convert series points from numbers to objects', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={seriesNumber}>
            <Graphics />
        </Chart>);
        expect(wrapper.find('Graphics').prop('series')[0].data[0].y).toEqual(seriesNumber[0].data[0]);
    });

    it('should convert series points from arrays to objects', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={seriesArray}>
            <Graphics />
        </Chart>);
        expect(wrapper.find('Graphics').prop('series')[0].data[0].y).toEqual(seriesArray[0].data[0][1]);
    });

});
