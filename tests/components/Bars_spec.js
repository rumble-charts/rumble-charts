'use strict';

const {render} = require('enzyme');
const graphicsComponent = require('../helpers/graphicsComponent');
const generateRandomSeries = require('../helpers/generateRandomSeries');

const Chart = require('../../lib/Chart');
const Bars = require('../../lib/Bars');
const seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});

describe('Bars', () => {

    // TODO:
    // tests for:
    // - combined, groupPadding, innerPadding, barWidth

    graphicsComponent(Bars, {
        pointGroupClassName: 'bar',
        pointStyling: true,
        defaultProps: {
            groupPadding: 0,
            innerPadding: 0,
            colors: 'category20',
            seriesVisible: true,
            barVisible: true
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            barVisible: ['path']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            barAttributes: ['path']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            barStyle: ['path'],
            groupStyle: ['g', 'bar']
        }

    });

});
