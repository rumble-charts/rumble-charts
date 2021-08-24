import React from 'react';
import {create} from 'react-test-renderer';
import {symbolStar} from 'd3-shape';

import {Chart} from './Chart';
import {Transform} from './Transform';
import {Dots} from './Dots';

import {graphicsComponent, testSelector} from './specs';
import {generateRandomSeries} from './helpers';

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
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='circle'
                circleRadius={10}
                circleAttributes={{fill: 'red'}}
            />
        </Chart>);
        const list = renderer.root.findAll(testSelector('.chart-circle'));
        expect(list.length).toEqual(15);
        expect(list[0].props.fill).toEqual('red');
        expect(list[0].props.r).toEqual(10);
    });

    it('should render ellipses', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='ellipse'
                ellipseRadiusX={10}
                ellipseRadiusY={2}
                ellipseAttributes={{fill: 'red'}}
            />
        </Chart>);
        const list = renderer.root.findAll(testSelector('.chart-ellipse'));
        expect(list.length).toEqual(15);
        expect(list[0].props.fill).toEqual('red');
        expect(list[0].props.rx).toEqual(10);
        expect(list[0].props.ry).toEqual(2);
    });

    it('should have default size for ellipses', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots className='chart' dotType='ellipse' />
        </Chart>);
        const list = renderer.root.findAll(testSelector('.chart-ellipse'));
        expect(list.length).toEqual(15);
        expect(list[0].props.rx).toEqual(6);
        expect(list[0].props.ry).toEqual(4);
    });

    it('should render symbols', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='symbol'
                symbolType='cross'
                symbolAttributes={{fill: 'red'}}
            />
        </Chart>);
        const list = renderer.root.findAll(testSelector('path.chart-symbol'));
        expect(list.length).toEqual(15);
        expect(list[0].props.fill).toEqual('red');
    });

    it('should render custom symbols', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='symbol'
                symbolType={symbolStar}
                symbolAttributes={{fill: 'red'}}
            />
        </Chart>);
        const list = renderer.root.findAll(testSelector('path.chart-symbol'));
        expect(list.length).toEqual(15);
        expect(list[0].props.fill).toEqual('red');
    });

    it('should render labels', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='label'
                label={() => 'formatted value'}
                labelAttributes={{fill: 'red'}}
            />
        </Chart>);
        const list = renderer.root.findAll(testSelector('text.chart-label'));
        expect(list.length).toEqual(15);
        expect(list[0].props.fill).toEqual('red');
        expect(list[0].children[0]).toEqual('formatted value');
    });

    it('should render paths', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType='path'
                path='M10'
                pathAttributes={{fill: 'red'}}
            />
        </Chart>);
        const list = renderer.root.findAll(testSelector('path.chart-path'));
        expect(list.length).toEqual(15);
        expect(list[0].props.fill).toEqual('red');
        expect(list[0].props.d).toEqual('M10');
    });

    it('should render multiple types', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotType={['dot', 'label']}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('.chart-dot')).length).toEqual(15);
        expect(renderer.root.findAll(testSelector('.chart-label')).length).toEqual(15);
    });

    it('should ignore incorrect dot types', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                // @ts-ignore
                dotType={() => 123}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('.chart-dot'))[0].children.length).toEqual(0);
    });

    it('should your own render method', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Dots
                className='chart'
                dotRender={() => <path className='chart-own' fill='red' d='M10' />}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.chart-own')).length).toEqual(15);
    });

    it('should support transform rotate', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Transform method='rotate'>
                <Dots className='chart' />
            </Transform>
        </Chart>);
        expect(renderer.root.findAll(testSelector('.chart-circle')).length).toEqual(15);
    });

});
