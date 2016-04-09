'use strict';

// check path->d (actual/real graphic)

const {shallow} = require('enzyme');
const _ = require('lodash');
const d3 = require('d3');
const Chart = require('../../lib/Chart');
const generateRandomSeries = require('./generateRandomSeries');

module.exports = function (Component, options = {}) {
    options = _.defaults({}, options, {
        deepestTag: 'path',
        oneDeepestTagPerSeries: false,
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
        }
    });

    const seriesNumbers3x5 = generateRandomSeries(3, 5, {type: 'numbers'});
    const seriesArrays3x5 = generateRandomSeries(3, 5, {type: 'array'});
    const seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});

    describe('Graphics renderer component', () => {

        describe('should support series property', () => {

            describe('data', () => {

                it('as an array of numbers', () => {
                    const wrapper = shallow(<Chart width={100} height={100} series={seriesNumbers3x5}>
                        <Component />
                    </Chart>);
                    checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                });

                it('as an array of [x,y] pairs', () => {
                    const wrapper = shallow(<Chart width={100} height={100} series={seriesArrays3x5}>
                        <Component />
                    </Chart>);
                    checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                });

                it('as an array of {x,y} objects', () => {
                    const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                        <Component />
                    </Chart>);
                    checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                });

            });

            describe('color', () => {
                it('as a string', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].color = 'violet';
                    const wrapper = shallow(<Chart width={100} height={100} series={series}>
                        <Component/>
                    </Chart>);
                    const path = wrapper.render().find(options.deepestTag).first();
                    expect(path.prop(options.colorProperty)).toEqual('violet');
                });

                xit('as a array of strings for gradient', () => {
                });
            });

            describe('opacity', () => {
                it('as a number', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].opacity = 0.85;
                    const wrapper = shallow(<Chart width={100} height={100} series={series}>
                        <Component className='chart'/>
                    </Chart>);
                    const path = wrapper.render().find('g.chart-series').first();
                    expect(path.prop('opacity')).toEqual('0.85');
                });
            });

            describe('style', () => {
                it('as an object', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].style = {
                        strokeDashArray: '5 5',
                        strokeDashOffset: 1
                    };
                    const wrapper = shallow(<Chart width={100} height={100} series={series}>
                        <Component/>
                    </Chart>);
                    const path = wrapper.render().find(options.deepestTag).first();
                    expect(path.prop('style')).toEqual(jasmine.objectContaining({
                        'stroke-dash-offset': '1px',
                        'stroke-dash-array': '5 5'
                    }));
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.series({series: seriesNumbers3x5}, 'series', '', null)).toEqual(null);
                expect(Component.propTypes.series({series: seriesArrays3x5}, 'series', '', null)).toEqual(null);
                expect(Component.propTypes.series({series: seriesObjects3x5}, 'series', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = shallow(<Chart><Component /></Chart>);
                expect(wrapper.find(Component).prop('series')).toBeUndefined();
            });

            xit('should not normalize series itself', () => {
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
            });

        });

        describe('should support seriesIndex property', () => {

            it('as a number', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={1}/>
                    <Component className='chart2' seriesIndex={2}/>
                </Chart>);
                expect(wrapper.render().find('.chart-series').length).toEqual(1);
                expect(wrapper.find(Component).first().prop('series')[0].data).toEqual(seriesObjects3x5[1].data);
                expect(wrapper.render().find('.chart2-series').length).toEqual(1);
                expect(wrapper.find(Component).last().prop('series')[0].data).toEqual(seriesObjects3x5[2].data);
            });

            it('as an array of numbers', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={[0, 2]}/>
                </Chart>);
                expect(wrapper.render().find('.chart-series').length).toEqual(2);
                expect(wrapper.find(Component).prop('series')[0].data).toEqual(seriesObjects3x5[0].data);
                expect(wrapper.find(Component).prop('series')[1].data).toEqual(seriesObjects3x5[2].data);
            });

            it('as a function that filters series property', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={(series, seriesIndex) => seriesIndex > 1}/>
                </Chart>);
                expect(wrapper.render().find('.chart-series').length).toEqual(1);
                expect(wrapper.find(Component).prop('series')[0].data).toEqual(seriesObjects3x5[2].data);
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.seriesIndex({seriesIndex: 1}, 'seriesIndex', '', null)).toEqual(null);
                expect(Component.propTypes.seriesIndex({seriesIndex: [0, 2]}, 'seriesIndex', '', null)).toEqual(null);
                expect(Component.propTypes.seriesIndex({
                    seriesIndex: (series, seriesIndex) => seriesIndex > 1
                }, 'seriesIndex', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = shallow(<Chart><Component /></Chart>);
                expect(wrapper.find(Component).prop('seriesIndex')).toBeUndefined();
            });

        });

        describe('should support className property', () => {

            it('should render proper class names', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart'/>
                </Chart>);
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
                expect(path.length + 1).toBeGreaterThan(options.oneDeepestTagPerSeries ? 1 : 5);
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.className({className: 'chart'}, 'className', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = shallow(<Chart><Component /></Chart>);
                expect(wrapper.find(Component).prop('className')).toBeUndefined();
            });

        });

        describe('should support style property', () => {

            it('should render style in the root element', () => {
                const wrapper = shallow(<Chart>
                    <Component className='chart' style={{transition: '100ms'}}/>
                </Chart>);
                const root = wrapper.render().find('g.chart');
                expect(root.prop('style').transition).toEqual('100ms');
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.style({style: {transition: '100ms'}}, 'style', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = shallow(<Chart><Component /></Chart>);
                expect(wrapper.find(Component).prop('style')).toBeUndefined();
            });

        });

        describe('should support colors property', () => {

            it('can be name of predefined color schema', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' colors='category10'/>
                </Chart>);
                const paths = wrapper.render().find(options.deepestTag);
                const colors = d3.scale.category10().domain(_.range(3));
                expect(paths.first().prop(options.colorProperty)).toEqual(colors(0));
                expect(paths.last().prop(options.colorProperty)).toEqual(colors(2));
            });

            it('can be array', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' colors={['red', 'green', 'blue']}/>
                </Chart>);
                const paths = wrapper.render().find(options.deepestTag);
                const colors = d3.scale.ordinal().range(['red', 'green', 'blue']).domain(_.range(3));
                expect(paths.first().prop(options.colorProperty)).toEqual(colors(0));
                expect(paths.last().prop(options.colorProperty)).toEqual(colors(2));
            });

            it('can be function or d3 scale', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' colors={seriesIndex => '#fff00' + seriesIndex}/>
                </Chart>);
                const paths = wrapper.render().find(options.deepestTag);
                expect(paths.first().prop(options.colorProperty)).toEqual('#fff000');
                expect(paths.last().prop(options.colorProperty)).toEqual('#fff002');
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.colors({colors: 'category20b'}, 'colors', '', null)).toEqual(null);
                expect(Component.propTypes.colors({colors: ['red', 'blue']}, 'colors', '', null)).toEqual(null);
                expect(Component.propTypes.colors({colors: seriesIndex => '#fff00' + seriesIndex}, 'colors', '', null)).toEqual(null);
                expect(Component.propTypes.colors({colors: d3.scale.category10()}, 'colors', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = shallow(<Chart><Component /></Chart>);
                expect(wrapper.find(Component).prop('colors')).toEqual(options.defaultProps.colors);
            });

        });

        describe('should support opacity property', () => {

            it('should apply opacity attribute to the root element', () => {
                const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component className='chart' opacity={0.9}/>
                </Chart>);
                const root = wrapper.render().find('g.chart');
                expect(root.prop('opacity')).toEqual('0.9');
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.opacity({opacity: 0.9}, 'opacity', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = shallow(<Chart><Component /></Chart>);
                expect(wrapper.find(Component).prop('opacity')).toBeUndefined();
            });

        });

        describe('should support "visible"-type properties', () => {

            _.forEach(options.visibleProperties, ([tagName, className], visibleProperty) => {

                const selector = _.isUndefined(className) ?
                    tagName :
                    (tagName + '.chart-' + className);

                describe(visibleProperty, () => {

                    const elementsCount = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                        <Component className='chart'/>
                    </Chart>).render().find(selector).length;

                    it('can be a boolean', () => {
                        const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                            <Component
                                className='chart'
                                {...{[visibleProperty]: false}}
                            />
                        </Chart>).render();
                        expect(render.find(selector).length).toEqual(0);
                    });

                    it('can be a function', () => {
                        const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                            <Component
                                className='chart'
                                {...{[visibleProperty]: ({seriesIndex}) => seriesIndex !== 0}}
                            />
                        </Chart>).render();
                        expect(render.find(selector).length).toBeLessThan(elementsCount);
                        if (!_.isUndefined(className)) {
                            expect(render.find(selector + '-0').length).toEqual(0);
                            expect(render.find(selector + '-1').length).toEqual(1);
                            expect(render.find(selector + '-2').length).toEqual(1);
                        }
                    });

                    it('should be correctly defined in propTypes', () => {
                        expect(Component.propTypes[visibleProperty](
                            {[visibleProperty]: false}, visibleProperty, '', null
                        )).toEqual(null);
                        expect(Component.propTypes[visibleProperty](
                            {[visibleProperty]: ({seriesIndex}) => seriesIndex !== 0}, visibleProperty, '', null
                        )).toEqual(null);
                    });

                    it('should be true by default', () => {
                        const wrapper = shallow(<Chart><Component /></Chart>);
                        expect(wrapper.find(Component).prop(visibleProperty)).toEqual(true);
                    });

                });
            });

        });

        describe('should support "attributes"-type properties', () => {

            _.forEach(options.attributesProperties, ([tagName, className], attrProperty) => {

                const selector = _.isUndefined(className) ?
                    tagName :
                    (tagName + '.chart-' + className);

                describe(attrProperty, () => {

                    it('can be an object', () => {
                        const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                            <Component
                                className='chart'
                                {...{[attrProperty]: {transform: 'translateX(10px)'}}}
                            />
                        </Chart>).render();
                        expect(render.find(selector).prop('transform')).toEqual('translateX(10px)');
                    });

                    it('can be a function', () => {
                        const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                            <Component
                                className='chart'
                                {...{
                                    [attrProperty]: ({series}) => ({
                                        transform: 'translateX(1' + series.data[0].y + 'px)'
                                    })
                                }}
                            />
                        </Chart>).render();
                        expect(render.find(selector).last().prop('transform')).toEqual('translateX(1' + seriesObjects3x5[2].data[0].y + 'px)');
                    });

                    it('should be correctly defined in propTypes', () => {
                        expect(Component.propTypes[attrProperty](
                            {[attrProperty]: {transform: 'translateX(10px)'}}, attrProperty, '', null
                        )).toEqual(null);
                        expect(Component.propTypes[attrProperty](
                            {
                                [attrProperty]: ({series}) => ({
                                    transform: 'translateX(1' + series.data[0].y + 'px)'
                                })
                            }, attrProperty, '', null
                        )).toEqual(null);
                    });

                    it('should not have default value', () => {
                        const wrapper = shallow(<Chart><Component /></Chart>);
                        expect(wrapper.find(Component).prop(attrProperty)).toBeUndefined();
                    });

                });
            });

        });

        describe('should support "style"-type properties', () => {

            _.forEach(options.styleProperties, ([tagName, className], styleProperty) => {

                const selector = _.isUndefined(className) ?
                    tagName :
                    (tagName + '.chart-' + className);

                describe(styleProperty, () => {

                    it('can be an object', () => {
                        const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                            <Component
                                className='chart'
                                {...{[styleProperty]: {transition: '100ms'}}}
                            />
                        </Chart>).render();
                        expect(render.find(selector).prop('style').transition).toEqual('100ms');
                    });

                    it('can be a function', () => {
                        const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                            <Component
                                className='chart'
                                {...{
                                    [styleProperty]: ({series}) => ({
                                        transition: '1' + series.data[0].y + 'ms'
                                    })
                                }}
                            />
                        </Chart>).render();
                        const style = render.find(selector).last().prop('style');
                        expect(style.transition).toEqual('1' + seriesObjects3x5[2].data[0].y + 'ms');
                    });

                    it('should be correctly defined in propTypes', () => {
                        expect(Component.propTypes[styleProperty](
                            {[styleProperty]: {transition: '123ms'}}, styleProperty, '', null
                        )).toEqual(null);
                        expect(Component.propTypes[styleProperty](
                            {
                                [styleProperty]: ({series}) => ({
                                    transform: 'translateX(1' + series.data[0].y + 'px)'
                                })
                            }, styleProperty, '', null
                        )).toEqual(null);
                    });

                    it('should not have default value', () => {
                        const wrapper = shallow(<Chart><Component /></Chart>);
                        expect(wrapper.find(Component).prop(styleProperty)).toBeUndefined();
                    });

                });
            });

        });

        describe('should receive some properties from the parent', () => {

            it('layerWidth and layerHeight', () => {
                const wrapper = shallow(<Chart width={123} height={321}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('layerWidth')).toEqual(123);
                expect(chart.prop('layerHeight')).toEqual(321);
            });

            it('minimums and maximums for each axis', () => {
                const minY = _.min(_.map(seriesNumbers3x5, series => _.min(series.data)));
                const maxY = _.max(_.map(seriesNumbers3x5, series => _.max(series.data)));

                const wrapper = shallow(<Chart width={100} height={100} series={seriesNumbers3x5}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('minX')).toEqual(0);
                expect(chart.prop('maxX')).toEqual(4);
                expect(chart.prop('minY')).toEqual(minY);
                expect(chart.prop('maxY')).toEqual(maxY);
            });

            it('scaleX and scaleY', () => {
                const wrapper = shallow(<Chart width={123} height={321}>
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
            const html1 = shallow(<Chart width={100} height={100}
                                         series={seriesObjects3x5}><Component/></Chart>).html();
            const html2 = shallow(<Chart width={100} height={100} series={seriesObjects3x5}><Component>
                <g>
                    <text />
                </g>
            </Component></Chart>).html();
            expect(html1).toEqual(html2);
        });

        it('should have some default properties', () => {
            const wrapper = shallow(<Chart><Component /></Chart>);
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

};
