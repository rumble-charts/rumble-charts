'use strict';

const graphicsComponent = require('../helpers/graphicsComponent');

const Labels = require('../../src/Labels');

describe('Labels', () => {

    // TODO:
    // tests for:
    // - label, labelFormat

    graphicsComponent(Labels, {
        deepestTag: 'text',
        pointGroupClassName: 'dot',
        defaultProps: {
            colors: 'category20',
            circleRadius: 4,
            ellipseRadiusX: 6,
            ellipseRadiusY: 4,
            seriesVisible: true,
            dotVisible: true
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            dotVisible: ['text']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            dotAttributes: ['text'],
            labelAttributes: ['text']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            groupStyle: ['g', 'dot'],
            dotStyle: ['text']
        }

    });

});
