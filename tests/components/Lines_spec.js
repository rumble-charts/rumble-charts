'use strict';

const {shallow} = require('enzyme');
const d3 = require('d3');
const _ = require('lodash');
const Transform = require('../../src/Transform');
const Chart = require('../../src/Chart');
const graphicsComponent = require('../helpers/graphicsComponent');
const linesComponent = require('../helpers/linesComponent');
const generateRandomSeries = require('../helpers/generateRandomSeries');

const Lines = require('../../src/Lines');

describe('Lines', () => {

    // Lines should be a graphics renderer component
    graphicsComponent(Lines, {
        colorProperty: 'stroke',
        oneDeepestTagPerSeries: true,
        defaultProps: {
            colors: 'category20',
            interpolation: 'monotone',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3
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

    linesComponent(Lines, {
        lineWidth: true,
        lineInterpolations: [
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]
    });

    describe('should render path elements', () => {

        const series = generateRandomSeries(1, 20, {type: 'object'});

        it('as lines', () => {
            const wrapper = shallow(<Chart width={100} height={100} series={series}>
                <Lines/>
            </Chart>);
            const graph = wrapper.find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const line = d3.svg.line()
                .x(({x}) => scaleX(x))
                .y(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .interpolate(graph.prop('interpolation'));

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as lines after "rotate" transformation', () => {
            const wrapper = shallow(<Chart width={100} height={100} series={series}>
                <Transform method='rotate'>
                    <Lines />
                </Transform>
            </Chart>);
            const graph = wrapper.find(Transform).shallow().find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const line = d3.svg.line()
                .y(({x}) => scaleX(x))
                .x(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .interpolate(graph.prop('interpolation'));

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas', () => {
            const wrapper = shallow(<Chart width={100} height={100} series={series} minY={0}>
                <Lines asAreas={true}/>
            </Chart>);
            const graph = wrapper.find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const _y0 = scaleY(0);
            const line = d3.svg.area()
                .x(({x}) => scaleX(x))
                .y0(({y0}) => _.isUndefined(y0) ? _y0 : scaleY(y0))
                .y1(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .interpolate(graph.prop('interpolation'));

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas after "rotate" transformation', () => {
            const wrapper = shallow(<Chart width={100} height={100} series={series} minY={0}>
                <Transform method='rotate'>
                    <Lines asAreas={true}/>
                </Transform>
            </Chart>);
            const graph = wrapper.find(Transform).shallow().find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const _y0 = scaleY(0);
            const line = d3.svg.area()
                .y(({x}) => scaleX(x))
                .x0(({y0}) => _.isUndefined(y0) ? _y0 : scaleY(y0))
                .x1(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .interpolate(graph.prop('interpolation'));

            expect(realCurve).toEqual(line(series[0].data));
        });

    });

});
