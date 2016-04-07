'use strict';

const {shallow} = require('enzyme');
const _ = require('lodash');
const Chart = require('../../lib/Chart');
const generateRandomSeries = require('./generateRandomSeries');

module.exports = function (Component, options = {}) {
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
                expect(Component.propTypes.lineWidth({lineWidth: 15}, 'lineWidth', '', null)).toEqual(null);
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
                expect(Component.propTypes.interpolation({interpolation: options.lineInterpolations[0]}, 'interpolation', '', null)).toEqual(null);
            });
        }


    });

};
