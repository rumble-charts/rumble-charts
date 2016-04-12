'use strict';

const graphicsComponent = require('../helpers/graphicsComponent');

const Cloud = require('../../lib/Cloud');
const generateRandomSeries = require('../helpers/generateRandomSeries');

describe('Cloud', () => {

    // TODO:
    // tests for:
    // - font, minFontSize, maxFontSize, fontStyle, fontWeight, rotate, spiral, padding, random
    // - label, labelFormat

    const seriesObjects3x5 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex}) => ({label: `${seriesIndex}-${pointIndex}`})
    });

    graphicsComponent(Cloud, {
        deepestTag: 'text',
        pointGroupClassName: 'label',
        renderMethod: 'mount',
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
        seriesObjects3x5: seriesObjects3x5,
        chartWidth: 1000,
        chartHeight: 1000
    });

});
