import {shallow, mount, render} from 'enzyme';
const enzyme = {
    shallow, mount, render
};
import _ from 'lodash';
import Chart from '../../src/Chart';
import generateRandomSeries from './generateRandomSeries';
import later from './later';
import spyOnWarnings from './spyOnWarnings';

export default function(Component, options = {}) {
    options = _.defaults({}, options, {
        renderMethod: 'shallow',
        chartWidth: 100,
        chartHeight: 100,
        props: {
            seriesStyle: ['g', 'series']
        }
    });
    let {seriesObjects3x5} = options;
    const {chartWidth, chartHeight} = options;

    if (!seriesObjects3x5) {
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});
    }

    const delayed = function(callback) {
        return later(callback, options.delay);
    };
    const render = _.isFunction(options.renderMethod) ?
        options.renderMethod(enzyme) :
        enzyme[options.renderMethod];

    describe('should support "style"-type properties', () => {

        _.forEach(options.props, ([tagName, className], styleProperty) => {

            const selector = _.isUndefined(className) ?
                tagName :
                (tagName + '.chart-' + className);

            describe(styleProperty, () => {

                it('can be an object', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[styleProperty]: {display: 'none'}}}
                        />
                    </Chart>);
                    return delayed(() => {
                        let render = wrapper.render();
                        expect(render.find(selector).length).toBeGreaterThan(0);
                        expect(render.find(selector).prop('style').display).toEqual('none');
                    });
                });

                it('can be a function', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{
                                [styleProperty]: ({series}) => ({
                                    display: '1' + series.data[0].y + 'ms'
                                })
                            }}
                        />
                    </Chart>);
                    return delayed(() => {
                        let render = wrapper.render();
                        expect(render.find(selector).length).toBeGreaterThan(0);
                        const style = render.find(selector).last().prop('style');
                        expect(style.display).toEqual('1' + seriesObjects3x5[2].data[0].y + 'ms');
                    });
                });

                it('should be correctly defined in propTypes', () => {
                    expect(Component.propTypes[styleProperty]).toEqual(jasmine.any(Function));
                    expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            {...{[styleProperty]: {transition: '123ms'}}}
                        />
                    </Chart>)).not.toHaveBeenCalled();
                    expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            {...{
                                [styleProperty]: ({series}) => ({
                                    transform: 'translateX(1' + series.data[0].y + 'px)'
                                })
                            }}
                        />
                    </Chart>)).not.toHaveBeenCalled();
                });

                it('should not have default value', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                    expect(wrapper.find(Component).prop(styleProperty.toString())).toBeUndefined();
                });

            });
        });

    });

}
