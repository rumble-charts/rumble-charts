import {shallow, mount, render} from 'enzyme';
const enzyme = {
    shallow, mount, render
};
import _ from 'lodash';
import {scaleOrdinal, schemeCategory10} from 'd3-scale';
import Chart from '../../src/Chart';
import generateRandomSeries from './generateRandomSeries';
import visibleProps from './visibleProps';
import attributesProps from './attributesProps';
import styleProps from './styleProps';
import later from './later';
import spyOnWarnings from './spyOnWarnings';

export default function(Component, options = {}) {
    options = _.defaults({}, options, {
        deepestTag: 'path',
        renderMethod: 'shallow',
        oneDeepestTagPerSeries: false,
        pointStyling: false,
        delay: 0,
        pointGroupClassName: '', // dot, bar
        colorProperty: 'fill', // fill, stroke
        defaultProps: {
            colors: 'category20'
        },
        visibleProperties: {
            seriesVisible: ['g', 'series']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series']
        },
        styleProperties: {
            seriesStyle: ['g', 'series']
        },
        chartWidth: 100,
        chartHeight: 100
    });

    const delayed = function(callback) {
        return later(callback, options.delay);
    };
    const render = _.isFunction(options.renderMethod) ?
        options.renderMethod(enzyme) :
        enzyme[options.renderMethod];

    let {seriesNumbers3x5, seriesArrays3x5, seriesObjects3x5} = options;
    const {chartWidth, chartHeight} = options;

    if (!seriesNumbers3x5) {
        seriesNumbers3x5 = generateRandomSeries(3, 5, {type: 'numbers'});
    }
    if (!seriesArrays3x5) {
        seriesArrays3x5 = generateRandomSeries(3, 5, {type: 'array'});
    }
    if (!seriesObjects3x5) {
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});
    }

    describe('Graphics renderer component', () => {

        describe('should support series property', () => {

            describe('data', () => {

                it('as an array of numbers', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesNumbers3x5}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                    });
                });

                it('as an array of [x,y] pairs', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesArrays3x5}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                    });
                });

                it('as an array of {x,y} objects', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                    });
                });

            });

            describe('color', () => {
                it('as a string', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].color = 'violet';
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        const path = wrapper.render().find(options.deepestTag).first();
                        expect(path.prop(options.colorProperty)).toEqual('violet');
                    });
                });

                // TODO:
                // xit('as an array of strings for gradient', () => {
                // });
            });

            describe('opacity', () => {
                it('as a number', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].opacity = 0.85;
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component className='chart' />
                    </Chart>);
                    return delayed(() => {
                        const path = wrapper.render().find('g.chart-series').first();
                        expect(path.prop('opacity')).toEqual('0.85');
                    });
                });
            });

            describe('style', () => {
                it('as an object', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].style = {
                        stroke: '#f0f',
                        fontSize: 24
                    };
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        const path = wrapper.render().find(options.deepestTag).first();
                        expect(path.prop('style')).toEqual(jasmine.objectContaining({
                            'font-size': '24px',
                            'stroke': '#f0f'
                        }));
                    });
                });
            });

            if (options.pointStyling) {
                describe('color for specific point', () => {
                    it('as a string', () => {
                        const series = _.cloneDeep(seriesObjects3x5);
                        series[0].color = 'red';
                        series[0].data[0].color = 'violet';
                        const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                            <Component />
                        </Chart>);
                        return delayed(() => {
                            const path = wrapper.render().find(options.deepestTag).first();
                            expect(path.prop(options.colorProperty)).toEqual('violet');
                        });
                    });

                    // TODO:
                    // xit('as an array of strings for gradient', () => {
                    // });
                });

                describe('opacity', () => {
                    it('as a number', () => {
                        const series = _.cloneDeep(seriesObjects3x5);
                        series[0].opacity = 0.85;
                        series[0].data[0].opacity = 0.74;
                        const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                            <Component className='chart' />
                        </Chart>);
                        return delayed(() => {
                            const path = wrapper.render().find(options.deepestTag).first();
                            expect(path.prop(options.colorProperty + '-opacity')).toEqual('0.74');
                        });
                    });
                });

                describe('style', () => {
                    it('as an object', () => {
                        const series = _.cloneDeep(seriesObjects3x5);
                        series[0].style = {fill: 'red'};
                        series[0].data[0].style = {
                            stroke: '#f0f',
                            fontSize: 24
                        };
                        const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                            <Component />
                        </Chart>);
                        return delayed(() => {
                            const path = wrapper.render().find(options.deepestTag).first();
                            expect(path.prop('style')).toEqual(jasmine.objectContaining({
                                'font-size': '24px',
                                'stroke': '#f0f',
                                'fill': 'red'
                            }));
                        });
                    });
                });
            }

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.series).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight}>
                    <Component series={seriesNumbers3x5} />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight}>
                    <Component series={seriesArrays3x5} />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight}>
                    <Component series={seriesObjects3x5} />
                </Chart>)).not.toHaveBeenCalled();
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('series')).toBeUndefined();
            });

            // xit('should not normalize series itself', () => {
            /*
             TODO:
             graphics renderers don't normalize series, but Chart or any other wrapper do that,
             that's not good to mutate child's property in the parent
             so:
             - don't normalize child's series
             - or add series normalization in graphics renderer
             or
             we can make normalization only as a transfer method,
             in that case graphics renderers will support just only normalized series data (object {x,y})
             but it will increase complexity
             but also it will increase performance
             */
            // });

        });

        describe('should support seriesIndex property', () => {

            it('as a number', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={1} />
                    <Component className='chart2' seriesIndex={2} />
                </Chart>);
                return delayed(() => {
                    expect(wrapper.render().find('.chart-series').length).toEqual(1);
                    expect(wrapper.find(Component).first().prop('series')[0].data).toEqual(seriesObjects3x5[1].data);
                    expect(wrapper.render().find('.chart2-series').length).toEqual(1);
                    expect(wrapper.find(Component).last().prop('series')[0].data).toEqual(seriesObjects3x5[2].data);
                });
            });

            it('as an array of numbers', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={[0, 2]} />
                </Chart>);
                return delayed(() => {
                    expect(wrapper.render().find('.chart-series').length).toEqual(2);
                    expect(wrapper.find(Component).prop('series')[0].data).toEqual(seriesObjects3x5[0].data);
                    expect(wrapper.find(Component).prop('series')[1].data).toEqual(seriesObjects3x5[2].data);
                });
            });

            it('as a function that filters series property', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={(series, seriesIndex) => seriesIndex > 1} />
                </Chart>);
                return delayed(() => {
                    expect(wrapper.render().find('.chart-series').length).toEqual(1);
                    expect(wrapper.find(Component).prop('series')[0].data).toEqual(seriesObjects3x5[2].data);
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.seriesIndex).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component seriesIndex={1} />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component seriesIndex={[0, 2]} />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component seriesIndex={(series, seriesIndex) => seriesIndex > 1} />
                </Chart>)).not.toHaveBeenCalled();
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                return delayed(() => {
                    expect(wrapper.find(Component).prop('seriesIndex')).toBeUndefined();
                });
            });

        });

        describe('should support className property', () => {

            it('should render proper class names', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' />
                </Chart>);
                return delayed(() => {
                    const root = wrapper.render().find('g.chart');
                    expect(root.length).toEqual(1);
                    const series = root.find('g.chart-series');
                    expect(series.length).toEqual(3);
                    const series0 = root.find('g.chart-series.chart-series-0');
                    expect(series0.length).toEqual(1);
                    if (options.pointGroupClassName) {
                        const points = root.find('.chart-' + options.pointGroupClassName);
                        expect(points.length).toEqual(3 * 5);
                        const points0 = root.find('.chart-' + options.pointGroupClassName + '-0');
                        expect(points0.length).toEqual(3);
                    }
                    const path = series0.find(options.deepestTag);
                    // we have at least 1 or 5 paths
                    expect(path.length).not.toBeLessThan(options.oneDeepestTagPerSeries ? 1 : 5);
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.className).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' />
                </Chart>)).not.toHaveBeenCalled();
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('className')).toBeUndefined();
            });

        });

        describe('should support style property', () => {

            it('should render style in the root element', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}>
                    <Component className='chart' style={{fill: 'red'}} />
                </Chart>);
                return delayed(() => {
                    const root = wrapper.render().find('g.chart');
                    expect(root.prop('style').fill).toEqual('red');
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.style).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component style={{fill: 'red'}} />
                </Chart>)).not.toHaveBeenCalled();
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('style')).toBeUndefined();
            });

        });

        describe('should support colors property', () => {

            it('can be name of predefined color schema', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors='category10' />
                </Chart>);
                return delayed(() => {
                    const paths = wrapper.render().find(options.deepestTag);
                    const colors = scaleOrdinal(schemeCategory10).domain(_.range(3));
                    expect(paths.first().prop(options.colorProperty)).toEqual(colors(0));
                    expect(paths.last().prop(options.colorProperty)).toEqual(colors(2));
                });
            });

            it('can be array', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors={['red', 'green', 'blue']} />
                </Chart>);
                return delayed(() => {
                    const paths = wrapper.render().find(options.deepestTag);
                    const colors = scaleOrdinal(['red', 'green', 'blue']).domain(_.range(3));
                    expect(paths.first().prop(options.colorProperty)).toEqual(colors(0));
                    expect(paths.last().prop(options.colorProperty)).toEqual(colors(2));
                });
            });

            it('can be function or d3 scale', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors={seriesIndex => '#fff00' + seriesIndex} />
                </Chart>);
                return delayed(() => {
                    const paths = wrapper.render().find(options.deepestTag);
                    expect(paths.first().prop(options.colorProperty)).toEqual('#fff000');
                    expect(paths.last().prop(options.colorProperty)).toEqual('#fff002');
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.colors).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component colors='category20b' />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component colors={['red', 'blue']} />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component colors={seriesIndex => '#fff00' + seriesIndex} />
                </Chart>)).not.toHaveBeenCalled();
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component colors={scaleOrdinal(schemeCategory10)} />
                </Chart>)).not.toHaveBeenCalled();
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('colors')).toEqual(options.defaultProps.colors);
            });

        });

        describe('should support opacity property', () => {

            it('should apply opacity attribute to the root element', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' opacity={0.9} />
                </Chart>);
                return delayed(() => {
                    const root = wrapper.render().find('g.chart');
                    expect(root.prop('opacity')).toEqual('0.9');
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.opacity).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component opacity={0.9} />
                </Chart>)).not.toHaveBeenCalled();
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('opacity')).toBeUndefined();
            });

        });

        visibleProps(Component, {
            renderMethod: options.renderMethod,
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            delay: options.delay,
            props: options.visibleProperties
        });

        attributesProps(Component, {
            renderMethod: options.renderMethod,
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            delay: options.delay,
            props: options.attributesProperties
        });

        styleProps(Component, {
            renderMethod: options.renderMethod,
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            delay: options.delay,
            props: options.styleProperties
        });

        describe('should receive some properties from the parent', () => {

            it('layerWidth and layerHeight', () => {
                const wrapper = render(<Chart width={chartWidth + 23} height={chartHeight * 3}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('layerWidth')).toEqual(chartWidth + 23);
                expect(chart.prop('layerHeight')).toEqual(chartHeight * 3);
            });

            it('minimums and maximums for each axis', () => {
                const minY = _.min(_.map(seriesNumbers3x5, series => _.min(series.data)));
                const maxY = _.max(_.map(seriesNumbers3x5, series => _.max(series.data)));

                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesNumbers3x5}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('minX')).toEqual(0);
                expect(chart.prop('maxX')).toEqual(4);
                expect(chart.prop('minY')).toEqual(minY);
                expect(chart.prop('maxY')).toEqual(maxY);
            });

            it('scaleX and scaleY', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('scaleX').direction).toEqual(jasmine.any(Number));
                expect(chart.prop('scaleX').factory).toEqual(jasmine.any(Function));
                expect(chart.prop('scaleY').direction).toEqual(jasmine.any(Number));
                expect(chart.prop('scaleY').factory).toEqual(jasmine.any(Function));
            });

        });

        it('should have no children', () => {
            const html1 = render(<Chart
                width={chartWidth} height={chartHeight}
                series={seriesObjects3x5}><Component /></Chart>).html();
            const html2 = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}><Component>
                <g>
                    <text />
                </g>
            </Component></Chart>).html();
            expect(html1).toEqual(html2);
        });

        it('should have some default properties', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
            expect(wrapper.find(Component).props()).toEqual(jasmine.objectContaining(options.defaultProps));
        });

    });

    function checkNormalizedSeries(series, seriesCount, pointsCount) {
        expect(series.length).toEqual(seriesCount);
        let seriesIndex = _.random(seriesCount - 1);
        expect(series[seriesIndex].data.length).toEqual(pointsCount);
        _.forEach(_.range(3), () => {
            let seriesIndex = _.random(seriesCount - 1);
            let pointIndex = _.random(pointsCount - 1);
            expect(series[seriesIndex].data[pointIndex].x).toEqual(pointIndex);
            expect(series[seriesIndex].data[pointIndex].y).toEqual(jasmine.any(Number));
        });
    }

}
