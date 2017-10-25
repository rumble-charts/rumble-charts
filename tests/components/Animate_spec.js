import {shallow, mount} from 'enzyme';
import _ from 'lodash';
import Animate from '../../src/Animate';
import eases from '../../src/helpers/eases';
import normalizeSeries from '../../src/helpers/normalizeSeries';
import generateRandomSeries from '../helpers/generateRandomSeries';
import later from '../helpers/later';

const series1 = generateRandomSeries(3, 5, {type: 'object'});
const series2 = generateRandomSeries(3, 5, {type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const Graphics = () => <span />;
Graphics.displayName = 'Graphics';

describe('Animate', () => {

    it('should render g element and takes a series object', () => {
        const wrapper = shallow(<Animate series={series1} className='animate'>
            <Graphics />
        </Animate>);
        const g = wrapper.find('g');
        expect(g.length).toEqual(1);
        expect(g.prop('className')).toEqual('animate');
        const expectedSeries = wrapper.find('Graphics').prop('series');
        expect(expectedSeries).toEqual(series1);
    });

    it('should interpolate props', () => {
        const wrapper = mount(<Animate
            series={series1}
            minX={0} maxX={2} minY={0} maxY={100}
            layerWidth={100} layerHeight={100}
            duration={500}
            interpolateProps={['series', 'maxX', 'maxY', 'minX', 'minY', 'layerWidth', 'layerHeight', 'newProp']}>
            <Graphics />
        </Animate>);
        const expectedSeries = wrapper.find('Graphics').prop('series');
        expect(expectedSeries).toEqual(series1);
        wrapper.setProps({
            series: series2,
            minX: 1,
            maxX: 3,
            minY: -50,
            maxY: 50,
            layerWidth: 50,
            layerHeight: 150,
            newProp: 'value'
        });

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).not.toEqual(series1);
            expect(expectedSeries).not.toEqual(series2);
            if (series1[0].data[0].y < series2[0].data[0].y) {
                expect(expectedSeries[0].data[0].y).not.toBeLessThan(series1[0].data[0].y);
                expect(expectedSeries[0].data[0].y).not.toBeGreaterThan(series2[0].data[0].y);
            } else {
                expect(expectedSeries[0].data[0].y).not.toBeGreaterThan(series1[0].data[0].y);
                expect(expectedSeries[0].data[0].y).not.toBeLessThan(series2[0].data[0].y);
            }
            expect(Graphics.prop('minX')).not.toBeLessThan(0);
            expect(Graphics.prop('maxX')).not.toBeLessThan(2);
            expect(Graphics.prop('minY')).not.toBeGreaterThan(0);
            expect(Graphics.prop('maxY')).not.toBeGreaterThan(100);
            expect(Graphics.prop('layerWidth')).not.toBeGreaterThan(100);
            expect(Graphics.prop('layerHeight')).not.toBeLessThan(100);

        }, 250).then(() =>
            later(() => {
                wrapper.update();
                const Graphics = wrapper.find('Graphics');
                const expectedSeries = Graphics.prop('series');
                expect(expectedSeries).toEqual(series2);
                expect(Graphics.prop('minX')).toEqual(1);
                expect(Graphics.prop('maxX')).toEqual(3);
                expect(Graphics.prop('minY')).toEqual(-50);
                expect(Graphics.prop('maxY')).toEqual(50);
                expect(Graphics.prop('layerWidth')).toEqual(50);
                expect(Graphics.prop('layerHeight')).toEqual(150);

            }, 500)
        );
    });

    it('should log FPS metrics', () => {
        const wrapper = mount(<Animate
            series={series1}
            logFPS={true}
            duration={100}>
            <Graphics />
        </Animate>);
        const expectedSeries = wrapper.find('Graphics').prop('series');
        expect(expectedSeries).toEqual(series1);
        let consoleWarn = console.warn;
        console.warn = jasmine.createSpy('console.warn');
        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
            expect(console.warn).toHaveBeenCalled();
            console.warn = consoleWarn;
        }, 200);
    });

    it('should stop timer on unmount', () => {
        const wrapper = mount(<Animate
            series={series1}
            duration={10}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            const timer = wrapper.find(Animate).instance()._timer;
            spyOn(timer, 'stop');
            wrapper.unmount();
            expect(timer.stop).toHaveBeenCalledTimes(1);
        }, 100);
    });

    it('should interpolate series points from numbers to objects', () => {
        const wrapper = mount(<Animate
            series={seriesNumber}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
        }, 250);
    });

    it('should interpolate series points from objects to numbers', () => {
        const wrapper = mount(<Animate
            series={series2}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: seriesNumber});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(normalizeSeries({series: seriesNumber}).series);
        }, 250);
    });

    it('should interpolate series points from arrays to objects', () => {
        const wrapper = mount(<Animate
            series={seriesArray}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
        }, 250);
    });

    it('should interpolate series points from null to objects', () => {
        const wrapper = mount(<Animate
            series={[{data: [null]}]}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
        }, 250);
    });

    it('should interpolate series from nothing to objects', () => {
        const wrapper = mount(<Animate
            series={null}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
        }, 250);
    });

    it('should trigger onStart and onEnd callback', () => {
        const onStart = jasmine.createSpy('onStart');
        const onEnd = jasmine.createSpy('onEnd');
        const wrapper = mount(<Animate
            series={series1}
            onStart={onStart}
            onEnd={onEnd}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
            expect(onStart).toHaveBeenCalledTimes(1);
            expect(onEnd).toHaveBeenCalledTimes(1);
        }, 250);
    });

    it('should support ease prop as a function', () => {
        const wrapper = mount(<Animate
            series={series1}
            ease={eases['linear-out-in']}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
        }, 250);
    });

    it('should support empty ease prop', () => {
        const wrapper = mount(<Animate
            series={series1}
            ease={null}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(expectedSeries).toEqual(series2);
        }, 250);
    });

    it('should support sequential updates and should not mutate series data', () => {
        const originalSeries1 = _.cloneDeep(series1);
        const originalSeries2 = _.cloneDeep(series2);

        const onStart = jest.fn();

        const wrapper = mount(<Animate
            series={series1}
            onStart={onStart}
            minX={0} maxX={2} minY={0} maxY={100}
            layerWidth={100} layerHeight={100}
            duration={200}>
            <Graphics />
        </Animate>);

        wrapper.setProps({series: series2});
        expect(onStart).toHaveBeenCalledTimes(1);

        wrapper.setProps({
            series: series1,
            minX: 1,
            maxX: 3,
            minY: -50,
            maxY: 50,
            layerWidth: 50,
            layerHeight: 150
        });
        expect(onStart).toHaveBeenCalledTimes(2);

        return later(() => {
            wrapper.update();
            const Graphics = wrapper.find('Graphics');
            const expectedSeries = Graphics.prop('series');
            expect(originalSeries1).toEqual(series1);
            expect(originalSeries2).toEqual(series2);
            expect(expectedSeries).toEqual(series1);
            expect(wrapper.state('series')).toEqual(series1);
        }, 300);
    });

});
