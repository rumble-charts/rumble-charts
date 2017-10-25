import {mount} from 'enzyme';

import Pies from '../../src/Pies';
import Chart from '../../src/Chart';
import Transform from '../../src/Transform';
import {arc as d3Arc} from 'd3-shape';
import {scaleLinear} from 'd3-scale';

import graphicsComponent from '../helpers/graphicsComponent';

const series = [{
    data: [1]
}, {
    data: [2]
}];

describe('Pies', () => {

    graphicsComponent(Pies, {
        pointGroupClassName: 'pie',
        pointStyling: true,
        defaultProps: {
            colors: 'category20',
            seriesVisible: true,
            pieVisible: true,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            padAngle: 0,
            innerRadius: 0,
            cornerRadius: 0,
            groupPadding: 0,
            innerPadding: 0,
            position: 'center middle',
            gradientStep: 0.01
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            pieVisible: ['path']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            pieAttributes: ['path']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            pieStyle: ['path'],
            groupStyle: ['g', 'pie']
        }

    });

    it('should support positioning', () => {
        const wrapper = mount(<Chart width={200} height={100} series={series}>
            <Pies position='bottom right' className='pies' />
        </Chart>);
        const pies = wrapper.find('g.pies');
        expect(pies.prop('transform')).toEqual('translate(150 50)');
    });

    it('should support an inner radius prop in pixels', () => {
        const size = 100;
        const innerRadius = 20;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' innerRadius={innerRadius} />
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[d.length - 1]).toEqual('-' + (size / 4 + innerRadius / 2) + 'Z');
    });

    it('should support an inner radius prop in percents', () => {
        const size = 100;
        const innerRadius = 0.25;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' innerRadius={innerRadius} />
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[d.length - 1]).toEqual('-' + (size / 4 + (size / 2 * innerRadius) / 2) + 'Z');
    });

    it('should support a pie width prop in pixels', () => {
        const size = 100;
        const pieWidth = 15;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' pieWidth={pieWidth} />
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        const width = size / 4 + pieWidth;
        expect(d[1]).toEqual('-' + width + 'A' + width);
    });

    it('should support a pie width prop in percents', () => {
        const size = 100;
        const pieWidth = '40%';
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' pieWidth={pieWidth} />
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        const width = size / 4 + size / 2 * parseFloat(pieWidth) / 100;
        expect(d[1]).toEqual('-' + width + 'A' + width);
    });

    it('should support a corner radius prop in pixels', () => {
        const size = 100;
        const cornerRadius = 9;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} cornerRadius={cornerRadius} />
            </Transform>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[2]).toEqual(cornerRadius + '');
    });

    it('should support a corner radius prop in percents', () => {
        const size = 100;
        const cornerRadius = '25%';
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} cornerRadius={cornerRadius} />
            </Transform>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[2]).toEqual(parseFloat(cornerRadius) / 100 * size / 2 + '');
    });

    it('should support a corner radius prop as function', () => {
        const size = 100;
        const cornerRadius = () => 0.35;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} cornerRadius={cornerRadius} />
            </Transform>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[2]).toEqual(cornerRadius() * size / 2 + '');
    });

    it('should render proper svg shape', () => {
        const size = 100;
        const pieWidth = 40;
        const cornerRadius = 9;
        const startAngle = 0.5;
        const endAngle = Math.PI * 2 - 0.5;

        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies
                    className='pies' combined={true}
                    pieWidth={pieWidth} cornerRadius={cornerRadius}
                    startAngle={startAngle} endAngle={endAngle}
                />
            </Transform>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d');

        const arc = d3Arc()
            .cornerRadius(cornerRadius)
            .padRadius(10)
            .innerRadius(size * 0.25 - pieWidth * 0.5)
            .outerRadius(size * 0.25 + pieWidth * 0.5);

        const circularScale = scaleLinear()
            .range([startAngle, endAngle])
            .domain([0, 3]);

        const angles = {
            startAngle: circularScale(0),
            endAngle: circularScale(1)
        };
        expect(d).toEqual(arc(angles));
    });

    it('should support radial gradients', () => {
        const size = 100;
        const gradientStep = 0.05;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies
                    className='pies' combined={true}
                    colors={[['#ff00ff', '#ffffff']]} gradientStep={gradientStep}
                />
            </Transform>
        </Chart>);
        const length = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').length;
        expect(length).toBeGreaterThanOrEqual(Math.PI * 2 / 3 / gradientStep);
    });

    it('should optimize gradients', () => {
        const size = 100;
        const gradientStep = 0.05;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies
                    className='pies' combined={true}
                    colors={[['#ff00ff', '#ff00ff']]} gradientStep={gradientStep}
                />
            </Transform>
        </Chart>);
        const length = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').length;
        expect(length).toBeGreaterThanOrEqual(1);
    });

    it('should support overlaps (>100%)', () => {
        const size = 100;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' maxY={0.25} />
            </Transform>
        </Chart>);
        const length = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').length;
        expect(length).toEqual(1);
    });

    it('should support opposite directions for scales', () => {
        const wrapper = mount(<Chart
            width={100} height={100} series={series}
            scaleX={{direction: -1}} scaleY={{direction: -1}}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} colors={['#ff00ff', '#ff0000']} />
            </Transform>
        </Chart>);
        const color = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').prop('fill');
        expect(color).toEqual('#ff00ff');
    });

    it('should support wrong scaleX direction and position properties', () => {
        const wrapper = mount(<Chart
            width={100} height={100} series={series} scaleX={{direction: 0}}>
            <Transform method='stack'>
                <Pies className='pies' position='' combined={true} colors={['#ff00ff', '#ff0000']} />
            </Transform>
        </Chart>);
        const color = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').prop('fill');
        expect(color).toEqual('#ff00ff');
    });


});
