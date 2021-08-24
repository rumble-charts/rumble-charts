import React from 'react';
import {create} from 'react-test-renderer';

import {Chart} from './Chart';
import {Lines} from './Lines';
import {Transform} from './Transform';
import {generateRandomSeries} from './helpers';
import {testSelector} from './specs';

const series1 = generateRandomSeries(3, 5, {type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const chartWidth = 1000;
const chartHeight = 1000;

const Graphics = (props: any) => <span {...props} />;

describe('Chart', () => {

    it('should render svg element and takes a series object', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={series1} className='chart'>
            <Graphics />
        </Chart>);
        const svg = renderer.root.findAll(testSelector('svg'));
        expect(svg.length).toEqual(1);
        expect(svg[0].props.className).toEqual('chart');
        const expectedSeries = renderer.root.findByType(Graphics).props.series;
        expect(expectedSeries).toEqual(series1);
    });

    it('should render any element', () => {
        const renderer = create(<svg>
            <Chart
                width={chartWidth} height={chartHeight}
                tag='g'
                series={series1} className='chart'>
                <Transform method='rotate'>
                    <Lines />
                </Transform>
            </Chart>
        </svg>);
        const g = renderer.root.findAll(testSelector('g.chart'));
        expect(g.length).toEqual(1);
        expect(g[0].props.className).toEqual('chart');
    });

    it('should convert series points from numbers to objects', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={seriesNumber}>
            <Graphics />
        </Chart>);
        expect(renderer.root.findByType(Graphics).props.series[0].data[0].y).toEqual(seriesNumber[0].data[0]);
    });

    it('should convert series points from arrays to objects', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={seriesArray}>
            <Graphics />
        </Chart>);
        expect(renderer.root.findByType(Graphics).props.series[0].data[0].y).toEqual(seriesArray[0].data[0][1]);
    });

    it('should support viewBox attribute', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            viewBox='50 50 500 500'
            scaleX={{direction: -1}}
            series={seriesArray}>
            <Lines />
        </Chart>);
        const svg = renderer.root.find(testSelector('svg'));
        expect(svg.props.viewBox).toEqual('50 50 500 500');
        expect(svg.props.width).toEqual(chartWidth);
        expect(svg.props.height).toEqual(chartHeight);
    });

    it('should generate viewBox attribute automatically', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={seriesArray}>
            <Graphics />
        </Chart>);
        expect(renderer.root.find(testSelector('svg')).props.viewBox).toEqual(`0 0 ${chartWidth} ${chartHeight}`);
    });

    it('should extract width and height from viewBox', () => {
        const renderer = create(<Chart
            viewBox='50 50 500 500'
            series={seriesArray}>
            <Graphics />
        </Chart>);
        const graphics = renderer.root.findByType(Graphics);
        expect(graphics.props.layerWidth).toEqual(500);
        expect(graphics.props.layerHeight).toEqual(500);
    });

    it('should support layerWidth and layerHeight props', () => {
        const renderer = create(<Chart
            viewBox='50 50 500 500'
            layerWidth={chartWidth}
            layerHeight={chartHeight}
            series={seriesArray}>
            <Graphics />
        </Chart>);
        const svg = renderer.root.find(testSelector('svg'));
        expect(svg.props.viewBox).toEqual('50 50 500 500');
        expect(svg.props.width).toEqual(undefined);
        expect(svg.props.height).toEqual(undefined);
        const graphics = renderer.root.findByType(Graphics);
        expect(graphics.props.layerWidth).toEqual(chartWidth);
        expect(graphics.props.layerHeight).toEqual(chartHeight);
    });

});
