'use strict';

const enzyme = require('enzyme');
const generateRandomSeries = require('../helpers/generateRandomSeries');
const spyOnWarnings = require('../helpers/spyOnWarnings');
const Chart = require('../../src/Chart');

const Ticks = require('../../src/Ticks');

describe('Ticks', () => {

    const chartWidth = 500;
    const chartHeight = 500;
    const series = generateRandomSeries(3, 10, {type: 'object'});
    const render = enzyme['shallow'];

    // test
    // - what should be rendered
    // - how it should be rendered

    // test props:
    // - ticks

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
                <Ticks className='ticks'/>
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
                <Ticks className='ticks'/>
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
                <Ticks className='chart' style={{transition: '100ms'}}/>
            </Chart>);
            const root = wrapper.render().find('g.chart');
            expect(root.prop('style').transition).toEqual('100ms');
        });

        it('should be correctly defined in propTypes', () => {
            expect(Ticks.propTypes.style).toEqual(jasmine.any(Function));
            expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks style={{transition: '100ms'}}/>
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
                <Ticks className='ticks' opacity={0.9}/>
            </Chart>);
            const root = wrapper.render().find('g.ticks');
            expect(root.prop('opacity')).toEqual('0.9');
        });

        it('should be correctly defined in propTypes', () => {
            expect(Ticks.propTypes.opacity).toEqual(jasmine.any(Function));
            expect(spyOnWarnings(() => <Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks opacity={0.9}/>
            </Chart>)).not.toHaveBeenCalled();
        });

        it('should have no default value', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(wrapper.find(Ticks).prop('opacity')).toBeUndefined();
        });

    });

    it('should have no children', () => {
        const html1 = render(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Ticks/>
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

});
