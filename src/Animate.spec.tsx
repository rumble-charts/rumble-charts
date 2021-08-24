import type {Point} from './types';

import React from 'react';
import {create, act} from 'react-test-renderer';

import {Animate} from './Animate';
import {eases, normalizeSeries, generateRandomSeries} from './helpers';

const series1 = generateRandomSeries(3, 5, {type: 'object'});
const series2 = generateRandomSeries(3, 5, {type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const Graphics = (props: any) => <span {...props} />;

describe('Animate', () => {

    it('should render g element and takes a series object', () => {
        const renderer = create(<Animate series={series1} className='animate'>
            <Graphics />
        </Animate>);
        const g = renderer.root.findAllByType('g');
        expect(g.length).toEqual(1);
        expect(g[0].props.className).toEqual('animate');
        const expectedSeries = renderer.root.findByType(Graphics).props.series;
        expect(expectedSeries).toEqual(series1);
    });

    it('should interpolate props', async() => {
        const interpolateProps = ['series', 'maxX', 'maxY', 'minX', 'minY', 'layerWidth', 'layerHeight', 'newProp'];

        const renderer = create(<Animate
            series={series1}
            minX={0} maxX={2} minY={0} maxY={100}
            layerWidth={100} layerHeight={100}
            duration={500}
            interpolateProps={interpolateProps}>
            <Graphics />
        </Animate>);

        const component = renderer.root.findByType(Graphics);

        expect(component.props.series).toEqual(series1);

        renderer.update(<Animate
            series={series2}
            minX={1} maxX={3} minY={-50} maxY={50}
            layerWidth={50} layerHeight={150}
            duration={500}
            newProp='value'
            interpolateProps={interpolateProps}>
            <Graphics />
        </Animate>);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(component.props.series).not.toEqual(series1);
        expect(component.props.series).not.toEqual(series2);
        const point1 = (series1[0].data[0] as Point);
        const point2 = (series2[0].data[0] as Point);
        if (point1.y < point2.y) {
            expect(component.props.series[0].data[0].y).not.toBeLessThan(point1.y);
            expect(component.props.series[0].data[0].y).not.toBeGreaterThan(point2.y);
        } else {
            expect(component.props.series[0].data[0].y).not.toBeGreaterThan(point1.y);
            expect(component.props.series[0].data[0].y).not.toBeLessThan(point2.y);
        }
        expect(component.props.minX).not.toBeLessThan(0);
        expect(component.props.maxX).not.toBeLessThan(2);
        expect(component.props.minY).not.toBeGreaterThan(0);
        expect(component.props.maxY).not.toBeGreaterThan(100);
        expect(component.props.layerWidth).not.toBeGreaterThan(100);
        expect(component.props.layerHeight).not.toBeLessThan(100);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(component.props.series).toEqual(series2);
        expect(component.props.minX).toEqual(1);
        expect(component.props.maxX).toEqual(3);
        expect(component.props.minY).toEqual(-50);
        expect(component.props.maxY).toEqual(50);
        expect(component.props.layerWidth).toEqual(50);
        expect(component.props.layerHeight).toEqual(150);
    });

    it('should log FPS metrics', async() => {
        const renderer = create(<Animate
            series={series1}
            logFPS={true}
            duration={100}>
            <Graphics />
        </Animate>);

        const component = renderer.root.findByType(Graphics);

        expect(component.props.series).toEqual(series1);
        const consoleWarn = console.warn;
        console.warn = jest.fn();

        renderer.update(<Animate
            series={series2}
            logFPS={true}
            duration={100}>
            <Graphics />
        </Animate>);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(component.props.series).toEqual(series2);
        expect(console.warn).toHaveBeenCalled();
        console.warn = consoleWarn;
    });

    it('should stop timer on unmount', () => {
        const onStart = jest.fn();
        const onEnd = jest.fn();
        const onCancel = jest.fn();

        const renderer = create(<Animate
            series={series1}
            onStart={onStart}
            onEnd={onEnd}
            onCancel={onCancel}
            duration={1000}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            onStart={onStart}
            onEnd={onEnd}
            onCancel={onCancel}
            duration={1000}>
            <Graphics />
        </Animate>);

        act(() => {
            jest.advanceTimersByTime(10);
        });

        renderer.unmount();

        act(() => {
            jest.advanceTimersByTime(10);
        });

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onEnd).not.toHaveBeenCalledTimes(1);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should interpolate series points from numbers to objects', () => {
        const renderer = create(<Animate
            series={seriesNumber}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
    });

    it('should interpolate series points from objects to numbers', () => {
        const renderer = create(<Animate
            series={series2}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={seriesNumber}
            duration={200}>
            <Graphics />
        </Animate>);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series)
            .toEqual(normalizeSeries({series: seriesNumber}).series);
    });

    it('should interpolate series points from arrays to objects', () => {
        const renderer = create(<Animate
            series={seriesArray}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
    });

    it('should interpolate series points from null to objects', () => {
        const renderer = create(<Animate
            // @ts-ignore
            series={[{data: [null]}]}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
    });

    it('should interpolate series from nothing to objects', () => {
        const renderer = create(<Animate
            // @ts-ignore
            series={null}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
    });

    it('should trigger onStart and onEnd callback', () => {
        const onStart = jest.fn();
        const onEnd = jest.fn();
        const onCancel = jest.fn();

        const renderer = create(<Animate
            series={series1}
            onStart={onStart}
            onEnd={onEnd}
            onCancel={onCancel}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            onStart={onStart}
            onEnd={onEnd}
            onCancel={onCancel}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('should support ease prop as a function', () => {
        const renderer = create(<Animate
            series={series1}
            ease={eases['linear-out-in']}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            ease={eases['linear-out-in']}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
    });

    it('should support empty ease prop', () => {
        const renderer = create(<Animate
            series={series1}
            // @ts-ignore
            ease={null}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            series={series2}
            // @ts-ignore
            ease={null}
            duration={200}>
            <Graphics />
        </Animate>);

        expect(renderer.root.findByType(Graphics).props.series).not.toEqual(series2);

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(renderer.root.findByType(Graphics).props.series).toEqual(series2);
    });

    it('should support sequential updates and should not mutate series data', () => {
        const originalSeries1 = JSON.parse(JSON.stringify(series1));
        const originalSeries2 = JSON.parse(JSON.stringify(series2));

        const onStart = jest.fn();

        const renderer = create(<Animate
            tag='div'
            series={series1}
            onStart={onStart}
            minX={0} maxX={2} minY={0} maxY={100}
            layerWidth={100} layerHeight={100}
            duration={200}>
            <Graphics />
        </Animate>);

        renderer.update(<Animate
            tag='div'
            series={series2}
            onStart={onStart}
            minX={0} maxX={2} minY={0} maxY={100}
            layerWidth={100} layerHeight={100}
            duration={200}>
            <Graphics />
        </Animate>);

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(onStart).toHaveBeenCalledTimes(1);

        renderer.update(<Animate
            tag='div'
            series={series1}
            onStart={onStart}
            minX={1} maxX={3} minY={-50} maxY={50}
            layerWidth={50} layerHeight={150}
            duration={200}>
            <Graphics />
        </Animate>);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(onStart).toHaveBeenCalledTimes(2);
        expect(originalSeries1).toEqual(series1);
        expect(originalSeries2).toEqual(series2);
        expect(renderer.root.findByType(Graphics).props.series).toEqual(series1);
    });

});
