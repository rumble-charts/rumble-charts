import React from 'react';
import {create} from 'react-test-renderer';
import {arc as d3Arc} from 'd3-shape';
import {scaleLinear} from 'd3-scale';

import {Pies} from './Pies';
import {Chart} from './Chart';
import {Transform} from './Transform';

import {graphicsComponent, testSelector} from './specs';

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
        const renderer = create(<Chart width={200} height={100} series={series}>
            <Pies position='bottom right' className='pies' />
        </Chart>);
        const pies = renderer.root.find(testSelector('g.pies'));
        expect(pies.props.transform).toEqual('translate(150 50)');
    });

    it('should support an inner radius prop in pixels', () => {
        const size = 100;
        const innerRadius = 20;
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Pies className='pies' innerRadius={innerRadius} />
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        expect(d[d.length - 1]).toEqual('-' + (size / 4 + innerRadius / 2) + 'Z');
    });

    it('should support an inner radius prop in percents', () => {
        const size = 100;
        const innerRadius = '25%';
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Pies className='pies' innerRadius={innerRadius} />
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        expect(d[d.length - 1]).toEqual('-' + (size / 4 + (size / 2 * 0.25) / 2) + 'Z');
    });

    it('should support a pie width prop in pixels', () => {
        const size = 100;
        const pieWidth = 15;
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Pies className='pies' pieWidth={pieWidth} />
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        const width = size / 4 + pieWidth;
        expect(d[1]).toEqual('-' + width + 'A' + width);
    });

    it('should support a pie width prop in percents', () => {
        const size = 100;
        const pieWidth = '40%';
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Pies className='pies' pieWidth={pieWidth} />
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        const width = size / 4 + size / 2 * parseFloat(pieWidth) / 100;
        expect(d[1]).toEqual('-' + width + 'A' + width);
    });

    it('should support a corner radius prop in pixels', () => {
        const size = 100;
        const cornerRadius = 9;
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} cornerRadius={cornerRadius} />
            </Transform>
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        expect(d[2]).toEqual(cornerRadius + '');
    });

    it('should support a corner radius prop in percents', () => {
        const size = 100;
        const cornerRadius = '25%';
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} cornerRadius={cornerRadius} />
            </Transform>
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        expect(d[2]).toEqual(parseFloat(cornerRadius) / 100 * size / 2 + '');
    });

    it('should support a corner radius prop as function', () => {
        const size = 100;
        const cornerRadius = () => '35%';
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} cornerRadius={cornerRadius} />
            </Transform>
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d.split(',');
        expect(d[2]).toEqual(0.35 * size / 2 + '');
    });

    it('should render proper svg shape', () => {
        const size = 100;
        const pieWidth = 40;
        const cornerRadius = 9;
        const startAngle = 0.5;
        const endAngle = Math.PI * 2 - 0.5;

        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies
                    className='pies' combined={true}
                    pieWidth={pieWidth} cornerRadius={cornerRadius}
                    startAngle={startAngle} endAngle={endAngle}
                />
            </Transform>
        </Chart>);
        const d = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.d;

        const innerRadius = size * 0.25 - pieWidth * 0.5;
        const outerRadius = size * 0.25 + pieWidth * 0.5;

        const arc = d3Arc()
            .cornerRadius(cornerRadius)
            .padRadius(10)
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const circularScale = scaleLinear()
            .range([startAngle, endAngle])
            .domain([0, 3]);

        const angles = {
            startAngle: circularScale(0),
            endAngle: circularScale(1),
            innerRadius: innerRadius,
            outerRadius: outerRadius,
        };
        expect(d).toEqual(arc(angles));
    });

    it('should support radial gradients', () => {
        const size = 100;
        const gradientStep = 0.05;
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies
                    className='pies' combined={true}
                    colors={[['#ff00ff', '#ffffff']]} gradientStep={gradientStep}
                />
            </Transform>
        </Chart>);
        const length = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))
            .length;
        expect(length).toBeGreaterThanOrEqual(Math.PI * 2 / 3 / gradientStep);
    });

    it('should optimize gradients', () => {
        const size = 100;
        const gradientStep = 0.05;
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies
                    className='pies' combined={true}
                    colors={[['#ff00ff', '#ff00ff']]} gradientStep={gradientStep}
                />
            </Transform>
        </Chart>);
        const length = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))
            .length;
        expect(length).toBeGreaterThanOrEqual(1);
    });

    it('should support overlaps (>100%)', () => {
        const size = 100;
        const renderer = create(<Chart width={size} height={size} series={series}>
            <Transform method='stack'>
                <Pies className='pies' maxY={0.25} />
            </Transform>
        </Chart>);
        const length = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))
            .length;
        expect(length).toEqual(1);
    });

    it('should support opposite directions for scales', () => {
        const renderer = create(<Chart
            width={100} height={100} series={series}
            scaleX={{direction: -1}} scaleY={{direction: -1}}>
            <Transform method='stack'>
                <Pies className='pies' combined={true} colors={['#ff00ff', '#ff0000']} />
            </Transform>
        </Chart>);
        const color = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.fill;
        expect(color).toEqual('#ff00ff');
    });

    it('should support wrong scaleX direction and position properties', () => {
        const renderer = create(<Chart
            width={100} height={100} series={series} scaleX={{direction: 0}}>
            <Transform method='stack'>
                <Pies className='pies' position='' combined={true} colors={['#ff00ff', '#ff0000']} />
            </Transform>
        </Chart>);
        const color = renderer.root
            .find(testSelector('g.pies-series-0'))
            .find(testSelector('g.pies-pie-0'))
            .findAll(testSelector('path'))[0]
            .props.fill;
        expect(color).toEqual('#ff00ff');
    });

});
