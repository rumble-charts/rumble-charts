import React from 'react';
import {create} from 'react-test-renderer';

import {line as d3Line, area as d3Area} from 'd3-shape';
import {curveCatmullRom} from 'd3-shape';

import {Transform} from './Transform';
import {Chart} from './Chart';
import {curves, generateRandomSeries, isNumber, isString, isUndefined} from './helpers';
import {graphicsComponent, linesComponent, testSelector} from './specs';

import {Lines} from './Lines';

describe('Lines', () => {

    // Lines should be a graphics renderer component
    graphicsComponent(Lines, {
        colorProperty: 'stroke',
        oneDeepestTagPerSeries: true,
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            lineVisible: ['path']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            lineAttributes: ['path']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            lineStyle: ['path']
        }
    });

    linesComponent(Lines, {
        lineWidth: true,
        lineInterpolations: [
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]
    });

    describe('should render path elements', () => {

        const series = generateRandomSeries(2, 20, {type: 'object'});

        it('as lines', () => {
            const renderer = create(<Chart width={100} height={100} series={series}>
                <Lines interpolation={curveCatmullRom} />
            </Chart>);
            const graph = renderer.root.findByType(Lines);
            const realCurve = renderer.root.findAll(testSelector('path'))[0].props.d;

            const {interpolation} = graph.props;
            const curve = isString(interpolation) ? curves[interpolation] : interpolation;

            const scaleX = graph.props.scaleX.factory(graph.props);
            const scaleY = graph.props.scaleY.factory(graph.props);
            const line = d3Line<any>()
                .x(({x}) => scaleX(x))
                .y(({y}) => scaleY(y))
                .defined(({y}) => isNumber(y))
                .curve(curve);

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as lines after "rotate" transformation', () => {
            const renderer = create(<Chart width={100} height={100} series={series}>
                <Transform method='rotate'>
                    <Lines interpolation='monotone' />
                </Transform>
            </Chart>);
            const graph = renderer.root.findByType(Lines);
            const realCurve = renderer.root.findAll(testSelector('path'))[0].props.d;

            const scaleX = graph.props.scaleX.factory(graph.props);
            const scaleY = graph.props.scaleY.factory(graph.props);
            const line = d3Line<any>()
                .y(({x}) => scaleX(x))
                .x(({y}) => scaleY(y))
                .defined(({y}) => isNumber(y))
                .curve(curves[graph.props.interpolation]);

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas', () => {
            const renderer = create(<Chart width={100} height={100} series={series} minY={0}>
                <Transform method='stack'>
                    <Lines asAreas={true} interpolation='monotone' />
                </Transform>
            </Chart>);
            const graph = renderer.root.findByType(Lines);
            const realCurve = renderer.root.findAll(testSelector('path'))[0].props.d;

            const scaleX = graph.props.scaleX.factory(graph.props);
            const scaleY = graph.props.scaleY.factory(graph.props);
            const _y0 = scaleY(0);
            const line = d3Area<any>()
                .x(({x}) => scaleX(x))
                .y0(({y0}) => isUndefined(y0) ? _y0 : scaleY(y0))
                .y1(({y}) => scaleY(y))
                .defined(({y}) => isNumber(y))
                .curve(curves[graph.props.interpolation]);

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas after "rotate" transformation', () => {
            const renderer = create(<Chart width={100} height={100} series={series} minY={0}>
                <Transform method={['stack', 'rotate']}>
                    <Lines asAreas={true} interpolation='monotone' />
                </Transform>
            </Chart>);
            const graph = renderer.root.findByType(Lines);
            const realCurve = renderer.root.findAll(testSelector('path'))[0].props.d;

            const scaleX = graph.props.scaleX.factory(graph.props);
            const scaleY = graph.props.scaleY.factory(graph.props);
            const _y0 = scaleY(0);
            const line = d3Area<any>()
                .y(({x}) => scaleX(x))
                .x0(({y0}) => isUndefined(y0) ? _y0 : scaleY(y0))
                .x1(({y}) => scaleY(y))
                .defined(({y}) => isNumber(y))
                .curve(curves[graph.props.interpolation]);

            expect(realCurve).toEqual(line(series[0].data));
        });

    });

});
