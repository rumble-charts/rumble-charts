import {shallow} from 'enzyme';
import _  from 'lodash';
import Chart from '../../src/Chart';
import generateRandomSeries from './generateRandomSeries';
import spyOnWarnings from './spyOnWarnings';

export default function(Component, options = {}) {
    options = _.defaults({}, options, {
        lineWidth: false, // true, false
        lineInterpolations: false
    });

    const seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});

    describe('Line graphics renderer component', () => {

        if (options.lineWidth) {
            it('should support lineWidth property', () => {
                const render = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component lineWidth={10}/>
                </Chart>).render();
                const pathLines = render.find('path');
                expect(pathLines.prop('stroke-width')).toEqual('10');
                // propTypes
                expect(Component.propTypes.lineWidth).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component lineWidth={15}/>
                </Chart>)).not.toHaveBeenCalled();
            });
        }

        if (_.isArray(options.lineInterpolations) && options.lineInterpolations.length) {
            it('should support interpolation property', () => {

                _.forEach(options.lineInterpolations, interpolation => {
                    const wrapper = shallow(<Chart width={100} height={100} series={seriesObjects3x5}>
                        <Component interpolation={interpolation}/>
                    </Chart>);
                    const d = wrapper.render().find('path').first().prop('d');
                    expect(d.length).toBeGreaterThan(20);
                });
                // propTypes
                expect(Component.propTypes.interpolation).toEqual(jasmine.any(Function));
                expect(spyOnWarnings(() => <Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component interpolation={options.lineInterpolations[0]}/>
                </Chart>)).not.toHaveBeenCalled();
            });
        }


    });

}
