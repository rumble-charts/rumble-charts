'use strict';

const {mount} = require('enzyme');

const Cloud = require('../../lib/Cloud');
const Chart = require('../../lib/Chart');

const graphicsComponent = require('../helpers/graphicsComponent');
const generateRandomSeries = require('../helpers/generateRandomSeries');
const later = require('../helpers/later');

describe('Cloud', () => {

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

    graphicsComponent(Cloud, {
        deepestTag: 'text',
        pointGroupClassName: 'label',
        renderMethod: 'mount',
        delay: 1000,
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
        chartWidth: 1000,
        chartHeight: 1000
    });

    pit('should update the chart', () => {
        const wrapper = mount(<Chart width={1000} height={1000} series={series1}>
            <Cloud />
        </Chart>);

        const cloud = wrapper.find(Cloud);
        expect(cloud.prop('series')).toEqual(series1);
        return later(() => {
            spyOn(Cloud.prototype, 'componentWillReceiveProps');
            wrapper.setProps({series: series2});
            expect(Cloud.prototype.componentWillReceiveProps).toHaveBeenCalledTimes(1);
            expect(cloud.prop('series')).toEqual(series2);
        }, 1000);
    });

});
