import type {MouseEvent} from './Handlers';

import React from 'react';
import {create} from 'react-test-renderer';

import {Chart} from './Chart';
import {Handlers} from './Handlers';
import {generateRandomSeries} from './helpers';
import {testSelector} from './specs';

const series = generateRandomSeries(3, 5, {min: 0, max: 100, type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const chartWidth = 500;
const chartHeight = 1000;

const Graphics = (props: any) => <span {...props} />;

describe('Handlers', () => {

    it('should render g element and takes a series object', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Handlers className='chart'>
                <Graphics />
            </Handlers>
        </Chart>);

        const g = renderer.root.findAll(testSelector('g.chart'));
        expect(g.length).toEqual(1);
        expect(g[0].props.className).toEqual('chart');
        expect(g[0].findAll(testSelector('rect'))[0].props).toEqual(expect.objectContaining({
            x: 0, y: 0, width: chartWidth, height: chartHeight
        }));

        const expectedSeries = renderer.root.findByType(Graphics).props.series;
        expect(expectedSeries).toEqual(series);
    });

    it('should convert series points from numbers to objects', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesNumber}>
            <Handlers>
                <Graphics />
            </Handlers>
        </Chart>);
        expect(renderer.root.findByType(Graphics).props.series[0].data[0].y).toEqual(seriesNumber[0].data[0]);
    });


    it('should convert series points from arrays to objects', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesArray}>
            <Handlers>
                <Graphics />
            </Handlers>
        </Chart>);
        expect(renderer.root.findByType(Graphics).props.series[0].data[0].y).toEqual(seriesArray[0].data[0][1]);
    });

    it('should handle onMouseMove event', done => {
        const onMouseMove = (event: MouseEvent) => {
            expect(event.clientX).toEqual(chartWidth * 0.75);
            expect(event.clientY).toEqual(chartHeight * 0.5);
            expect(event.x).toEqual(3.25);
            expect(event.y).toEqual(50);
            expect(event.originalEvent).toEqual(expect.any(Object));
            expect(event.scaleX).toBeDefined();
            expect(event.scaleY).toBeDefined();
            expect(event.closestPoints.length).toBeGreaterThan(1);
            let minDistance = 0;
            event.closestPoints.forEach(closestPoint => {
                expect(closestPoint.seriesIndex).toEqual(expect.any(Number));
                expect(closestPoint.pointIndex).toEqual(expect.any(Number));
                expect(closestPoint.distance).not.toBeLessThan(minDistance);
                minDistance = closestPoint.distance;
                expect(closestPoint.point).toEqual(expect.any(Object));
                expect(closestPoint.point.x).toEqual(expect.any(Number));
                expect(closestPoint.point.y).toEqual(expect.any(Number));
            });
            done();
        };

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove}>
                <Graphics />
            </Handlers>
        </Chart>, {
            createNodeMock: (element) => {
                if (element.type === 'rect') {
                    return {
                        getBoundingClientRect: () => ({
                            left: chartWidth * 0.1,
                            top: chartHeight * 0.1,
                            width: chartWidth * 0.6,
                            height: chartHeight * 0.6
                        })
                    };
                }
                return null;
            }
        });

        renderer.root.findByType(Handlers).findByType('g').props.onMouseMove({
            clientX: chartWidth * 0.55,
            clientY: chartHeight * 0.4
        });
    });

    it('should support distance type "x" for onMouseMove event', done => {
        const onMouseMove = event => {
            expect(event.closestPoints.length).toBeGreaterThan(0);
            expect(event.closestPoints[0].distance).toEqual(0.25);
            done();
        };

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove} distance='x'>
                <Graphics />
            </Handlers>
        </Chart>, {
            createNodeMock(element): any {
                if (element.type === 'rect') {
                    return {
                        getBoundingClientRect: () => ({
                            left: chartWidth * 0.1,
                            top: chartHeight * 0.1,
                            width: chartWidth * 0.6,
                            height: chartHeight * 0.6
                        })
                    };
                }
                return null;
            }
        });
        renderer.root.findByType(Handlers).findByType('g').props.onMouseMove({
            clientX: chartWidth * 0.55,
            clientY: chartHeight * 0.4
        });
    });

    it('should support distance type "y" for onMouseMove event', done => {
        const onMouseMove = event => {
            expect(event.closestPoints.length).toBeGreaterThan(0);
            expect(event.closestPoints[0].distance).toEqual(expect.any(Number));
            done();
        };

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove} distance='y'>
                <Graphics />
            </Handlers>
        </Chart>, {
            createNodeMock(element: React.ReactElement): any {
                if (element.type === 'rect') {
                    return {
                        getBoundingClientRect: () => ({
                            left: chartWidth * 0.1,
                            top: chartHeight * 0.1,
                            width: chartWidth * 0.6,
                            height: chartHeight * 0.6
                        })
                    };
                }
                return null;
            }
        });
        renderer.root.findByType(Handlers).findByType('g').props.onMouseMove({
            clientX: chartWidth * 0.55,
            clientY: chartHeight * 0.4
        });
    });

    it('should handle onMouseLeave event', done => {
        const onMouseLeave = event => {
            expect(event.type).toEqual('mouseleave');
            done();
        };

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseLeave={onMouseLeave}>
                <Graphics />
            </Handlers>
        </Chart>);
        renderer.root.findByType(Handlers).findByType('g').props.onMouseLeave({
            type: 'mouseleave'
        });
    });

    it('should handle onClick event', done => {
        const onClick = event => {
            expect(event.originalEvent.type).toEqual('click');
            done();
        };

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onClick={onClick}>
                <Graphics />
            </Handlers>
        </Chart>, {
            createNodeMock(element: React.ReactElement): any {
                if (element.type === 'rect') {
                    return {
                        getBoundingClientRect: () => ({})
                    };
                }
                return null;
            }
        });
        renderer.root.findByType(Handlers).findByType('g').props.onClick({
            type: 'click'
        });
    });

    it('should handle wrong scales and wrong ratio', done => {
        const onMouseMove = event => {
            expect(event.clientX).toEqual(expect.any(Number));
            expect(event.clientY).toEqual(expect.any(Number));
            expect(event.x).toEqual(expect.any(Number));
            expect(event.y).toEqual(expect.any(Number));
            done();
        };

        const renderer = create(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove}>
                <Graphics />
            </Handlers>
        </Chart>, {
            createNodeMock(element: React.ReactElement): any {
                if (element.type === 'rect') {
                    return {
                        getBoundingClientRect: () => ({
                            left: chartWidth * 0.1,
                            top: chartHeight * 0.1,
                            width: chartWidth * 0.6,
                            height: chartHeight * 0.6
                        })
                    };
                }
                return null;
            }
        });
        renderer.root.findByType(Handlers).findByType('g').props.onMouseMove({
            clientX: chartWidth * 0.6,
            clientY: chartHeight * 0.4
        });
    });

});
