import {shallow, mount} from 'enzyme';
import generateRandomSeries from '../helpers/generateRandomSeries';
import spyOnWarnings from '../helpers/spyOnWarnings';
import Chart from '../../src/Chart';

import Ticks from '../../src/Ticks';
import Transform from '../../src/Transform';


function checkVASProperties(propertyName, tag, {chartWidth, chartHeight, series, className = 'ticks'}) {
    const selector = `${tag}.${className}-${propertyName}`;

    describe(`"visible", "attributes" and "style" properties for ${propertyName}s`, () => {

        it(`${propertyName}Visible could be a boolean`, () => {
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Visible`]: false}}
                />
            </Chart>);
            expect(wrapper.find(selector).length).toEqual(0);
        });

        it(`${propertyName}Visible could be a function`, () => {
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Visible`]: ({index}) => index <= 1}}
                />
            </Chart>);
            expect(wrapper.find(selector).length).toEqual(2);
        });

        it(`${propertyName}Attributes could be an object`, () => {
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Attributes`]: {fill: 'red'}}}
                />
            </Chart>);
            expect(wrapper.find(selector).at(0).prop('fill')).toEqual('red');
        });


        it(`${propertyName}Attributes could be a function`, () => {
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Attributes`]: ({index}) => ({fill: index})}}
                />
            </Chart>);
            expect(wrapper.find(selector).at(2).prop('fill')).toEqual(2);
        });


        it(`${propertyName}Style could be an object`, () => {
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Style`]: {fill: 'red'}}}
                />
            </Chart>);
            expect(wrapper.find(selector).at(0).prop('style')).toEqual({fill: 'red'});
        });


        it(`${propertyName}Style could be a function`, () => {
            const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Style`]: ({index}) => ({fill: index})}}
                />
            </Chart>);
            expect(wrapper.find(selector).at(2).prop('style')).toEqual({fill: 2});
        });

    });
}

describe('Ticks', () => {

    const chartWidth = 500;
    const chartHeight = 500;
    const series = generateRandomSeries(3, 10, {type: 'object'});
    const render = shallow;

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
                const minY = 0;
                const ticks = {
                    maxTicks: 20,
                    minDistance: 10
                };
                const wrapper = mount(<Chart
                    width={chartWidth} height={chartHeight} series={series}
                    maxY={maxY} minY={minY}>
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

    checkVASProperties('tick', 'g', {chartWidth, chartHeight, series, className: 'ticks1'});
    checkVASProperties('label', 'text', {chartWidth, chartHeight, series, className: 'ticks2'});
    checkVASProperties('line', 'path', {chartWidth, chartHeight, series, className: 'ticks3'});

    it('should support label property as string', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label='static label'
            />
        </Chart>);
        expect(wrapper.find('text.ticks-label').at(0).text()).toEqual('static label');
    });

    it('should support label property as node', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label={<text className='label'>static node label</text>}
            />
        </Chart>);
        expect(wrapper.find('text.label').at(0).text()).toEqual('static node label');
    });

    it('should support label property as function returns string', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label={({index}) => `label-${index}`}
            />
        </Chart>);
        expect(wrapper.find('text.ticks-label').at(2).text()).toEqual('label-2');
    });

    it('should support label property as function returns node', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label={({index}) => <text className={`label-${index}`}>
                    node-label-{index}
                </text>}
            />
        </Chart>);
        expect(wrapper.find('text.label-2').at(0).text()).toEqual('node-label-2');
    });

    it('should support labelFormat property as function to format a label', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                labelFormat={label => `(${label})`}
            />
        </Chart>);
        expect(wrapper.find('text.ticks-label').at(2).text()).toMatch(/\(.*\)/);
    });

    it('should support swap mode', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Transform method='rotate'>
                <Ticks className='ticks' />
            </Transform>
        </Chart>);
        const root = wrapper.render().find('g.ticks');
        expect(root.length).toEqual(1);
        const ticks = root.find('g.ticks-tick');
        expect(ticks.length).toEqual(5);
        const labels = root.find('text.ticks-label');
        expect(labels.length).toEqual(5);
        const lines = root.find('path.ticks-line');
        expect(lines.length).toEqual(5);
    });


    it('should support lineLength property as number', () => {
        const lineLength = 10;
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineLength={lineLength}
            />
        </Chart>);
        expect(wrapper.find('path.ticks-line').at(0).prop('d')).toEqual(`M0,0 v${lineLength}`);
    });

    it('should support lineLength property as percentage', () => {
        const lineLength = 0.5;
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineLength={lineLength}
            />
        </Chart>);
        expect(wrapper.find('path.ticks-line').at(0).prop('d')).toEqual(`M0,0 v${chartHeight * lineLength}`);
    });

    it('should support lineLength property as function', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineLength={({index}) => index * 10 + 5}
            />
        </Chart>);
        expect(wrapper.find('path.ticks-line').at(2).prop('d')).toEqual('M0,0 v25');
    });

    it('should support lineOffset property as number', () => {
        const lineOffset = 10;
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineOffset={lineOffset}
            />
        </Chart>);
        expect(wrapper.find('path.ticks-line').at(0).prop('d')).toEqual(`M0,${lineOffset} v5`);
    });

    it('should support lineOffset property as percentage', () => {
        const lineOffset = 0.5;
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineOffset={lineOffset}
            />
        </Chart>);
        expect(wrapper.find('path.ticks-line').at(0).prop('d')).toEqual(`M0,${chartHeight * lineOffset} v5`);
    });

    it('should support lineOffset property as function', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineOffset={({index}) => index * 10 + 5}
            />
        </Chart>);
        expect(wrapper.find('path.ticks-line').at(2).prop('d')).toEqual('M0,25 v5');
    });


    // TODO: test props:
    // - axis x, y
    // - position (9-point)

});
