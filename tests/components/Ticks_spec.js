import {shallow, mount} from 'enzyme';
import generateRandomSeries from '../helpers/generateRandomSeries';
import spyOnWarnings from '../helpers/spyOnWarnings';
import Chart from '../../src/Chart';

import Ticks from '../../src/Ticks';

describe('Ticks', () => {

    const chartWidth = 500;
    const chartHeight = 500;
    const series = generateRandomSeries(3, 10, {type: 'object'});
    const render = shallow;

    // TODO: test props:
    // - axis x, y
    // - position (9-point)

    // - tickV.A.S.
    // - labelV.A.S.
    // - label
    // - labelFormat
    // - lineV.A.S.
    // - lineLength
    // - lineOffset

    describe('should support className property', () => {

        it('should render proper class names', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks className='ticks' />
            </Chart>);
            const root = wrapper.render().find('g.ticks');
            expect(root.length).toEqual(1);
            const ticks = root.find('g.ticks-tick');
            expect(ticks.length).toEqual(5);
            const labels = root.find('text.ticks-label');
            expect(labels.length).toEqual(5);
            const lines = root.find('path.ticks-line');
            expect(lines.length).toEqual(5);

            expect(ticks.first().find('text.ticks-label').length).toEqual(1);
            expect(ticks.first().find('path.ticks-line').length).toEqual(1);
        });

        it('should be correctly defined in propTypes', () => {
            expect(Ticks.propTypes.className).toEqual(jasmine.any(Function));
            expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks className='ticks' />
            </Chart>)).not.toHaveBeenCalled();
        });

        it('should have no default value', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(wrapper.find(Ticks).prop('className')).toBeUndefined();
        });

    });

    describe('should support style property', () => {

        it('should render style in the root element', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}>
                <Ticks className='chart' style={{transition: '100ms'}} />
            </Chart>);
            const root = wrapper.render().find('g.chart');
            expect(root.prop('style').transition).toEqual('100ms');
        });

        it('should be correctly defined in propTypes', () => {
            expect(Ticks.propTypes.style).toEqual(jasmine.any(Function));
            expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks style={{transition: '100ms'}} />
            </Chart>)).not.toHaveBeenCalled();
        });

        it('should have no default value', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(wrapper.find(Ticks).prop('style')).toBeUndefined();
        });

    });

    describe('should support opacity property', () => {

        it('should apply opacity attribute to the root element', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks className='ticks' opacity={0.9} />
            </Chart>);
            const root = wrapper.render().find('g.ticks');
            expect(root.prop('opacity')).toEqual('0.9');
        });

        it('should be correctly defined in propTypes', () => {
            expect(Ticks.propTypes.opacity).toEqual(jasmine.any(Function));
            expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks opacity={0.9} />
            </Chart>)).not.toHaveBeenCalled();
        });

        it('should have no default value', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(wrapper.find(Ticks).prop('opacity')).toBeUndefined();
        });

    });

    it('should have no children', () => {
        const html1 = render(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Ticks />
        </Chart>).html();
        const html2 = render(<Chart width={chartWidth} height={chartHeight} series={series}><Ticks>
            <g>
                <text>Hello</text>
            </g>
        </Ticks></Chart>).html();
        expect(html1).toEqual(html2);
    });

    it('should have some default properties', () => {
        const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
        expect(wrapper.find(Ticks).props()).toEqual(jasmine.objectContaining({
            axis: 'x',
            tickVisible: true,
            labelVisible: true,
            lineVisible: true,
            lineLength: 5,
            lineOffset: 0
        }));
    });

    it('should render ticks with lines and labels', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Ticks className='ticks' axis='y' />
        </Chart>);
        const tick = wrapper.find('g.ticks-tick').first();
        expect(tick.children().length).toEqual(2);
        expect(tick.prop('transform').substr(0, 10)).toEqual('translate(');
        expect(tick.childAt(0).name()).toEqual('text');
        expect(tick.childAt(1).name()).toEqual('path');
    });

    describe('ticks property', () => {
        it('could be a number', () => {
            const ticks = 10;
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks className='ticks' ticks={ticks} axis='y' />
            </Chart>);
            expect(wrapper.find('g.ticks-tick').length).toEqual(ticks);
        });

        describe('could be a list of settings', () => {
            it('should support max ticks value', () => {
                const maxY = 100;
                const minY = 0;
                const ticks = {
                    maxTicks: 5
                };
                const wrapper = mount(<Chart
                    width={chartWidth} height={chartHeight}
                    series={series}
                    maxY={maxY} minY={minY}>
                    <Ticks className='ticks' ticks={ticks} axis='y' maxY={maxY} minY={minY} />
                </Chart>);
                expect(wrapper.find('g.ticks-tick').length).toEqual(ticks.maxTicks + 1);
            });

            it('should support distance value', () => {
                const maxY = 100;
                const ticks = {
                    distance: 25
                };
                const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={maxY}>
                    <Ticks className='ticks' ticks={ticks} axis='y' maxY={maxY} />
                </Chart>);
                expect(wrapper.find('g.ticks-tick').length).toEqual(maxY / ticks.distance);
            });

            it('should support min distance value', () => {
                const maxY = 100;
                const ticks = {
                    maxTicks: 20,
                    minDistance: 10
                };
                const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={maxY}>
                    <Ticks className='ticks' ticks={ticks} axis='y' />
                </Chart>);
                expect(wrapper.find('g.ticks-tick').length).toEqual(maxY / ticks.minDistance + 1);
            });
        });

        it('could be an array of actual ticks', () => {
            const ticks = [9.5, 15, 28, {
                label: 'seventy eight',
                y: 78
            }];
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks className='ticks' ticks={ticks} axis='y' />
            </Chart>);
            expect(wrapper.find('g.ticks-tick').length).toEqual(ticks.length);
            expect(wrapper.find('g.ticks-tick').first().find('text').text()).toEqual('9.5');
            expect(wrapper.find('g.ticks-tick').last().find('text').text()).toEqual('seventy eight');
        });

        it('could be a function', () => {
            const ticks = ({maxY}) => ([maxY, 15, 28, {
                label: 'seventy eight',
                y: 78
            }]);
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks className='ticks' ticks={ticks} axis='y' />
            </Chart>);
            expect(wrapper.find('g.ticks-tick').length).toEqual(4);
            expect(wrapper.find('g.ticks-tick').first().find('text').text()).toEqual('100');
            expect(wrapper.find('g.ticks-tick').last().find('text').text()).toEqual('seventy eight');
        });
    });

});
