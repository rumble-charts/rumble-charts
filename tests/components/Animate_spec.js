'use strict';

const {shallow, mount} = require('enzyme');
const Animate = require('../../lib/Animate');
const generateRandomSeries = require('../helpers/generateRandomSeries');
const later = require('../helpers/later');

const series1 = generateRandomSeries(3, 5, {type: 'object'});
const series2 = generateRandomSeries(3, 5, {type: 'object'});

describe('Animate', () => {

    it('should render g element and takes a series object', () => {
        const wrapper = shallow(<Animate series={series1} className='animate'>
            <span />
        </Animate>);
        const g = wrapper.find('g');
        expect(g.length).toEqual(1);
        expect(g.prop('className')).toEqual('animate');
        const expectedSeries = wrapper.find('span').prop('series');
        expect(expectedSeries).toEqual(series1);
    });

    pit('should interpolate props', () => {
        const wrapper = mount(<Animate
            series={series1}
            minX={0} maxX={2} minY={0} maxY={100}
            layerWidth={100} layerHeight={100}
            duration={100}>
            <span />
        </Animate>);
        const expectedSeries = wrapper.find('span').prop('series');
        expect(expectedSeries).toEqual(series1);
        jest.useRealTimers();
        wrapper.setProps({
            series: series2,
            minX: 1,
            maxX: 3,
            minY: -50,
            maxY: 50,
            layerWidth: 50,
            layerHeight: 150
        });

        return later(() => {
            const span = wrapper.find('span');
            const expectedSeries = span.prop('series');
            expect(expectedSeries).not.toEqual(series1);
            expect(expectedSeries).not.toEqual(series2);
            if (series1[0].data[0].y < series2[0].data[0].y) {
                expect(expectedSeries[0].data[0].y).not.toBeLessThan(series1[0].data[0].y);
                expect(expectedSeries[0].data[0].y).not.toBeGreaterThan(series2[0].data[0].y);
            } else {
                expect(expectedSeries[0].data[0].y).not.toBeGreaterThan(series1[0].data[0].y);
                expect(expectedSeries[0].data[0].y).not.toBeLessThan(series2[0].data[0].y);
            }
            expect(span.prop('minX')).not.toBeLessThan(0);
            expect(span.prop('maxX')).not.toBeLessThan(2);
            expect(span.prop('minY')).not.toBeGreaterThan(0);
            expect(span.prop('maxY')).not.toBeGreaterThan(100);
            expect(span.prop('layerWidth')).not.toBeGreaterThan(100);
            expect(span.prop('layerHeight')).not.toBeLessThan(100);

        }, 50).then(() => later(() => {
            const span = wrapper.find('span');
            const expectedSeries = span.prop('series');
            expect(expectedSeries).toEqual(series2);
            expect(span.prop('minX')).toEqual(1);
            expect(span.prop('maxX')).toEqual(3);
            expect(span.prop('minY')).toEqual(-50);
            expect(span.prop('maxY')).toEqual(50);
            expect(span.prop('layerWidth')).toEqual(50);
            expect(span.prop('layerHeight')).toEqual(150);

        }, 100));
    });

    pit('should log FPS metrics', () => {
        const wrapper = mount(<Animate
            series={series1}
            logFPS={true}
            duration={10}>
            <span />
        </Animate>);
        const expectedSeries = wrapper.find('span').prop('series');
        expect(expectedSeries).toEqual(series1);
        jest.useRealTimers();
        let consoleWarn = console.warn;
        console.warn = jasmine.createSpy('console.warn');
        wrapper.setProps({series: series2});

        return later(() => {
            const span = wrapper.find('span');
            const expectedSeries = span.prop('series');
            expect(expectedSeries).toEqual(series2);
            expect(console.warn).toHaveBeenCalled();
            console.warn = consoleWarn;
        }, 50);
    });

    pit('should stop timer on unmount', () => {
        const wrapper = mount(<Animate
            series={series1}
            duration={1}>
            <span />
        </Animate>);

        jest.useRealTimers();
        wrapper.setProps({series: series2});

        return later(() => {
            const timer = wrapper.find(Animate).node._timer;
            spyOn(timer, 'stop');
            wrapper.unmount();
            expect(timer.stop).toHaveBeenCalledTimes(1);
        }, 30);
    });

});
