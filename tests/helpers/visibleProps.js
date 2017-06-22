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
            seriesVisible: ['g', 'series']
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

    describe('should support "visible"-type properties', () => {

        _.forEach(options.props, ([tagName, className], visibleProperty) => {

            const selector = _.isUndefined(className) ?
                tagName :
                (tagName + '.chart-' + className);

            describe(visibleProperty, () => {

                it('can be a boolean', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[visibleProperty]: false}}
                        />
                    </Chart>);

                    return delayed(() => {
                        expect(wrapper.render().find(selector).length).toEqual(0);
                    });
                });

                it('can be a function', () => {
                    const wrapper = render(<Chart
                        width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[visibleProperty]: ({seriesIndex}) => seriesIndex !== 0}}
                        />
                    </Chart>);

                    const maxWrapper = render(<Chart
                        width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component className='chart'/>
                    </Chart>);

                    return delayed(() => {
                        const elementsCount = maxWrapper.render().find(selector).length;

                        let render = wrapper.render();
                        expect(render.find(selector).length).toBeLessThan(elementsCount);
                        if (!_.isUndefined(className)) {
                            expect(render.find(selector + '-0').length).toEqual(0);
                            expect(render.find(selector + '-1').length).toEqual(1);
                            expect(render.find(selector + '-2').length).toEqual(1);
                        }
                    });
                });

                it('should be correctly defined in propTypes', () => {
                    expect(Component.propTypes[visibleProperty]).toEqual(jasmine.any(Function));
                    expect(spyOnWarnings(() => <Chart
                        width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            {...{[visibleProperty]: false}}
                        />
                    </Chart>)).not.toHaveBeenCalled();
                    expect(spyOnWarnings(() => <Chart
                        width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            {...{[visibleProperty]: ({seriesIndex}) => seriesIndex !== 0}}
                        />
                    </Chart>)).not.toHaveBeenCalled();
                });

                it('should be true by default', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                    expect(wrapper.find(Component).prop(visibleProperty.toString())).toEqual(true);
                });

            });
        });

    });

}
