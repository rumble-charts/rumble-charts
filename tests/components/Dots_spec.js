'use strict';

const graphicsComponent = require('../helpers/graphicsComponent');

const Dots = require('../../lib/Dots');

describe('Dots', () => {

    // TODO:
    // tests for:
    // - dotType, dotRender, circleRadius, circleAttributes, ellipseRadiusX, ellipseRadiusY, ellipseAttributes
    // - symbolType, symbolAttributes, label, labelFormat, labelAttributes, path, pathAttributes

    graphicsComponent(Dots, {
        deepestTag: 'circle',
        pointGroupClassName: 'dot',
        pointStyling: true,
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
            dotVisible: ['circle']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            dotAttributes: ['circle'],
            circleAttributes: ['circle']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            groupStyle: ['g', 'dot'],
            dotStyle: ['circle']
        }

    });

});
