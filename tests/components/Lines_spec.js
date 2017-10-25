import {shallow, mount} from 'enzyme';
import {line as d3Line, area as d3Area} from 'd3-shape';
import {curveCatmullRom} from 'd3-shape';
import _ from 'lodash';

import Transform from '../../src/Transform';
import Chart from '../../src/Chart';
import curves from '../../src/helpers/curves';
import graphicsComponent from '../helpers/graphicsComponent';
import linesComponent from '../helpers/linesComponent';
import generateRandomSeries from '../helpers/generateRandomSeries';

import Lines from '../../src/Lines';

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

        const series = generateRandomSeries(2, 20, {type: 'object'});

        it('as lines', () => {
            const wrapper = shallow(<Chart width={100} height={100} series={series}>
                <Lines interpolation={curveCatmullRom} />
            </Chart>);
            const graph = wrapper.find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const interpolation = graph.prop('interpolation');
            const curve = _.isString(interpolation) ? curves[interpolation] : interpolation;

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const line = d3Line()
                .x(({x}) => scaleX(x))
                .y(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .curve(curve);

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
            const line = d3Line()
                .y(({x}) => scaleX(x))
                .x(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .curve(curves[graph.prop('interpolation')]);

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas', () => {
            const wrapper = mount(<Chart width={100} height={100} series={series} minY={0}>
                <Transform method='stack'>
                    <Lines asAreas={true} />
                </Transform>
            </Chart>);
            const graph = wrapper.find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const _y0 = scaleY(0);
            const line = d3Area()
                .x(({x}) => scaleX(x))
                .y0(({y0}) => _.isUndefined(y0) ? _y0 : scaleY(y0))
                .y1(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .curve(curves[graph.prop('interpolation')]);

            expect(realCurve).toEqual(line(series[0].data));
        });

        it('as areas after "rotate" transformation', () => {
            const wrapper = shallow(<Chart width={100} height={100} series={series} minY={0}>
                <Transform method={['stack', 'rotate']}>
                    <Lines asAreas={true} />
                </Transform>
            </Chart>);
            const graph = wrapper.find(Transform).shallow().find(Lines);
            const realCurve = wrapper.render().find('path').prop('d');

            const scaleX = graph.prop('scaleX').factory(graph.props());
            const scaleY = graph.prop('scaleY').factory(graph.props());
            const _y0 = scaleY(0);
            const line = d3Area()
                .y(({x}) => scaleX(x))
                .x0(({y0}) => _.isUndefined(y0) ? _y0 : scaleY(y0))
                .x1(({y}) => scaleY(y))
                .defined(({y}) => _.isNumber(y))
                .curve(curves[graph.prop('interpolation')]);

            expect(realCurve).toEqual(line(series[0].data));
        });

    });

});
