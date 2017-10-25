import {shallow} from 'enzyme';
import {symbolStar} from 'd3-shape';

import Chart from '../../src/Chart';
import Transform from '../../src/Transform';
import Dots from '../../src/Dots';

import graphicsComponent from '../helpers/graphicsComponent';
import generateRandomSeries from '../helpers/generateRandomSeries';

describe('Dots', () => {

    const series = generateRandomSeries(3, 5);
    const chartWidth = 1000;
    const chartHeight = 1000;

    graphicsComponent(Dots, {
        deepestTag: 'circle',
        pointGroupClassName: 'dot',
        pointStyling: true,
        defaultProps: {
            colors: 'category20',
            circleRadius: 4,
            ellipseRadiusX: 6,
            ellipseRadiusY: 4,
            seriesVisible: true,
            dotVisible: true
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            dotVisible: ['circle']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            dotAttributes: ['circle'],
            circleAttributes: ['circle']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            groupStyle: ['g', 'dot'],
            dotStyle: ['circle']
        }

    });

    it('should render circles', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='circle'
                circleRadius={10}
                circleAttributes={{fill: 'red'}}
            />
        </Chart>).render().find('.chart-circle');
        expect(wrapper.length).toEqual(15);
        const attribs = wrapper[0]['attribs'];
        expect(attribs.fill).toEqual('red');
        expect(attribs.r).toEqual('10');
    });

    it('should render ellipses', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='ellipse'
                ellipseRadiusX={10}
                ellipseRadiusY={2}
                ellipseAttributes={{fill: 'red'}}
            />
        </Chart>).render().find('.chart-ellipse');
        expect(wrapper.length).toEqual(15);
        const attribs = wrapper[0]['attribs'];
        expect(attribs.fill).toEqual('red');
        expect(attribs.rx).toEqual('10');
        expect(attribs.ry).toEqual('2');
    });

    it('should render ellipses', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='symbol'
                symbolType='cross'
                symbolAttributes={{fill: 'red'}}
            />
        </Chart>).render().find('path.chart-symbol');
        expect(wrapper.length).toEqual(15);
        const attribs = wrapper[0]['attribs'];
        expect(attribs.fill).toEqual('red');
    });

    it('should render custom symbols', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='symbol'
                symbolType={symbolStar}
                symbolAttributes={{fill: 'red'}}
            />
        </Chart>).render().find('path.chart-symbol');
        expect(wrapper.length).toEqual(15);
        const attribs = wrapper[0]['attribs'];
        expect(attribs.fill).toEqual('red');
    });

    it('should render labels', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='label'
                label={() => 'formatted value'}
                labelAttributes={{fill: 'red'}}
            />
        </Chart>).render().find('text.chart-label');
        expect(wrapper.length).toEqual(15);
        const attribs = wrapper[0]['attribs'];
        expect(attribs.fill).toEqual('red');
        expect(wrapper[0].children[0].data).toEqual('formatted value');
    });

    it('should render paths', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='path'
                path='M10'
                pathAttributes={{fill: 'red'}}
            />
        </Chart>).render().find('path.chart-path');
        expect(wrapper.length).toEqual(15);
        const attribs = wrapper[0]['attribs'];
        expect(attribs.fill).toEqual('red');
        expect(attribs.d).toEqual('M10');
    });

    it('should render multiple types', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType={['dot', 'label']}
            />
        </Chart>).render();
        expect(wrapper.find('.chart-dot').length).toEqual(15);
        expect(wrapper.find('.chart-label').length).toEqual(15);
    });

    it('should ignore incorrect dot types', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType={() => 123}
            />
        </Chart>).render();
        expect(wrapper.find('.chart-dot').get(0).children.length).toEqual(0);
    });

    it('should your own render method', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotRender={() => <path className='chart-own' fill='red' d='M10' />}
            />
        </Chart>).render();
        expect(wrapper.find('path.chart-own').length).toEqual(15);
    });

    it('should support transform rotate', () => {
        const wrapper = shallow(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Transform method='rotate'>
                <Dots className='chart' />
            </Transform>
        </Chart>).render();
        expect(wrapper.find('.chart-circle').length).toEqual(15);
    });

});
