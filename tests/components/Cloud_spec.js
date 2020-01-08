import React from 'react';
import {mount} from 'enzyme';
import {createCanvas} from 'canvas';

import Cloud from '../../src/Cloud';
import Chart from '../../src/Chart';

import graphicsComponent from '../helpers/graphicsComponent';
import generateRandomSeries from '../helpers/generateRandomSeries';
import later from '../helpers/later';

describe('Cloud', () => {

    const WIDTH = 1000;
    const HEIGHT = 1000;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const TestCloud = props => <Cloud {...props} canvas={canvas} random={() => 0.2} />;
    TestCloud.displayName = Cloud.displayName;
    TestCloud.propTypes = Cloud.propTypes;
    TestCloud.defaultProps = Cloud.defaultProps;

    const series1 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex}) => ({label: `${seriesIndex}-${pointIndex}`})
    });
    const series2 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex}) => ({label: `${seriesIndex}-${pointIndex}`})
    });
    const series3 = [{
        data: [
            {x: 0, y: 45, label: '45'}, {x: 1, y: 50, label: '50'},
            {x: 2, y: 55, label: '55'}, {x: 3, y: 2, label: ''}
        ]
    }];

    graphicsComponent(TestCloud, {
        deepestTag: 'text',
        pointGroupClassName: 'label',
        renderMethod: 'mount',
        delay: 500,
        defaultProps: {
            colors: 'category20',
            seriesVisible: true,
            labelVisible: true,
            font: 'serif',
            minFontSize: 10,
            maxFontSize: 100,
            fontStyle: 'normal',
            fontWeight: 'normal',
            rotate: 0,
            spiral: 'archimedean',
            padding: 1,
            random: Math.random
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            labelVisible: ['text']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            labelAttributes: ['text']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            labelStyle: ['text']
        },
        seriesObjects3x5: series1,
        chartWidth: WIDTH,
        chartHeight: HEIGHT
    });

    it('should update the chart', () => {
        const wrapper = mount(<Chart width={1000} height={1000} series={series1}>
            <TestCloud />
        </Chart>);

        const cloud = wrapper.find(Cloud);
        expect(cloud.prop('series')).toEqual(series1);
        wrapper.render();
        return new Promise(resolve => {
            wrapper.setProps({series: series2}, () => {
                wrapper.render();
                const cloud = wrapper.find(Cloud);
                expect(cloud.prop('series')).toEqual(series2);
                resolve();
            });
        });
    });

    it('should skip empty labels', () => {
        const width = 100;
        const height = 100;
        const wrapper = mount(<Chart width={width} height={height} series={series3}>
            <Cloud minFontSize={20} maxFontSize={45} canvas={createCanvas(width, height)} />
        </Chart>);

        return later(() => {
            expect(wrapper.find('text').length).toBeLessThanOrEqual(2);
        }, 200);
    });

    it('should work without setting canvas', () => {
        const wrapper = mount(<Chart width={100} height={100} series={[]}>
            <Cloud />
        </Chart>);
        expect(wrapper.html()).toStrictEqual(
            '<svg width="100" height="100" viewBox="0 0 100 100"><g transform="translate(50,50)"></g></svg>'
        );
    });
});
