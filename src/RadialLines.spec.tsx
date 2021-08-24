import React from 'react';
import {create} from 'react-test-renderer';
import {areaRadial, lineRadial, curveNatural} from 'd3-shape';
import {scaleLinear} from 'd3-scale';

import {curves, generateRandomSeries, isNumber, isString, isUndefined, normalizeNumber} from './helpers';
import {graphicsComponent, linesComponent, testSelector} from './specs';
import {Chart} from './Chart';
import {Transform} from './Transform';
import {RadialLines} from './RadialLines';
import {Point} from './types';

describe('RadialLines', () => {

    // RadialLines should be a graphics renderer component
    graphicsComponent(RadialLines, {
        colorProperty: 'stroke',
        oneDeepestTagPerSeries: true,
        defaultProps: {
            colors: 'category20',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            innerRadius: 0,
            position: 'center middle',
            interpolation: 'cardinal-closed'
        },
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

    linesComponent(RadialLines, {
        lineWidth: true,
        lineInterpolations: [
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]
    });

    describe('should render path elements using startAngle, endAngle, innerRadius properties', () => {

        const series = generateRandomSeries(2, 20, {type: 'object'});

        it('as lines', () => {
            const renderer = create(<Chart width={120} height={100} series={series}>
                <RadialLines
                    startAngle={0.5 * Math.PI}
                    endAngle={1.75 * Math.PI}
                    innerRadius={20}
                    interpolation={curveNatural}
                />
            </Chart>);
            const graph = renderer.root.findByType(RadialLines);
            const realCurve = renderer.root.findAll(testSelector('path'))[0].props.d;

            const props = graph.props;
            const {minX, maxX, minY, maxY, scaleX, scaleY} = props;

            const outerRadius = Math.min(props.layerWidth, props.layerHeight) / 2;
            const innerRadius = normalizeNumber(props.innerRadius, outerRadius);

            const radialScale = scaleLinear()
                .range([innerRadius, outerRadius])
                .domain(scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);
            const circularScale = scaleLinear()
                .range([props.startAngle, props.endAngle])
                .domain(scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

            const interpolation = graph.props.interpolation;
            const curve = isString(interpolation) ? curves[interpolation] : interpolation;

            const line = lineRadial<Point>()
                .radius(({y}) => radialScale(y))
                .angle(({x}) => circularScale(x))
                .defined(({y}) => isNumber(y))
                .curve(curve);

            expect(realCurve).toEqual(line(series[0].data as Point[]));
        });

        it('as areas', () => {
            const renderer = create(<Chart width={80} height={100} series={series}>
                <Transform method='stack'>
                    <RadialLines
                        asAreas={true}
                        startAngle={0.1 * Math.PI}
                        endAngle={1.1 * Math.PI}
                        innerRadius={20}
                        interpolation='cardinal-closed'
                    />
                </Transform>
            </Chart>);
            const graph = renderer.root.findByType(RadialLines);
            const realCurve = renderer.root.findAll(testSelector('path'))[0].props.d;

            const props = graph.props;
            const {minX, maxX, minY, maxY, scaleX, scaleY} = props;

            const outerRadius = Math.min(props.layerWidth, props.layerHeight) / 2;
            const innerRadius = normalizeNumber(props.innerRadius, outerRadius);

            const radialScale = scaleLinear()
                .range([innerRadius, outerRadius])
                .domain(scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);
            const circularScale = scaleLinear()
                .range([props.startAngle, props.endAngle])
                .domain(scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

            const _radius0 = radialScale(0);
            const line = areaRadial<Point>()
                .innerRadius(({y0}) => isUndefined(y0) ? _radius0 : radialScale(y0))
                .outerRadius(({y}) => radialScale(y))
                .angle(({x}) => circularScale(x))
                .defined(({y}) => isNumber(y))
                .curve(curves[graph.props.interpolation]);

            expect(realCurve).toEqual(line(series[0].data as Point[]));
        });

        it('should support opposite directions for scales', () => {
            const renderer = create(<Chart
                width={100} height={100} series={series}
                scaleX={{direction: -1}} scaleY={{direction: -1}}>
                <RadialLines />
            </Chart>);
            expect(renderer.root.findAll(testSelector('path')).length).toEqual(series.length);
        });

        it('should support empty position', () => {
            const renderer = create(<Chart
                width={200} height={100} series={series}>
                <RadialLines position='' />
            </Chart>);
            expect(renderer.root.findAll(testSelector('g'))[0].props.transform).toEqual('translate(50 50)');
        });

    });

});
