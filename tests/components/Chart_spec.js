import {shallow, mount} from 'enzyme';
import Chart from '../../src/Chart';
import Lines from '../../src/Lines';
import Transform from '../../src/Transform';
import generateRandomSeries from '../helpers/generateRandomSeries';

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
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            tag='g'
            series={series1} className='chart'>
            <Transform method='rotate'>
                <Lines />
            </Transform>
        </Chart>);
        const g = wrapper.find('g.chart');
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

    it('should support viewBox attribute', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            viewBox='50 50 500 500'
            scaleX={{direction: -1}}
            series={seriesArray}>
            <Lines />
        </Chart>);
        const svg = wrapper.find('svg');
        expect(svg.prop('viewBox')).toEqual('50 50 500 500');
        expect(svg.prop('width')).toEqual(chartWidth);
        expect(svg.prop('height')).toEqual(chartHeight);
    });

    it('should generate viewBox attribute automatically', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={seriesArray}>
            <Graphics />
        </Chart>);
        expect(wrapper.find('svg').prop('viewBox')).toEqual(`0 0 ${chartWidth} ${chartHeight}`);
    });

    it('should extract width and height from viewBox', () => {
        const wrapper = mount(<Chart
            viewBox='50 50 500 500'
            series={seriesArray}>
            <Graphics />
        </Chart>);
        const graphics = wrapper.find('Graphics');
        expect(graphics.prop('layerWidth')).toEqual(500);
        expect(graphics.prop('layerHeight')).toEqual(500);
    });

    it('should support layerWidth and layerHeight props', () => {
        const wrapper = mount(<Chart
            viewBox='50 50 500 500'
            layerWidth={chartWidth}
            layerHeight={chartHeight}
            series={seriesArray}>
            <Graphics />
        </Chart>);
        const svg = wrapper.find('svg');
        expect(svg.prop('viewBox')).toEqual('50 50 500 500');
        expect(svg.prop('width')).toEqual(undefined);
        expect(svg.prop('height')).toEqual(undefined);
        const graphics = wrapper.find('Graphics');
        expect(graphics.prop('layerWidth')).toEqual(chartWidth);
        expect(graphics.prop('layerHeight')).toEqual(chartHeight);
    });

});
