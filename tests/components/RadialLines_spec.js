'use strict';

const {shallow} = require('enzyme');
const d3 = require('d3');
const _ = require('lodash');
const helpers = require('../../src/helpers');
const Chart = require('../../src/Chart');
const graphicsComponent = require('../helpers/graphicsComponent');
const linesComponent = require('../helpers/linesComponent');
const generateRandomSeries = require('../helpers/generateRandomSeries');

const RadialLines = require('../../src/RadialLines');

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

        const series = generateRandomSeries(1, 20, {type: 'object'});

        it('as lines', () => {
            const wrapper = shallow(<Chart width={120} height={100} series={series}>
                <RadialLines
                    startAngle={0.5 * Math.PI}
                    endAngle={1.75 * Math.PI}
                    innerRadius={20}
                />
            </Chart>);
            const graph = wrapper.find(RadialLines);
            const realCurve = wrapper.render().find('path').prop('d');

            const props = graph.props();
            const {minX, maxX, minY, maxY, scaleX, scaleY} = props;

            const outerRadius = Math.min(props.layerWidth, props.layerHeight) / 2;
            const innerRadius = helpers.normalizeNumber(props.innerRadius, outerRadius);

            const radialScale = d3.scale.linear()
                .range([innerRadius, outerRadius])
                .domain(scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);
            const circularScale = d3.scale.linear()
                .range([props.startAngle, props.endAngle])
                .domain(scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

            const line = d3.svg.line.radial()
                .radius(({y}) => radialScale(y))
                .angle(({x}) => circularScale(x))
                .defined(({y}) => _.isNumber(y))
                .interpolate(graph.prop('interpolation'));

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas', () => {
            const wrapper = shallow(<Chart width={80} height={100} series={series}>
                <RadialLines
                    asAreas={true}
                    startAngle={0.1 * Math.PI}
                    endAngle={1.1 * Math.PI}
                    innerRadius={20}
                />
            </Chart>);
            const graph = wrapper.find(RadialLines);
            const realCurve = wrapper.render().find('path').prop('d');

            const props = graph.props();
            const {minX, maxX, minY, maxY, scaleX, scaleY} = props;

            const outerRadius = Math.min(props.layerWidth, props.layerHeight) / 2;
            const innerRadius = helpers.normalizeNumber(props.innerRadius, outerRadius);

            const radialScale = d3.scale.linear()
                .range([innerRadius, outerRadius])
                .domain(scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);
            const circularScale = d3.scale.linear()
                .range([props.startAngle, props.endAngle])
                .domain(scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

            const _radius0 = radialScale(0);
            const line = d3.svg.area.radial()
                .innerRadius(({y0}) => _.isUndefined(y0) ? _radius0 : radialScale(y0))
                .outerRadius(({y}) => radialScale(y))
                .angle(({x}) => circularScale(x))
                .defined(({y}) => _.isNumber(y))
                .interpolate(graph.prop('interpolation'));

            expect(realCurve).toEqual(line(series[0].data));
        });

    });

});
