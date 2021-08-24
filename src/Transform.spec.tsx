import type {NormalizedSeriesProps, TransformMethod} from './types';

import React from 'react';
import {create} from 'react-test-renderer';

import {Chart} from './Chart';
import {Transform} from './Transform';
import {generateRandomSeries, normalizeSeries, transform} from './helpers';

const series = generateRandomSeries(3, 5, {type: 'object'});

const chartWidth = 1000;
const chartHeight = 1000;

const Container = ({children}: NormalizedSeriesProps) => <g>{children}</g>;
const Graphics = () => <span />;

describe('Transform', () => {

    it('should render g element with className', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Transform className='transform' method='reverse'>
                <Graphics />
            </Transform>
        </Chart>);

        const elements = renderer.root.findAllByType('g');
        expect(elements.length).toEqual(1);
        expect(elements[0].type).toEqual('g');
    });

    it('should make series data transformation', () => {
        const transformations: TransformMethod[] = [
            'stackNormalized',
            (props: NormalizedSeriesProps) => ({
                ...props,
                maxY: 20
            })
        ];

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Transform width='50%' height='50%' method={transformations}>
                <Graphics />
            </Transform>
        </Chart>);

        const graphics = renderer.root.findByType(Graphics);
        const resultedSeries = graphics.props.series;
        expect(resultedSeries).not.toEqual(series);
        expect(resultedSeries).toEqual(transform(normalizeSeries({series}), transformations).series);
        expect(graphics.props.maxY).toEqual(20);
    });

    it('should work with a tag between', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight}>
            <Container>
                <Transform width='50%' height='50%' method={[({series}) => ({series})]} series={series}>
                    <Graphics />
                </Transform>
            </Container>
        </Chart>);

        const graphics = renderer.root.findByType(Graphics);
        const resultedSeries = graphics.props.series;
        expect(resultedSeries).toEqual(series);
    });

});
