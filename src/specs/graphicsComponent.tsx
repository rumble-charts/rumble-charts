import type {Series, SharedProps} from '../types';

import React from 'react';
import {scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import {create, act} from 'react-test-renderer';

import {Chart} from '../Chart';
import {generateRandomSeries, random, range} from '../helpers';
import {visibleProps} from './visibleProps';
import {attributesProps} from './attributesProps';
import {styleProps} from './styleProps';
import {testSelector} from './testSelector';

type Options = Partial<{
    deepestTag: string;
    oneDeepestTagPerSeries: boolean;
    pointStyling: boolean;
    delay: number;
    pointGroupClassName: string;
    colorProperty: string;
    visibleProperties: Record<any, string[]>;
    attributesProperties: Record<any, string[]>;
    styleProperties: Record<any, string[]>;
    chartWidth: number;
    chartHeight: number;
    seriesNumbers3x5: Series[];
    seriesArrays3x5: Series[];
    seriesObjects3x5: Series[];
}>;

export function graphicsComponent(Component: React.FC<SharedProps>, options: Options = {}): void {
    options = {
        deepestTag: 'path',
        oneDeepestTagPerSeries: false,
        pointStyling: false,
        delay: 100,
        pointGroupClassName: '', // dot, bar
        colorProperty: 'fill', // fill, stroke
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
        chartHeight: 100,
        ...options
    };

    const delay = () => {
        act(() => {
            jest.advanceTimersByTime(options.delay || 0);
        });
    };

    const {
        chartWidth,
        chartHeight,
        seriesNumbers3x5 = generateRandomSeries(3, 5, {type: 'number'}),
        seriesArrays3x5 = generateRandomSeries(3, 5, {type: 'array'}),
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'}),
    } = options;

    const chartSeriesSelector = testSelector('g.chart-series');
    const deepestTagSelector = testSelector(options.deepestTag);

    describe('Graphics renderer component', () => {

        describe('should support series property', () => {

            describe('data', () => {

                it('as an array of numbers', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesNumbers3x5}>
                        <Component />
                    </Chart>);
                    delay();
                    expect(checkNormalizedSeries(renderer.root.findByType(Component).props.series, 3, 5)).toBe(true);
                });

                it('as an array of [x,y] pairs', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesArrays3x5}>
                        <Component />
                    </Chart>);
                    delay();
                    expect(checkNormalizedSeries(renderer.root.findByType(Component).props.series, 3, 5)).toBe(true);
                });

                it('as an array of {x,y} objects', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component />
                    </Chart>);
                    delay();
                    expect(checkNormalizedSeries(renderer.root.findByType(Component).props.series, 3, 5)).toBe(true);
                });

            });

            describe('color', () => {
                it('as a string', () => {
                    const series = JSON.parse(JSON.stringify(seriesNumbers3x5));
                    series[0].color = 'violet';
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component />
                    </Chart>);
                    delay();
                    const path = renderer.root.findAll(deepestTagSelector)[0];
                    expect(path.props[options.colorProperty]).toEqual('violet');
                });

                // TODO:
                // ('as an array of strings for gradient', () => {
                // });
            });

            describe('opacity', () => {
                it('as a number', () => {
                    const series = JSON.parse(JSON.stringify(seriesNumbers3x5));
                    series[0].opacity = 0.85;
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component className='chart' />
                    </Chart>);
                    delay();
                    const path = renderer.root.findAll(chartSeriesSelector)[0];
                    expect(path.props.opacity).toEqual(0.85);
                });
            });

            describe('style', () => {
                it('as an object', () => {
                    const series = JSON.parse(JSON.stringify(seriesNumbers3x5));
                    series[0].style = {
                        stroke: '#f0f',
                        fontSize: 24
                    };
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component />
                    </Chart>);
                    delay();
                    const path = renderer.root.findAll(deepestTagSelector)[0];
                    expect(path.props.style).toEqual(expect.objectContaining({
                        fontSize: 24,
                        stroke: '#f0f'
                    }));
                });
            });

            if (options.pointStyling) {
                describe('pointStyling', () => {

                    describe('color for specific point', () => {
                        it('as a string', () => {
                            const series = JSON.parse(JSON.stringify(seriesObjects3x5));
                            series[0].color = 'red';
                            series[0].data[0].color = 'violet';
                            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                                <Component />
                            </Chart>);
                            delay();
                            const path = renderer.root.findAll(deepestTagSelector)[0];
                            expect(path.props[options.colorProperty]).toEqual('violet');
                        });

                        // TODO:
                        // ('as an array of strings for gradient', () => {
                        // });
                    });

                    describe('opacity', () => {
                        it('as a number', () => {
                            const series = JSON.parse(JSON.stringify(seriesObjects3x5));
                            series[0].opacity = 0.85;
                            series[0].data[0].opacity = 0.74;
                            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                                <Component className='chart' />
                            </Chart>);
                            delay();
                            const path = renderer.root.findAll(deepestTagSelector)[0];
                            expect(path.props[options.colorProperty + 'Opacity']).toEqual(0.74);
                        });
                    });

                    describe('style', () => {
                        it('as an object', () => {
                            const series = JSON.parse(JSON.stringify(seriesObjects3x5));
                            series[0].style = {fill: 'red'};
                            series[0].data[0].style = {
                                stroke: '#f0f',
                                fontSize: 24
                            };
                            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                                <Component />
                            </Chart>);
                            delay();
                            const path = renderer.root.findAll(deepestTagSelector)[0];
                            expect(path.props['style']).toEqual(expect.objectContaining({
                                fontSize: 24,
                                stroke: '#f0f',
                                fill: 'red'
                            }));
                        });
                    });
                });
            }

            it('should have no default value', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(renderer.root.findByType(Component).props['series']).toBeUndefined();
            });

            // ('should not normalize series itself', () => {
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
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={1} />
                    <Component className='chart2' seriesIndex={2} />
                </Chart>);
                delay();
                const list = renderer.root.findAllByType(Component);
                expect(renderer.root.findAll(chartSeriesSelector).length).toEqual(1);
                expect(list[0].props['series'][0].data).toEqual(seriesObjects3x5[1].data);
                expect(renderer.root.findAll(testSelector('g.chart2-series')).length).toEqual(1);
                expect(list[list.length - 1].props['series'][0].data).toEqual(seriesObjects3x5[2].data);
            });

            it('as an array of numbers', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={[0, 2]} />
                </Chart>);
                delay();
                expect(renderer.root.findAll(chartSeriesSelector).length).toEqual(2);
                const instance = renderer.root.findByType(Component);
                expect(instance.props['series'][0].data).toEqual(seriesObjects3x5[0].data);
                expect(instance.props['series'][1].data).toEqual(seriesObjects3x5[2].data);
            });

            it('as a function that filters series property', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={(series, seriesIndex) => seriesIndex > 1} />
                </Chart>);
                delay();
                expect(renderer.root.findAll(chartSeriesSelector).length).toEqual(1);
                expect(renderer.root.findByType(Component).props['series'][0].data).toEqual(seriesObjects3x5[2].data);
            });

            it('should have no default value', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                delay();
                expect(renderer.root.findByType(Component).props['seriesIndex']).toBeUndefined();
            });

        });

        describe('should support className property', () => {

            it('should render proper class names', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' />
                </Chart>);
                delay();
                const chart = renderer.root.findAll(testSelector('g.chart'));
                expect(chart.length).toEqual(1);
                const root = chart[0];
                const series = root.findAll(chartSeriesSelector);
                expect(series.length).toEqual(3);
                const series0 = root.findAll(testSelector('g.chart-series.chart-series-0'));
                expect(series0.length).toEqual(1);
                if (options.pointGroupClassName) {
                    const points = root.findAll(testSelector(`.chart-${options.pointGroupClassName}`));
                    expect(points.length).toEqual(3 * 5);
                    const points0 = root.findAll(testSelector(`.chart-${options.pointGroupClassName}-0`));
                    expect(points0.length).toEqual(3);
                }
                const path = series0[0].findAll(deepestTagSelector);
                // we have at least 1 or 5 paths
                expect(path.length).not.toBeLessThan(options.oneDeepestTagPerSeries ? 1 : 5);
            });

            it('should have no default value', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(renderer.root.findByType(Component).props['className']).toBeUndefined();
            });

        });

        describe('should support style property', () => {

            it('should render style in the root element', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}>
                    <Component className='chart' style={{fill: 'red'}} />
                </Chart>);
                delay();
                const root = renderer.root.find(testSelector('g.chart'));
                expect(root.props['style'].fill).toEqual('red');
            });

            it('should have no default value', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(renderer.root.findByType(Component).props['style']).toBeUndefined();
            });

        });

        describe('should support colors property', () => {

            it('can be name of predefined color schema', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors='category10' />
                </Chart>);
                delay();
                const paths = renderer.root.findAll(deepestTagSelector);
                const colors = scaleOrdinal(schemeCategory10).domain(range(3).map(String));
                expect(paths[0].props[options.colorProperty]).toEqual(colors('0'));
                expect(paths[paths.length - 1].props[options.colorProperty]).toEqual(colors('2'));
            });

            it('can be array', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors={['red', 'green', 'blue']} />
                </Chart>);
                delay();
                const paths = renderer.root.findAll(deepestTagSelector);
                const colors = scaleOrdinal(['red', 'green', 'blue']).domain(range(3).map(String));
                expect(paths[0].props[options.colorProperty]).toEqual(colors('0'));
                expect(paths[paths.length - 1].props[options.colorProperty]).toEqual(colors('2'));
            });

            it('can be function or d3 scale', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors={seriesIndex => '#fff00' + seriesIndex} />
                </Chart>);
                delay();
                const paths = renderer.root.findAll(deepestTagSelector);
                expect(paths[0].props[options.colorProperty]).toEqual('#fff000');
                expect(paths[paths.length - 1].props[options.colorProperty]).toEqual('#fff002');
            });

        });

        describe('should support opacity property', () => {

            it('should apply opacity attribute to the root element', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' opacity={0.9} />
                </Chart>);
                delay();
                const root = renderer.root.find(testSelector('g.chart'));
                expect(root.props['opacity']).toEqual(0.9);
            });

            it('should have no default value', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(renderer.root.findByType(Component).props['opacity']).toBeUndefined();
            });

        });

        visibleProps(Component, {
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            delay: options.delay,
            props: options.visibleProperties
        });

        attributesProps(Component, {
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            delay: options.delay,
            props: options.attributesProperties
        });

        styleProps(Component, {
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            delay: options.delay,
            props: options.styleProperties
        });

        describe('should receive some properties from the parent', () => {

            it('layerWidth and layerHeight', () => {
                const renderer = create(<Chart width={chartWidth + 23} height={chartHeight * 3}>
                    <Component />
                </Chart>);
                const chart = renderer.root.findByType(Component);
                expect(chart.props['layerWidth']).toEqual(chartWidth + 23);
                expect(chart.props['layerHeight']).toEqual(chartHeight * 3);
            });

            it('minimums and maximums for each axis', () => {
                const minY = Math.min(...seriesNumbers3x5.map(series => Math.min.apply(null, series.data)));
                const maxY = Math.max(...seriesNumbers3x5.map(series => Math.max.apply(null, series.data)));

                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesNumbers3x5}>
                    <Component />
                </Chart>);
                const chart = renderer.root.findByType(Component);
                expect(chart.props['minX']).toEqual(0);
                expect(chart.props['maxX']).toEqual(4);
                expect(chart.props['minY']).toEqual(minY);
                expect(chart.props['maxY']).toEqual(maxY);
            });

            it('scaleX and scaleY', () => {
                const renderer = create(<Chart width={chartWidth} height={chartHeight}>
                    <Component />
                </Chart>);
                const chart = renderer.root.findByType(Component);
                expect(chart.props['scaleX'].direction).toEqual(expect.any(Number));
                expect(chart.props['scaleX'].factory).toEqual(expect.any(Function));
                expect(chart.props['scaleY'].direction).toEqual(expect.any(Number));
                expect(chart.props['scaleY'].factory).toEqual(expect.any(Function));
            });

        });

        it('should have no children', () => {
            const renderer1 = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                <Component />
            </Chart>);
            const renderer2 = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                <Component>
                    <g>
                        <text />
                    </g>
                </Component>
            </Chart>);
            delay();
            expect(renderer1.toJSON()).toEqual(renderer2.toJSON());
        });

    });

    function checkNormalizedSeries(series, seriesCount, pointsCount): boolean {
        expect(series.length).toEqual(seriesCount);
        const seriesIndex = random(seriesCount - 1);
        expect(series[seriesIndex].data.length).toEqual(pointsCount);
        range(3).forEach(() => {
            const seriesIndex = random(0, seriesCount - 1);
            const pointIndex = random(0, pointsCount - 1);
            expect(series[seriesIndex].data[pointIndex].x).toEqual(pointIndex);
            expect(series[seriesIndex].data[pointIndex].y).toEqual(expect.any(Number));
        });
        return true;
    }

}
