'use strict';

const graphicsComponent = require('../helpers/graphicsComponent');

const Pies = require('../../src/Pies');

describe('Pies', () => {

    // TODO:
    // tests for:
    // - position, innerRadius, cornerRadius, innerPadding, groupPadding, combined, startAngle, endAngle
    // - padAngle, gradientStep, pieWidth

    graphicsComponent(Pies, {
        pointGroupClassName: 'pie',
        pointStyling: true,
        defaultProps: {
            colors: 'category20',
            seriesVisible: true,
            pieVisible: true,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            padAngle: 0,
            innerRadius: 0,
            cornerRadius: 0,
            groupPadding: 0,
            innerPadding: 0,
            position: 'center middle',
            gradientStep: 0.01
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            pieVisible: ['path']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            pieAttributes: ['path']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            pieStyle: ['path'],
            groupStyle: ['g', 'pie']
        }

    });

});
