import {mount} from 'enzyme';

import Pies from '../../src/Pies';
import Chart from '../../src/Chart';

import graphicsComponent from '../helpers/graphicsComponent';

const series = [{
    data: [1]
}, {
    data: [2]
}];

describe('Pies', () => {

    // TODO:
    // tests for:
    // - cornerRadius, innerPadding, groupPadding,
    // - combined, startAngle, endAngle, padAngle,
    // - gradientStep

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
            <Pies position='bottom right' className='pies'/>
        </Chart>);
        const pies = wrapper.find('g.pies');
        expect(pies.prop('transform')).toEqual('translate(150 50)');
    });

    it('should support an inner radius prop in pixels', () => {
        const size = 100;
        const innerRadius = 20;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' innerRadius={innerRadius}/>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[d.length - 1]).toEqual((size / 4 + innerRadius / 2) + 'Z');
    });

    it('should support an inner radius prop in percents', () => {
        const size = 100;
        const innerRadius = 0.25;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' innerRadius={innerRadius}/>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        expect(d[d.length - 1]).toEqual((size / 4 + (size / 2 * innerRadius) / 2) + 'Z');
    });

    it('should support a pie width prop in pixels', () => {
        const size = 100;
        const pieWidth = 15;
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' pieWidth={pieWidth}/>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        const width = size / 4 + pieWidth;
        expect(d[1]).toEqual(width + 'A' + width);
    });

    it('should support a pie width prop in percents', () => {
        const size = 100;
        const pieWidth = '40%';
        const wrapper = mount(<Chart width={size} height={size} series={series}>
            <Pies className='pies' pieWidth={pieWidth}/>
        </Chart>);
        const d = wrapper.find('g.pies-series-0 > g.pies-pie-0 > path').first().prop('d').split(',');
        const width = size / 4 + size / 2 * parseFloat(pieWidth) / 100;
        expect(d[1]).toEqual(width + 'A' + width);
    });

});
