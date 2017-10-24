import _ from 'lodash';
import {mount} from 'enzyme';
import Chart from '../../src/Chart';
import Handlers from '../../src/Handlers';
import generateRandomSeries from '../helpers/generateRandomSeries';

const series = generateRandomSeries(3, 5, {min: 0, max: 100, type: 'object'});
const seriesNumber = generateRandomSeries(3, 5, {type: 'number'});
const seriesArray = generateRandomSeries(3, 5, {type: 'array'});

const chartWidth = 500;
const chartHeight = 1000;

const Graphics = () => <span />;
Graphics.displayName = 'Graphics';

describe('Handlers', () => {

    it('should render g element and takes a series object', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Handlers className='chart'>
                <Graphics />
            </Handlers>
        </Chart>);
        const g = wrapper.find('g.chart');
        expect(g.length).toEqual(1);
        expect(g.prop('className')).toEqual('chart');
        expect(g.children('rect').at(0).props()).toEqual(jasmine.objectContaining({
            x: 0, y: 0, width: chartWidth, height: chartHeight
        }));
        const expectedSeries = wrapper.find('Graphics').prop('series');
        expect(expectedSeries).toEqual(series);
    });

    it('should convert series points from numbers to objects', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={seriesNumber}>
            <Handlers>
                <Graphics />
            </Handlers>
        </Chart>);
        expect(wrapper.find('Graphics').prop('series')[0].data[0].y).toEqual(seriesNumber[0].data[0]);
    });

    it('should convert series points from arrays to objects', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight} series={seriesArray}>
            <Handlers>
                <Graphics />
            </Handlers>
        </Chart>);
        expect(wrapper.find('Graphics').prop('series')[0].data[0].y).toEqual(seriesArray[0].data[0][1]);
    });

    it('should handle onMouseMove event', done => {
        const onMouseMove = event => {
            expect(event.clientX).toEqual(chartWidth * 0.75);
            expect(event.clientY).toEqual(chartHeight * 0.5);
            expect(event.x).toEqual(3.25);
            expect(event.y).toEqual(50);
            expect(event.originalEvent).toEqual(jasmine.any(Object));
            expect(event.scaleX).toBeDefined();
            expect(event.scaleY).toBeDefined();
            expect(event.closestPoints.length).toBeGreaterThan(1);
            let minDistance = 0;
            _.forEach(event.closestPoints, closestPoint => {
                expect(closestPoint.seriesIndex).toEqual(jasmine.any(Number));
                expect(closestPoint.pointIndex).toEqual(jasmine.any(Number));
                expect(closestPoint.distance).not.toBeLessThan(minDistance);
                minDistance = closestPoint.distance;
                expect(closestPoint.point).toEqual(jasmine.any(Object));
                expect(closestPoint.point.x).toEqual(jasmine.any(Number));
                expect(closestPoint.point.y).toEqual(jasmine.any(Number));
            });
            done();
        };

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove}>
                <Graphics />
            </Handlers>
        </Chart>);
        wrapper.find(Handlers).instance().rect.getBoundingClientRect = () => ({
            left: chartWidth * 0.1,
            top: chartHeight * 0.1,
            width: chartWidth * 0.6,
            height: chartHeight * 0.6
        });
        wrapper.find(Handlers).simulate('mouseMove', {
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

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove} distance='x'>
                <Graphics />
            </Handlers>
        </Chart>);
        wrapper.find(Handlers).instance().rect.getBoundingClientRect = () => ({
            left: chartWidth * 0.1,
            top: chartHeight * 0.1,
            width: chartWidth * 0.6,
            height: chartHeight * 0.6
        });
        wrapper.find(Handlers).simulate('mouseMove', {
            clientX: chartWidth * 0.55,
            clientY: chartHeight * 0.4
        });
    });

    it('should support distance type "y" for onMouseMove event', done => {
        const onMouseMove = event => {
            expect(event.closestPoints.length).toBeGreaterThan(0);
            expect(event.closestPoints[0].distance).toEqual(jasmine.any(Number));
            done();
        };

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove} distance='y'>
                <Graphics />
            </Handlers>
        </Chart>);
        wrapper.find(Handlers).instance().rect.getBoundingClientRect = () => ({
            left: chartWidth * 0.1,
            top: chartHeight * 0.1,
            width: chartWidth * 0.6,
            height: chartHeight * 0.6
        });
        wrapper.find(Handlers).simulate('mouseMove', {
            clientX: chartWidth * 0.55,
            clientY: chartHeight * 0.4
        });
    });

    it('should handle onMouseLeave event', done => {
        const onMouseLeave = event => {
            expect(event.type).toEqual('mouseleave');
            done();
        };

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseLeave={onMouseLeave}>
                <Graphics />
            </Handlers>
        </Chart>);
        wrapper.find(Handlers).simulate('mouseLeave');
    });

    it('should handle onClick event', done => {
        const onClick = event => {
            expect(event.originalEvent.type).toEqual('click');
            done();
        };

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onClick={onClick}>
                <Graphics />
            </Handlers>
        </Chart>);
        wrapper.find(Handlers).simulate('click');
    });

    it('should handle wrong scales and wrong ratio', done => {
        const onMouseMove = event => {
            expect(event.clientX).toEqual(jasmine.any(Number));
            expect(event.clientY).toEqual(jasmine.any(Number));
            expect(event.x).toEqual(jasmine.any(Number));
            expect(event.y).toEqual(jasmine.any(Number));
            done();
        };

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight} series={series}
            minY={0} maxY={100}>
            <Handlers onMouseMove={onMouseMove}>
                <Graphics />
            </Handlers>
        </Chart>);
        wrapper.find(Handlers).instance().ratio = 0;
        wrapper.find(Handlers).instance().rect.getBoundingClientRect = () => ({
            left: chartWidth * 0.1,
            top: chartHeight * 0.1,
            width: chartWidth * 0.6,
            height: chartHeight * 0.6
        });
        wrapper.find(Handlers).simulate('mouseMove', {
            clientX: chartWidth * 0.6,
            clientY: chartHeight * 0.4
        });
    });

});
